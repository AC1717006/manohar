"use client";

import { Fragment, useEffect, useState } from "react";
import { useAdminApi } from "@/lib/useAdminApi";
import { formatPrice } from "@/lib/format";
import type { Customer } from "@/lib/types";

export default function AdminCustomersPage() {
  const adminApi = useAdminApi();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get<Customer[]>("/api/customers")
      .then(setCustomers)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Customers</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-royal-charcoal">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-gold-light/60">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gold-light/50">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gold-light/50">
                  No customers yet.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <Fragment key={customer.id}>
                  <tr className="border-b border-gold/10 text-gold-light">
                    <td className="px-4 py-3">{customer.name}</td>
                    <td className="px-4 py-3">{customer.mobile}</td>
                    <td className="px-4 py-3">{customer.city}</td>
                    <td className="px-4 py-3">{customer.state}</td>
                    <td className="px-4 py-3">{customer.orders?.length ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setExpanded((e) => (e === customer.id ? null : customer.id))
                        }
                        className="text-gold hover:underline"
                      >
                        {expanded === customer.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expanded === customer.id && (
                    <tr className="border-b border-gold/10">
                      <td colSpan={6} className="bg-royal-black/40 px-4 py-3">
                        <p className="mb-2 text-xs uppercase tracking-wide text-gold-light/50">
                          Order History
                        </p>
                        {customer.orders && customer.orders.length > 0 ? (
                          <ul className="space-y-1 text-sm text-gold-light/80">
                            {customer.orders.map((order) => (
                              <li key={order.id} className="flex justify-between">
                                <span className="font-mono text-xs">{order.orderNumber}</span>
                                <span>{order.status}</span>
                                <span>{formatPrice(order.total)}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gold-light/50">No orders.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
