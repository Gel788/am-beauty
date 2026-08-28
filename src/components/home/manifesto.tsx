"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";
import { useSite } from "@/context/catalog-context";

export function HomeManifesto() {
  const { home } = useSite();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-0">
        <Reveal className="lg:col-span-5">
          <p className="label-caps">{home.manifestoLabel}</p>
          <h2 className="headline-massive mt-6 !text-[clamp(2rem,6vw,4.5rem)] !leading-[0.95] whitespace-pre-line">
            {home.manifestoTitle}
          </h2>
        </Reveal>

        <motion.div
          className="relative aspect-[4/5] lg:col-span-7 lg:-mr-16 lg:aspect-auto lg:min-h-[70vh]"
          style={reduce ? undefined : { scale }}
        >
          <div className="absolute inset-3 sm:inset-4 md:inset-0">
            <Image
              src={home.manifestoImage}
              alt="Сыворотка AM Beauty"
              fill
              className="object-contain object-center md:object-cover"
              sizes="(max-width:768px) 90vw, 60vw"
            />
          </div>
        </motion.div>
      </div>

      <Reveal className="container-page mt-16 max-w-xl">
        <p className="text-lg leading-relaxed font-light md:text-xl">
          {home.manifestoText}
        </p>
        <Link href="/about" className="link-underline mt-8 inline-block">
          О бренде
        </Link>
      </Reveal>
    </section>
  );
}
