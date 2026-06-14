"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { formatPrice, productImage } from "@/lib/format";
import { API_URL } from "@/lib/api";

function resolveImage(src: string) {
  if (src.startsWith("/uploads")) return `${API_URL}${src}`;
  return src;
}

export default function ProductCard({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(`rotateX(${y * -10}deg) rotateY(${x * 10}deg)`);
  }

  function handleMouseLeave() {
    setTransform("rotateX(0deg) rotateY(0deg)");
  }

  const hasDiscount =
    product.discountPrice && Number(product.discountPrice) < Number(product.price);

  return (
    <Link href={`/shop/${product.id}`} className="group block [perspective:1000px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="overflow-hidden rounded-xl border border-gold/15 bg-royal-charcoal shadow-lg shadow-black/40 transition-shadow duration-300 group-hover:border-gold/50 group-hover:shadow-gold/20"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-royal-black">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-royal-maroon px-3 py-1 text-xs font-semibold text-gold-light">
              Sale
            </span>
          )}
          <img
            src={resolveImage(productImage(product.images))}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-gold/60">
            {product.category.name}
          </p>
          <h3 className="mt-1 line-clamp-1 font-medium text-gold-light">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold text-gold">
              {formatPrice(hasDiscount ? product.discountPrice! : product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gold-light/40 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
