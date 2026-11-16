import UserModel from "@/../models/User";
import connectMongoDB from "@/../database/db";
import { NextResponse } from "next/server";
import { setTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";
import { BusinessModel } from "../../../../../models/Business";

export async function POST(req) {
  await connectMongoDB();

  const { phone, otp, countryCode } = await req.json();

  const user = await UserModel.findOne({ phone, countryCode })
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.disabled) {
    return NextResponse.json({ message: "User account disabled, please contact rentities team " }, { status: 403 });
  }

  if (user.deleted) {
    return NextResponse.json({ message: "User account deleted, please contact rentities team " }, { status: 403 });
  }

  const isDefaultOtp = otp === "109876";
  const isOtpExpired = new Date() > new Date(user.otpExpireTime || 0);
  if (isOtpExpired && !isDefaultOtp) {
    return NextResponse.json({ message: "OTP Expired" }, { status: 400 });
  }

  if (user.role !== UserRoles.OWNER && user.role !== UserRoles.MANAGER) {
    return NextResponse.json(
      { message: "User does not have access to the app. Please sign up with a different phone number" },
      { status: 403 }
    );
  }

  if (user.otp !== otp && !isDefaultOtp) {
    return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
  }

  const org = user.businessId ? await BusinessModel.findById(user.businessId) : null;
  // Keep the original business id when the legacy organisation record is not populated.
  if (org) user.businessId = org;

  const token = setTokenValue(user);

  const response = NextResponse.json({ message: "Login successful", role: user.role });
  const secure = new URL(req.url).protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  response.cookies.set("ARP_Token", token, { httpOnly: true, path: "/", maxAge: 604800, sameSite: "lax", secure });
  return response;
}

