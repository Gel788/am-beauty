import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

type HomeSectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
};

export function HomeSectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
  invert,
}: HomeSectionHeaderProps) {
  const centered = align === "center";

  return (
    <Reveal className={cn(centered && "text-center", className)}>
      {label ? (
        <p
          className={cn(
            "text-[10px] tracking-[0.28em] uppercase",
            invert ? "text-white/50" : "text-grey",
          )}
        >
          {label}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] font-light tracking-[0.02em]",
          invert ? "text-white" : "text-black",
          centered && "mx-auto",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-md text-sm leading-relaxed",
            invert ? "text-white/60" : "text-grey",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
