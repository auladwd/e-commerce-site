"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Plus,
  Eye,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
  const { lang, t } = useLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/products"),
      ]);

      const ordJson = await ordRes.json();
      const prodJson = await prodRes.json();

      if (ordJson.success && ordJson.data) setOrders(ordJson.data);
      if (prodJson.success && prodJson.data) setProducts(prodJson.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "pending").length;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      fetchDashboardData();
    } catch {
      alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalRevenue}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.currency}
              {totalRevenue.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              +১২.৫% এই সপ্তাহে বৃদ্ধি
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalOrders}
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {orders.length}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              দেশব্যাপী মোট অর্ডার
            </p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.pendingOrders}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600">
              {pendingOrders}
            </h3>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              ফোন ভেরিফিকেশন প্রয়োজন
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalProducts}
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {products.length}
            </h3>
            <p className="text-[11px] text-teal-700 font-medium mt-1">
              লাইভ স্টোরে সক্রিয়
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-black">
            নতুন পণ্য আপলোড করতে চান?
          </h3>
          <p className="text-xs text-emerald-100">
            Cloudinary তে সরাসরি অপ্টিমাইজড ছবি আপলোড করে নিমেষেই নতুন প্রোডাক্ট যুক্ত করুন।
          </p>
        </div>
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-slate-100 font-black text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন</span>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">
              সাম্প্রতিক অর্ডারসমূহ (Recent Orders)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              কাস্টমারকে কল করে এক ক্লিকে স্ট্যাটাস আপডেট করুন
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            সকল অর্ডার দেখুন →
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">অর্ডার নম্বর</th>
                <th className="py-3.5 px-6">গ্রাহক ও মোবাইল</th>
                <th className="py-3.5 px-6">ডেলিভারি ঠিকানা</th>
                <th className="py-3.5 px-6">টাকা ও মেথড</th>
                <th className="py-3.5 px-6">বর্তমান স্ট্যাটাস</th>
                <th className="py-3.5 px-6 text-right">স্ট্যাটাস পরিবর্তন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.slice(0, 8).map((ord) => (
                <tr key={ord._id || ord.orderNumber} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-black text-slate-900">
                    <Link
                      href={`/order-success/${ord.orderNumber || ord._id}`}
                      className="hover:text-emerald-600 hover:underline"
                    >
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{ord.customerName}</div>
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-emerald-600 font-semibold text-[11px] hover:underline"
                    >
                      {ord.customerPhone}
                    </a>
                  </td>
                  <td className="py-4 px-6 max-w-xs truncate text-slate-500">
                    {ord.customerAddress}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-black text-emerald-600 block">
                      {t.currency}
                      {ord.total}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {ord.paymentMethod === "cod" ? "Cash on Delivery" : ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.orderStatus === "delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : ord.orderStatus === "confirmed"
                          ? "bg-teal-100 text-teal-800"
                          : ord.orderStatus === "cancelled"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(ord._id || ord.orderNumber, e.target.value)
                      }
                      className="py-1 px-2 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
