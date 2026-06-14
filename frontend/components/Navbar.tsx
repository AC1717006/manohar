"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=bridal-poshak", label: "Bridal" },
  { href: "/shop?category=wedding-collection", label: "Wedding" },
];

export default function Navbar() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-royal-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-gradient-gold sm:text-2xl">
          Surendra Sa Rajputi Fashion
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gold-light/80 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
        >
          <span>Cart</span>
          {mounted && cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-royal-black">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
