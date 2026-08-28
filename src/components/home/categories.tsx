"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalogCategories, useSite } from "@/context/catalog-context";
import { Reveal } from "@/components/reveal";

export function HomeCategories() {
  const categories = useCatalogCategories();
  const { home } = useSite();
  const [lead, ...rest] = categories;

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="headline-lg text-center">{home.categoriesTitle}</h2>
        </Reveal>

        {lead ? (
          <Reveal delay={0.1} className="mt-12">
            <Link
              href={`/catalog?category=${lead.id}`}
              className="group relative block aspect-[4/3] overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]"
            >
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                className="img-zoom object-cover object-[center_30%] sm:object-center"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/30 transition-colors duration-500 group-hover:bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <p className="text-[10px] tracking-[0.36em] uppercase opacity-70">Главная категория</p>
                <h3 className="headline-lg mt-4 !text-white">{lead.title}</h3>
                <span className="link-underline mt-6 !text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Смотреть
                </span>
              </div>
            </Link>
          </Reveal>
        ) : null}

        <div className="mt-5 grid gap-px bg-border md:grid-cols-3">
          {rest.map((cat, i) => (
            <Reveal key={cat.id} delay={0.08 * (i + 1)}>
              <Link
                href={`/catalog?category=${cat.id}`}
                className="group relative flex min-h-[280px] items-end bg-black p-6 md:min-h-[300px] md:p-8"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="img-zoom object-cover object-center opacity-80 md:opacity-60"
                  sizes="33vw"
                />
                <div className="relative">
                  <h3 className="text-[11px] tracking-[0.22em] text-white uppercase">{cat.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
