import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import type { Product } from "@/lib/types";

const BASE_URL = "https://surendrasarajputifashion.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await api.get<Product[]>("/api/products").catch(() => []);

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/shop/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...productEntries,
  ];
}
