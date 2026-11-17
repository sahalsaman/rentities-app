import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { env } from "../../environment";
import { UserRoles } from "@/utils/contants";

/** Middleware normally handles this route; keep a safe server-side fallback. */
export default async function AppEntry() {
  const token = (await cookies()).get("ARP_Token")?.value;
  if (token) {
    try {
      const { role } = jwt.verify(token, env.JWT_SECRET) as { role: UserRoles };
      if (role === UserRoles.ADMIN) redirect("/admin/dashboard");
      if (role === UserRoles.OWNER || role === UserRoles.MANAGER) redirect("/owner/dashboard");
      if (role === UserRoles.USER) redirect("/user/dashboard");
    } catch {
      // Invalid/expired sessions fall through to login.
    }
  }
  redirect("/auth/login");
}
