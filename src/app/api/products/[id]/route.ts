import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import { demoProducts } from "@/lib/demoData";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await connectToDatabase();

    if (!db) {
      const product = demoProducts.find((p) => p.id === id || p.slug === id);
      if (!product) {
        return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: product });
    }

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: id }).lean();
    }

    if (!product) {
      // Check demo products
      const fallback = demoProducts.find((p) => p.id === id || p.slug === id);
      if (fallback) {
        return NextResponse.json({ success: true, data: fallback });
      }
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const db = await connectToDatabase();

    if (!db) {
      const index = demoProducts.findIndex((p) => p.id === id || p.slug === id);
      if (index !== -1) {
        demoProducts[index] = { ...demoProducts[index], ...body };
        return NextResponse.json({ success: true, data: demoProducts[index] });
      }
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const updated = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await connectToDatabase();

    if (!db) {
      const index = demoProducts.findIndex((p) => p.id === id || p.slug === id);
      if (index !== -1) {
        demoProducts.splice(index, 1);
        return NextResponse.json({ success: true, message: "Product deleted from demo list" });
      }
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Clean up images from Cloudinary if public_id exists
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteImageFromCloudinary(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
