import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "../environment";
import { UserRoles } from "@/utils/contants";

function dashboardFor(role: UserRoles) {
  if (role === UserRoles.ADMIN) return "/admin/dashboard";
  if (role === UserRoles.OWNER || role === UserRoles.MANAGER) return "/owner/dashboard";
  if (role === UserRoles.USER) return "/user/dashboard";
  return "/auth/login";
}

// These links are sent to tenants by WhatsApp, before they have an app session.
function isPublicTenantLink(pathname: string) {
  return pathname.startsWith("/user/booking/") || pathname.startsWith("/user/payment/");
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("ARP_Token")?.value;
  const pathname = request.nextUrl.pathname;

  if (isPublicTenantLink(pathname)) return NextResponse.next();

  if (!token) {
    if (pathname.startsWith("/auth/")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const { role } = jwt.verify(token, env.JWT_SECRET) as { role: UserRoles };
    if (pathname === "/" || pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL(dashboardFor(role), request.url));
    }
    if (pathname.startsWith("/admin") && role !== UserRoles.ADMIN)
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    if (pathname.startsWith("/owner") && role !== UserRoles.OWNER && role !== UserRoles.MANAGER)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    if (pathname.startsWith("/user") && role !== UserRoles.USER)
      return NextResponse.redirect(new URL("/auth/login", request.url));
  } catch {
    if (pathname.startsWith("/auth/")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/admin/:path*", "/owner/:path*", "/user/:path*"],
};
