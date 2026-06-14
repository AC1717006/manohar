"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminApi } from "@/lib/useAdminApi";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const adminApi = useAdminApi();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.get<Product[]>("/api/products");
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await adminApi.delete(`/api/products/${id}`);
    setProducts((p) => p.filter((prod) => prod.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
        >
          + Add Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-royal-charcoal">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-gold-light/60">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gold-light/50">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gold-light/50">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gold/10 text-gold-light">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3 text-gold-light/70">{product.category.name}</td>
                  <td className="px-4 py-3">
                    {formatPrice(product.discountPrice ?? product.price)}
                    {product.discountPrice && (
                      <span className="ml-2 text-gold-light/40 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{product.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="mr-3 text-gold hover:underline"
                    >
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
