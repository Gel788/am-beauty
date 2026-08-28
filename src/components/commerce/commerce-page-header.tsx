import { cn } from "@/lib/utils";

type CommercePageHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function CommercePageHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: CommercePageHeaderProps) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {label ? (
        <p className="text-[10px] tracking-[0.32em] text-grey uppercase">{label}</p>
      ) : null}
      <h1
        className={cn(
          "font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-light tracking-[0.02em] text-black",
          label ? "mt-4" : "",
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-4 max-w-lg text-sm leading-relaxed text-grey",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
