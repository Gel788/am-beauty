"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";

export function HomeManifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.5]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream py-24 md:py-36">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-0">
        <Reveal className="lg:col-span-5">
          <p className="label-caps">Манифест</p>
          <h2 className="headline-massive mt-6 !text-[clamp(2rem,6vw,4.5rem)] !leading-[0.95]">
            Less
            <br />
            noise
          </h2>
        </Reveal>

        <motion.div
          className="relative aspect-[4/5] lg:col-span-7 lg:-mr-16 lg:aspect-auto lg:min-h-[70vh]"
          style={reduce ? undefined : { scale, opacity }}
        >
          <Image
            src="/images/peptide-v2.jpg"
            alt="Сыворотка AM Beauty"
            fill
            className="object-cover"
            sizes="60vw"
          />
        </motion.div>
      </div>

      <Reveal className="container-page mt-16 max-w-xl">
        <p className="text-lg leading-relaxed font-light md:text-xl">
          Мы не обещаем чудес за одну ночь. Мы делаем формулы, которые работают каждый день — тихо,
          стабильно, честно.
        </p>
        <Link href="/about" className="link-underline mt-8 inline-block">
          О бренде
        </Link>
      </Reveal>
    </section>
  );
}
