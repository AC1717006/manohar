"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const { category, search, featured } = req.query;
    const where = {};
    if (category && typeof category === "string") {
        where.category = { slug: category };
    }
    if (search && typeof search === "string") {
        where.name = { contains: search, mode: "insensitive" };
    }
    if (featured === "true") {
        where.featured = true;
    }
    const products = await prisma_1.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(products);
});
router.get("/:id", async (req, res) => {
    const product = await prisma_1.prisma.product.findUnique({
        where: { id: req.params.id },
        include: { category: true },
    });
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
});
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    discountPrice: zod_1.z.number().positive().nullable().optional(),
    stock: zod_1.z.number().int().min(0),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    featured: zod_1.z.boolean().default(false),
    categoryId: zod_1.z.string().min(1),
});
router.post("/", auth_1.requireAdmin, async (req, res) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const product = await prisma_1.prisma.product.create({ data: parsed.data });
    res.status(201).json(product);
});
router.put("/:id", auth_1.requireAdmin, async (req, res) => {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const product = await prisma_1.prisma.product.update({
        where: { id: req.params.id },
        data: parsed.data,
    });
    res.json(product);
});
router.delete("/:id", auth_1.requireAdmin, async (req, res) => {
    await prisma_1.prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
});
exports.default = router;
