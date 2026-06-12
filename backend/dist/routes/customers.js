"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAdmin, async (_req, res) => {
    const customers = await prisma_1.prisma.customer.findMany({
        include: {
            orders: {
                select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(customers);
});
exports.default = router;
