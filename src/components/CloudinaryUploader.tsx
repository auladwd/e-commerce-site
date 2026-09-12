"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, CheckCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface UploadedMedia {
  url: string;
  public_id?: string;
  optimized_url?: string;
  thumbnail_url?: string;
  sizeSaved?: string;
}

interface CloudinaryUploaderProps {
  images: UploadedMedia[];
  onImagesChange: (images: UploadedMedia[]) => void;
  maxFiles?: number;
}

export default function CloudinaryUploader({
  images,
  onImagesChange,
  maxFiles = 5,
}: CloudinaryUploaderProps) {
  const { lang, t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Client-side canvas compression: Resizes image and compresses quality
   * before sending to server and Cloudinary for maximum optimization.
   */
  const compressClientImage = (file: File): Promise<{ base64: string; originalSize: number; compressedSize: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({
              base64: event.target?.result as string,
              originalSize: file.size,
              compressedSize: file.size,
            });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Output as optimized WebP or JPEG
          const compressedDataUrl = canvas.toDataURL("image/webp", 0.82);
          const head = "data:image/webp;base64,";
          const approxBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);

          resolve({
            base64: compressedDataUrl,
            originalSize: file.size,
            compressedSize: approxBytes,
          });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      alert(`সর্বোচ্চ ${maxFiles} টি ছবি আপলোড করা যাবে।`);
      return;
    }

    setUploading(true);
    setStatusMessage(lang === "bn" ? "ছবি অপ্টিমাইজ ও আপলোড হচ্ছে..." : "Optimizing & uploading...");

    const uploadedList: UploadedMedia[] = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Client-side compression
        const { base64, originalSize, compressedSize } = await compressClientImage(file);
        const savedPercent = Math.max(
          0,
          Math.round(((originalSize - compressedSize) / originalSize) * 100)
        );

        // 2. Upload to Cloudinary API
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const resData = await response.json();

        if (resData.success && resData.data) {
          uploadedList.push({
            url: resData.data.secure_url || resData.data.url,
            public_id: resData.data.public_id,
            optimized_url: resData.data.optimized_url || resData.data.secure_url,
            thumbnail_url: resData.data.thumbnail_url || resData.data.secure_url,
            sizeSaved: `${savedPercent}% কমপ্রেসড`,
          });
        }
      }

      onImagesChange(uploadedList);
      setStatusMessage(
        lang === "bn"
          ? "ছবি সফলভাবে Cloudinary তে অপ্টিমাইজ হয়ে আপলোড হয়েছে!"
          : "Images successfully optimized & uploaded to Cloudinary!"
      );
    } catch (err) {
      console.error("Upload failed", err);
      setStatusMessage(lang === "bn" ? "আপলোডে সমস্যা হয়েছে।" : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drag and drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-slate-300 hover:border-emerald-400 bg-slate-50/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {uploading
                ? lang === "bn"
                  ? "Cloudinary তে আপলোড হচ্ছে..."
                  : "Uploading to Cloudinary..."
                : t.dragDropImage}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              PNG, JPG, WEBP (অটো কমপ্রেশন ও WebP ফরম্যাটে রূপান্তর হবে)
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{statusMessage}</span>
        </p>
      )}

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.optimized_url || img.url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Optimization badge */}
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] text-emerald-300 font-bold">
                Cloudinary WebP
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
