import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function AdminField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[10px] tracking-[0.16em] text-grey uppercase">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <p className="mt-1 text-xs text-grey">{hint}</p> : null}
    </label>
  );
}

const inputClass =
  "w-full border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold";

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />;
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, "min-h-[100px] resize-y")} {...props} />;
}

export function AdminSelect({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputClass, className)} {...props}>
      {children}
    </select>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer px-5 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-colors",
        variant === "primary" && "bg-black text-white hover:bg-charcoal",
        variant === "ghost" && "border border-black/15 bg-white hover:border-black/30",
        variant === "danger" && "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

export function parseLines(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinLines(values: string[]) {
  return values.join("\n");
}
