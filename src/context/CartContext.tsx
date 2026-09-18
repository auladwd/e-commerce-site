"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductItem } from "@/lib/demoData";

export interface CartItem {
  productId: string;
  title: string;
  titleBn: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductItem, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  quickBuyProduct: ProductItem | null;
  openQuickBuy: (product: ProductItem) => void;
  closeQuickBuy: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponConfig, setCouponConfig] = useState<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrder: number;
  } | null>(null);
  const [quickBuyProduct, setQuickBuyProduct] = useState<ProductItem | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shopping_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("shopping_cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (
    product: ProductItem,
    quantity = 1,
    color?: string,
    size?: string
  ) => {
    const effectivePrice = product.salePrice ?? product.price;
    const imgUrl = product.images?.[0]?.url || "https://placehold.co/400x400";
    const pId = product.id || product._id || "";

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === pId &&
          item.color === color &&
          item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: pId,
            title: product.title,
            titleBn: product.titleBn,
            price: effectivePrice,
            image: imgUrl,
            quantity,
            color,
            size,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.color === color &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.productId === productId &&
          item.color === color &&
          item.size === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode("");
    setDiscount(0);
    setCouponConfig(null);
    localStorage.removeItem("shopping_cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate discount if cart items/subtotal change
  useEffect(() => {
    if (!couponConfig || cartItems.length === 0) {
      if (cartItems.length === 0 && (couponCode || discount > 0)) {
        setCouponCode("");
        setDiscount(0);
        setCouponConfig(null);
      }
      return;
    }

    if (subtotal < couponConfig.minOrder) {
      setDiscount(0);
      return;
    }

    if (couponConfig.type === "percentage") {
      setDiscount(Math.round(subtotal * (couponConfig.value / 100)));
    } else {
      setDiscount(Math.min(couponConfig.value, subtotal));
    }
  }, [subtotal, couponConfig, cartItems.length, couponCode, discount]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const clean = code.trim().toUpperCase();
    if (!clean) {
      return { success: false, message: "দয়া করে কুপন কোড লিখুন।" };
    }

    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      const settings = json?.data;

      // Check if admin has enabled coupon system
      const isEnabled = settings?.couponEnabled ?? false;
      if (!isEnabled) {
        return {
          success: false,
          message: "বর্তমানে কোনো কুপন অফার সক্রিয় নেই।",
        };
      }

      const activeCode = (settings?.couponCode || "SAVE10").trim().toUpperCase();
      if (clean !== activeCode) {
        return {
          success: false,
          message: "ভুল অথবা অকার্যকর কুপন কোড।",
        };
      }

      const minOrder = Number(settings?.couponMinOrder) || 0;
      if (subtotal < minOrder) {
        return {
          success: false,
          message: `এই কুপনের জন্য সর্বনিম্ন ৳${minOrder} টাকার পণ্য কার্টে থাকতে হবে।`,
        };
      }

      const discountType = (settings?.couponDiscountType || "percentage") as "percentage" | "fixed";
      const discountVal = Number(settings?.couponDiscountValue) || 10;

      let calcDiscount = 0;
      if (discountType === "percentage") {
        calcDiscount = Math.round(subtotal * (discountVal / 100));
      } else {
        calcDiscount = Math.min(discountVal, subtotal);
      }

      setCouponCode(clean);
      setDiscount(calcDiscount);
      setCouponConfig({
        code: clean,
        type: discountType,
        value: discountVal,
        minOrder,
      });

      const discountText = discountType === "percentage" ? `${discountVal}% (৳${calcDiscount})` : `৳${calcDiscount}`;
      return {
        success: true,
        message: `কুপন '${clean}' সফলভাবে যুক্ত হয়েছে! ${discountText} ছাড় পেয়েছেন।`,
      };
    } catch {
      return {
        success: false,
        message: "কুপন যাচাই করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
      };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponConfig(null);
  };

  const openQuickBuy = (product: ProductItem) => {
    setQuickBuyProduct(product);
  };

  const closeQuickBuy = () => {
    setQuickBuyProduct(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
        quickBuyProduct,
        openQuickBuy,
        closeQuickBuy,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
