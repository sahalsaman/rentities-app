
import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true });
  const secure = new URL(request.url).protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  response.cookies.set('ARP_Token', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax', secure });
  return response;
}
