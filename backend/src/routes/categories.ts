import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  res.json(categories);
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = categorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const category = await prisma.category.create({ data: parsed.data });
  res.status(201).json(category);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = categorySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(category);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
