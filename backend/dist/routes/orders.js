"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../middleware/auth");
const orderNumber_1 = require("../utils/orderNumber");
const router = (0, express_1.Router)();
const GST_RATE = 0.05;
const DELIVERY_CHARGE = 99;
const FREE_DELIVERY_THRESHOLD = 5000;
const checkoutSchema = zod_1.z.object({
    customer: zod_1.z.object({
        name: zod_1.z.string().min(1),
        mobile: zod_1.z.string().min(10),
        address: zod_1.z.string().min(1),
        city: zod_1.z.string().min(1),
        state: zod_1.z.string().min(1),
        pincode: zod_1.z.string().min(4),
    }),
    items: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().min(1),
        qty: zod_1.z.number().int().positive(),
    }))
        .min(1),
    paymentMethod: zod_1.z.enum(["COD", "UPI", "QR"]),
});
// Create order (public checkout)
router.post("/", async (req, res) => {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { customer, items, paymentMethod } = parsed.data;
    const productIds = items.map((i) => i.productId);
    const products = await prisma_1.prisma.product.findMany({
        where: { id: { in: productIds } },
    });
    if (products.length !== productIds.length) {
        return res.status(400).json({ error: "One or more products not found" });
    }
    for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (product.stock < item.qty) {
            return res
                .status(400)
                .json({ error: `Insufficient stock for ${product.name}` });
        }
    }
    let subtotal = 0;
    const orderItemsData = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const unitPrice = product.discountPrice
            ? Number(product.discountPrice)
            : Number(product.price);
        subtotal += unitPrice * item.qty;
        return {
            productId: product.id,
            name: product.name,
            price: unitPrice,
            qty: item.qty,
        };
    });
    const gst = Math.round(subtotal * GST_RATE * 100) / 100;
    const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const total = Math.round((subtotal + gst + deliveryCharge) * 100) / 100;
    const orderNumber = await (0, orderNumber_1.generateOrderNumber)();
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const customerRecord = await tx.customer.upsert({
            where: { mobile: customer.mobile },
            update: {
                name: customer.name,
                address: customer.address,
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
            },
            create: customer,
        });
        const createdOrder = await tx.order.create({
            data: {
                orderNumber,
                customerId: customerRecord.id,
                subtotal,
                gst,
                deliveryCharge,
                total,
                paymentMethod,
                items: { create: orderItemsData },
                payment: { create: { method: paymentMethod } },
            },
            include: { items: true, customer: true, payment: true },
        });
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.qty } },
            });
        }
        return createdOrder;
    });
    res.status(201).json(order);
});
// Admin: list orders
router.get("/", auth_1.requireAdmin, async (req, res) => {
    const { status } = req.query;
    const where = {};
    if (status && typeof status === "string") {
        where.status = status;
    }
    const orders = await prisma_1.prisma.order.findMany({
        where,
        include: { customer: true, items: true, payment: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(orders);
});
// Admin: get single order
router.get("/:id", auth_1.requireAdmin, async (req, res) => {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id: req.params.id },
        include: { customer: true, items: true, payment: true },
    });
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
});
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]),
});
// Admin: update order status
router.patch("/:id/status", auth_1.requireAdmin, async (req, res) => {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const order = await prisma_1.prisma.order.update({
        where: { id: req.params.id },
        data: { status: parsed.data.status },
        include: { customer: true, items: true, payment: true },
    });
    res.json(order);
});
exports.default = router;
