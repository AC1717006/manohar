import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  const customers = await prisma.customer.findMany({
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

export default router;
