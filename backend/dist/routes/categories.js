"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const categories = await prisma_1.prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    res.json(categories);
});
const categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
});
router.post("/", auth_1.requireAdmin, async (req, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const category = await prisma_1.prisma.category.create({ data: parsed.data });
    res.status(201).json(category);
});
router.put("/:id", auth_1.requireAdmin, async (req, res) => {
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const category = await prisma_1.prisma.category.update({
        where: { id: req.params.id },
        data: parsed.data,
    });
    res.json(category);
});
router.delete("/:id", auth_1.requireAdmin, async (req, res) => {
    await prisma_1.prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
});
exports.default = router;
