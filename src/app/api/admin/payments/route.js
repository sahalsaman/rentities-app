import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { SubscriptionPaymentModel } from "@/../models/Organisation";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {
    const user = getTokenValue(request);
    if (user?.role !== UserRoles.ADMIN) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    await connectMongoDB();
    const payments = await SubscriptionPaymentModel.find().populate("organisationId", "name owner").sort({ createdAt: -1 }).lean();
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch subscription payments", details: error.message }, { status: 500 });
  }
}
