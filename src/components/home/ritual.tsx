"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/reveal";
import { MarqueeStrip } from "@/components/marquee-strip";
import { useSite } from "@/context/catalog-context";

export function HomeRitual() {
  const site = useSite();
  const { home } = site;
  const steps = home.ritualSteps;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <>
      <section ref={ref} className="section-invert grid min-h-[90vh] lg:grid-cols-2">
        <div className="relative min-h-[52vh] overflow-hidden sm:min-h-[48vh] lg:min-h-full">
          <motion.div
            className="absolute inset-0"
            style={reduce || !isDesktop ? undefined : { y: imageY }}
          >
            <Image
              src={home.ritualImage}
              alt="Текстура сыворотки"
              fill
              className="object-cover object-[center_35%] lg:object-center"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        <div className="flex flex-col justify-center px-6 py-20 md:px-16 lg:py-28">
          <Reveal>
            <p className="text-[10px] tracking-[0.36em] text-white/45 uppercase">Ритуал</p>
            <blockquote className="headline-lg mt-8 !normal-case !tracking-[0.02em]">
              «Красота — это не украшение. Это способ быть собой.»
            </blockquote>
          </Reveal>

          <div className="mt-14 space-y-0">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={0.1 * i}>
                <div className="group flex gap-6 border-t border-white/15 py-7 transition-colors hover:border-white/40">
                  <span className="text-3xl font-extralight text-white/25 transition-colors group-hover:text-white/60">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="text-[11px] tracking-[0.22em] uppercase">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/50">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <MarqueeStrip invert items={site.marquee} />
    </>
  );
}
