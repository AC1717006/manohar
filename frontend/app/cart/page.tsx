"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotals, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { API_URL } from "@/lib/api";

function resolveImage(src: string | null) {
  if (!src) return "/images/placeholder.svg";
  if (src.startsWith("/uploads")) return `${API_URL}${src}`;
  return src;
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const { subtotal, gst, deliveryCharge, total } = cartTotals(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-gradient-gold">Your Cart is Empty</h1>
        <p className="mt-3 text-gold-light/70">Add some royal pieces to your cart.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-gradient-gold">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl border border-gold/15 bg-royal-charcoal p-4"
            >
              <img
                src={resolveImage(item.image)}
                alt={item.name}
                className="h-20 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link href={`/shop/${item.productId}`} className="font-medium text-gold-light hover:text-gold">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-gold/70">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-gold/30">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  className="px-3 py-1 text-gold hover:text-gold-light"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-gold-light">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  className="px-3 py-1 text-gold hover:text-gold-light"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-semibold text-gold">
                {formatPrice(item.price * item.qty)}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-gold-light/50 hover:text-red-400"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gold/15 bg-royal-charcoal p-6">
          <h2 className="font-serif text-xl font-semibold text-gold-light">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm text-gold-light/70">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>GST (5%)</dt>
              <dd>{formatPrice(gst)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gold/15 pt-4 text-lg font-semibold text-gold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-gold px-8 py-3 text-center text-sm font-semibold text-royal-black transition-transform hover:scale-105"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
