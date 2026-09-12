"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, Truck, Phone, User, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function QuickBuyModal() {
  const { lang, t } = useLanguage();
  const { quickBuyProduct, closeQuickBuy } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!quickBuyProduct) return null;

  const effectivePrice = quickBuyProduct.salePrice ?? quickBuyProduct.price;
  const shippingFee = deliveryZone === "outside" ? 130 : 70;
  const totalAmount = effectivePrice * quantity + shippingFee;
  const imgUrl =
    quickBuyProduct.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg(
        lang === "bn" ? "দয়া করে আপনার নাম লিখুন।" : "Please enter your name."
      );
      return;
    }

    if (!phone.trim() || phone.trim().length < 11) {
      setErrorMsg(
        lang === "bn"
          ? "দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।"
          : "Please enter a valid 11-digit mobile number."
      );
      return;
    }

    if (!address.trim()) {
      setErrorMsg(
        lang === "bn"
          ? "দয়া করে আপনার সম্পূর্ণ ঠিকানা লিখুন।"
          : "Please enter your full delivery address."
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
        paymentMethod: "cod",
        userId: user?.uid || undefined,
        userEmail: user?.email || undefined,
        items: [
          {
            productId: quickBuyProduct.id || quickBuyProduct._id || "",
            title: quickBuyProduct.title,
            titleBn: quickBuyProduct.titleBn,
            price: effectivePrice,
            quantity,
            image: imgUrl,
            color: selectedColor || quickBuyProduct.colors?.[0],
            size: selectedSize || quickBuyProduct.sizes?.[0],
          },
        ],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        closeQuickBuy();
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {t.quickBuyTitle}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              {t.quickBuySubtitle}
            </p>
          </div>
          <button
            onClick={closeQuickBuy}
            className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {/* Selected Product Summary Box */}
          <div className="flex gap-3 items-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl}
              alt={quickBuyProduct.title}
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {lang === "bn"
                  ? quickBuyProduct.titleBn || quickBuyProduct.title
                  : quickBuyProduct.title}
              </h4>
              <p className="text-xs font-black text-emerald-600 mt-1">
                {t.currency}
                {effectivePrice}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Color & Size Variant (if exists) */}
          {quickBuyProduct.colors && quickBuyProduct.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.color}:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickBuyProduct.colors.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      (selectedColor || quickBuyProduct.colors?.[0]) === c
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quickBuyProduct.sizes && quickBuyProduct.sizes.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.size}:
              </label>
              <div className="flex flex-wrap gap-2">
                {quickBuyProduct.sizes.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                      (selectedSize || quickBuyProduct.sizes?.[0]) === s
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Inputs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.customerName} *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.customerNamePlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.customerPhone} *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.customerPhonePlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t.customerAddress} *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.customerAddressPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Delivery Zone Radio Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.district}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                  deliveryZone === "dhaka"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="quickDelivery"
                  checked={deliveryZone === "dhaka"}
                  onChange={() => setDeliveryZone("dhaka")}
                  className="accent-emerald-600"
                />
                <span>{t.dhakaCity}</span>
              </label>

              <label
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition ${
                  deliveryZone === "outside"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="quickDelivery"
                  checked={deliveryZone === "outside"}
                  onChange={() => setDeliveryZone("outside")}
                  className="accent-emerald-600"
                />
                <span>{t.outsideDhaka}</span>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-3 rounded-xl bg-slate-100 text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>{t.subtotal}:</span>
              <span className="font-bold">
                {t.currency}
                {effectivePrice * quantity}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{t.deliveryCharge}:</span>
              <span className="font-bold">
                {t.currency}
                {shippingFee}
              </span>
            </div>
            <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-slate-200">
              <span>{t.estimatedTotal}:</span>
              <span className="text-emerald-600">
                {t.currency}
                {totalAmount}
              </span>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
              {errorMsg}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <span>{t.processing}</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>
                  {t.confirmOrder} ({t.currency}
                  {totalAmount})
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
