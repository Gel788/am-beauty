"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { products } from "@/data/products";
import { ProductIndexStrip } from "@/components/product-index-strip";
import { Reveal } from "@/components/reveal";

export function ShopHero() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const y = useTransform(scrollY, [0, 600], [0, 45]);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[var(--ink)]">
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <Image
          src="/images/hero-v2.jpg"
          alt="Янтарная сыворотка AM Beauty"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_0%,rgba(12,10,8,0.5)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[rgba(12,10,8,0.25)] to-[rgba(12,10,8,0.55)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/85 via-[var(--ink)]/20 to-transparent" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-0 pt-36 md:px-10 md:pt-40">
        <div className="max-w-2xl pb-10 md:pb-14">
          <Reveal>
            <p className="label-caps text-[var(--copper)]/80">Ателье · Москва</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display-xl mt-5">
              Три формулы
              <span className="text-[var(--copper)]">.</span>
              <br />
              <span className="italic text-foreground/90">Один ритуал</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-foreground/70">
              Ночь, утро, восстановление — сыворотки в стекле. Малые партии, точные
              дозировки.
            </p>
          </Reveal>
          <Reveal delay={0.14} className="mt-8">
            <Link
              href="#shop"
              className="group inline-flex cursor-pointer items-center gap-3 border-b border-[var(--copper-dim)] pb-1 transition-colors hover:border-[var(--copper)] hover:text-[var(--copper)]"
            >
              <span className="label-caps !text-inherit">Витрина</span>
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <ProductIndexStrip />
      </div>
    </section>
  );
}
