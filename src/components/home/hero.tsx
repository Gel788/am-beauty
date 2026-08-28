"use client";

import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { products } from "@/data/products";
import { MarqueeStrip } from "@/components/marquee-strip";
import { useSite } from "@/context/catalog-context";

export function HomeHero() {
  const site = useSite();
  const home = site.home;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const lead = products[0];

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <>
      <section
        ref={ref}
        className="relative -mt-[3.75rem] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black"
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={reduce || !isDesktop ? undefined : { y: imageY }}
        >
          <div className={`absolute inset-0 md:inset-[-8%] ${reduce ? "" : "hero-kenburns max-md:!transform-none"}`}>
            <ContentImage
              src={home.heroImage}
              alt=""
              fill
              priority
              className="object-cover object-[center_42%] md:object-[center_35%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </motion.div>

        <div
          className="pointer-events-none absolute right-[-2vw] top-[18vh] select-none font-extralight text-[clamp(6rem,22vw,16rem)] leading-none tracking-tight text-white/[0.04]"
          aria-hidden
        >
          AM
        </div>

        <motion.div
          className="container-page relative z-10 pb-10 pt-32 md:pb-16 md:pt-40"
          style={reduce ? undefined : { y: textY, opacity }}
        >
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[10px] tracking-[0.36em] text-white/55 uppercase"
          >
            {home.heroLabel}
          </motion.p>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="headline-massive mt-6 max-w-[12ch] text-white"
          >
            {home.heroTitle}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-sm text-sm leading-relaxed text-white/60"
          >
            {home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Link
              href="/catalog"
              className="group relative inline-flex h-12 items-center overflow-hidden border border-white px-8 text-[10px] tracking-[0.28em] text-white uppercase"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-black">
                {home.heroCta}
              </span>
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            </Link>
            {lead ? (
              <Link
                href={`/products/${lead.slug}`}
                className="text-[10px] tracking-[0.28em] text-white/45 uppercase transition-colors hover:text-white"
              >
                N°01 — {lead.shortName}
              </Link>
            ) : null}
          </motion.div>
        </motion.div>

        <div className="container-page relative z-10 hidden items-end justify-between border-t border-white/15 py-5 md:flex">
          <p className="text-[10px] tracking-[0.28em] text-white/40 uppercase">Scroll</p>
          <motion.div
            animate={reduce ? undefined : { scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-px origin-top bg-white/50"
          />
          <p className="text-[10px] tracking-[0.28em] text-white/40 uppercase">{home.heroFootnote}</p>
        </div>
      </section>

      <MarqueeStrip items={site.marquee} />
    </>
  );
}
