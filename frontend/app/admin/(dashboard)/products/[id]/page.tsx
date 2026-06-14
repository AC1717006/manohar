"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminApi } from "@/lib/useAdminApi";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const adminApi = useAdminApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .get<Product>(`/api/products/${params.id}`)
      .then(setProduct)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gradient-gold">Edit Product</h1>
      <div className="mt-6">
        {loading ? (
          <p className="text-gold-light/60">Loading...</p>
        ) : product ? (
          <ProductForm product={product} />
        ) : (
          <p className="text-gold-light/60">Product not found.</p>
        )}
      </div>
    </div>
  );
}
