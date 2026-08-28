"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { categories } from "@/data/categories";
import { lineLabels } from "@/data/categories";
import { formatPrice, products } from "@/data/products";
import { searchSuggestions } from "@/lib/catalog";
import { useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/account", label: "Аккаунт" },
];

const iconClass = "size-[18px] stroke-[1]";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isHome = pathname === "/";
  const onHero = isHome && !scrolled && !searchOpen && !menuOpen;
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
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  const goSearch = (q: string) => {
    setSearchOpen(false);
    setMenuOpen(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
          onHero ? "border-transparent bg-transparent" : "border-border bg-white/95 backdrop-blur-md",
        )}
      >
        {/* Mobile: 3 колонки — меню | лого | корзина */}
        <div className="container-page relative grid h-[3.75rem] grid-cols-[3rem_1fr_3rem] items-center lg:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className={cn(
              "flex size-12 cursor-pointer items-center justify-center transition-opacity hover:opacity-60",
              iconColor,
            )}
          >
            {menuOpen ? (
              <X className="size-5" strokeWidth={1.25} />
            ) : (
              <Menu className="size-5" strokeWidth={1.25} />
            )}
          </button>

          <Link
            href="/"
            onClick={closeMenu}
            className="justify-self-center text-center text-[11px] font-medium tracking-[0.42em] uppercase"
            style={{ color: onHero ? "white" : "black" }}
          >
            AM Beauty
          </Link>

          <Link
            href="/cart"
            aria-label={`Корзина${count > 0 ? `, ${count}` : ""}`}
            className={cn(
              "relative flex size-12 items-center justify-center justify-self-end",
              iconColor,
            )}
          >
            <ShoppingBag className={iconClass} />
            {count > 0 ? (
              <span className="absolute top-2.5 right-2 text-[9px] font-medium leading-none">{count}</span>
            ) : null}
          </Link>
        </div>

        {/* Desktop */}
        <div className="container-page hidden h-[3.75rem] grid-cols-[1fr_auto_1fr] items-center lg:grid">
          <nav className="flex items-center gap-8" aria-label="Основное меню">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass(item.href)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="text-[11px] font-medium tracking-[0.42em] uppercase transition-colors"
            style={{ color: onHero ? "white" : "black" }}
          >
            AM Beauty
          </Link>

          <div className="flex items-center justify-end gap-0">
            <nav className="mr-2 flex items-center gap-8">
              {navItems.slice(2, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
              className={cn("flex size-10 cursor-pointer items-center justify-center hover:opacity-50", iconColor)}
            >
              <Search className={iconClass} />
            </button>

            <Link href="/account" aria-label="Аккаунт" className={cn("flex size-10 items-center justify-center hover:opacity-50", iconColor)}>
              <User className={iconClass} />
            </Link>

            <Link
              href="/account?tab=wishlist"
              aria-label="Избранное"
              className={cn("relative flex size-10 items-center justify-center hover:opacity-50", iconColor)}
            >
              <Heart className={iconClass} />
              {wishlistCount > 0 ? <span className="absolute top-2 right-2 size-1.5 bg-current" /> : null}
            </Link>

            <Link
              href="/cart"
              aria-label="Корзина"
              className={cn("relative flex size-10 items-center justify-center hover:opacity-50", iconColor)}
            >
              <ShoppingBag className={iconClass} />
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-4 text-center text-[9px]"
                >
                  {count}
                </motion.span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden"
          >
            <div className="container-page flex h-[3.75rem] items-center justify-between border-b border-border">
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={closeMenu}
                className="flex size-11 cursor-pointer items-center justify-center text-black"
              >
                <X className="size-5" strokeWidth={1} />
              </button>
              <span className="text-[10px] tracking-[0.32em] text-grey uppercase">Меню</span>
              <button
                type="button"
                aria-label="Поиск"
                onClick={() => {
                  closeMenu();
                  setSearchOpen(true);
                }}
                className="flex size-11 cursor-pointer items-center justify-center text-black"
              >
                <Search className={iconClass} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Мобильное меню">
              <ul>
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reduce ? 0 : 0.05 + i * 0.06, duration: 0.45 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "group flex items-baseline gap-5 border-b border-border py-5",
                        isActive(pathname, item.href) ? "text-black" : "text-grey",
                      )}
                    >
                      <span className="text-[11px] tracking-[0.2em] text-grey-light">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xl font-light tracking-[0.14em] uppercase transition-colors group-hover:text-black">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.4 }}
                className="mt-10"
              >
                <p className="label-caps">Категории</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.id}`}
                      onClick={closeMenu}
                      className="border border-border px-3 py-2 text-[10px] tracking-[0.16em] uppercase transition-colors hover:border-black hover:text-black"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </nav>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex flex-1 items-center justify-center gap-2 border border-border py-3 text-[10px] tracking-[0.2em] uppercase"
                >
                  <User className="size-4" strokeWidth={1} />
                  Аккаунт
                </Link>
                <Link
                  href="/account?tab=wishlist"
                  onClick={closeMenu}
                  className="flex flex-1 items-center justify-center gap-2 border border-border py-3 text-[10px] tracking-[0.2em] uppercase"
                >
                  <Heart className="size-4" strokeWidth={1} />
                  Избранное
                  {wishlistCount > 0 ? ` (${wishlistCount})` : ""}
                </Link>
              </div>
              <p className="mt-4 text-center text-[10px] tracking-[0.2em] text-grey uppercase">
                Москва · Доставка по России
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-white"
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
                  className="flex size-11 cursor-pointer items-center justify-center text-grey hover:opacity-50"
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
                        className="flex w-full cursor-pointer items-center gap-5 py-5 text-left hover:opacity-60"
                      >
                        <div className="relative size-16 bg-cream">
                          <div className="absolute inset-1.5">
                            <Image src={p.image} alt="" fill className="object-contain object-bottom" sizes="64px" />
                          </div>
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
    </>
  );
}
