import { cn } from "@/lib/utils";

type PageHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function PageHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: PageHeaderProps) {
  return (
    <header className={cn(align === "center" && "text-center", className)}>
      {label ? <p className="label-caps">{label}</p> : null}
      <h1 className={cn("headline-xl", label ? "mt-4" : "")}>{title}</h1>
      {description ? (
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed text-grey",
            align === "center" && "mx-auto max-w-lg",
          )}
        >
          {description}
        </p>
      ) : null}
    </header>
  );
}
