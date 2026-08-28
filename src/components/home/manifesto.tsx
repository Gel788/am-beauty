"use client";

import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { useSite } from "@/context/catalog-context";

export function HomeManifesto() {
  const { home } = useSite();

  return (
    <section className="overflow-hidden border-b border-border bg-white">
      <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:gap-12 md:py-24 lg:gap-16">
        <Reveal>
          <p className="text-[10px] tracking-[0.28em] text-grey uppercase">{home.manifestoLabel}</p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[0.02em] whitespace-pre-line">
            {home.manifestoTitle}
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal md:text-lg">
            {home.manifestoText}
          </p>
          <Link href="/about" className="link-underline mt-8 inline-block">
            О бренде
          </Link>
        </Reveal>

        <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden bg-cream md:aspect-[5/6]">
          <ContentImage
            src={home.manifestoImage}
            alt="Сыворотка AM Beauty"
            fill
            className="object-cover object-center"
            sizes="(max-width:768px) 90vw, 45vw"
          />
        </Reveal>
      </div>
    </section>
  );
}
