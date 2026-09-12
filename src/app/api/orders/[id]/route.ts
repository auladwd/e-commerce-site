import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        data: {
          _id: id,
          orderNumber: id.startsWith("BD-") ? id : `BD-98210`,
          customerName: "Sample Customer",
          customerPhone: "017XXXXXXXX",
          customerAddress: "Dhaka, Bangladesh",
          deliveryZone: "dhaka",
          items: [],
          subtotal: 1500,
          shippingFee: 70,
          total: 1570,
          paymentMethod: "cod",
          paymentStatus: "pending",
          orderStatus: "confirmed",
          trackingHistory: [
            { status: "pending", note: "Order placed", timestamp: new Date() },
          ],
          createdAt: new Date(),
        },
      });
    }

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).lean();
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id }).lean();
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { orderStatus, paymentStatus, note } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: true,
        message: "Status updated in demo mode",
        data: { id, orderStatus, paymentStatus },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateQuery: any = {};
    if (orderStatus) updateQuery.orderStatus = orderStatus;
    if (paymentStatus) updateQuery.paymentStatus = paymentStatus;

    if (orderStatus || note) {
      updateQuery.$push = {
        trackingHistory: {
          status: orderStatus || "updated",
          note: note || `Order status updated to ${orderStatus}`,
          timestamp: new Date(),
        },
      };
    }

    const updated = await Order.findOneAndUpdate(
      id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderNumber: id },
      updateQuery,
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
