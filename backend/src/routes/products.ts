import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
  const { category, search, featured } = req.query;

  const where: any = {};
  if (category && typeof category === "string") {
    where.category = { slug: category };
  }
  if (search && typeof search === "string") {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (featured === "true") {
    where.featured = true;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true },
  });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discountPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  categoryId: z.string().min(1),
});

router.post("/", requireAdmin, async (req, res) => {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const product = await prisma.product.create({ data: parsed.data });
  res.status(201).json(product);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(product);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
