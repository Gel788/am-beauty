"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:px-10 md:py-20">
        <div>
          <p className="font-display text-4xl tracking-tight">
            AM<span className="text-[var(--copper)]">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Ателье сывороток в Москве. Малые партии, стекло, точные формулы.
          </p>
        </div>
        <div>
          <p className="label-caps">Магазин</p>
          <div className="mt-4 space-y-2 text-sm">
            <Link href="/#shop" className="block text-muted-foreground transition-colors hover:text-[var(--copper)]">
              Сыворотки
            </Link>
            <Link href="/#ritual" className="block text-muted-foreground transition-colors hover:text-[var(--copper)]">
              Ритуал
            </Link>
          </div>
        </div>
        <div>
          <p className="label-caps">Рассылка</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Email"
              aria-label="Email"
              className="rounded-none border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
            <Button type="submit" variant="outline" className="shrink-0 cursor-pointer rounded-none border-[var(--copper-dim)]">
              OK
            </Button>
          </form>
        </div>
      </div>
      <div className="hairline-x" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-[11px] text-muted-foreground md:flex-row md:px-10">
        <span>© 2026 AM Beauty</span>
        <span>Доставка · Возврат · Конфиденциальность</span>
      </div>
    </footer>
  );
}
