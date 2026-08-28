"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { formatPrice, products } from "@/data/products";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

const trio = products.slice(0, 3);

export function HomeFeatured() {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="overflow-hidden bg-white py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-caps">Коллекция</p>
              <h2 className="headline-lg mt-3">Три формулы</h2>
            </div>
            <p className="max-w-xs text-sm text-grey">
              Листайте вправо — ночь, утро, восстановление.
            </p>
          </div>
        </Reveal>
      </div>

      <div
        ref={railRef}
        className="scroll-snap-x mt-12 flex gap-5 overflow-x-auto px-6 pb-4 md:gap-8 md:px-10 lg:px-16"
      >
        <Stagger className="flex gap-5 md:gap-8" stagger={0.15}>
          {trio.map((p, i) => (
            <StaggerItem key={p.slug}>
              <Link
                href={`/products/${p.slug}`}
                className="group relative block w-[78vw] shrink-0 snap-center sm:w-[52vw] md:w-[38vw] lg:w-[28vw]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    priority={i === 0}
                    className="img-zoom object-cover"
                    sizes="40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                    <p className="text-[10px] tracking-[0.36em] text-white/50 uppercase">
                      N°{String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-lg tracking-[0.12em] uppercase md:text-xl">
                      {p.shortName}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{p.actives}</p>
                    <p className="mt-4 text-sm">{formatPrice(p.price)}</p>
                    <span className="mt-4 inline-block text-[10px] tracking-[0.24em] uppercase underline underline-offset-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Смотреть
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal className="container-page mt-12 text-center">
        <Link href="/catalog" className="link-underline">
          Вся коллекция
        </Link>
      </Reveal>
    </section>
  );
}
