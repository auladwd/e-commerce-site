import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { demoProducts } from "@/lib/demoData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const flash = searchParams.get("flash");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

    const db = await connectToDatabase();

    if (!db) {
      // Graceful fallback to demo products if MongoDB is not connected yet
      let results = [...demoProducts];

      if (category && category !== "all") {
        results = results.filter((p) => p.category === category);
      }

      if (search) {
        const query = search.toLowerCase();
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.titleBn.includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      if (featured === "true") {
        results = results.filter((p) => p.isFeatured);
      }

      if (flash === "true") {
        results = results.filter((p) => p.isFlashDeal);
      }

      return NextResponse.json({
        success: true,
        source: "demo",
        count: results.length,
        data: results.slice(0, limit),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { titleBn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (flash === "true") {
      filter.isFlashDeal = true;
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (products.length === 0 && !search && (!category || category === "all")) {
      // If DB is empty, return demo products
      return NextResponse.json({
        success: true,
        source: "demo",
        count: demoProducts.length,
        data: demoProducts.slice(0, limit),
      });
    }

    return NextResponse.json({
      success: true,
      source: "database",
      count: products.length,
      data: products,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    console.error("GET Products error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: "Title and price are required" },
        { status: 400 }
      );
    }

    // Auto-generate slug if missing
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    if (!db) {
      // In-memory response when DB not connected
      const newDemo = {
        id: `p_${Date.now()}`,
        _id: `p_${Date.now()}`,
        title: body.title,
        titleBn: body.titleBn || body.title,
        slug,
        price: Number(body.price),
        salePrice: body.salePrice ? Number(body.salePrice) : undefined,
        description: body.description || "",
        descriptionBn: body.descriptionBn || body.description || "",
        category: body.category || "gadgets",
        categoryBn: body.categoryBn || "স্মার্ট গ্যাজেট",
        images: body.images || [],
        stock: Number(body.stock || 10),
        rating: 5,
        numReviews: 0,
        isFeatured: Boolean(body.isFeatured),
        isFlashDeal: Boolean(body.isFlashDeal),
        tags: body.tags || [],
      };
      demoProducts.unshift(newDemo);

      return NextResponse.json(
        { success: true, message: "Product created (Demo mode)", data: newDemo },
        { status: 201 }
      );
    }

    const product = await Product.create({
      ...body,
      slug,
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      stock: Number(body.stock || 0),
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully in MongoDB", data: product },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    console.error("POST Product error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
