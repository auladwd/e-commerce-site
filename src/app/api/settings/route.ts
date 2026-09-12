import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StoreSettings from "@/models/StoreSettings";

const defaultSettings = {
  storeName: "SmartShop BD",
  storeNameBn: "স্মার্টশপ বাংলাদেশ",
  hotline: "01700-112233",
  whatsapp: "8801700112233",
  email: "support@smartshopbd.com",
  address: "House 15, Road 2, Mirpur 10, Dhaka - 1216",
  shippingFeeInsideDhaka: 70,
  shippingFeeOutsideDhaka: 130,
  bkashNumber: "01700-112233",
  nagadNumber: "01700-112233",
  currencySymbol: "৳",
};

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: true, data: defaultSettings });
    }

    let settings = await StoreSettings.findOne().lean();
    if (!settings) {
      settings = await StoreSettings.create(defaultSettings);
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Settings updated in memory",
        data: { ...defaultSettings, ...body },
      });
    }

    let settings = await StoreSettings.findOne();
    if (settings) {
      Object.assign(settings, body);
      await settings.save();
    } else {
      settings = await StoreSettings.create({ ...defaultSettings, ...body });
    }

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully",
      data: settings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
