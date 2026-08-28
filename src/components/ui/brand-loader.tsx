type BrandLoaderProps = {
  label?: string;
  className?: string;
  compact?: boolean;
};

export function BrandLoader({
  label = "Загрузка",
  className,
  compact = false,
}: BrandLoaderProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-3 py-8" : "gap-4 py-16 sm:py-20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="brand-loader__mark font-display text-2xl tracking-[0.28em] text-black/90 uppercase">
        AM
      </div>
      <div className="brand-loader__line" aria-hidden />
      <p className="text-[10px] tracking-[0.28em] text-grey uppercase">{label}</p>
    </div>
  );
}
