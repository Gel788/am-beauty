import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminStatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-black/10 bg-white p-5">
      <p className="text-[10px] tracking-[0.18em] text-grey uppercase">{label}</p>
      <p className={cn("mt-2 font-display text-3xl tracking-wide", accent && "text-gold")}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-grey">{hint}</p> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border border-black/10 bg-white", className)}>
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
          <h3 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.2em] uppercase">
            {title}
          </h3>
          {action}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-black/10 px-3 py-3 text-[10px] tracking-[0.14em] text-grey uppercase first:pl-0 last:pr-0">
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("border-b border-black/5 px-3 py-4 align-middle first:pl-0 last:pr-0", className)}>
      {children}
    </td>
  );
}

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "gold" | "muted" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 text-[10px] tracking-[0.12em] uppercase",
        variant === "gold" && "bg-gold/15 text-gold",
        variant === "muted" && "bg-black/5 text-grey",
        variant === "danger" && "bg-red-50 text-red-700",
        variant === "default" && "bg-black text-white",
      )}
    >
      {children}
    </span>
  );
}
