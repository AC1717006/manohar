import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@surendrasarajputi.com" },
    update: {},
    create: {
      email: "admin@surendrasarajputi.com",
      password: adminPassword,
      name: "Surendra Sa Admin",
      role: "admin",
    },
  });

  await prisma.setting.upsert({
    where: { key: "order_sequence" },
    update: {},
    create: { key: "order_sequence", value: "0" },
  });

  const categories = [
    { name: "Rajputi Poshak", slug: "rajputi-poshak" },
    { name: "Bridal Poshak", slug: "bridal-poshak" },
    { name: "Wedding Collection", slug: "wedding-collection" },
    { name: "Traditional Dress", slug: "traditional-dress" },
    { name: "Kids Collection", slug: "kids-collection" },
  ];

  const categoryRecords = [];
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryRecords.push(record);
  }

  const findCat = (slug: string) =>
    categoryRecords.find((c) => c.slug === slug)!.id;

  const products = [
    {
      name: "Royal Golden Rajputi Poshak",
      description:
        "Elegant traditional Rajputi poshak with intricate golden zari work, perfect for festive occasions.",
      price: 8999,
      discountPrice: 6999,
      stock: 12,
      images: ["/images/placeholder.svg"],
      featured: true,
      categoryId: findCat("rajputi-poshak"),
    },
    {
      name: "Maroon Embroidered Rajputi Poshak",
      description:
        "Rich maroon poshak with detailed hand embroidery and mirror work.",
      price: 7499,
      discountPrice: null,
      stock: 8,
      images: ["/images/placeholder.svg"],
      featured: false,
      categoryId: findCat("rajputi-poshak"),
    },
    {
      name: "Royal Red Bridal Poshak",
      description:
        "Luxurious bridal poshak in royal red with gold thread embroidery, designed for the modern Rajputi bride.",
      price: 24999,
      discountPrice: 21999,
      stock: 4,
      images: ["/images/placeholder.svg"],
      featured: true,
      categoryId: findCat("bridal-poshak"),
    },
    {
      name: "Pink Bridal Lehenga Poshak",
      description:
        "Heavily embellished pink bridal lehenga poshak with dupatta and matching jewellery set.",
      price: 27999,
      discountPrice: null,
      stock: 3,
      images: ["/images/placeholder.svg"],
      featured: true,
      categoryId: findCat("bridal-poshak"),
    },
    {
      name: "Wedding Collection Sharara Set",
      description:
        "Designer sharara set from our wedding collection with premium fabric and finishing.",
      price: 15999,
      discountPrice: 13999,
      stock: 6,
      images: ["/images/placeholder.svg"],
      featured: false,
      categoryId: findCat("wedding-collection"),
    },
    {
      name: "Classic Traditional Rajasthani Dress",
      description:
        "Comfortable everyday traditional dress with authentic Rajasthani prints.",
      price: 3999,
      discountPrice: 2999,
      stock: 20,
      images: ["/images/placeholder.svg"],
      featured: false,
      categoryId: findCat("traditional-dress"),
    },
    {
      name: "Festive Traditional Ghagra Choli",
      description:
        "Vibrant ghagra choli set ideal for festivals and family functions.",
      price: 5499,
      discountPrice: null,
      stock: 10,
      images: ["/images/placeholder.svg"],
      featured: false,
      categoryId: findCat("traditional-dress"),
    },
    {
      name: "Kids Rajputi Poshak Set",
      description:
        "Adorable miniature Rajputi poshak set for kids, matching the royal family look.",
      price: 2999,
      discountPrice: 2499,
      stock: 15,
      images: ["/images/placeholder.svg"],
      featured: true,
      categoryId: findCat("kids-collection"),
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name },
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
