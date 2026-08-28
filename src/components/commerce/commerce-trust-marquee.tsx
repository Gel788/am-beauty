const TRUST_ITEMS = [
  "Доставка от 1 дня",
  "Возврат 14 дней",
  "Оплата СБП",
  "Безопасная оплата",
  "СДЭК · Почта · Яндекс",
] as const;

export function CommerceTrustMarquee() {
  const row = TRUST_ITEMS.map((item) => (
    <span key={item} className="inline-flex items-center gap-12 md:gap-20">
      <span>{item}</span>
      <span className="text-[10px] opacity-40" aria-hidden>
        —
      </span>
    </span>
  ));

  return (
    <div className="overflow-hidden border-y border-border bg-black py-3" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-12 px-6 text-[10px] tracking-[0.28em] text-white/70 uppercase md:gap-20">
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
      </div>
    </div>
  );
}

export function CommerceTrustPills({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {TRUST_ITEMS.slice(0, 3).map((item) => (
        <li
          key={item}
          className="border border-border px-3 py-1.5 text-[9px] tracking-[0.14em] text-grey uppercase"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
