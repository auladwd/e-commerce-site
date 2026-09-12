import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileData = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      fileData = body.image || body.file;
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Convert file to base64 data URI
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type || "image/jpeg";
      fileData = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    if (!fileData) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    // Upload to Cloudinary with automatic optimization (f_auto, q_auto, webp)
    const result = await uploadImageToCloudinary(fileData, "products");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Image upload failed";
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
