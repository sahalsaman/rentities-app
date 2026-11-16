
import jwt from "jsonwebtoken";
import { env } from "../../environment";

 export interface IPayload  {
    id: string;
    role: string;
    businessId:string;
    subscriptionPlan:string;
  };

export function setTokenValue(user:any){
  const business = user.businessId;
  const businessId = business?._id ?? business;
  const payload:IPayload = {
    id: String(user._id),
    role: user.role,
    businessId: businessId ? String(businessId) : "",
    subscriptionPlan: business?.subscription?.plan,
  };

  return  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function getTokenValue(request:Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/ARP_Token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}
