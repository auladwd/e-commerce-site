"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ExternalLink,
  Smartphone,
  Shirt,
  Apple,
  Home,
  ShoppingBag,
  Watch,
  Headphones,
  Heart,
  Tag,
  Search,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CategoryData {
  _id?: string;
  id?: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string;
  image?: string;
  createdAt?: string;
}

const AVAILABLE_ICONS = [
  { key: "ShoppingBag", label: "শপিং ব্যাগ", icon: ShoppingBag },
  { key: "Smartphone", label: "গ্যাজেট / ফোন", icon: Smartphone },
  { key: "Shirt", label: "ফ্যাশন / পোশাক", icon: Shirt },
  { key: "Watch", label: "স্মার্টওয়াচ / ঘড়ি", icon: Watch },
  { key: "Headphones", label: "হেডফোন / অডিও", icon: Headphones },
  { key: "Sparkles", label: "স্পেশাল / কসমেটিক্স", icon: Sparkles },
  { key: "Apple", label: "অর্গানিক / খাদ্য", icon: Apple },
  { key: "Home", label: "হোম অ্যান্ড লিভিং", icon: Home },
  { key: "Heart", label: "লাইফস্টাইল / কেয়ার", icon: Heart },
];

export default function AdminCategoriesPage() {
  const { lang } = useLanguage();

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Form State
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingBag");
  const [imageUrl, setImageUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from English name
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(autoSlug);
  };

  // Create Category Handler
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !nameBn.trim()) {
      setMessage({ type: "error", text: "দয়া করে ক্যাটাগরির ইংরেজি ও বাংলা নাম লিখুন।" });
      return;
    }

    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

    // Check duplicate slug
    if (categories.some((c) => c.slug === finalSlug)) {
      setMessage({ type: "error", text: "এই স্লাগ (Slug) দিয়ে ইতোমধ্যে একটি ক্যাটাগরি আছে।" });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          nameBn: nameBn.trim(),
          slug: finalSlug,
          icon: selectedIcon,
          image:
            imageUrl.trim() ||
            "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setMessage({ type: "success", text: "নতুন ক্যাটাগরি সফলভাবে যুক্ত হয়েছে!" });
        setName("");
        setNameBn("");
        setSlug("");
        setImageUrl("");
        fetchCategories();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("categories_updated"));
        }
      } else {
        setMessage({ type: "error", text: json.error || "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে।" });
      }
    } catch {
      setMessage({ type: "error", text: "সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" });
    } finally {
      setCreating(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (cat: CategoryData) => {
    const identifier = cat._id || cat.id || cat.slug;
    const catName = cat.nameBn || cat.name;

    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে "${catName}" ক্যাটাগরিটি ডিলিট করতে চান?\nডিলিট করলে ওয়েবসাইট ও ক্যাটাগরি বার থেকে এটি মুছে যাবে।`
    );
    if (!confirmed) return;

    setDeletingId(identifier);
    try {
      const res = await fetch(`/api/categories/${identifier}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        setCategories((prev) =>
          prev.filter((c) => (c._id || c.id || c.slug) !== identifier)
        );
        setMessage({ type: "success", text: `"${catName}" ক্যাটাগরিটি সফলভাবে মুছে ফেলা হয়েছে!` });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("categories_updated"));
        }
      } else {
        setMessage({ type: "error", text: json.error || "ডিলিট করতে সমস্যা হয়েছে।" });
      }
    } catch {
      setMessage({ type: "error", text: "সার্ভার এরর: ক্যাটাগরি ডিলিট ব্যর্থ হয়েছে।" });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameBn.includes(searchQuery) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case "Smartphone":
        return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case "Shirt":
        return <Shirt className="w-5 h-5 text-indigo-600" />;
      case "Watch":
        return <Watch className="w-5 h-5 text-teal-600" />;
      case "Headphones":
        return <Headphones className="w-5 h-5 text-blue-600" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-pink-600" />;
      case "Apple":
        return <Apple className="w-5 h-5 text-amber-600" />;
      case "Home":
        return <Home className="w-5 h-5 text-orange-600" />;
      case "Heart":
        return <Heart className="w-5 h-5 text-rose-600" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">
                ক্যাটাগরি ম্যানেজমেন্ট ও নিয়ন্ত্রণ
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                মোট {categories.length} টি
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              নতুন ক্যাটাগরি তৈরি করুন অথবা অপ্রয়োজনীয় ক্যাটাগরি এক ক্লিকে ডিলিট করুন।
            </p>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <span>হোমপেজে ক্যাটাগরি বার দেখুন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid: Add Form (Left) & List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Add New Category */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 sticky top-24">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              <span>নতুন ক্যাটাগরি যোগ করুন</span>
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ক্যাটাগরির নাম (বাংলা) *
                </label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: স্মার্ট গ্যাজেট"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Smart Gadgets"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  স্লাগ (URL Slug) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="smart-gadgets"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  ইংরেজি নামের সাথে স্বয়ংক্রিয়ভাবে তৈরি হবে।
                </p>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  আইকন বেছে নিন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = selectedIcon === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedIcon(item.key)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="truncate max-w-[80px]">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ছবি বা ব্যানার URL (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <FolderPlus className="w-4 h-4" />
                <span>{creating ? "তৈরি হচ্ছে..." : "ক্যাটাগরি তৈরি করুন"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right List: Existing Categories */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  বিদ্যমান ক্যাটাগরি তালিকা ({filteredCategories.length} টি)
                </h3>
                <p className="text-xs text-slate-400">
                  যেকোনো ক্যাটাগরি ডিলিট করতে পাশের ডিলিট বাটনে ক্লিক করুন
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ক্যাটাগরি খুঁজুন..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 mx-auto" />
                <p className="text-xs font-bold">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => {
                  const catId = cat._id || cat.id || cat.slug;
                  const isDeleting = deletingId === catId;

                  return (
                    <div
                      key={catId}
                      className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {renderCategoryIcon(cat.icon || cat.slug)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {cat.nameBn}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-medium">
                              ({cat.name})
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              <Tag className="w-2.5 h-2.5" />
                              {cat.slug}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/products?category=${cat.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-emerald-600 transition"
                          title="স্টোরফ্রন্টে দেখুন"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDeleteCategory(cat)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer disabled:opacity-50"
                          title="ক্যাটাগরি ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isDeleting ? "মুছে ফেলা হচ্ছে..." : "ডিলিট"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
