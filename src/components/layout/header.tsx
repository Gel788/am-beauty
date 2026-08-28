"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { lineLabels } from "@/data/categories";
import { formatPrice, products } from "@/data/products";
import { searchSuggestions } from "@/lib/catalog";
import { useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLeft = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
];

const navRight = [
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
];

const allNav = [...navLeft, ...navRight, { href: "/account", label: "Аккаунт" }];

const iconClass = "size-[18px] stroke-[1]";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";
  const onHero = isHome && !scrolled && !searchOpen;
  const { count } = useCartTotals();
  const wishlistCount = useWishlistStore((s) => s.slugs.length);
  const suggestions = searchSuggestions(products, query);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const goSearch = (q: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(`/catalog?q=${encodeURIComponent(q)}`);
  };

  const navLinkClass = (href: string) =>
    cn(
      "text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-50",
      onHero
        ? isActive(pathname, href)
          ? "text-white"
          : "text-white/55"
        : isActive(pathname, href)
          ? "text-black"
          : "text-grey",
    );

  const iconColor = onHero ? "text-white" : "text-black";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        onHero ? "border-transparent bg-transparent" : "border-border bg-white/95 backdrop-blur-md",
      )}
    >
      <div className="container-page grid h-[3.75rem] grid-cols-[1fr_auto_1fr] items-center">
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Основное меню">
          {navLeft.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex justify-start lg:justify-center">
          <Link
            href="/"
            className="text-[11px] font-medium tracking-[0.42em] uppercase transition-colors"
            style={{ color: onHero ? "white" : "black" }}
            aria-label="AM Beauty — на главную"
          >
            AM Beauty
          </Link>
        </div>

        <div className="flex items-center justify-end gap-0">
          <nav className="mr-2 hidden items-center gap-8 lg:flex">
            {navRight.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Поиск"
            onClick={() => setSearchOpen(true)}
            className={cn("flex size-10 cursor-pointer items-center justify-center transition-opacity hover:opacity-50", iconColor)}
          >
            <Search className={iconClass} />
          </button>

          <Link
            href="/account"
            aria-label="Аккаунт"
            className={cn("hidden size-10 items-center justify-center transition-opacity hover:opacity-50 sm:flex", iconColor, !onHero && navLinkClass("/account"))}
          >
            <User className={iconClass} />
          </Link>

          <Link
            href="/account#wishlist"
            aria-label={`Избранное${wishlistCount > 0 ? `, ${wishlistCount}` : ""}`}
            className={cn("relative flex size-10 items-center justify-center transition-opacity hover:opacity-50", iconColor)}
          >
            <Heart className={iconClass} />
            {wishlistCount > 0 ? (
              <span className="absolute top-2 right-2 size-1.5 bg-black" aria-hidden />
            ) : null}
          </Link>

          <Link
            href="/cart"
            aria-label={`Корзина${count > 0 ? `, ${count} товаров` : ""}`}
            className={cn("relative flex size-10 items-center justify-center transition-opacity hover:opacity-50", iconColor)}
          >
            <ShoppingBag className={iconClass} />
            {count > 0 ? (
              <motion.span
                key={count}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-4 px-1 text-center text-[9px]"
              >
                {count}
              </motion.span>
            ) : null}
          </Link>

          <button
            type="button"
            aria-label="Меню"
            onClick={() => setMenuOpen(true)}
            className={cn("flex size-10 cursor-pointer items-center justify-center lg:hidden", iconColor)}
          >
            <Menu className={iconClass} />
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-full bg-white sm:max-w-sm">
          <p className="text-[11px] font-medium tracking-[0.42em] uppercase">AM Beauty</p>
          <nav className="mt-12 flex flex-col">
            {allNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn("border-b border-border py-5", navLinkClass(item.href))}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Поиск"
          >
            <div className="container-page pt-6">
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <Search className="size-5 text-grey" strokeWidth={1} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && query && goSearch(query)}
                  placeholder="Поиск"
                  className="flex-1 bg-transparent text-sm tracking-[0.12em] uppercase outline-none placeholder:text-grey-light"
                />
                <button
                  type="button"
                  aria-label="Закрыть"
                  onClick={() => setSearchOpen(false)}
                  className="cursor-pointer p-2 text-grey hover:opacity-50"
                >
                  <X className="size-5" strokeWidth={1} />
                </button>
              </div>

              {suggestions.length > 0 ? (
                <ul className="mt-2 divide-y divide-border">
                  {suggestions.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => goSearch(p.shortName)}
                        className="flex w-full cursor-pointer items-center gap-6 py-5 text-left transition-opacity hover:opacity-60"
                      >
                        <div className="relative size-16 overflow-hidden bg-cream">
                          <Image src={p.image} alt="" fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="text-left">
                          <p className="text-[11px] tracking-[0.18em] uppercase">{p.shortName}</p>
                          <p className="mt-1 text-xs text-grey">
                            {lineLabels[p.line]} · {formatPrice(p.price)}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <p className="mt-16 text-center text-sm text-grey">Ничего не найдено</p>
              ) : (
                <p className="mt-16 text-center text-xs text-grey">Сыворотка · кушон · SPF</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
