"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid email or password format" });
    }
    const { email, password } = parsed.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
});
exports.default = router;
