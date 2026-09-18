"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, CheckCircle, Store, Phone, Truck, CreditCard, Tag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSettingsPage() {
  const { lang, t } = useLanguage();

  const [storeName, setStoreName] = useState("SmartShop BD");
  const [storeNameBn, setStoreNameBn] = useState("স্মার্টশপ বাংলাদেশ");
  const [hotline, setHotline] = useState("01700-112233");
  const [whatsapp, setWhatsapp] = useState("8801700112233");
  const [email, setEmail] = useState("support@smartshopbd.com");
  const [address, setAddress] = useState("Mirpur-10, Dhaka-1216, Bangladesh");
  const [shippingFeeInsideDhaka, setShippingFeeInsideDhaka] = useState(70);
  const [shippingFeeOutsideDhaka, setShippingFeeOutsideDhaka] = useState(130);
  const [bkashNumber, setBkashNumber] = useState("01700-112233");
  const [nagadNumber, setNagadNumber] = useState("01700-112233");
  const [couponEnabled, setCouponEnabled] = useState(false);
  const [couponCode, setCouponCode] = useState("SAVE10");
  const [couponDiscountType, setCouponDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [couponDiscountValue, setCouponDiscountValue] = useState(10);
  const [couponMinOrder, setCouponMinOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          if (d.storeName) setStoreName(d.storeName);
          if (d.storeNameBn) setStoreNameBn(d.storeNameBn);
          if (d.hotline) setHotline(d.hotline);
          if (d.whatsapp) setWhatsapp(d.whatsapp);
          if (d.email) setEmail(d.email);
          if (d.address) setAddress(d.address);
          if (d.shippingFeeInsideDhaka) setShippingFeeInsideDhaka(d.shippingFeeInsideDhaka);
          if (d.shippingFeeOutsideDhaka) setShippingFeeOutsideDhaka(d.shippingFeeOutsideDhaka);
          if (d.bkashNumber) setBkashNumber(d.bkashNumber);
          if (d.nagadNumber) setNagadNumber(d.nagadNumber);
          if (typeof d.couponEnabled === "boolean") setCouponEnabled(d.couponEnabled);
          if (d.couponCode) setCouponCode(d.couponCode);
          if (d.couponDiscountType) setCouponDiscountType(d.couponDiscountType);
          if (d.couponDiscountValue !== undefined) setCouponDiscountValue(d.couponDiscountValue);
          if (d.couponMinOrder !== undefined) setCouponMinOrder(d.couponMinOrder);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeNameBn,
          hotline,
          whatsapp,
          email,
          address,
          shippingFeeInsideDhaka: Number(shippingFeeInsideDhaka),
          shippingFeeOutsideDhaka: Number(shippingFeeOutsideDhaka),
          bkashNumber,
          nagadNumber,
          couponEnabled,
          couponCode: couponCode.trim().toUpperCase(),
          couponDiscountType,
          couponDiscountValue: Number(couponDiscountValue) || 0,
          couponMinOrder: Number(couponMinOrder) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
      }
    } catch {
      setMsg("সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>স্টোর ও ডেলিভারি সেটিংস কনফিগারেশন</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            আপনার ক্লায়েন্টের ব্যবসা অনুযায়ী হটলাইন, ডেলিভারি চার্জ ও বিকাশ নম্বর পরিবর্তন করুন।
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Store Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-slate-500" />
              <span>স্টোর পরিচিতি</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্টোরের নাম (বাংলা)
                </label>
                <input
                  type="text"
                  value={storeNameBn}
                  onChange={(e) => setStoreNameBn(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store Name (English)
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Contact & Hotline */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>যোগাযোগ ও হটলাইন</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  হটলাইন মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  হোয়াটসঅ্যাপ নম্বর (দেশ কোডসহ)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="8801XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  সাপোর্ট ইমেইল
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                অফিস / শোরুম ঠিকানা
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>ডেলিভারি চার্জ নির্ধারণ (৳ BDT)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={shippingFeeInsideDhaka}
                  onChange={(e) => setShippingFeeInsideDhaka(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  value={shippingFeeOutsideDhaka}
                  onChange={(e) => setShippingFeeOutsideDhaka(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Banking Numbers */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>মোবাইল ব্যাংকিং পেমেন্ট নম্বর</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিকাশ (bKash) নম্বর
                </label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নগদ (Nagad) নম্বর
                </label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Coupon & Discount Settings Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span>কুপন ও ডিসকাউন্ট অফার কনফিগারেশন</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  গ্রাহকদের কার্টে ডিসকাউন্ট দিতে কুপন সিস্টেম চালু বা বন্ধ করুন।
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition select-none">
                <input
                  type="checkbox"
                  checked={couponEnabled}
                  onChange={(e) => setCouponEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  {couponEnabled ? "কুপন সক্রিয় (Active)" : "কুপন নিষ্ক্রিয় (Inactive)"}
                </span>
              </label>
            </div>

            <div className={`p-4 rounded-2xl border transition ${couponEnabled ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50 border-slate-200 opacity-75"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    কুপন কোড
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={!couponEnabled}
                    placeholder="SAVE10"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono font-bold disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ডিসকাউন্টের ধরন
                  </label>
                  <select
                    value={couponDiscountType}
                    onChange={(e) => setCouponDiscountType(e.target.value as "percentage" | "fixed")}
                    disabled={!couponEnabled}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                  >
                    <option value="percentage">শতাংশ (%) ছাড়</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳) ছাড়</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ছাড়ের পরিমাণ {couponDiscountType === "percentage" ? "(%)" : "(৳)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={couponDiscountValue}
                    onChange={(e) => setCouponDiscountValue(Number(e.target.value))}
                    disabled={!couponEnabled}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সর্বনিম্ন অর্ডার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    disabled={!couponEnabled}
                    placeholder="0"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="mt-3 text-[11px] font-medium">
                {couponEnabled ? (
                  <p className="text-emerald-700">
                    ✓ কুপন সক্রিয়: গ্রাহক কার্টে <span className="font-bold uppercase font-mono">'{couponCode}'</span> কোড দিলে {couponDiscountType === "percentage" ? `${couponDiscountValue}%` : `৳${couponDiscountValue}`} ছাড় পাবেন {couponMinOrder > 0 ? `(সর্বনিম্ন অর্ডার ৳${couponMinOrder})` : "(যেকোনো অর্ডারে)"}।
                  </p>
                ) : (
                  <p className="text-slate-500">
                    ℹ️ বর্তমানে কুপন ব্যবস্থা নিষ্ক্রিয় রয়েছে। গ্রাহকরা কার্টে কোনো কুপন দিলে তা সক্রিয় হবে না। চালু করতে উপরের চকমার্কে ক্লিক করে সেটিংস সংরক্ষণ করুন।
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Admin Permissions & Security Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-slate-500" />
              <span>অ্যাডমিন প্যানেল অনুমতি ও সিকিউরিটি</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-800">অ্যাডমিন এক্সেস সিক্রেট কি (Security Passkey)</span>
                  <p className="text-[11px] text-slate-500">
                    অ্যাডমিন প্যানেলে প্রবেশের জন্য যে পাসকোডটি ভেরিফাই করা হয়।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-emerald-700">
                    admin123456
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    সক্রিয়
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                💡 <span className="font-semibold text-slate-700">অনুমতি নির্দেশনা:</span> শুধুমাত্র যাকে এই সিক্রেট কি বা অ্যাডমিন ইমেইল দেওয়া হবে, শুধু সে-ই অ্যাডমিন প্যানেলে ঢুকতে পারবে। যেকোনো সাধারণ ভিজিটরের এক্সেস স্বয়ংক্রিয়ভাবে ব্লক থাকবে।
              </div>
            </div>
          </div>

          {msg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{msg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
