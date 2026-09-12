import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary server-side
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  optimized_url: string;
  thumbnail_url: string;
}

/**
 * Upload an image buffer or base64 data to Cloudinary with automatic optimization
 * (auto format conversion to webp/avif, automatic quality compression, max width limit)
 */
export async function uploadImageToCloudinary(
  fileData: string, // Base64 data URI or image URL
  folder = "ecommerce_products"
): Promise<UploadResult> {
  // If Cloudinary keys are not provided, return placeholder for local testing
  if (
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET ||
    !(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME)
  ) {
    console.warn("Cloudinary credentials not configured. Returning data URL placeholder.");
    return {
      url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,
      secure_url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,
      public_id: `mock_${Date.now()}`,
      width: 800,
      height: 800,
      format: "webp",
      bytes: 120000,
      optimized_url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`,
      thumbnail_url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`,
    };
  }

  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(fileData, {
      folder: `ecommerce_shop/${folder}`,
      resource_type: "image",
      transformation: [
        {
          width: 1200,
          crop: "limit",
        },
        {
          quality: "auto:good",
          fetch_format: "auto",
        },
      ],
    });

    // Cloudinary dynamic optimized URLs
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const optimized_url = cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
      width: 1000,
      crop: "limit",
      secure: true,
    });

    const thumbnail_url = cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
      width: 400,
      height: 400,
      crop: "fill",
      secure: true,
    });

    return {
      url: result.url,
      secure_url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      optimized_url: optimized_url || result.secure_url,
      thumbnail_url: thumbnail_url || result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Delete an image from Cloudinary by public ID
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return true;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

export default cloudinary;
