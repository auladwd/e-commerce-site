"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Star, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ProductItem } from "@/lib/demoData";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { addToCart, openQuickBuy } = useCart();

  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80";

  const pId = product.id || product._id || product.slug;
  const regularPrice = product.price;
  const salePrice = product.salePrice;
  const hasDiscount = salePrice && salePrice < regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  return (
    <div className="product-card group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold shadow-xs">
            {discountPercent}% {t.off}
          </span>
        )}
        {product.isFlashDeal && (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-xs flex items-center gap-1">
            <Zap className="w-3 h-3 fill-slate-950" />
            HOT
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${pId}`}
        className="relative block w-full aspect-square bg-slate-50 overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primaryImage}
          alt={product.title}
          loading="lazy"
          className="product-card-img w-full h-full object-cover object-center"
        />
      </Link>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category Pill & Rating */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1 sm:mb-1.5 text-xs">
            <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium truncate max-w-[90px] sm:max-w-none">
              {lang === "bn" ? product.categoryBn || product.category : product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold text-[10px] sm:text-[11px] shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 5.0}</span>
              <span className="text-slate-400 font-normal hidden xs:inline">
                ({product.numReviews || 12})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${pId}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-emerald-600 transition leading-snug mb-1.5 sm:mb-2">
              {lang === "bn" ? product.titleBn || product.title : product.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-sm sm:text-base md:text-lg font-black text-emerald-600">
              {t.currency}
              {salePrice ?? regularPrice}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {t.currency}
                {regularPrice}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => addToCart(product)}
              className="flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 text-[11px] sm:text-xs font-bold transition cursor-pointer border border-slate-200"
              title={t.addToCart}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{t.addToCart}</span>
            </button>

            <button
              onClick={() => openQuickBuy(product)}
              className="flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold transition shadow-xs cursor-pointer"
              title={t.buyNow}
            >
              <span className="truncate">{t.buyNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
