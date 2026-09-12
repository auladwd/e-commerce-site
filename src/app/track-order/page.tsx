"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MapPin,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function TrackOrderContent() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const searchOrder = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchVal.trim())}`);
      const json = await res.json();

      if (json.success && json.data?.length > 0) {
        setOrders(json.data);
      } else {
        setOrders([]);
        setErrorMsg(json.error || t.orderNotFound);
      }
    } catch {
      setErrorMsg("ট্র্যাক করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      searchOrder(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(query);
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "processing":
        return 3;
      case "shipped":
        return 4;
      case "delivered":
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="py-10 max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t.trackOrderTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t.trackOrderSubtitle}
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 p-2 rounded-2xl bg-white border border-slate-200 shadow-md"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="অর্ডার আইডি (যেমনঃ BD-84920) অথবা মোবাইল নম্বর..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          {loading ? t.processing : t.trackButton}
        </button>
      </form>

      {errorMsg && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Orders Tracking Result */}
      {orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((ord) => {
            const step = getStatusStep(ord.orderStatus);

            return (
              <div
                key={ord._id || ord.orderNumber}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-md space-y-4 sm:space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      অর্ডার নম্বর
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {ord.orderNumber}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block font-semibold">
                      সর্বমোট টাকা
                    </span>
                    <span className="text-base font-black text-emerald-600">
                      {t.currency}
                      {ord.total}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="py-3 sm:py-4 px-1">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 w-full z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                      style={{ width: `${((step - 1) / 4) * 100}%` }}
                    />

                    {/* Steps */}
                    {[
                      { num: 1, label: "অর্ডার গ্রহণ" },
                      { num: 2, label: "নিশ্চিত" },
                      { num: 3, label: "প্যাকিং" },
                      { num: 4, label: "কুরিয়ারে" },
                      { num: 5, label: "ডেলিভার্ড" },
                    ].map((st) => {
                      const isCompleted = step >= st.num;
                      return (
                        <div
                          key={st.num}
                          className="relative z-10 flex flex-col items-center"
                        >
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black transition ${
                              isCompleted
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              st.num
                            )}
                          </div>
                          <span
                            className={`text-[9px] sm:text-[10px] font-bold mt-1 text-center max-w-[50px] sm:max-w-none leading-tight ${
                              isCompleted ? "text-emerald-700 font-black" : "text-slate-400"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer and Parcel Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-800">{ord.customerName}</p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ord.customerPhone}</span>
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ord.customerAddress}</span>
                    </p>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <p className="text-slate-500">
                      পেমেন্ট:{" "}
                      <strong className="text-slate-800 uppercase">
                        {ord.paymentMethod === "cod"
                          ? "ক্যাশ অন ডেলিভারি"
                          : ord.paymentMethod}
                      </strong>
                    </p>
                    <p className="text-slate-500">
                      তারিখ:{" "}
                      <span className="text-slate-800">
                        {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </p>
                    <p className="font-bold text-emerald-700">
                      স্ট্যাটাস: {ord.orderStatus?.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Items in order */}
                {ord.items && ord.items.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700">অর্ডারের পণ্যসমূহ:</p>
                    <div className="space-y-2">
                      {ord.items.map((it: { image: string; title: string; titleBn?: string; quantity: number; price: number }, i: number) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={it.image}
                            alt={it.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">
                              {lang === "bn" ? it.titleBn || it.title : it.title}
                            </p>
                            <p className="text-slate-500 text-[11px]">
                              {it.quantity} টি x ৳{it.price}
                            </p>
                          </div>
                          <span className="font-black text-emerald-600">
                            ৳{it.quantity * it.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
