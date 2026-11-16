import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { setTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import { OrganisationModel } from "../../../../../models/Organisation";
import crypto from "crypto";

function matchesPassword(password, storedPassword) {
  if (!storedPassword) return false;
  if (storedPassword.startsWith("scrypt$")) {
    const [, salt, expected] = storedPassword.split("$");
    const actual = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
  }
  // Allows existing legacy admin records to log in until their password is reset.
  const provided = Buffer.from(password);
  const stored = Buffer.from(storedPassword);
  return provided.length === stored.length && crypto.timingSafeEqual(provided, stored);
}

export async function POST(req) {
  await connectMongoDB();

  const { username, password } = await req.json();

  const user = await UserModel.findOne({ $or: [{ username }, { email: username }] });
  if (!user || !matchesPassword(password, user.password)) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.role != UserRoles.ADMIN) {
    return NextResponse.json({ message: "User have not access" }, { status: 403 });
  }

  if (user.disabled) {
    return NextResponse.json({ message: "User account disabled, please contact super admin " }, { status: 403 });
  }

  if (user.deleted) {
    return NextResponse.json({ message: "User account deleted, please contact super admin " }, { status: 403 });
  }


  const org = await OrganisationModel.findById(user.organisationId);
  user.organisationId = org;

  const token = setTokenValue(user);

  const response = NextResponse.json({ message: "Login successful", role: user.role });
  // A Secure cookie is silently discarded by browsers on http://localhost.
  // Detect the actual request protocol instead of trusting a custom NODE_ENV value.
  const secure = new URL(req.url).protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  response.cookies.set("ARP_Token", token, { httpOnly: true, path: "/", maxAge: 604800, sameSite: "lax", secure });
  return response;
}

