import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import StoreSettings from "@/models/StoreSettings";
import { demoProducts, demoCategories } from "@/lib/demoData";

export async function POST() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "MongoDB Atlas URI is not configured in .env.local" },
        { status: 400 }
      );
    }

    // Seed categories
    for (const cat of demoCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        {
          name: cat.name,
          nameBn: cat.nameBn,
          slug: cat.slug,
          image: cat.image,
          icon: cat.icon,
        },
        { upsert: true }
      );
    }

    // Seed products
    for (const p of demoProducts) {
      await Product.findOneAndUpdate(
        { slug: p.slug },
        {
          title: p.title,
          titleBn: p.titleBn,
          slug: p.slug,
          price: p.price,
          salePrice: p.salePrice,
          description: p.description,
          descriptionBn: p.descriptionBn,
          category: p.category,
          categoryBn: p.categoryBn,
          images: p.images,
          stock: p.stock,
          rating: p.rating,
          numReviews: p.numReviews,
          isFeatured: p.isFeatured,
          isFlashDeal: p.isFlashDeal,
          colors: p.colors || [],
          sizes: p.sizes || [],
          tags: p.tags || [],
        },
        { upsert: true }
      );
    }

    // Seed default settings
    const existingSettings = await StoreSettings.findOne();
    if (!existingSettings) {
      await StoreSettings.create({
        storeName: "SmartShop BD",
        storeNameBn: "স্মার্টশপ বাংলাদেশ",
        hotline: "01700-112233",
        whatsapp: "8801700112233",
        email: "support@smartshopbd.com",
        address: "Mirpur-10, Dhaka-1216",
        shippingFeeInsideDhaka: 70,
        shippingFeeOutsideDhaka: 130,
        bkashNumber: "01700-112233",
        nagadNumber: "01700-112233",
        currencySymbol: "৳",
      });
    }

    return NextResponse.json({
      success: true,
      message: "MongoDB Atlas database seeded successfully with products, categories, and settings!",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
