import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/models/Order";

// In-memory demo orders storage for local testing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const demoOrders: any[] = [
  {
    _id: "ord_1",
    orderNumber: "BD-84920",
    customerName: "Md. Tanvir Hossain",
    customerPhone: "01712345678",
    customerAddress: "House 12, Road 4, Sector 7, Uttara, Dhaka",
    deliveryZone: "dhaka",
    items: [
      {
        productId: "p1",
        title: "T900 Ultra Smartwatch with Bluetooth Calling",
        titleBn: "টি৯০০ আল্ট্রা স্মার্টওয়াচ - ব্লুটুথ কলিং ও হার্ট রেট সেন্সর সহ",
        price: 1650,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
        color: "Orange",
      },
    ],
    subtotal: 1650,
    shippingFee: 70,
    discount: 0,
    total: 1720,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "confirmed",
    trackingHistory: [
      { status: "pending", note: "Order placed successfully", timestamp: new Date(Date.now() - 86400000) },
      { status: "confirmed", note: "Order confirmed via phone call", timestamp: new Date(Date.now() - 43200000) },
    ],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    _id: "ord_2",
    orderNumber: "BD-91543",
    customerName: "Ayesha Siddiqua",
    customerPhone: "01898765432",
    customerAddress: "Kazir Dewri, Kotwali, Chittagong",
    deliveryZone: "outside",
    items: [
      {
        productId: "p4",
        title: "Handloom Traditional Pure Dhakai Jamdani Saree",
        titleBn: "হাতে বোনা ট্র্যাডিশনাল পিওর ঢাকাই জামদানি শাড়ি",
        price: 3200,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        color: "Crimson Red",
      },
    ],
    subtotal: 3200,
    shippingFee: 130,
    discount: 0,
    total: 3330,
    paymentMethod: "bkash",
    paymentStatus: "paid",
    trxId: "BK9X47L29",
    orderStatus: "shipped",
    trackingHistory: [
      { status: "pending", note: "Order placed", timestamp: new Date(Date.now() - 172800000) },
      { status: "confirmed", note: "Payment verified via bKash", timestamp: new Date(Date.now() - 120000000) },
      { status: "shipped", note: "Handed over to Steadfast Courier", timestamp: new Date(Date.now() - 40000000) },
    ],
    createdAt: new Date(Date.now() - 172800000),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const userEmail = searchParams.get("userEmail");
    const phone = searchParams.get("phone");
    const db = await connectToDatabase();

    if (!db) {
      let filtered = [...demoOrders];
      if (status && status !== "all") {
        filtered = filtered.filter((o) => o.orderStatus === status);
      }
      if (userId) {
        filtered = filtered.filter((o) => o.userId === userId || (userEmail && o.userEmail === userEmail));
      } else if (userEmail) {
        filtered = filtered.filter((o) => o.userEmail === userEmail);
      }
      if (phone) {
        filtered = filtered.filter((o) => o.customerPhone === phone);
      }
      return NextResponse.json({
        success: true,
        source: "demo",
        count: filtered.length,
        data: filtered,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (status && status !== "all") {
      filter.orderStatus = status;
    }
    if (userId && userEmail) {
      filter.$or = [{ userId }, { userEmail }];
    } else if (userId) {
      filter.userId = userId;
    } else if (userEmail) {
      filter.userEmail = userEmail;
    }
    if (phone) {
      filter.customerPhone = phone;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      source: "database",
      count: orders.length,
      data: orders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerAddress,
      deliveryZone = "dhaka",
      items,
      paymentMethod = "cod",
      trxId,
      notes,
      userId,
      userEmail,
    } = body;

    if (!customerName || !customerPhone || !customerAddress) {
      return NextResponse.json(
        { success: false, error: "Name, phone, and delivery address are required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty. Please add items before placing order." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (acc: number, item: { price: number; quantity: number }) =>
        acc + Number(item.price) * Number(item.quantity),
      0
    );

    const shippingFee = deliveryZone === "outside" ? 130 : 70;
    const discount = body.discount || 0;
    const total = Math.max(0, subtotal + shippingFee - discount);

    const orderNumber = `BD-${Math.floor(10000 + Math.random() * 90000)}`;

    const typedDeliveryZone: "dhaka" | "outside" =
      deliveryZone === "outside" ? "outside" : "dhaka";
    const typedPaymentMethod: "cod" | "bkash" | "nagad" | "rocket" =
      ["cod", "bkash", "nagad", "rocket"].includes(paymentMethod)
        ? paymentMethod
        : "cod";
    const typedPaymentStatus: "pending" | "paid" | "failed" =
      typedPaymentMethod === "cod" ? "pending" : trxId ? "paid" : "pending";

    const orderData = {
      orderNumber,
      userId: userId || undefined,
      userEmail: userEmail || undefined,
      customerName,
      customerPhone,
      customerAddress,
      deliveryZone: typedDeliveryZone,
      notes,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod: typedPaymentMethod,
      paymentStatus: typedPaymentStatus,
      trxId,
      orderStatus: "pending" as const,
      trackingHistory: [
        {
          status: "pending",
          note: "Order has been placed and is waiting for phone verification.",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    };

    const db = await connectToDatabase();

    if (!db) {
      // Store in memory demo list
      const savedDemo = {
        _id: `ord_${Date.now()}`,
        ...orderData,
      };
      demoOrders.unshift(savedDemo);

      return NextResponse.json(
        {
          success: true,
          message: "Order placed successfully!",
          data: savedDemo,
        },
        { status: 201 }
      );
    }

    const order = await Order.create(orderData);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully in MongoDB!",
        data: order,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    console.error("Order creation error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
