"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#shop", label: "Магазин" },
  { href: "/#ritual", label: "Ритуал" },
  { href: "/#story", label: "О бренде" },
];

function CartPanel() {
  const { lines, count, total, remove } = useCart();

  return (
    <SheetContent className="flex flex-col border-border bg-card sm:max-w-md">
      <SheetHeader>
        <SheetTitle className="font-display text-2xl font-normal">Корзина</SheetTitle>
      </SheetHeader>
      {lines.length === 0 ? (
        <p className="px-4 text-sm text-muted-foreground">Корзина пуста.</p>
      ) : (
        <ul className="flex-1 overflow-y-auto px-4">
          {lines.map(({ product, qty }) => (
            <li key={product.slug}>
              <div className="flex justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {qty} × {formatPrice(product.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => remove(product.slug)}
                >
                  Убрать
                </Button>
              </div>
              <Separator />
            </li>
          ))}
        </ul>
      )}
      <SheetFooter>
        <div className="flex w-full justify-between text-sm">
          <span className="text-muted-foreground">Итого</span>
          <span className="font-display text-xl">{formatPrice(total)}</span>
        </div>
        <Button className="w-full cursor-pointer" disabled={lines.length === 0}>
          Оформить заказ
        </Button>
      </SheetFooter>
    </SheetContent>
  );
}

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const { count } = useCart();
  const [elevated, setElevated] = useState(solid);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setElevated(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const onHero = !solid && !elevated;
  const isSolid = solid || elevated;

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500",
        isSolid
          ? "border-b border-border/80 bg-background/92 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          : "border-b border-white/10 bg-[rgba(10,8,6,0.52)] backdrop-blur-lg"
      )}
    >
      <div
        className={cn(
          "border-b text-center text-[9px] tracking-[0.28em] uppercase transition-colors duration-500",
          isSolid
            ? "border-border/60 bg-secondary/40 py-2 text-muted-foreground"
            : "border-white/8 bg-black/25 py-2.5 text-[var(--copper)]/80"
        )}
      >
        Бесплатная доставка от 7 500 ₽ · Москва
      </div>

      <div className="mx-auto grid h-[3.75rem] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:h-[4.25rem] md:px-10">
        <Link
          href="/"
          className="group flex items-baseline gap-2.5 justify-self-start"
        >
          <span
            className={cn(
              "font-display text-[1.65rem] leading-none tracking-tight transition-colors md:text-[1.85rem]",
              onHero ? "text-stone-50" : "text-foreground"
            )}
          >
            AM
          </span>
          <span
            className={cn(
              "font-sans text-[0.58rem] font-medium tracking-[0.34em] uppercase transition-colors",
              onHero
                ? "text-stone-50/45 group-hover:text-[var(--copper)]"
                : "text-muted-foreground group-hover:text-[var(--copper)]"
            )}
          >
            Beauty
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Основное меню"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link relative cursor-pointer px-4 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors",
                onHero
                  ? "text-stone-50/65 hover:text-stone-50"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3 md:gap-4">
          <Link
            href="/#shop"
            className={cn(
              "nav-link hidden cursor-pointer px-3 py-2 text-[11px] tracking-[0.22em] uppercase transition-colors sm:inline-flex",
              onHero
                ? "text-[var(--copper)] hover:text-stone-50"
                : "text-[var(--copper)] hover:text-foreground"
            )}
          >
            Купить
          </Link>

          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2 border px-3.5 py-2 text-[11px] tracking-[0.18em] uppercase transition-all duration-300",
                    onHero
                      ? "border-white/15 bg-white/5 text-stone-50 hover:border-[var(--copper)]/50 hover:bg-white/10"
                      : "border-border bg-secondary/50 text-foreground hover:border-[var(--copper)]/40 hover:bg-secondary"
                  )}
                >
                  <ShoppingBag className="size-3.5 stroke-[1.5]" />
                  <span className="hidden sm:inline">Корзина</span>
                  {count > 0 ? (
                    <span className="flex size-5 items-center justify-center bg-[var(--copper)] text-[10px] font-medium text-[var(--ink)]">
                      {count}
                    </span>
                  ) : null}
                </button>
              }
            />
            <CartPanel />
          </Sheet>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="md:hidden"
              render={
                <button
                  type="button"
                  aria-label="Открыть меню"
                  className={cn(
                    "flex size-10 cursor-pointer items-center justify-center border transition-colors",
                    onHero
                      ? "border-white/15 bg-white/5 text-stone-50"
                      : "border-border bg-secondary/50 text-foreground"
                  )}
                >
                  <Menu className="size-[18px] stroke-[1.5]" />
                </button>
              }
            />
            <SheetContent side="right" className="w-full border-border bg-card sm:max-w-sm">
              <div className="mb-8 border-b border-border pb-6">
                <p className="font-display text-3xl tracking-tight">AM Beauty</p>
                <p className="label-caps mt-2">Ателье сывороток</p>
              </div>
              <nav className="flex flex-col" aria-label="Мобильное меню">
                {links.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-4 border-b border-border py-5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="step-ring shrink-0 text-base">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl tracking-tight">{link.label}</span>
                  </Link>
                ))}
              </nav>
              <Link
                href="/#shop"
                onClick={() => setMenuOpen(false)}
                className="mt-8 flex h-12 items-center justify-center bg-[var(--copper)] text-[11px] tracking-[0.22em] text-[var(--ink)] uppercase"
              >
                В витрину
              </Link>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
