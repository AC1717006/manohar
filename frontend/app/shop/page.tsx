import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse Rajputi Poshak, Bridal Poshak, Wedding Collection, Traditional Dresses and Kids Collection.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search } = await searchParams;

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);

  const [products, categories] = await Promise.all([
    api.get<Product[]>(`/api/products?${params.toString()}`).catch(() => []),
    api.get<Category[]>("/api/categories").catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-gradient-gold">Shop Collection</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              !category
                ? "border-gold bg-gold/10 text-gold"
                : "border-gold/20 text-gold-light/70 hover:border-gold/50"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                category === c.slug
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-gold/20 text-gold-light/70 hover:border-gold/50"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <form action="/shop" method="get" className="flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search products..."
            className="w-full rounded-full border border-gold/20 bg-royal-charcoal px-4 py-1.5 text-sm text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none sm:w-64"
          />
          <button
            type="submit"
            className="rounded-full border border-gold/40 px-4 py-1.5 text-sm text-gold hover:bg-gold/10"
          >
            Search
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-gold-light/60">No products found.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
