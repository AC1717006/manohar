import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";
import { generateOrderNumber } from "../utils/orderNumber";

const router = Router();

const GST_RATE = 0.05;
const DELIVERY_CHARGE = 99;
const FREE_DELIVERY_THRESHOLD = 5000;

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    mobile: z.string().min(10),
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(4),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  paymentMethod: z.enum(["COD", "UPI", "QR"]),
});

// Create order (public checkout)
router.post("/", async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { customer, items, paymentMethod } = parsed.data;

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    return res.status(400).json({ error: "One or more products not found" });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.qty) {
      return res
        .status(400)
        .json({ error: `Insufficient stock for ${product.name}` });
    }
  }

  let subtotal = 0;
  const orderItemsData = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
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

  const orderNumber = await generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
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
router.get("/", requireAdmin, async (req, res) => {
  const { status } = req.query;
  const where: any = {};
  if (status && typeof status === "string") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    include: { customer: true, items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

// Admin: get single order
router.get("/:id", requireAdmin, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { customer: true, items: true, payment: true },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// Admin: update order status
router.patch("/:id/status", requireAdmin, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: parsed.data.status },
    include: { customer: true, items: true, payment: true },
  });
  res.json(order);
});

export default router;
