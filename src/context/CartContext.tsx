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
  applyCoupon: (code: string) => { success: boolean; message: string };
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
    localStorage.removeItem("shopping_cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "DISCOUNT100" || clean === "EID100") {
      setCouponCode(clean);
      setDiscount(100);
      return { success: true, message: "৳১০০ ডিসকাউন্ট যুক্ত হয়েছে!" };
    }
    if (clean === "SAVE10" || clean === "WELCOME10") {
      setCouponCode(clean);
      const tenPercent = Math.round(subtotal * 0.1);
      setDiscount(tenPercent);
      return { success: true, message: `১০% (৳${tenPercent}) ডিসকাউন্ট যুক্ত হয়েছে!` };
    }
    return { success: false, message: "ভুল অথবা অকার্যকর কুপন কোড।" };
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
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
