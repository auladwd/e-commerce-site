import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickBuyModal from "@/components/QuickBuyModal";
import WhatsAppFloat from "@/components/WhatsAppFloat";

import MobileBottomNav from "@/components/MobileBottomNav";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "স্মার্টশপ বাংলাদেশ | SmartShop BD - সেরা দামে আধুনিক ই-কমার্স",
  description:
    "সেরা দামে সেরা গ্যাজেট ও লাইফস্টাইল পণ্য, সারা দেশে ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারি।",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pb-20 md:pb-8">
                {children}
              </main>
              <CartDrawer />
              <QuickBuyModal />
              <WhatsAppFloat />
              <Footer />
              <MobileBottomNav />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
