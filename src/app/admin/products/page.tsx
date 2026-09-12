"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Package,
  Search,
  CheckCircle,
  X,
  UploadCloud,
  Zap,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import CloudinaryUploader, { UploadedMedia } from "@/components/CloudinaryUploader";
import { demoCategories, ProductItem } from "@/lib/demoData";

export default function AdminProductsPage() {
  const { lang, t } = useLanguage();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoriesList, setCategoriesList] = useState<any[]>(demoCategories);

  // Form State
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("20");
  const [category, setCategory] = useState("gadgets");
  const [description, setDescription] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedMedia[]>([]);
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/products?limit=100"),
        fetch("/api/categories"),
      ]);
      const pJson = await pRes.json();
      const cJson = await cRes.json();
      if (pJson.success && pJson.data) {
        setProducts(pJson.data);
      }
      if (cJson.success && cJson.data?.length > 0) {
        setCategoriesList(cJson.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg("");

    if (!title.trim() || !price) {
      setFormMsg("দয়া করে পণ্যের নাম ও মূল্য দিন।");
      return;
    }

    setSaving(true);

    try {
      const categoryItem = categoriesList.find((c) => c.slug === category);

      const payload = {
        title: title.trim(),
        titleBn: titleBn.trim() || title.trim(),
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        stock: Number(stock || 10),
        category,
        categoryBn: categoryItem?.nameBn || category,
        description: description.trim() || title.trim(),
        descriptionBn: descriptionBn.trim() || titleBn.trim() || title.trim(),
        isFeatured,
        isFlashDeal,
        images:
          uploadedImages.length > 0
            ? uploadedImages.map((img) => ({
                url: img.optimized_url || img.url,
                public_id: img.public_id,
              }))
            : [
                {
                  url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                },
              ],
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        setIsModalOpen(false);
        // Reset form
        setTitle("");
        setTitleBn("");
        setPrice("");
        setSalePrice("");
        setDescription("");
        setDescriptionBn("");
        setUploadedImages([]);
        loadProducts();
      } else {
        setFormMsg(json.error || "পণ্য তৈরিতে সমস্যা হয়েছে।");
      }
    } catch {
      setFormMsg("সার্ভারে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান?")) return;

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      loadProducts();
    } catch {
      alert("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.titleBn.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header with Search & Add Product Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম দিয়ে পণ্য খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProduct} (Cloudinary সহ)</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">ছবি ও পণ্যের নাম</th>
                <th className="py-3.5 px-6">ক্যাটাগরি</th>
                <th className="py-3.5 px-6">মূল্য (নিয়মিত / অফার)</th>
                <th className="py-3.5 px-6">স্টক</th>
                <th className="py-3.5 px-6">ফিচার্ড / ফ্ল্যাশ</th>
                <th className="py-3.5 px-6 text-right">মুছুন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => {
                const pId = p.id || p._id || p.slug;
                const img =
                  p.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80";

                return (
                  <tr key={pId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-slate-900 truncate">
                            {lang === "bn" ? p.titleBn || p.title : p.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {p.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex items-baseline gap-1.5 font-bold">
                        <span className="text-emerald-600">
                          {t.currency}
                          {p.salePrice ?? p.price}
                        </span>
                        {p.salePrice && (
                          <span className="text-slate-400 line-through text-[11px]">
                            {t.currency}
                            {p.price}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-6">
                      <span
                        className={`font-bold text-xs ${
                          (p.stock || 0) > 5
                            ? "text-emerald-700"
                            : "text-amber-600"
                        }`}
                      >
                        {p.stock || 0} টি
                      </span>
                    </td>

                    <td className="py-3 px-6">
                      <div className="flex gap-1.5">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Featured
                          </span>
                        )}
                        {p.isFlashDeal && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-amber-500" />
                            Flash
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleDelete(pId)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  {t.addProduct}
                </h3>
                <p className="text-xs text-slate-400">
                  Cloudinary তে ছবি আপলোড ও অপ্টিমাইজ হয়ে সরাসরি ডাটাবেজে সংরক্ষণ হবে
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-800 transition text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Cloudinary Image Uploader */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.uploadImages} *
                </label>
                <CloudinaryUploader
                  images={uploadedImages}
                  onImagesChange={setUploadedImages}
                  maxFiles={4}
                />
              </div>

              {/* Title Bangla & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.productTitleBn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: টি৯০০ আল্ট্রা স্মার্টওয়াচ"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.productTitleEn} *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. T900 Ultra Smartwatch"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Prices and Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.regularPrice} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="যেমন: 2200"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.salePrice}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="যেমন: 1650 (ঐচ্ছিক)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.stockQuantity}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t.selectCategory}
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  >
                    + নতুন ক্যাটাগরি তৈরি করুন
                  </Link>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
                >
                  {categoriesList.map((c) => (
                    <option key={c.slug || c.id || c._id} value={c.slug}>
                      {c.nameBn || c.name} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পণ্যের বিবরণ (বাংলা)
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    placeholder="পণ্যের বিস্তারিত ফিচার ও সুবিধা লিখুন..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key features and details..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>জনপ্রিয় / ফিচার্ড পণ্য হিসেবে হোমপেজে দেখান</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="rounded accent-rose-600"
                  />
                  <span className="text-rose-600">ফ্ল্যাশ ডিল সেলে যুক্ত করুন</span>
                </label>
              </div>

              {formMsg && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {formMsg}
                </p>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {saving ? (
                    <span>সংরক্ষণ হচ্ছে...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.saveProduct}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
