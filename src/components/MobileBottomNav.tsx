"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, ShoppingBag, Truck, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();

  // Hide bottom nav on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: lang === "bn" ? "হোম" : "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: lang === "bn" ? "পণ্যসমূহ" : "Products",
      href: "/products",
      icon: Grid,
      isActive: pathname.startsWith("/products"),
    },
    {
      label: lang === "bn" ? "কার্ট" : "Cart",
      action: () => setIsCartOpen(true),
      icon: ShoppingBag,
      badge: totalItems,
      isActive: false,
    },
    {
      label: lang === "bn" ? "ট্র্যাকিং" : "Track",
      href: "/track-order",
      icon: Truck,
      isActive: pathname === "/track-order",
    },
    {
      label: user
        ? lang === "bn"
          ? "হিস্ট্রি"
          : "History"
        : lang === "bn"
        ? "লগইন"
        : "Account",
      href: user ? "/dashboard" : "/login",
      icon: User,
      isActive: pathname === "/dashboard" || pathname === "/login",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.action) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="relative flex flex-col items-center justify-center py-1 px-3 text-slate-600 hover:text-emerald-600 transition cursor-pointer group"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 transition-transform group-active:scale-90" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-tight text-slate-700">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-3 transition group ${
                item.isActive
                  ? "text-emerald-600 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    item.isActive ? "text-emerald-600 stroke-[2.5]" : ""
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  item.isActive ? "text-emerald-700 font-black" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
