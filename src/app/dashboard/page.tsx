"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ExternalLink,
  Copy,
  Receipt,
  RotateCcw,
  User,
  Phone,
  MapPin,
  LogIn,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { ProductItem } from "@/lib/demoData";

interface OrderItem {
  productId: string;
  title: string;
  titleBn?: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface OrderRecord {
  _id?: string;
  orderNumber: string;
  userId?: string;
  userEmail?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: "dhaka" | "outside";
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<OrderRecord | null>(null);

  // Guest lookup state
  const [guestPhone, setGuestPhone] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupMsg, setLookupMsg] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch from server API
      const params = new URLSearchParams();
      if (user?.uid) params.append("userId", user.uid);
      if (user?.email) params.append("userEmail", user.email);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const json = await res.json();
      let serverOrders: OrderRecord[] = [];
      if (json.success && Array.isArray(json.data)) {
        serverOrders = json.data;
      }

      // 2. Combine with local storage cached orders (for immediate sync)
      const localHistory: OrderRecord[] = JSON.parse(
        localStorage.getItem("my_orders_history") || "[]"
      );

      // Merge avoiding duplicates by orderNumber
      const orderMap = new Map<string, OrderRecord>();
      serverOrders.forEach((o) => orderMap.set(o.orderNumber, o));
      localHistory.forEach((o) => {
        if (!orderMap.has(o.orderNumber)) {
          orderMap.set(o.orderNumber, o);
        }
      });

      const combined = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(combined);
    } catch {
      // Fallback to local storage
      const localHistory: OrderRecord[] = JSON.parse(
        localStorage.getItem("my_orders_history") || "[]"
      );
      setOrders(localHistory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Guest phone lookup handler
  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhone.trim() || guestPhone.trim().length < 11) {
      setLookupMsg("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
      return;
    }

    setLookupLoading(true);
    setLookupMsg("");
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(guestPhone.trim())}`);
      const json = await res.json();
      if (json.success && json.data?.length > 0) {
        setOrders(json.data);
        setLookupMsg(`আপনার মোবাইল নম্বরে ${json.data.length}টি অর্ডার পাওয়া গেছে!`);
      } else {
        setLookupMsg("এই মোবাইল নম্বরে কোনো অর্ডার খুঁজে পাওয়া যায়নি।");
      }
    } catch {
      setLookupMsg("অর্ডার খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLookupLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reorder action
  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const dummyProduct: ProductItem = {
        id: item.productId,
        title: item.title,
        titleBn: item.titleBn || item.title,
        slug: item.productId,
        price: item.price,
        description: item.title,
        descriptionBn: item.titleBn || item.title,
        category: "gadgets",
        categoryBn: "গ্যাজেট",
        images: [{ url: item.image, public_id: "" }],
        stock: 50,
        rating: 5,
        numReviews: 1,
        isFeatured: false,
        isFlashDeal: false,
      };
      addToCart(dummyProduct, item.quantity, item.color, item.size);
    });
    router.push("/checkout");
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesTab = activeTab === "all" || ord.orderStatus === activeTab;
      const matchesSearch =
        !searchQuery.trim() ||
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerPhone.includes(searchQuery) ||
        ord.items.some((i) =>
          (i.titleBn || i.title).toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Statistics calculation
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) =>
    ["pending", "processing"].includes(o.orderStatus)
  ).length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;
  const totalSpent = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);

  const statusBadge = (status: OrderRecord["orderStatus"]) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ডেলিভার্ড সম্পন্ন
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            ডেলিভারির পথে (Shipped)
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            অর্ডার নিশ্চিত
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Package className="w-3.5 h-3.5" />
            প্যাকিং হচ্ছে
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            বাতিলকৃত
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            পেন্ডিং ভেরিফিকেশন
          </span>
        );
    }
  };

  return (
    <div className="py-4 sm:py-8 space-y-5 sm:space-y-8">
      {/* Top Header / Greeting */}
      <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg sm:text-xl shadow-lg shrink-0">
            {user?.displayName ? (
              user.displayName.charAt(0).toUpperCase()
            ) : (
              <User className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-black">
                {user ? `স্বাগতম, ${user.displayName || "সম্মানিত গ্রাহক"}!` : "কাস্টমার ড্যাশবোর্ড ও হিস্ট্রি"}
              </h1>
              {user && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[9px] sm:text-[10px] font-extrabold">
                  ভেরিফাইড কাস্টমার
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1">
              {user?.email
                ? `ইমেইল: ${user.email} • আপনার পূর্ববর্তী সকল অর্ডারের তথ্য ও ডেলিভারি স্ট্যাটাস`
                : "যে কোনো ব্যক্তি লগইন করে অথবা সরাসরি অর্ডার করতে পারেন। আপনার সকল অর্ডার হিস্ট্রি এখানে সংরক্ষিত থাকে।"}
            </p>
          </div>
        </div>

        {!user && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন</span>
            </Link>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">মোট অর্ডার</span>
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900">
            {totalOrdersCount}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500">সর্বমোট দেওয়া অর্ডার</p>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">চলমান / পেন্ডিং</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-amber-600">
            {pendingCount}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500">প্রক্রিয়াধীন অর্ডার</p>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">সফল ডেলিভারি</span>
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-emerald-600">
            {deliveredCount}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500">হাতে পৌঁছানো পণ্য</p>
        </div>

        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1 sm:space-y-2">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">মোট কেনাকাটা</span>
            <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900">
            ৳{totalSpent.toLocaleString()}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-500">ক্যাশ অন ডেলিভারি ও অনলাইন</p>
        </div>
      </div>

      {/* Guest Phone Lookup Box (if user wants to search by phone) */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>মোবাইল নম্বর দিয়ে তাৎক্ষণিক অর্ডার খুঁজুন</span>
          </h4>
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            লগইন ছাড়াও যে নম্বর দিয়ে অর্ডার করেছিলেন তা দিয়ে অর্ডার দেখতে পারেন।
          </p>
        </div>

        <form onSubmit={handleGuestLookup} className="flex items-center gap-2">
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 sm:w-44"
          />
          <button
            type="submit"
            disabled={lookupLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0"
          >
            {lookupLoading ? "খোঁজা হচ্ছে..." : "অর্ডার খুঁজুন"}
          </button>
        </form>
      </div>

      {lookupMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{lookupMsg}</span>
        </div>
      )}

      {/* Main Order History Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Controls Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              সকল অর্ডার হিস্ট্রি ({filteredOrders.length} টি)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              যেকোনো অর্ডারের লাইভ ট্র্যাকিং, ইনভয়েস ডাউনলোড এবং পুনরায় অর্ডার করুন
            </p>
          </div>

          {/* Search bar inside history */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার নম্বর বা পণ্য দিয়ে ফিল্টার..."
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/50">
          {[
            { key: "all", label: "সকল অর্ডার" },
            { key: "pending", label: "পেন্ডিং" },
            { key: "confirmed", label: "কনফার্মড" },
            { key: "shipped", label: "ডেলিভারির পথে" },
            { key: "delivered", label: "সম্পন্ন" },
            { key: "cancelled", label: "বাতিল" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Listing */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                কোনো অর্ডার খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                আপনি এখনও কোনো পণ্য অর্ডার করেননি অথবা ফিল্টারে কোনো মিল পাওয়া যায়নি।
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                <span>কেনাকাটা শুরু করুন</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.orderNumber || ord._id}
                  className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:border-emerald-300 transition"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                        <span>{ord.orderNumber}</span>
                        <button
                          onClick={() => copyToClipboard(ord.orderNumber)}
                          title="অর্ডার নম্বর কপি করুন"
                          className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedId === ord.orderNumber && (
                          <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে!</span>
                        )}
                      </div>

                      <span className="text-slate-400">•</span>

                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(ord.createdAt).toLocaleDateString("bn-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {statusBadge(ord.orderStatus)}
                    </div>
                  </div>

                  {/* Order Items & Customer Info */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Items List (Left) */}
                    <div className="lg:col-span-8 divide-y divide-slate-100">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {lang === "bn" ? item.titleBn || item.title : item.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span>পরিমাণ: {item.quantity}টি</span>
                              {item.color && (
                                <>
                                  <span>•</span>
                                  <span>রঙ: {item.color}</span>
                                </>
                              )}
                              {item.size && (
                                <>
                                  <span>•</span>
                                  <span>সাইজ: {item.size}</span>
                                </>
                              )}
                            </div>
                            <span className="text-xs font-black text-emerald-600 block mt-1">
                              ৳{item.price} × {item.quantity} = ৳{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Price Summary (Right) */}
                    <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                      <div className="space-y-1 pb-3 border-b border-slate-200">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>{ord.customerName}</span>
                        </p>
                        <p className="text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{ord.customerPhone}</span>
                        </p>
                        <p className="text-slate-500 flex items-start gap-1.5 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span>{ord.customerAddress} ({ord.deliveryZone === "dhaka" ? "ঢাকা সিটি" : "ঢাকার বাইরে"})</span>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-slate-600">
                        <div className="flex justify-between">
                          <span>সাবটোটাল:</span>
                          <span className="font-bold">৳{ord.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ডেলিভারি চার্জ:</span>
                          <span className="font-bold">৳{ord.shippingFee}</span>
                        </div>
                        {ord.discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-bold">
                            <span>ছাড়:</span>
                            <span>-৳{ord.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                          <span>মোট পরিশোধযোগ্য:</span>
                          <span className="text-emerald-600">৳{ord.total}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-slate-500 flex justify-between">
                          <span>পেমেন্ট মেথড:</span>
                          <span className="font-bold uppercase">
                            {ord.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : ord.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer Actions */}
                  <div className="p-3.5 sm:p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-slate-500 font-medium">
                      ডেলিভারি প্রয়োজনে হটলাইন: <strong className="text-slate-700">01700-112233</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      {/* Track Button */}
                      <Link
                        href={`/track-order?orderId=${ord.orderNumber}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition text-xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>লাইভ ট্র্যাকিং</span>
                      </Link>

                      {/* Invoice Modal Trigger */}
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 transition cursor-pointer text-xs"
                      >
                        <Receipt className="w-3.5 h-3.5 text-teal-600" />
                        <span>রিসিট / ইনভয়েস</span>
                      </button>

                      {/* Reorder Button */}
                      <button
                        type="button"
                        onClick={() => handleReorder(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition cursor-pointer text-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>আবার কিনুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-black text-lg text-slate-900">অর্ডার ইনভয়েস রিসিট</h3>
                <p className="text-xs text-slate-500">
                  স্মার্টশপ বাংলাদেশ • অর্ডার #{selectedInvoice.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold">গ্রাহকের নাম:</span>
                <p className="font-bold text-slate-800">{selectedInvoice.customerName}</p>
                <p className="text-slate-600">{selectedInvoice.customerPhone}</p>
                <p className="text-slate-500 text-[11px] mt-1">{selectedInvoice.customerAddress}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-bold">তারিখ:</span>
                <p className="font-bold text-slate-800">
                  {new Date(selectedInvoice.createdAt).toLocaleDateString("bn-BD")}
                </p>
                <p className="text-emerald-600 font-bold uppercase mt-1">
                  {selectedInvoice.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : selectedInvoice.paymentMethod}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">পণ্য</th>
                    <th className="p-3 text-center">পরিমাণ</th>
                    <th className="p-3 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items.map((it, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-slate-800">
                        {it.titleBn || it.title}
                        {it.color && <span className="text-slate-400 block text-[10px]">রঙ: {it.color}</span>}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-600">{it.quantity}</td>
                      <td className="p-3 text-right font-black text-slate-900">৳{it.price * it.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span className="font-bold">৳{selectedInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold">৳{selectedInvoice.shippingFee}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>কুপন ছাড়:</span>
                  <span className="font-bold">-৳{selectedInvoice.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-black text-base pt-2 border-t border-slate-200">
                <span>সর্বমোট:</span>
                <span className="text-emerald-600">৳{selectedInvoice.total}</span>
              </div>
            </div>

            {/* Print or Close */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                প্রিন্ট / সেভ করুন
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
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
