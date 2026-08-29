"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { ContentImage } from "@/components/ui/content-image";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lineLabels } from "@/data/categories";
import { formatPrice } from "@/data/products";
import { useCatalogCategories, useCatalogProducts, useSite } from "@/context/catalog-context";
import { searchSuggestions } from "@/lib/catalog";
import { useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const HEADER_H = "h-16";

const iconClass = "size-[17px] stroke-[1.25]";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function HeaderIconButton({
  children,
  className,
  ...props
}: ComponentProps<"button"> & { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function HeaderIconLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & { children: React.ReactNode }) {
  return (
    <Link
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

function CountBadge({ count, onHero }: { count: number; onHero?: boolean }) {
  if (count <= 0) return null;

  return (
    <motion.span
      key={count}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "absolute top-1.5 right-1 flex min-w-[1.125rem] items-center justify-center px-0.5 text-[8px] font-medium leading-none tabular-nums",
        onHero ? "bg-white text-black" : "bg-gold text-black",
      )}
    >
      {count > 9 ? "9+" : count}
    </motion.span>
  );
}

export function Header() {
  const site = useSite();
  const navItems = site.nav.filter((item) => item.href !== "/account");
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
  const categories = useCatalogCategories();
  const products = useCatalogProducts();
  const suggestions = searchSuggestions(products, query);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
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

  const navLinkClass = (href: string) => {
    const active = isActive(pathname, href);
    return cn(
      "relative py-1 text-[10px] tracking-[0.22em] uppercase transition-colors",
      onHero
        ? active
          ? "text-white after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-white"
          : "text-white/60 hover:text-white"
        : active
          ? "text-black after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-gold"
          : "text-grey hover:text-black",
    );
  };

  const iconTone = onHero ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5";

  const mobileMenuButtonTone = onHero
    ? "bg-black/55 text-white shadow-[0_2px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm hover:bg-black/70"
    : "bg-cream text-black hover:bg-black/5";

  const closeMenu = () => setMenuOpen(false);

  const brandLink = (
    <Link
      href="/"
      onClick={closeMenu}
      className={cn(
        "block max-w-full truncate whitespace-nowrap text-center font-display text-[1.125rem] leading-none font-normal tracking-[0.04em] transition-colors sm:text-[1.25rem] md:text-[1.375rem]",
        onHero
          ? "text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]"
          : "text-black",
      )}
    >
      {site.brand}
    </Link>
  );

  const desktopNav = (
    <nav className="hidden min-w-0 items-center gap-3 md:flex md:gap-4 xl:gap-7" aria-label="Основное меню">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(navLinkClass(item.href), "whitespace-nowrap md:text-[9px] lg:text-[10px]")}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  const utilityIcons = (
    <>
      <HeaderIconButton aria-label="Поиск" onClick={() => setSearchOpen(true)} className={iconTone}>
        <Search className={iconClass} />
      </HeaderIconButton>

      <HeaderIconLink href="/account" aria-label="Аккаунт" className={iconTone}>
        <User className={iconClass} />
      </HeaderIconLink>

      <HeaderIconLink
        href="/account?tab=wishlist"
        aria-label={`Избранное${wishlistCount > 0 ? `, ${wishlistCount}` : ""}`}
        className={iconTone}
      >
        <Heart className={iconClass} />
        <CountBadge count={wishlistCount} onHero={onHero} />
      </HeaderIconLink>

      <HeaderIconLink href="/cart" aria-label={`Корзина${count > 0 ? `, ${count}` : ""}`} className={iconTone}>
        <ShoppingBag className={iconClass} />
        <CountBadge count={count} onHero={onHero} />
      </HeaderIconLink>
    </>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 motion-reduce:transition-none",
          onHero
            ? "border-b border-white/10 bg-gradient-to-b from-black/70 via-black/35 to-transparent max-md:from-black/85 max-md:via-black/55"
            : "border-b border-border bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md",
        )}
      >
        {/* Mobile */}
        <div className={cn("container-page max-w-full md:hidden", HEADER_H)}>
          <div className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <HeaderIconButton
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={cn("relative z-10", mobileMenuButtonTone)}
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.75} />
              ) : (
                <Menu className="size-5" strokeWidth={1.75} />
              )}
            </HeaderIconButton>

            <div className="min-w-0 justify-self-center px-1">{brandLink}</div>

            <div className="relative z-10 flex items-center justify-self-end gap-0.5">
              <HeaderIconButton
                aria-label="Поиск"
                onClick={() => setSearchOpen(true)}
                className={iconTone}
              >
                <Search className={iconClass} />
              </HeaderIconButton>
              <HeaderIconLink
                href="/cart"
                aria-label={`Корзина${count > 0 ? `, ${count}` : ""}`}
                className={iconTone}
              >
                <ShoppingBag className={iconClass} />
                <CountBadge count={count} onHero={onHero} />
              </HeaderIconLink>
            </div>
          </div>
        </div>

        {/* Desktop / tablet */}
        <div className={cn("container-page hidden max-w-full md:block", HEADER_H)}>
          <div className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
            <div className="min-w-0 justify-self-start">{desktopNav}</div>

            <div className="justify-self-center px-2">{brandLink}</div>

            <div className="relative z-10 flex items-center justify-self-end gap-0.5">{utilityIcons}</div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-hidden bg-white md:hidden"
          >
            <div
              className={cn(
                "container-page relative max-w-full border-b border-border bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]",
                HEADER_H,
              )}
            >
              <div className="grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                <button
                  type="button"
                  aria-label="Закрыть меню"
                  onClick={closeMenu}
                  className="relative z-10 flex size-10 cursor-pointer items-center justify-center text-black"
                >
                  <X className="size-5" strokeWidth={1} />
                </button>

                <div className="min-w-0 flex-1 text-center px-2">
                  <span className="block truncate font-display text-[1.125rem] leading-none font-normal tracking-[0.04em] text-black sm:text-[1.25rem]">
                    {site.brand}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Поиск"
                  onClick={() => {
                    closeMenu();
                    setSearchOpen(true);
                  }}
                  className="relative z-10 flex size-10 cursor-pointer items-center justify-center text-black"
                >
                  <Search className={iconClass} />
                </button>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-y-contain bg-white" aria-label="Мобильное меню">
              <ul className="border-b border-border bg-white">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.04 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "group flex min-h-14 items-center gap-4 border-b border-border px-6 py-5 last:border-b-0 active:bg-cream sm:px-8",
                        isActive(pathname, item.href) ? "bg-cream" : "bg-white",
                      )}
                    >
                      <span className="w-7 shrink-0 font-display text-lg text-gold tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "font-display text-xl leading-tight tracking-[0.02em] transition-colors sm:text-2xl",
                          isActive(pathname, item.href) ? "text-black" : "text-black/85 group-hover:text-black",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.28 }}
                className="border-b border-border bg-cream px-6 py-8 sm:px-8"
              >
                <p className="text-[10px] font-medium tracking-[0.28em] text-charcoal uppercase">Категории</p>
                <div className="scroll-snap-x mt-4 flex gap-2 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog?category=${cat.id}`}
                      onClick={closeMenu}
                      className="shrink-0 snap-start border border-border bg-white px-3.5 py-2.5 text-[10px] font-medium tracking-[0.16em] text-black uppercase transition-colors hover:border-gold"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </nav>

            <div className="border-t border-border bg-white px-6 py-5 sm:px-8">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 border border-border py-3.5 text-[10px] tracking-[0.18em] uppercase transition-colors hover:border-black"
                >
                  <User className="size-4" strokeWidth={1} />
                  Аккаунт
                </Link>
                <Link
                  href="/account?tab=wishlist"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 border border-border py-3.5 text-[10px] tracking-[0.18em] uppercase transition-colors hover:border-black"
                >
                  <Heart className="size-4" strokeWidth={1} />
                  Избранное
                  {wishlistCount > 0 ? ` · ${wishlistCount}` : ""}
                </Link>
              </div>
              <p className="mt-4 text-center text-[10px] tracking-[0.2em] text-grey uppercase">
                Москва · Доставка по России
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Search */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Поиск"
          >
            <div className="container-page max-w-full pt-6 pb-10">
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <Search className="size-5 shrink-0 text-grey" strokeWidth={1} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && query && goSearch(query)}
                  placeholder="Найти продукт"
                  className="min-w-0 flex-1 bg-transparent font-display text-xl font-light tracking-[0.02em] outline-none placeholder:text-grey/60"
                />
                <button
                  type="button"
                  aria-label="Закрыть"
                  onClick={() => setSearchOpen(false)}
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-grey transition-colors hover:text-black"
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
                        className="flex w-full cursor-pointer items-center gap-4 py-4 text-left transition-colors hover:bg-cream/40 sm:gap-5 sm:py-5"
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden border border-border bg-cream sm:size-[4.5rem]">
                          <ContentImage
                            src={p.image}
                            alt=""
                            fill
                            objectFit="cover"
                            sizes="72px"
                            className="object-center"
                          />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="font-display text-lg tracking-[0.02em] text-black">
                            {p.shortName}
                          </p>
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
                <div className="mt-12">
                  <p className="text-[10px] tracking-[0.28em] text-grey uppercase">Популярное</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Сыворотка", "Кушон", "SPF", "Тоник"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => goSearch(term)}
                        className="cursor-pointer border border-border px-3.5 py-2 text-[10px] tracking-[0.16em] uppercase transition-colors hover:border-black"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
