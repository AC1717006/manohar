"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotals, useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { api, ApiError } from "@/lib/api";
import type { Order, PaymentMethod } from "@/lib/types";

const INDIAN_STATES = [
  "Rajasthan", "Delhi", "Gujarat", "Maharashtra", "Madhya Pradesh", "Uttar Pradesh",
  "Punjab", "Haryana", "Uttarakhand", "Bihar", "West Bengal", "Karnataka", "Tamil Nadu",
  "Telangana", "Andhra Pradesh", "Kerala", "Other",
];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-gradient-gold">
          Order Placed Successfully!
        </h1>
        <p className="mt-4 text-gold-light/80">
          Your Order ID is
          <span className="ml-2 rounded-full border border-gold/40 px-4 py-1 font-mono text-gold">
            {order.orderNumber}
          </span>
        </p>
        <p className="mt-2 text-gold-light/70">
          Total Amount: <span className="text-gold">{formatPrice(order.total)}</span>
        </p>
        <p className="mt-2 text-gold-light/70">
          Payment Method: <span className="text-gold">{order.paymentMethod}</span>
        </p>
        {order.paymentMethod !== "COD" && (
          <div className="mt-6 flex justify-center">
            <img src="/images/qr-placeholder.svg" alt="UPI QR Code" className="h-48 w-48 rounded-lg" />
          </div>
        )}
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-gradient-gold">Your Cart is Empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const { subtotal, gst, deliveryCharge, total } = cartTotals(items);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const created = await api.post<Order>("/api/orders", {
        customer: form,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        paymentMethod,
      });
      setOrder(created);
      clear();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-gradient-gold">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
            />
            <input
              required
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              className="rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
            />
          </div>
          <textarea
            required
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              required
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
            />
            <select
              required
              name="state"
              value={form.state}
              onChange={handleChange}
              className="rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light focus:border-gold focus:outline-none"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              required
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              className="rounded-lg border border-gold/20 bg-royal-charcoal px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <h2 className="mb-3 font-serif text-lg text-gold-light">Payment Method</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(["COD", "UPI", "QR"] as PaymentMethod[]).map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-4 py-3 text-sm transition-colors ${
                    paymentMethod === method
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-gold/20 text-gold-light/70 hover:border-gold/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="sr-only"
                  />
                  {method === "COD" ? "Cash on Delivery" : method === "UPI" ? "UPI" : "Scan QR Code"}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105 disabled:opacity-50"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="rounded-xl border border-gold/15 bg-royal-charcoal p-6">
          <h2 className="font-serif text-xl font-semibold text-gold-light">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm text-gold-light/70">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span className="line-clamp-1">
                  {item.name} × {item.qty}
                </span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-gold/15 pt-4 text-sm text-gold-light/70">
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
        </div>
      </div>
    </div>
  );
}
