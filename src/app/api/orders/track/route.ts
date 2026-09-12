import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Please enter your Order ID or Mobile Number" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      // Mock tracking data for testing
      return NextResponse.json({
        success: true,
        source: "demo",
        data: [
          {
            orderNumber: query.toUpperCase().startsWith("BD-") ? query.toUpperCase() : "BD-84920",
            customerName: "Md. Tanvir Hossain",
            customerPhone: query.startsWith("01") ? query : "01712345678",
            customerAddress: "Sector 7, Uttara, Dhaka",
            deliveryZone: "dhaka",
            total: 1720,
            orderStatus: "confirmed",
            paymentMethod: "cod",
            paymentStatus: "pending",
            items: [
              {
                title: "T900 Ultra Smartwatch with Bluetooth Calling",
                titleBn: "টি৯০০ আল্ট্রা স্মার্টওয়াচ - ব্লুটুথ কলিং ও হার্ট রেট সেন্সর সহ",
                quantity: 1,
                price: 1650,
                image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
              },
            ],
            trackingHistory: [
              {
                status: "pending",
                note: "Order received via website",
                timestamp: new Date(Date.now() - 3600000 * 20),
              },
              {
                status: "confirmed",
                note: "Customer confirmed order over call",
                timestamp: new Date(Date.now() - 3600000 * 10),
              },
            ],
            createdAt: new Date(Date.now() - 3600000 * 20),
          },
        ],
      });
    }

    // Search in MongoDB by exact orderNumber or customerPhone
    const orders = await Order.find({
      $or: [
        { orderNumber: query.toUpperCase() },
        { customerPhone: query },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "No orders found matching your search." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to track order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
