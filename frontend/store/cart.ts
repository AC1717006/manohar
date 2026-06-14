"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

export interface CartItem {
  productId: string;
  name: string;
  image: string | null;
  price: number;
  qty: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
}

const GST_RATE = 0.05;
const DELIVERY_CHARGE = 99;
const FREE_DELIVERY_THRESHOLD = 5000;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty) => {
        const price = product.discountPrice
          ? Number(product.discountPrice)
          : Number(product.price);
        const existing = get().items.find((i) => i.productId === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === product.id
                ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                productId: product.id,
                name: product.name,
                image: product.images[0] ?? null,
                price,
                qty: Math.min(qty, product.stock),
                stock: product.stock,
              },
            ],
          });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQty: (productId, qty) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) }
              : i
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "rajputi-cart" }
  )
);

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const deliveryCharge = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = Math.round((subtotal + gst + deliveryCharge) * 100) / 100;
  return { subtotal, gst, deliveryCharge, total };
}
