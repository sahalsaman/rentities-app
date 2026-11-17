import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { env } from "../../../../../environment";

export async function GET() {
  const token = (await cookies()).get("ARP_Token")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { role?: string };
    return NextResponse.json({ authenticated: true, role: payload.role });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
