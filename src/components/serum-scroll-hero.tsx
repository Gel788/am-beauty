"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { bindScrollCanvas } from "@/lib/serum-canvas";

const chapters = [
  { at: 0, label: "01", title: "Закрыто", text: "Флакон ждёт вечера." },
  { at: 0.22, label: "02", title: "Откройте", text: "Пипетка поднимается — точная доза." },
  { at: 0.48, label: "03", title: "Капля", text: "Одна капля на всё лицо." },
  { at: 0.72, label: "04", title: "Ритуал", text: "Тишина. Формула работает." },
];

export function SerumScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  const chapter =
    [...chapters].reverse().find((c) => progress >= c.at) ?? chapters[0];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    return bindScrollCanvas(canvas, section, setProgress);
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-[420vh] bg-black"
      aria-label="Ритуал нанесения сыворотки"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        <div className="relative flex h-full flex-col justify-between px-4 py-6 md:px-10 md:py-8">
          <p className="text-[10px] tracking-[0.32em] text-white/50 uppercase">
            AM Beauty · Bakuchiol Night
          </p>

          <div className="max-w-lg">
            <p className="text-[10px] tracking-[0.36em] text-white/45 uppercase">
              {chapter.label}
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-6xl">
              {chapter.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/75 md:text-lg">
              {chapter.text}
            </p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <div className="h-px w-full bg-white/20">
                <div
                  className="h-px bg-white transition-[width] duration-150"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] tracking-[0.2em] text-white/40 uppercase">
                Крутите вниз
              </p>
            </div>
            <Link
              href="#shop"
              className="cursor-pointer rounded-full border border-white/30 px-5 py-2.5 text-xs tracking-wide text-white transition-colors hover:bg-white hover:text-black"
            >
              К коллекции
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
