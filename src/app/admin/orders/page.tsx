"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Phone,
  Printer,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminOrdersPage() {
  const { lang, t } = useLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? "/api/orders"
          : `/api/orders?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setOrders(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      fetchOrders();
    } catch {
      alert("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="অর্ডার নম্বর বা কাস্টমার ফোন দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">অর্ডার নম্বর</th>
                <th className="py-3.5 px-6">গ্রাহকের নাম ও ফোন</th>
                <th className="py-3.5 px-6">ঠিকানা ও জোন</th>
                <th className="py-3.5 px-6">পণ্য বিবরণী</th>
                <th className="py-3.5 px-6">মোট টাকা ও পেমেন্ট</th>
                <th className="py-3.5 px-6">স্ট্যাটাস</th>
                <th className="py-3.5 px-6 text-right">মেমো / চালান</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.map((ord) => (
                <tr key={ord._id || ord.orderNumber} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-black text-slate-900">
                    <span className="text-emerald-700 block">{ord.orderNumber}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{ord.customerName}</div>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1 hover:underline mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </td>

                  <td className="py-4 px-6 max-w-xs">
                    <p className="truncate text-slate-800 font-medium">
                      {ord.customerAddress}
                    </p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                      {ord.deliveryZone === "outside" ? "ঢাকার বাইরে (৳১৩০)" : "ঢাকা সিটি (৳৭০)"}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800">
                      {ord.items?.length || 1} টি পণ্য
                    </span>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {ord.items?.[0]?.title}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="font-black text-emerald-600 text-sm block">
                      {t.currency}
                      {ord.total}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {ord.paymentMethod === "cod" ? "COD" : `${ord.paymentMethod} (${ord.trxId || "No Trx"})`}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(ord._id || ord.orderNumber, e.target.value)
                      }
                      className="py-1 px-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedInvoice(ord)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                      title="চালান / মেমো দেখুন"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>চালান</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal for Printing */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  অর্ডার চালান / মেমো
                </h3>
                <p className="text-xs text-slate-500">
                  স্মার্টশপ বাংলাদেশ - কাস্টমার কপি
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Memo Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-slate-400">অর্ডার নম্বর:</p>
                  <p className="font-black text-slate-900 text-sm">
                    {selectedInvoice.orderNumber}
                  </p>
                  <p className="text-slate-400 mt-2">তারিখ:</p>
                  <p className="font-bold text-slate-800">
                    {new Date(selectedInvoice.createdAt).toLocaleString("bn-BD")}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">গ্রাহকের তথ্য:</p>
                  <p className="font-bold text-slate-900">
                    {selectedInvoice.customerName}
                  </p>
                  <p className="text-slate-600">{selectedInvoice.customerPhone}</p>
                  <p className="text-slate-600 mt-1">
                    {selectedInvoice.customerAddress}
                  </p>
                </div>
              </div>

              {/* Items in Invoice */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold text-slate-600">
                    <tr>
                      <th className="p-3">পণ্য</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items?.map((item: { title: string; quantity: number; price: number }, i: number) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold text-slate-800">
                          {item.title}
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          ৳{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Totals */}
              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 text-right">
                <p className="text-slate-600">
                  উপমোট: <strong className="text-slate-800">৳{selectedInvoice.subtotal}</strong>
                </p>
                <p className="text-slate-600">
                  ডেলিভারি চার্জ: <strong className="text-slate-800">৳{selectedInvoice.shippingFee}</strong>
                </p>
                {selectedInvoice.discount > 0 && (
                  <p className="text-emerald-600 font-bold">
                    কুপন ছাড়: -৳{selectedInvoice.discount}
                  </p>
                )}
                <p className="text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                  সর্বমোট প্রদেয়: <span className="text-emerald-600">৳{selectedInvoice.total}</span>
                </p>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>মেমো প্রিন্ট করুন</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
