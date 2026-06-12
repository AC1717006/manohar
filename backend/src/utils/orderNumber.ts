import { prisma } from "../lib/prisma";

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const updated = await prisma.$transaction(async (tx) => {
    const setting = await tx.setting.upsert({
      where: { key: "order_sequence" },
      update: {},
      create: { key: "order_sequence", value: "0" },
    });

    const next = parseInt(setting.value, 10) + 1;

    await tx.setting.update({
      where: { key: "order_sequence" },
      data: { value: String(next) },
    });

    return next;
  });

  return `SRF-${year}-${String(updated).padStart(5, "0")}`;
}
