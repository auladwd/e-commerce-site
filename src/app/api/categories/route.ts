import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { demoCategories } from "@/lib/demoData";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json({
        success: true,
        source: "demo",
        data: demoCategories,
      });
    }

    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    if (categories.length === 0) {
      return NextResponse.json({
        success: true,
        source: "demo",
        data: demoCategories,
      });
    }

    return NextResponse.json({
      success: true,
      source: "database",
      data: categories,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await connectToDatabase();

    if (!body.name || !body.nameBn) {
      return NextResponse.json(
        { success: false, error: "Name and NameBn are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    if (!db) {
      const newCat = {
        id: slug,
        name: body.name,
        nameBn: body.nameBn,
        slug,
        image: body.image || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        icon: body.icon || "ShoppingBag",
      };
      demoCategories.push(newCat);
      return NextResponse.json({ success: true, data: newCat }, { status: 201 });
    }

    const category = await Category.create({ ...body, slug });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    const identifier = id || slug;

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "Category ID or slug is required for deletion." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      const idx = demoCategories.findIndex(
        (c) => c.id === identifier || c.slug === identifier || (c as unknown as { _id: string })._id === identifier
      );
      if (idx !== -1) {
        demoCategories.splice(idx, 1);
      }
      return NextResponse.json({
        success: true,
        message: "Category deleted from demo memory.",
      });
    }

    // Try deleting by _id first if valid ObjectId, else by slug
    let deleted = null;
    try {
      deleted = await Category.findByIdAndDelete(identifier);
    } catch {
      // not a valid ObjectId, try by slug
    }

    if (!deleted) {
      deleted = await Category.findOneAndDelete({ slug: identifier });
    }

    // Also remove from demo array in case cached
    const demoIdx = demoCategories.findIndex((c) => c.slug === identifier || c.id === identifier);
    if (demoIdx !== -1) {
      demoCategories.splice(demoIdx, 1);
    }

    return NextResponse.json({
      success: true,
      message: "ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে!",
      data: deleted,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

