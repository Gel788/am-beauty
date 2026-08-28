"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { formatPrice, products } from "@/data/products";
import { cn } from "@/lib/utils";

type ProductIndexStripProps = {
  className?: string;
  variant?: "hero" | "inline";
};

export function ProductIndexStrip({ className, variant = "hero" }: ProductIndexStripProps) {
  return (
    <div
      className={cn(
        "border-t",
        variant === "hero" ? "border-white/10 bg-[var(--ink)]/75 backdrop-blur-xl" : "border-border",
        className
      )}
    >
      <div className="grid grid-cols-3 divide-x divide-white/8 md:divide-border/80">
        {products.map((product, index) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/products/${product.slug}`}
              transitionTypes={["nav-forward"]}
              className="group relative flex min-h-[9.5rem] cursor-pointer flex-col items-center justify-end overflow-hidden px-3 py-5 transition-colors hover:bg-white/[0.03] md:min-h-[11rem] md:px-5 md:py-6"
            >
              <span
                className="index-outline pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 font-display text-[clamp(4.5rem,12vw,6.5rem)] leading-none select-none md:top-0"
                aria-hidden
              >
                {product.id}
              </span>

              <div className="relative z-10 mb-3 size-[4.5rem] overflow-hidden rounded-full ring-1 ring-white/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:ring-[var(--copper)]/70 md:size-20">
                <Image
                  src={product.image}
                  alt=""
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  sizes="80px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="relative z-10 w-full text-center">
                <p className="label-caps !text-[9px] text-[var(--copper)]/70">{product.ritual}</p>
                <p className="font-display mt-1 truncate text-sm text-foreground md:text-base">
                  {product.name}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatPrice(product.price)}</p>
              </div>

              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--copper)] transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
