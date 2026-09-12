"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { demoCategories, CategoryItem } from "@/lib/demoData";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Apple,
  Home,
  ShoppingBag,
  Watch,
  Headphones,
  Heart,
  LayoutGrid,
} from "lucide-react";

export default function CategoryBar() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState<CategoryItem[]>(demoCategories);

  const loadCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCategories();
    window.addEventListener("categories_updated", loadCategories);
    return () => window.removeEventListener("categories_updated", loadCategories);
  }, []);

  const getCategoryIcon = (iconOrSlug?: string) => {
    switch (iconOrSlug) {
      case "Smartphone":
      case "gadgets":
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case "Shirt":
      case "fashion-men":
        return <Shirt className="w-5 h-5 text-indigo-600" />;
      case "Sparkles":
      case "fashion-women":
        return <Sparkles className="w-5 h-5 text-pink-600" />;
      case "Apple":
      case "organic-food":
        return <Apple className="w-5 h-5 text-amber-600" />;
      case "Home":
      case "home-living":
        return <Home className="w-5 h-5 text-teal-600" />;
      case "Watch":
      case "smart-watches":
        return <Watch className="w-5 h-5 text-teal-600" />;
      case "Headphones":
      case "audio":
        return <Headphones className="w-5 h-5 text-blue-600" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-rose-600" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      default:
        return <LayoutGrid className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            {t.browseByCategory}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "bn"
              ? "আপনার প্রয়োজনীয় পণ্য দ্রুত খুঁজে পেতে ক্যাটাগরি বেছে নিন"
              : "Select category to find your desired items fast"}
          </p>
        </div>

        <Link
          href="/products"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline shrink-0"
        >
          {lang === "bn" ? "সবগুলো দেখুন →" : "View All →"}
        </Link>
      </div>

      {/* Single Row Category Container: flex-nowrap & shrink to ensure all stay in 1 row */}
      <div className="flex flex-nowrap items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none w-full">
        {categories.map((cat) => (
          <Link
            key={cat.slug || cat.id}
            href={`/products?category=${cat.slug}`}
            className="flex-1 min-w-[90px] sm:min-w-[105px] max-w-[200px] group flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all text-center shrink-0 md:shrink"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors mb-2">
              {getCategoryIcon(cat.icon || cat.slug)}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition truncate max-w-full px-1">
              {lang === "bn" ? cat.nameBn || cat.name : cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
