"use client";

import Image from "next/image";
import type { AdminCategory } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

type CatalogHeroProps = {
  categories: AdminCategory[];
  activeCategoryId: string | null;
  productCount: number;
  query?: string;
};

const DEFAULT = {
  title: "Коллекция",
  description: "Сыворотки, уход и декоративная косметика — малые партии, точные дозировки.",
  image: "/images/hero-dark.jpg",
};

export function CatalogHero({
  categories,
  activeCategoryId,
  productCount,
  query,
}: CatalogHeroProps) {
  const active = categories.find((c) => c.id === activeCategoryId);
  const title = query ? `«${query}»` : (active?.title ?? DEFAULT.title);
  const description = query
    ? `${productCount} ${productCount === 1 ? "результат" : "результатов"} в каталоге`
    : (active?.description ?? DEFAULT.description);
  const image = active?.image ?? DEFAULT.image;

  return (
    <section className="relative -mt-[3.75rem] flex min-h-[min(52vh,520px)] items-end overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      <div
        className="pointer-events-none absolute top-[22%] right-[-4vw] select-none font-extralight text-[clamp(5rem,18vw,14rem)] leading-none tracking-tight text-white/[0.04]"
        aria-hidden
      >
        AM
      </div>

      <div className="container-page relative w-full pb-12 pt-28 md:pb-16 md:pt-32">
        <p className="label-caps !text-white/55">Каталог · AM Beauty</p>
        <h1 className="headline-xl mt-4 max-w-2xl !text-white">{title}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6">
          <p className="text-[11px] tracking-[0.2em] text-white/50 uppercase">
            {productCount} {productCount === 1 ? "продукт" : "продуктов"}
          </p>
          <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
          <p className="text-[11px] tracking-[0.2em] text-gold uppercase">
            Доставка от 2 дней
          </p>
        </div>
      </div>
    </section>
  );
}
