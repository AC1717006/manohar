"use client";

import { useEffect, useState } from "react";
import { useAdminApi } from "@/lib/useAdminApi";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const adminApi = useAdminApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.get<Order[]>("/api/orders");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: OrderStatus) {
    const updated = await adminApi.patch<Order>(`/api/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-royal-charcoal">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-gold-light/60">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gold-light/50">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gold-light/50">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gold/10 text-gold-light">
                  <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">{order.customer.name}</td>
                  <td className="px-4 py-3">{order.customer.mobile}</td>
                  <td className="px-4 py-3">{order.items.length}</td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-gold/20 bg-royal-black px-2 py-1 text-xs text-gold-light focus:border-gold focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
