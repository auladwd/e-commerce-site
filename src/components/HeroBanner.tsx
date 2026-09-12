"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Flame,
  Truck,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroBanner() {
  const { lang, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: lang === "bn" ? "🔥 মেগা অফার • নিশ্চিত সর্বোচ্চ ছাড়!" : "🔥 Mega Sale • Up to 40% OFF",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
      title: (
        <>
          {lang === "bn" ? (
            <>
              স্মার্ট <span className="text-emerald-400">গ্যাজেট ও লাইফস্টাইল</span> পণ্যের সেরা সমাহার
            </>
          ) : (
            <>
              Premium <span className="text-emerald-400">Gadgets & Lifestyle</span> Collection
            </>
          )}
        </>
      ),
      subtitle:
        lang === "bn"
          ? "দেশজুড়ে ক্যাশ অন ডেলিভারিতে ঝামেলাহীন কেনাকাটা করুন।"
          : "Shop genuine gadgets with fastest nationwide cash on delivery.",
      btnPrimaryText: t.shopNow,
      btnPrimaryHref: "/products",
      btnSecondaryText: t.flashSale,
      btnSecondaryHref: "/products?flash=true",
      gradient: "from-slate-950 via-emerald-950 to-teal-950",
      accentGlow: "bg-emerald-500/15",
    },
    {
      id: 2,
      badge: lang === "bn" ? "✨ প্রিমিয়াম কোয়ালিটি • ট্রেন্ডি কালেকশন" : "✨ Trendsetters • New Arrivals",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-400/30",
      title: (
        <>
          {lang === "bn" ? (
            <>
              সেরা দামে প্রিমিয়াম <span className="text-teal-300">ফ্যাশন ও অ্যাক্সেসরিজ</span>
            </>
          ) : (
            <>
              Affordable <span className="text-teal-300">Fashion & Accessories</span>
            </>
          )}
        </>
      ),
      subtitle:
        lang === "bn"
          ? "পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন, কোনো অগ্রিম চার্জ নেই।"
          : "Inspect your items before paying. Zero advance required.",
      btnPrimaryText: lang === "bn" ? "ফ্যাশন কালেকশন" : "View Fashion",
      btnPrimaryHref: "/products?category=fashion-men",
      btnSecondaryText: lang === "bn" ? "সকল পণ্য" : "All Products",
      btnSecondaryHref: "/products",
      gradient: "from-slate-950 via-teal-950 to-slate-900",
      accentGlow: "bg-teal-500/15",
    },
    {
      id: 3,
      badge: lang === "bn" ? "⚡ আজকের স্পেশাল • ফ্ল্যাশ ডিল" : "⚡ Limited Time • Flash Deals",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
      title: (
        <>
          {lang === "bn" ? (
            <>
              সীমিত সময়ের জন্য <span className="text-amber-400">অবিশ্বাস্য ফ্ল্যাশ ছাড়!</span>
            </>
          ) : (
            <>
              Limited Time <span className="text-amber-400">Unbeatable Deals!</span>
            </>
          )}
        </>
      ),
      subtitle:
        lang === "bn"
          ? "স্টক শেষ হওয়ার আগেই আপনার পছন্দের গ্যাজেটটি লুফে নিন।"
          : "Grab your favorite deals before the stock runs out.",
      btnPrimaryText: lang === "bn" ? "ফ্ল্যাশ ডিল দেখুন" : "Browse Deals",
      btnPrimaryHref: "/products?flash=true",
      btnSecondaryText: lang === "bn" ? "অর্ডার করুন" : "Order Now",
      btnSecondaryHref: "/products",
      gradient: "from-slate-950 via-slate-900 to-emerald-950",
      accentGlow: "bg-amber-500/15",
    },
  ];

  // Auto slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const active = slides[currentSlide];

  return (
    <div className="my-3 sm:my-4 space-y-2 sm:space-y-2.5">
      {/* Compact Banner Card */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r ${active.gradient} text-white shadow-lg border border-emerald-500/20 transition-all duration-500`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute -top-12 -right-12 w-60 sm:w-80 h-60 sm:h-80 ${active.accentGlow} rounded-full blur-3xl pointer-events-none transition-all duration-700`}
        />
        <div
          className={`absolute -bottom-12 -left-12 w-60 sm:w-80 h-60 sm:h-80 ${active.accentGlow} rounded-full blur-3xl pointer-events-none transition-all duration-700`}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          {/* Left Content Area */}
          <div className="space-y-2.5 sm:space-y-3.5 max-w-2xl">
            {/* Promo Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border transition-colors ${active.badgeColor}`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
              <span>{active.badge}</span>
            </div>

            {/* Headline */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-snug sm:leading-tight transition-all">
              {active.title}
            </h2>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {active.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
              <Link
                href={active.btnPrimaryHref}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition-transform active:scale-95"
              >
                <span>{active.btnPrimaryText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={active.btnSecondaryHref}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-xs transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{active.btnSecondaryText}</span>
              </Link>
            </div>
          </div>

          {/* Right Highlight Box (Compact Offer Pill) */}
          <div className="hidden lg:flex flex-col items-end gap-2.5 shrink-0">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 text-right">
              <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-400">
                <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                <span>সুপার সেভার ডিল</span>
              </div>
              <p className="text-2xl font-black text-white">
                ৪০% পর্যন্ত ছাড়
              </p>
              <span className="text-[11px] text-slate-300 block">
                কুপন কোড: <strong className="text-amber-300 font-mono">SAVE10</strong>
              </span>
            </div>

            {/* Slide Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer border border-white/10"
                title="পূর্ববর্তী স্লাইড"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer border border-white/10"
                title="পরবর্তী স্লাইড"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-2 sm:bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                index === currentSlide
                  ? "w-6 bg-emerald-400"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              title={`স্লাইড ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slim Reassurance Strip beneath the banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 text-xs">
        <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[10px] sm:text-[11px] truncate">
            {lang === "bn" ? "১০০% খাঁটি পণ্য" : "100% Authentic"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[10px] sm:text-[11px] truncate">
            {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[10px] sm:text-[11px] truncate">
            {lang === "bn" ? "২৪-৪৮ ঘণ্টায় ডেলিভারি" : "Fast Delivery"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-800 text-[10px] sm:text-[11px] truncate">
            {lang === "bn" ? "৭ দিনের রিটার্ন গ্যারান্টি" : "7 Days Return"}
          </span>
        </div>
      </div>
    </div>
  );
}
