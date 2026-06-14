"use client";

import { useEffect, useState } from "react";
import { useAdminApi } from "@/lib/useAdminApi";
import { formatPrice } from "@/lib/format";
import type { AdminStats } from "@/lib/types";

export default function AdminDashboardPage() {
  const adminApi = useAdminApi();
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.get<AdminStats>("/api/admin/stats").then(setStats).catch(() => {});
  }, [adminApi]);

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders ?? "—" },
    { label: "Total Products", value: stats?.totalProducts ?? "—" },
    { label: "Revenue", value: stats ? formatPrice(stats.revenue) : "—" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? "—" },
    { label: "Completed Orders", value: stats?.completedOrders ?? "—" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-gold/15 bg-royal-charcoal p-6">
            <p className="text-sm text-gold-light/60">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-gold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
