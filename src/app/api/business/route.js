import { NextResponse } from "next/server";
import connectMongoDB from "@/../database/db";
import { BusinessModel } from "@/../models/Business";
import { getTokenValue } from "@/utils/tokenHandler";
import { SubscritptionStatus, UserRoles } from "@/utils/contants";

export async function GET(request) {
  try {

    const user = getTokenValue(request);
    if (!user?.businessId && user?.role !== UserRoles.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectMongoDB();

    if (user.role == UserRoles.ADMIN) {
      let businesss = await BusinessModel.find().populate('owner', 'firstName lastName countryCode phone _id').lean();
      return NextResponse.json(businesss, { status: 200 });
    }

    if (user.role !== UserRoles.OWNER) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    let business = await BusinessModel.findById(user.businessId).lean();

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("Error fetching business:", error);
    return NextResponse.json(
      { message: "Failed to fetch business" },
      { status: 500 }
    );
  }
}


export async function PUT(request) {
  await connectMongoDB();

  const user = getTokenValue(request);
  if (!user?.businessId && user?.role !== UserRoles.ADMIN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== UserRoles.OWNER && user.role !== UserRoles.ADMIN) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const id = user.businessId;
  const body = await request.json();

  const updated = await BusinessModel.findByIdAndUpdate(id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}
