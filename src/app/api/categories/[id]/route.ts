import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { demoCategories } from "@/lib/demoData";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      const idx = demoCategories.findIndex(
        (c) =>
          c.id === id ||
          c.slug === id ||
          (c as unknown as { _id: string })._id === id
      );
      if (idx !== -1) {
        demoCategories.splice(idx, 1);
      }
      return NextResponse.json({
        success: true,
        message: "Category deleted successfully from demo",
      });
    }

    let deleted = null;
    try {
      deleted = await Category.findByIdAndDelete(id);
    } catch {
      // not a valid ObjectId, try by slug
    }

    if (!deleted) {
      deleted = await Category.findOneAndDelete({ slug: id });
    }

    // Also remove from demo array
    const demoIdx = demoCategories.findIndex((c) => c.slug === id || c.id === id);
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
