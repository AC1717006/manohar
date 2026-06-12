import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/stats", requireAdmin, async (_req, res) => {
  const [totalOrders, totalProducts, pendingOrders, completedOrders, revenueResult] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

  res.json({
    totalOrders,
    totalProducts,
    pendingOrders,
    completedOrders,
    revenue: revenueResult._sum.total ?? 0,
  });
});

export default router;
