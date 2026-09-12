"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, Search, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/ProductCard";
import { demoProducts, demoCategories, ProductItem } from "@/lib/demoData";

function ProductsContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();

  const initialCat = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialFlash = searchParams.get("flash") === "true";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [onlyFlash, setOnlyFlash] = useState<boolean>(initialFlash);
  const [sortBy, setSortBy] = useState<string>("default");
  const [products, setProducts] = useState<ProductItem[]>(demoProducts);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchTerm(searchParams.get("search") || "");
    setOnlyFlash(searchParams.get("flash") === "true");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm) params.set("search", searchTerm);
    if (onlyFlash) params.set("flash", "true");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProducts(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, searchTerm, onlyFlash]);

  // Client-side sorting
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;
    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.products}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === "bn"
              ? `মোট ${sortedProducts.length} টি পণ্য পাওয়া গেছে`
              : `Found ${sortedProducts.length} products`}
          </p>
        </div>

        {/* Filters & Sorters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="default">
                {lang === "bn" ? "সাজান: ডিফল্ট" : "Sort: Default"}
              </option>
              <option value="price-low">
                {lang === "bn" ? "দাম: কম থেকে বেশি" : "Price: Low to High"}
              </option>
              <option value="price-high">
                {lang === "bn" ? "দাম: বেশি থেকে কম" : "Price: High to Low"}
              </option>
              <option value="rating">
                {lang === "bn" ? "সেরা রেটিং" : "Highest Rating"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Flash Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
            selectedCategory === "all"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          {lang === "bn" ? "সকল ক্যাটাগরি" : "All Categories"}
        </button>

        {demoCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
              selectedCategory === cat.slug
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {lang === "bn" ? cat.nameBn : cat.name}
          </button>
        ))}

        <button
          onClick={() => setOnlyFlash(!onlyFlash)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 transition ${
            onlyFlash
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.flashSale}</span>
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 py-4 sm:py-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 sm:h-80 rounded-2xl bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="py-16 sm:py-20 text-center space-y-3 bg-white rounded-2xl border border-slate-200">
          <Filter className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">
            {lang === "bn"
              ? "কোনো পণ্য পাওয়া যায়নি।"
              : "No products matched your search."}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === "bn"
              ? "অন্য কোনো নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।"
              : "Try searching with different keywords or categories."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 py-2 sm:py-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id || product._id || product.slug}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
