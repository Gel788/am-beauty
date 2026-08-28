const items = [
  "Малые партии",
  "Стекло и пипетка",
  "Доставка 1–3 дня",
  "Подарочная упаковка",
  "Без парабенов",
  "Сделано в Москве",
];

export function MarqueeStrip({ invert = false }: { invert?: boolean }) {
  const row = items.map((item) => (
    <span key={item} className="inline-flex items-center gap-12 md:gap-20">
      <span>{item}</span>
      <span className="text-[10px] opacity-40" aria-hidden>
        —
      </span>
    </span>
  ));

  return (
    <div
      className={`overflow-hidden border-y py-4 ${
        invert ? "border-white/15 bg-black text-white/70" : "border-border bg-black text-white/80"
      }`}
      aria-hidden
    >
      <div className="marquee-track flex w-max items-center gap-12 px-6 text-[10px] tracking-[0.32em] uppercase md:gap-20">
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
      </div>
    </div>
  );
}
