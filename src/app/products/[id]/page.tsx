"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Zap,
  Check,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { demoProducts, ProductItem } from "@/lib/demoData";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { addToCart, openQuickBuy } = useCart();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProduct(json.data);
          if (json.data.colors?.length) setSelectedColor(json.data.colors[0]);
          if (json.data.sizes?.length) setSelectedSize(json.data.sizes[0]);
        } else {
          // Fallback to demo
          const fallback = demoProducts.find((p) => p.id === id || p.slug === id);
          if (fallback) {
            setProduct(fallback);
            if (fallback.colors?.length) setSelectedColor(fallback.colors[0]);
            if (fallback.sizes?.length) setSelectedSize(fallback.sizes[0]);
          }
        }
      })
      .catch(() => {
        const fallback = demoProducts.find((p) => p.id === id || p.slug === id);
        if (fallback) setProduct(fallback);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">পণ্যটি খুঁজে পাওয়া যায়নি!</h2>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          সকল পণ্য দেখুন
        </Link>
      </div>
    );
  }

  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" }];

  const relatedProducts = demoProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-6 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-600">
          {t.home}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-emerald-600">
          {t.products}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-bold truncate max-w-xs">
          {lang === "bn" ? product.titleBn || product.title : product.title}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[selectedImageIndex]?.url}
              alt={product.title}
              className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-rose-600 text-white font-black text-xs shadow-md">
                {discountPercent}% {t.off}
              </span>
            )}
            {product.isFlashDeal && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                HOT DEAL
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition ${
                    selectedImageIndex === idx
                      ? "border-emerald-600 ring-2 ring-emerald-500/30"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {lang === "bn" ? product.categoryBn || product.category : product.category}
            </span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-1 leading-snug">
              {lang === "bn" ? product.titleBn || product.title : product.title}
            </h1>

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 5.0}</span>
                <span className="text-slate-400 font-normal text-xs">
                  ({product.numReviews || 85} {t.reviews})
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                {t.inStock} ({product.stock || 25})
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {t.currency}
              {effectivePrice}
            </span>
            {hasDiscount && (
              <span className="text-base text-slate-400 line-through">
                {t.currency}
                {product.price}
              </span>
            )}
            {hasDiscount && (
              <span className="ml-auto text-xs font-bold text-rose-600">
                সেভ করুন {t.currency}
                {product.price - product.salePrice!}
              </span>
            )}
          </div>

          {/* Color Variants */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {t.color}: <span className="text-emerald-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                      selectedColor === color
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Variants */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {t.size}: <span className="text-emerald-600">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                      selectedSize === size
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">{t.quantity}:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() =>
                  addToCart(product, quantity, selectedColor, selectedSize)
                }
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>

              <button
                onClick={() => openQuickBuy(product)}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{t.buyNow}</span>
              </button>
            </div>
          </div>

          {/* Delivery Assurances */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2.5 text-xs text-slate-700">
            <h4 className="font-extrabold text-emerald-900 text-xs flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t.deliveryInfoTitle}</span>
            </h4>
            <p className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.deliveryInfo1} (চার্জ ৳৭০)</span>
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.deliveryInfo2} (চার্জ ৳১৩০)</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.deliveryInfo3}</span>
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.deliveryInfo4}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          {t.description}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {lang === "bn"
            ? product.descriptionBn || product.description
            : product.description}
        </p>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900">
            {t.relatedProducts}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id || p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
