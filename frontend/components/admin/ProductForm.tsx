"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminApi } from "@/lib/useAdminApi";
import { getAdminToken } from "@/lib/adminAuth";
import { API_URL } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const adminApi = useAdminApi();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [discountPrice, setDiscountPrice] = useState(product?.discountPrice ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.get<Category[]>("/api/categories").then((cats) => {
      setCategories(cats);
      if (!categoryId && cats.length > 0) setCategoryId(cats[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_URL}/api/uploads`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((imgs) => [...imgs, data.url]);
    } catch {
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx: number) {
    setImages((imgs) => imgs.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      categoryId,
      featured,
      images,
    };

    try {
      if (product) {
        await adminApi.put(`/api/products/${product.id}`, payload);
      } else {
        await adminApi.post("/api/products", payload);
      }
      router.push("/admin/products");
    } catch {
      setError("Failed to save product. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input
        required
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
      />
      <textarea
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <input
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Discount Price"
          value={discountPrice ?? ""}
          onChange={(e) => setDiscountPrice(e.target.value)}
          className="rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
        />
        <input
          required
          type="number"
          min="0"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light placeholder:text-gold-light/40 focus:border-gold focus:outline-none"
        />
      </div>

      <select
        required
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full rounded-lg border border-gold/20 bg-royal-black px-4 py-2.5 text-gold-light focus:border-gold focus:outline-none"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 text-sm text-gold-light/80">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-[var(--color-gold)]"
        />
        Featured Product
      </label>

      <div>
        <p className="mb-2 text-sm text-gold-light/80">Images</p>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={img + idx} className="relative h-20 w-16 overflow-hidden rounded-lg border border-gold/20">
              <img
                src={img.startsWith("/uploads") ? `${API_URL}${img}` : img}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-0 top-0 bg-royal-black/80 px-1 text-xs text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="mt-3 text-sm text-gold-light/70"
        />
        {uploading && <p className="mt-1 text-xs text-gold-light/50">Uploading...</p>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105 disabled:opacity-50"
      >
        {submitting ? "Saving..." : product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
