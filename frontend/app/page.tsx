import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    api.get<Product[]>("/api/products?featured=true").catch(() => []),
    api.get<Category[]>("/api/categories").catch(() => []),
  ]);

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-semibold text-gradient-gold sm:text-3xl">
          Shop by Category
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex items-center justify-center rounded-xl border border-gold/15 bg-royal-charcoal px-4 py-8 text-center transition-colors hover:border-gold/50"
            >
              <span className="font-medium text-gold-light transition-colors group-hover:text-gold">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-gradient-gold sm:text-3xl">
              Featured Collection
            </h2>
            <Link href="/shop" className="text-sm font-medium text-gold hover:underline">
              View All
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gold/15 bg-royal-charcoal p-8 text-center sm:p-12">
          <h2 className="font-serif text-2xl font-semibold text-gradient-gold sm:text-3xl">
            Follow Us on Instagram
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gold-light/70">
            See our latest Rajputi Poshak designs, bridal collections and customer stories.
          </p>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-gold px-6 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
          >
            @surendrasarajputifashion
          </a>
        </div>
      </section>
    </>
  );
}
