"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Sparkles, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import HeroBanner from "@/components/HeroBanner";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import { demoProducts, ProductItem } from "@/lib/demoData";

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>(demoProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-7 sm:space-y-12 pb-8 sm:pb-12">
      {/* Hero Banner with Flash Deal Countdown */}
      <HeroBanner />

      {/* Category Icons Bar */}
      <CategoryBar />

      {/* Flash Deals Showcase */}
      {flashDeals.length > 0 && (
        <section className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 border border-rose-200/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                  {t.flashDealsTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {t.flashDealsSubtitle}
                </p>
              </div>
            </div>

            <Link
              href="/products?flash=true"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-rose-200 shadow-2xs hover:shadow-xs transition shrink-0"
            >
              <span>{lang === "bn" ? "সব ডিল" : "View All"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {flashDeals.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id || product._id || product.slug}
                product={product}
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {t.featuredProducts}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === "bn"
                  ? "আমাদের কাস্টমারদের সবচেয়ে পছন্দের বেস্ট সেলিং পণ্যসমূহ"
                  : "Top rated best-selling products loved by our customers"}
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <span>{lang === "bn" ? "সকল পণ্য দেখুন" : "View All Products"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-72 sm:h-80 rounded-2xl bg-slate-200/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id || product._id || product.slug}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews & Trust Showcase */}
      <section className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-100 text-amber-600 mb-2">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900">
            {lang === "bn"
              ? "সন্তুষ্ট গ্রাহকদের প্রতিক্রিয়া"
              : "What Our Happy Customers Say"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {lang === "bn"
              ? "দেশজুড়ে হাজারো গ্রাহক আমাদের পণ্য ও সেবায় সন্তুষ্ট"
              : "Thousands of satisfied customers all across Bangladesh"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic">
              {lang === "bn"
                ? '"টি৯০০ আল্ট্রা ঘড়িটি হাতে পেয়েছি মাত্র ২ দিনে। প্রোডাক্টের কোয়ালিটি ও ব্যাটারি লাইফ দারুণ। ক্যাশ অন ডেলিভারিতে চেক করে নিতে পেরেছি।"'
                : '"Received the T900 Ultra watch in just 2 days. Quality is superb and loved the cash on delivery option."'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                রা
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">রাকিবুল হাসান</h5>
                <p className="text-[10px] text-slate-500">মিরপুর, ঢাকা</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic">
              {lang === "bn"
                ? '"জামদানি শাড়ির সুতা ও কাজ সত্যিই চমৎকার! দাম অনুযায়ী ১০০% খাঁটি কাপড়। সবাইকে নেয়ার অনুরোধ করব।"'
                : '"The Jamdani saree fabric and motifs are authentic. High recommendation for everyone!"'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-800 font-bold text-xs flex items-center justify-center">
                না
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">নাজমুন নাহার</h5>
                <p className="text-[10px] text-slate-500">জিইসি, চট্টগ্রাম</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic">
              {lang === "bn"
                ? '"সুন্দরবনের খাঁটি মধু পেয়েছি। মধুর সুঘ্রাণ ও টেস্ট অসাধারণ। কাস্টমার সাপোর্টে ফোন করে খুব দ্রুত উত্তর পেয়েছি।"'
                : '"100% pure wild honey with natural aroma. Very responsive and polite customer support."'}
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                মা
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900">মাহমুদুল করিম</h5>
                <p className="text-[10px] text-slate-500">উপশহর, সিলেট</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
