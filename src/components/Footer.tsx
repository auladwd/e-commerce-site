"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Truck,
  Headphones,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { demoCategories } from "@/lib/demoData";

export default function Footer() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>(demoCategories);

  const isAdmin = Boolean(
    user &&
    (user.role === "admin" ||
      user.email?.toLowerCase().includes("admin") ||
      user.email?.toLowerCase().endsWith("@smartshopbd.com"))
  );

  useEffect(() => {
    const loadFooterCats = () => {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCategories(json.data);
          }
        })
        .catch(() => { });
    };

    loadFooterCats();
    window.addEventListener("categories_updated", loadFooterCats);
    return () => window.removeEventListener("categories_updated", loadFooterCats);
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      {/* Service Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t.feature1Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.feature1Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t.feature2Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.feature2Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t.feature3Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.feature3Desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t.feature4Title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.feature4Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        {/* Col 1: Store Bio */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">
              {lang === "bn" ? "স্মার্টশপ" : "SmartShop"}
              <span className="text-emerald-500">.BD</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "bn"
              ? "বাংলাদেশের যেকোনো প্রান্ত থেকে সাশ্রয়ী মূল্যে প্রিমিয়াম পণ্য অর্ডার করুন। আমরা দিচ্ছি ১০০% অরিজিনাল প্রোডাক্ট এবং দ্রুততম হোম ডেলিভারির নিশ্চয়তা।"
              : "Order premium products at affordable prices from anywhere in Bangladesh. Guaranteed 100% authentic quality and superfast home delivery."}
          </p>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Mirpur-10, Dhaka-1216, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
              <a href="tel:01700112233" className="hover:text-emerald-400">
                01700-112233 (24/7 Hotline)
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>support@smartshopbd.com</span>
            </div>
          </div>
        </div>

        {/* Col 2 & 3: Quick Links & Top Categories (Side-by-side on mobile) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:col-span-2 md:grid-cols-2">
          {/* Col 2: Quick Links */}
          <div>
            <h5 className="font-semibold text-white text-sm mb-4">
              {lang === "bn" ? "প্রয়োজনীয় লিংক" : "Quick Links"}
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/products" className="hover:text-emerald-400 transition">
                  {t.products}
                </Link>
              </li>
              <li>
                <Link href="/products?flash=true" className="hover:text-emerald-400 transition">
                  {t.flashSale}
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-emerald-400 transition">
                  {t.trackOrder}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition">
                  {lang === "bn" ? "আমার ড্যাশবোর্ড" : "My Dashboard"}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href="/admin" className="hover:text-emerald-400 transition text-emerald-400 font-bold">
                    {t.adminDashboard}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Categories (Right of Quick Links) */}
          <div>
            <h5 className="font-semibold text-white text-sm mb-4">
              {lang === "bn" ? "শীর্ষ ক্যাটাগরি" : "Top Categories"}
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug || cat.id || cat._id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:text-emerald-400 transition truncate block"
                  >
                    {lang === "bn" ? cat.nameBn || cat.name : cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Col 4: Payment Methods */}
        <div className="space-y-4">
          <h5 className="font-semibold text-white text-sm">
            {lang === "bn" ? "পেমেন্ট মাধ্যমসমূহ" : "Accepted Payment Methods"}
          </h5>
          <p className="text-xs text-slate-400">
            {lang === "bn"
              ? "আমরা ক্যাশ অন ডেলিভারি (COD) সহ সকল নির্ভরযোগ্য অনলাইন পেমেন্ট সাপোর্ট করি।"
              : "We support Cash on Delivery (COD) and all major mobile financial services."}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1.5 rounded-lg bg-pink-900/40 text-pink-300 border border-pink-700/50 text-[11px] font-bold">
              বিকাশ bKash
            </span>
            <span className="px-2.5 py-1.5 rounded-lg bg-orange-900/40 text-orange-300 border border-orange-700/50 text-[11px] font-bold">
              নগদ Nagad
            </span>
            <span className="px-2.5 py-1.5 rounded-lg bg-purple-900/40 text-purple-300 border border-purple-700/50 text-[11px] font-bold">
              রকেট Rocket
            </span>
            <span className="px-2.5 py-1.5 rounded-lg bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 text-[11px] font-bold">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {t.siteName}. {t.allRightsReserved}
        </p>
        <p className="flex items-center gap-1 text-slate-400">
          <span>Developed with</span>
          <span className="text-rose-500">♥</span>
          <span>Next.js, MongoDB & Cloudinary</span>
        </p>
      </div>
    </footer>
  );
}
