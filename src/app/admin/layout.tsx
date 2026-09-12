"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { user, signInWithGoogle } = useAuth();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Passkey input state
  const [passkey, setPasskey] = useState<string>("");
  const [showPasskey, setShowPasskey] = useState<boolean>(false);
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string>("");

  // Seed state
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  // Check authorization on mount
  useEffect(() => {
    const checkPermission = () => {
      // 1. Check verified session token
      const sessionToken =
        sessionStorage.getItem("admin_session_token") ||
        localStorage.getItem("admin_session_token");

      if (sessionToken) {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }

      // 2. Check logged-in user role or admin email
      if (
        user &&
        (user.role === "admin" ||
          user.email?.toLowerCase().includes("admin") ||
          user.email?.toLowerCase().endsWith("@smartshopbd.com"))
      ) {
        setIsAuthorized(true);
        sessionStorage.setItem("admin_session_token", `user_${user.uid}`);
        setCheckingAuth(false);
        return;
      }

      setIsAuthorized(false);
      setCheckingAuth(false);
    };

    checkPermission();
  }, [user]);

  // Handle passkey verification
  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");

    if (!passkey.trim()) {
      setVerifyError("দয়া করে অ্যাডমিন পারমিশন কি প্রবেশ করান।");
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey: passkey.trim(), email: user?.email }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        sessionStorage.setItem("admin_session_token", data.token);
        localStorage.setItem("admin_session_token", data.token);
        setIsAuthorized(true);
        setPasskey("");
      } else {
        setVerifyError(
          data.error || "ভুল পারমিশন কি! শুধুমাত্র অনুমতি প্রাপ্ত ব্যক্তি প্রবেশ করতে পারবেন।"
        );
      }
    } catch {
      setVerifyError("সার্ভার ভেরিফিকেশনে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Logout / Lock Admin Panel
  const handleLockAdmin = () => {
    sessionStorage.removeItem("admin_session_token");
    localStorage.removeItem("admin_session_token");
    setIsAuthorized(false);
    setPasskey("");
  };

  // Seed DB handler
  const handleSeedDatabase = async () => {
    setSeedLoading(true);
    setSeedMsg(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSeedMsg("ডাটাবেজ সফলভাবে সীড হয়েছে! (MongoDB Atlas)");
      } else {
        setSeedMsg(json.error || "সীড করতে সমস্যা হয়েছে। .env.local চেক করুন।");
      }
    } catch {
      setSeedMsg("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSeedLoading(false);
    }
  };

  const navItems = [
    { href: "/admin", label: "ড্যাশবোর্ড (Overview)", icon: LayoutDashboard },
    { href: "/admin/products", label: "পণ্য ও Cloudinary আপলোড", icon: Package },
    { href: "/admin/categories", label: "ক্যাটাগরি তৈরি ও নিয়ন্ত্রণ", icon: Layers },
    { href: "/admin/orders", label: "অর্ডার ও কুরিয়ার ট্র্যাকিং", icon: ShoppingCart },
    { href: "/admin/settings", label: "স্টোর ও পেমেন্ট সেটিংস", icon: Settings },
  ];

  // While checking auth on initial page load
  if (checkingAuth) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
          <KeyRound className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-500">
          অ্যাডমিন পারমিশন যাচাই করা হচ্ছে...
        </p>
      </div>
    );
  }

  // If NOT authorized, render the Security & Permission Gate
  if (!isAuthorized) {
    return (
      <div className="py-12 sm:py-16 max-w-md mx-auto space-y-6">
        {/* Security Warning Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              সংরক্ষিত এলাকা • Restricted Access
            </span>
            <h1 className="text-2xl font-black text-slate-900">
              অ্যাডমিন প্যানেল এক্সেস
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              শুধুমাত্র অনুমোদিত ব্যক্তি ও পারমিশন প্রাপ্ত অ্যাডমিন এখানে প্রবেশ করতে পারবেন।
            </p>
          </div>
        </div>

        {/* Security Verification Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <form onSubmit={handleVerifyPasskey} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>অ্যাডমিন সিক্রেট পারমিশন কি দিন:</span>
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? "text" : "password"}
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="অ্যাডমিন পাসকোড লিখুন..."
                  className="w-full px-4 py-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ডিফল্ট সিকিউরিটি কি: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-bold">admin123456</code>
              </p>
            </div>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {verifyLoading ? (
                <span>যাচাই হচ্ছে...</span>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>পারমিশন ভেরিফাই করে প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">
              অথবা অনুমোদিত একাউন্ট
            </span>
          </div>

          {/* Quick Google Sign In for Authorized Admin */}
          <button
            type="button"
            onClick={async () => {
              await signInWithGoogle();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>অ্যাডমিন ইমেইল দিয়ে লগইন করুন</span>
          </button>
        </div>

        {/* Return to Live Store */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  // If AUTHORIZED: Render the full admin layout & complete dashboard
  return (
    <div className="py-6 space-y-6">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white">
                {t.adminDashboard}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                অনুমোদিত অ্যাডমিন
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === "bn"
                ? "পণ্য, অর্ডার, ক্লাউডিনারি মিডিয়া ও স্টোর সেটিংস নিয়ন্ত্রণ"
                : "Manage products, orders, Cloudinary media and store settings"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1-Click Database Seed */}
          <button
            onClick={handleSeedDatabase}
            disabled={seedLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
            title="MongoDB Atlas এ ডেমো ডাটা যোগ করুন"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{seedLoading ? "সীড হচ্ছে..." : "MongoDB সিড"}</span>
          </button>

          {/* Visit Live Store */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
          >
            <span>লাইভ স্টোর</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Lock / Logout Admin Button */}
          <button
            onClick={handleLockAdmin}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer"
            title="অ্যাডমিন সেশন লক করুন"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লক করুন</span>
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{seedMsg}</span>
        </div>
      )}

      {/* Admin Sub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Content Area */}
      <div>{children}</div>
    </div>
  );
}
