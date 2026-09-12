"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Printer,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrder(json.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const orderNumber = order?.orderNumber || id;
  const whatsappMsg = encodeURIComponent(
    `হ্যালো! আমার অর্ডার আইডি ${orderNumber} সম্পর্কে জানতে চাচ্ছি।`
  );

  return (
    <div className="py-12 max-w-2xl mx-auto space-y-8">
      {/* Success Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.orderSuccessTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.orderSuccessSubtitle}
          </p>
        </div>

        {/* Order Number Highlight */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block px-8">
          <span className="text-xs text-slate-500 block font-medium">
            {t.orderId}
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-wider">
            {orderNumber}
          </span>
        </div>

        {/* Order Details Preview */}
        {order && (
          <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">গ্রাহকের নাম:</span>
              <span className="font-bold text-slate-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">মোবাইল নম্বর:</span>
              <span className="font-bold text-slate-800">{order.customerPhone}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">ঠিকানা:</span>
              <span className="font-bold text-slate-800">{order.customerAddress}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">পেমেন্ট মেথড:</span>
              <span className="font-bold uppercase text-emerald-700">
                {order.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি (COD)" : order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-black text-slate-900">
              <span>মোট পরিশোধযোগ্য টাকা:</span>
              <span className="text-emerald-600">
                {t.currency}
                {order.total}
              </span>
            </div>
          </div>
        )}

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={`/track-order?query=${encodeURIComponent(orderNumber)}`}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
          >
            <Truck className="w-4 h-4" />
            <span>পার্সেল ট্র্যাক করুন</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printInvoice}</span>
          </button>
        </div>

        {/* WhatsApp assistance */}
        <a
          href={`https://wa.me/8801700112233?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline pt-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>অর্ডারটি দ্রুত নিশ্চিত করতে হোয়াটসঅ্যাপে নক দিন</span>
        </a>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>হোমপেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}
