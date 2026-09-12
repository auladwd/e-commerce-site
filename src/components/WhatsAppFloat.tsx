"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppFloat() {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const whatsappNumber = "8801700112233";
  const defaultMessage = encodeURIComponent(
    lang === "bn"
      ? "হ্যালো! আমি আপনার স্মার্টশপ ওয়েবসাইট থেকে পণ্য অর্ডার ও তথ্য সম্পর্কে জানতে আগ্রহী।"
      : "Hello! I am interested in purchasing products from your SmartShop website."
  );

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3.5 sm:right-6 z-40 flex flex-col items-end space-y-3">
      {/* Pop-up dialog options */}
      {expanded && (
        <div className="p-4 rounded-2xl bg-white shadow-2xl border border-slate-100 w-64 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-800">
                {lang === "bn" ? "সহায়তা কেন্দ্র" : "Customer Support"}
              </span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.whatsappChat}</span>
            </a>

            <a
              href="tel:01700112233"
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 font-semibold text-xs transition"
            >
              <Phone className="w-4 h-4 text-slate-700 shrink-0" />
              <span>{t.callUs} (01700-112233)</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Bubble Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        aria-label="Customer Support"
      >
        <MessageCircle className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline font-bold text-xs">
          {lang === "bn" ? "সহায়তা প্রয়োজন?" : "Need Help?"}
        </span>
      </button>
    </div>
  );
}
