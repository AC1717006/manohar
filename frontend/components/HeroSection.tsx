"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-royal-black" />,
});

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919649030231";

export default function HeroSection() {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-royal-black">
      <div className="absolute inset-0">
        <Hero3D />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-royal-black/10 via-transparent to-royal-black" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 rounded-full border border-gold/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-gold"
        >
          Ajmer, Rajasthan
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-4xl font-bold leading-tight text-gradient-gold sm:text-5xl md:text-6xl"
        >
          Welcome to Surendra Sa Rajputi Fashion
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-4 max-w-xl text-base text-gold-light/80 sm:text-lg"
        >
          Royal Rajputi Poshak, Bridal Wear &amp; Traditional Collections — crafted with
          heritage, finished with gold.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/shop"
            className="rounded-full bg-gold px-8 py-3 text-sm font-semibold text-royal-black transition-transform hover:scale-105"
          >
            Shop Now
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Namaste! I'd like to place an order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            WhatsApp Order
          </a>
        </motion.div>
      </div>
    </section>
  );
}
