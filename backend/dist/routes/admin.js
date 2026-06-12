"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/stats", auth_1.requireAdmin, async (_req, res) => {
    const [totalOrders, totalProducts, pendingOrders, completedOrders, revenueResult] = await Promise.all([
        prisma_1.prisma.order.count(),
        prisma_1.prisma.product.count(),
        prisma_1.prisma.order.count({ where: { status: "PENDING" } }),
        prisma_1.prisma.order.count({ where: { status: "DELIVERED" } }),
        prisma_1.prisma.order.aggregate({
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
exports.default = router;
