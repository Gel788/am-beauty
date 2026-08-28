"use client";

import { ContentImage } from "@/components/ui/content-image";
import { Reveal } from "@/components/reveal";
import { MarqueeStrip } from "@/components/marquee-strip";
import { useSite } from "@/context/catalog-context";

export function HomeRitual() {
  const site = useSite();
  const { home } = site;
  const steps = home.ritualSteps;

  return (
    <>
      <section className="section-invert grid lg:min-h-[min(88vh,920px)] lg:grid-cols-2">
        <div className="relative min-h-[50vh] overflow-hidden lg:min-h-full">
          <ContentImage
            src={home.ritualImage}
            alt="Текстура сыворотки"
            fill
            className="object-cover object-center"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/20 lg:hidden" aria-hidden />
        </div>

        <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:px-16 lg:py-20">
          <Reveal>
            <p className="text-[10px] tracking-[0.28em] text-white/50 uppercase">Ритуал</p>
            <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug font-light tracking-[0.02em] text-white">
              Три шага — и формула работает за вас.
            </blockquote>
          </Reveal>

          <ol className="mt-10 space-y-0">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={0.08 * i}>
                <li className="group flex gap-5 border-t border-white/15 py-6 transition-colors hover:border-white/35">
                  <span className="w-8 shrink-0 font-display text-2xl leading-none text-gold/80 tabular-nums">
                    {step.num}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[11px] tracking-[0.2em] text-white uppercase">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{step.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <MarqueeStrip invert items={site.marquee} />
    </>
  );
}
