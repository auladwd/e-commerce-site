"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  PhoneCall,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  Languages,
  Truck,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadNavCategories = () => {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setCategories(json.data);
          }
        })
        .catch(() => {});
    };

    loadNavCategories();
    window.addEventListener("categories_updated", loadNavCategories);
    return () => window.removeEventListener("categories_updated", loadNavCategories);
  }, []);

  const isAdmin = Boolean(
    user &&
      (user.role === "admin" ||
        user.email?.toLowerCase().includes("admin") ||
        user.email?.toLowerCase().endsWith("@smartshopbd.com"))
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
              {lang === "bn" ? "অফার" : "PROMO"}
            </span>
            <span className="truncate text-[10px] sm:text-xs text-slate-300 font-medium">
              {lang === "bn"
                ? "🎁 প্রথম অর্ডারে কুপন 'SAVE10' দিয়ে ১০% ছাড়!"
                : "🎁 Use coupon 'SAVE10' for 10% discount!"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Hotline Call */}
            <a
              href="tel:01700112233"
              className="flex items-center gap-1 hover:text-emerald-400 transition text-[10px] sm:text-xs"
            >
              <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span className="hidden xs:inline">01700-112233</span>
            </a>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer border border-slate-700 text-[10px] sm:text-xs"
              title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <Languages className="w-3 h-3 text-emerald-400" />
              <span>
                {lang === "bn" ? "English" : "বাংলা"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="glass-nav shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition">
                {lang === "bn" ? "স্মার্টশপ" : "SmartShop"}
                <span className="text-emerald-600">.BD</span>
              </span>
              <p className="hidden sm:block text-[11px] text-slate-500 -mt-1 font-medium">
                {t.siteTagline}
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-6 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-4 pr-11 py-2.5 rounded-full border border-slate-300 bg-white/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Track Order Link */}
            <Link
              href="/track-order"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t.trackOrder}</span>
            </Link>

            {/* Admin Dashboard (Visible only when Admin is logged in) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition"
                title="Admin Panel"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>{t.adminDashboard}</span>
              </Link>
            )}

            {/* User Account / Dashboard Link */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition"
                  title="আমার ড্যাশবোর্ড ও অর্ডার হিস্ট্রি"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>আমার ড্যাশবোর্ড</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer">
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="w-8 h-8 rounded-full border border-emerald-400 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {user.displayName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.displayName || "সম্মানিত গ্রাহক"}
                        </p>
                        {isAdmin && (
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-black">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-indigo-700 hover:bg-indigo-50 font-bold transition border-b border-slate-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>{t.adminDashboard}</span>
                      </Link>
                    )}

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-bold transition"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>আমার ড্যাশবোর্ড (হিস্ট্রি)</span>
                    </Link>
                    <Link
                      href="/track-order"
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      <Truck className="w-4 h-4 text-slate-500" />
                      <span>লাইভ ট্র্যাকিং</span>
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition cursor-pointer font-bold"
                    >
                      {t.logout}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.login}</span>
              </Link>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">{t.cart}</span>
              {totalItems > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-amber-400 text-slate-900 font-bold text-[11px] animate-pulse-deal">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dedicated Search Input (Always easily accessible on phones) */}
        <div className="md:hidden px-3.5 pb-2.5 pt-0.5">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-3.5 pr-9 py-2 rounded-xl border border-slate-200 bg-white/95 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-600 text-white cursor-pointer hover:bg-emerald-700 transition"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {t.home}
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {t.products}
              </Link>
              <Link
                href="/products?flash=true"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/70 hover:bg-rose-100 flex items-center justify-between transition"
              >
                <span>{t.flashSale}</span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black">
                  HOT
                </span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center justify-between transition"
              >
                <span>আমার ড্যাশবোর্ড ও অর্ডার</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                  হিস্ট্রি
                </span>
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {t.trackOrder}
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 flex items-center justify-between transition"
                >
                  <span>{t.adminDashboard}</span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                    অনুমোদিত
                  </span>
                </Link>
              )}

              {!user ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition text-center mt-2"
                >
                  {t.login} / রেজিস্ট্রেশন
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                >
                  {t.logout}
                </button>
              )}
            </div>

            {/* Quick Categories in Mobile Menu */}
            {categories.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  ক্যাটাগরি সমূহ
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug || cat.id || cat._id}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold truncate transition"
                    >
                      {lang === "bn" ? cat.nameBn || cat.name : cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-Header Navigation Links (Desktop) */}
      <div className="hidden md:block bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-emerald-600 transition">
              {t.home}
            </Link>
            <Link href="/products" className="hover:text-emerald-600 transition">
              {t.products}
            </Link>
            <Link
              href="/products?flash=true"
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{t.flashSale}</span>
            </Link>

            {/* Dynamic Category Links */}
            {categories.map((cat) => (
              <Link
                key={cat.slug || cat.id || cat._id}
                href={`/products?category=${cat.slug}`}
                className="hover:text-emerald-600 transition whitespace-nowrap"
              >
                {lang === "bn" ? cat.nameBn || cat.name : cat.name}
              </Link>
            ))}
          </div>

          <div className="text-slate-500 font-medium flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {lang === "bn"
                ? "সারা বাংলাদেশে দ্রুততম হোম ডেলিভারি"
                : "Fastest Nationwide Home Delivery"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
