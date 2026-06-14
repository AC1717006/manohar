"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice, productImage } from "@/lib/format";
import { API_URL } from "@/lib/api";
import { useCartStore } from "@/store/cart";

function resolveImage(src: string) {
  if (src.startsWith("/uploads")) return `${API_URL}${src}`;
  return src;
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const images = product.images.length > 0 ? product.images : [productImage([])];
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const hasDiscount =
    product.discountPrice && Number(product.discountPrice) < Number(product.price);
  const outOfStock = product.stock <= 0;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  }

  function handleAddToCart() {
    addItem(product, qty);
  }

  function handleBuyNow() {
    addItem(product, qty);
    router.push("/checkout");
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-xl border border-gold/15 bg-royal-charcoal"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoom(null)}
        >
          <img
            src={resolveImage(images[activeImage])}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-200"
            style={
              zoom
                ? {
                    transform: "scale(2)",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  }
                : undefined
            }
          />
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setActiveImage(idx)}
                className={`h-20 w-16 overflow-hidden rounded-lg border ${
                  activeImage === idx ? "border-gold" : "border-gold/15"
                }`}
              >
                <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm uppercase tracking-wide text-gold/60">{product.category.name}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-gold-light sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold text-gold">
            {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-lg text-gold-light/40 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <p className="mt-6 leading-relaxed text-gold-light/70">{product.description}</p>

        <p className={`mt-4 text-sm ${outOfStock ? "text-red-400" : "text-emerald-400"}`}>
          {outOfStock ? "Out of Stock" : `In Stock (${product.stock} available)`}
        </p>

        {!outOfStock && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm text-gold-light/70">Quantity</span>
              <div className="flex items-center rounded-full border border-gold/30">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-gold hover:text-gold-light"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-gold-light">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-gold hover:text-gold-light"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className="rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
              >
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
