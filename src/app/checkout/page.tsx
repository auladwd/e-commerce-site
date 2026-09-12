"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Banknote,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CheckoutPage() {
  const { lang, t } = useLanguage();
  const { cartItems, subtotal, discount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [trxId, setTrxId] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const shippingFee = deliveryZone === "outside" ? 130 : 70;
  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (cartItems.length === 0) {
      setErrorMsg("আপনার কার্ট খালি। অর্ডার করতে প্রথমে পণ্য যুক্ত করুন।");
      return;
    }

    if (!name.trim()) {
      setErrorMsg(lang === "bn" ? "দয়া করে নাম লিখুন।" : "Please enter your name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 11) {
      setErrorMsg(
        lang === "bn"
          ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।"
          : "Please enter a valid 11-digit mobile number."
      );
      return;
    }

    if (!address.trim()) {
      setErrorMsg(
        lang === "bn"
          ? "দয়া করে সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।"
          : "Please enter your full delivery address."
      );
      return;
    }

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !trxId.trim()) {
      setErrorMsg(
        lang === "bn"
          ? "বিকাশ/নগদ পেমেন্টের TrxID প্রদান করুন।"
          : "Please enter the TrxID for mobile payment."
      );
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerAddress: address.trim(),
        deliveryZone,
        paymentMethod,
        trxId: trxId.trim() || undefined,
        notes: notes.trim() || undefined,
        discount,
        userId: user?.uid || undefined,
        userEmail: user?.email || undefined,
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.title,
          titleBn: item.titleBn,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          size: item.size,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        clearCart();
        // Save to user's order history cache
        try {
          const existingHistory = JSON.parse(localStorage.getItem("my_orders_history") || "[]");
          const newOrderRecord = {
            ...data.data,
            userId: user?.uid,
            userEmail: user?.email,
          };
          localStorage.setItem("my_orders_history", JSON.stringify([newOrderRecord, ...existingHistory.filter((o: { orderNumber: string }) => o.orderNumber !== data.data.orderNumber)]));
        } catch {
          // ignore
        }
        router.push(`/order-success/${data.data.orderNumber || data.data._id}`);
      } else {
        setErrorMsg(data.error || "অর্ডার সম্পন্ন হতে সমস্যা হয়েছে।");
      }
    } catch {
      setErrorMsg("সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t.emptyCart}</h2>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.startShopping}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Link href="/" className="hover:text-emerald-600">
          {t.home}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">চেকআউট ও অর্ডার কনফার্ম</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
        {lang === "bn" ? "অর্ডার সম্পন্ন করুন" : "Complete Your Order"}
      </h1>

      {/* Account Info Pill */}
      {user ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
              ✓
            </div>
            <p className="font-bold">
              লগইন করা আছেন: <span className="text-emerald-700 font-extrabold">{user.displayName || user.email}</span>
            </p>
          </div>
          <p className="text-[11px] text-emerald-800 sm:ml-auto">
            অর্ডারটি সফল হওয়ার সাথে সাথে আপনার ড্যাশবোর্ডে জমা থাকবে।
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black shrink-0">
              গেস্ট চেকআউট
            </span>
            <span className="text-[11px] sm:text-xs">লগইন ছাড়াই সরাসরি নাম ও ঠিকানা দিয়ে দ্রুত অর্ডার করতে পারেন।</span>
          </div>
          <Link
            href="/login"
            className="text-emerald-700 hover:text-emerald-800 font-bold underline whitespace-nowrap text-xs"
          >
            লগইন করে হিস্ট্রি রাখবেন?
          </Link>
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Customer Details & Payment Options */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Section 1: Customer Information */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                ১
              </span>
              <span>ডেলিভারি ঠিকানা ও যোগাযোগের তথ্য</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.customerName} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.customerNamePlaceholder}
                className="w-full px-3.5 sm:px-4 py-2.5 text-sm sm:text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.customerPhone} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.customerPhonePlaceholder}
                className="w-full px-3.5 sm:px-4 py-2.5 text-sm sm:text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.customerAddress} *
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.customerAddressPlaceholder}
                className="w-full px-3.5 sm:px-4 py-2.5 text-sm sm:text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Delivery Zone Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                ডেলিভারি জোন নির্বাচন করুন *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer text-xs font-bold transition ${
                    deliveryZone === "dhaka"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="zone"
                    checked={deliveryZone === "dhaka"}
                    onChange={() => setDeliveryZone("dhaka")}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span>ঢাকা সিটির ভেতরে</span>
                    <p className="text-[11px] font-normal text-slate-500">
                      ডেলিভারি চার্জ ৳৭০ (২৪-৪৮ ঘণ্টার মধ্যে)
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer text-xs font-bold transition ${
                    deliveryZone === "outside"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="zone"
                    checked={deliveryZone === "outside"}
                    onChange={() => setDeliveryZone("outside")}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span>ঢাকা সিটির বাইরে</span>
                    <p className="text-[11px] font-normal text-slate-500">
                      ডেলিভারি চার্জ ৳১৩০ (৩-৫ দিনের মধ্যে)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t.orderNotes}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: কালারের বিশেষ কোনো পছন্দ থাকলে..."
                className="w-full px-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                ২
              </span>
              <span>পেমেন্ট মেথড নির্বাচন করুন</span>
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer text-xs transition ${
                  paymentMethod === "cod"
                    ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-0.5 accent-emerald-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer text-xs transition ${
                  paymentMethod === "bkash"
                    ? "bg-pink-50 border-pink-500 ring-1 ring-pink-500"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                  className="mt-0.5 accent-pink-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-pink-900">
                    <CreditCard className="w-4 h-4 text-pink-600" />
                    <span>বিকাশ (bKash Send Money)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    আমাদের বিকাশ নম্বর <strong>01700-112233</strong> তে সেন্ড মানি করুন।
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer text-xs transition ${
                  paymentMethod === "nagad"
                    ? "bg-orange-50 border-orange-500 ring-1 ring-orange-500"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "nagad"}
                  onChange={() => setPaymentMethod("nagad")}
                  className="mt-0.5 accent-orange-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-orange-900">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                    <span>নগদ (Nagad Send Money)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    আমাদের নগদ নম্বর <strong>01700-112233</strong> তে সেন্ড মানি করুন।
                  </p>
                </div>
              </label>
            </div>

            {/* TrxID input for bKash/Nagad */}
            {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <p className="text-xs font-bold text-amber-900">
                  {t.bkashInstructions}
                </p>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder={t.trxIdPlaceholder}
                  className="w-full px-4 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              অর্ডার বিবরণী ({cartItems.length} টি পণ্য)
            </h3>

            {/* Items List */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-3 flex gap-3 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {lang === "bn" ? item.titleBn || item.title : item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {t.quantity}: {item.quantity}
                      {item.color && ` • ${item.color}`}
                    </p>
                  </div>
                  <span className="text-xs font-black text-emerald-600">
                    {t.currency}
                    {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t.subtotal}:</span>
                <span className="font-bold">
                  {t.currency}
                  {subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.deliveryCharge}:</span>
                <span className="font-bold">
                  {t.currency}
                  {shippingFee}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>কুপন ছাড়:</span>
                  <span className="font-bold">
                    -{t.currency}
                    {discount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-200">
                <span>{t.estimatedTotal}:</span>
                <span className="text-emerald-600 text-lg">
                  {t.currency}
                  {finalTotal}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <span>{t.processing}</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>
                    {t.confirmOrder} ({t.currency}
                    {finalTotal})
                  </span>
                </>
              )}
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>নিরাপদ ও নির্ভরযোগ্য অনলাইন অর্ডারের নিশ্চয়তা</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
