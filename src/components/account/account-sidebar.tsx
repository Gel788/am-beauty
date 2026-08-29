"use client";

import Link from "next/link";
import {
  Heart,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import type { AccountProfile } from "@/store/account-store";
import { cn } from "@/lib/utils";

export type AccountTabId = "overview" | "orders" | "profile" | "addresses" | "wishlist";

const TABS: { id: AccountTabId; label: string; shortLabel: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Обзор", shortLabel: "Обзор", icon: LayoutDashboard },
  { id: "orders", label: "Заказы", shortLabel: "Заказы", icon: Package },
  { id: "profile", label: "Профиль", shortLabel: "Профиль", icon: User },
  { id: "addresses", label: "Адреса", shortLabel: "Адреса", icon: MapPin },
  { id: "wishlist", label: "Избранное", shortLabel: "Избр.", icon: Heart },
];

const QUICK_LINKS = [
  { href: "/catalog", label: "Каталог", icon: ShoppingBag },
  { href: "/cart", label: "Корзина", icon: Package },
  { href: "/contacts", label: "Поддержка", icon: MessageCircle },
] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

type AccountSidebarProps = {
  active: AccountTabId;
  onChange: (tab: AccountTabId) => void;
  profile: AccountProfile;
  stats: { orders: number; addresses: number; wishlist: number };
  vertical?: boolean;
  isAuthenticated?: boolean;
  onLogout?: () => void | Promise<void>;
};

export function AccountNav({
  active,
  onChange,
  vertical,
}: {
  active: AccountTabId;
  onChange: (tab: AccountTabId) => void;
  vertical?: boolean;
}) {
  return (
    <nav
      className={cn(
        vertical
          ? "flex flex-col gap-0.5"
          : "grid grid-cols-2 gap-2 sm:flex sm:gap-0 sm:overflow-x-auto sm:border-b sm:border-border sm:pb-px",
      )}
      aria-label="Разделы личного кабинета"
    >
      {TABS.map(({ id, label, shortLabel, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex min-h-11 cursor-pointer items-center justify-center gap-2 px-3 py-2.5 text-[10px] tracking-[0.14em] uppercase transition-colors sm:min-h-0 sm:shrink-0 sm:justify-start sm:px-4 sm:py-3 sm:tracking-[0.16em]",
            vertical
              ? active === id
                ? "border-l-2 border-gold bg-cream/80 pl-[14px] text-black"
                : "border-l-2 border-transparent text-grey hover:bg-cream/40 hover:text-black"
              : active === id
                ? "border border-gold/60 bg-cream/80 text-black sm:border-0 sm:border-b-2 sm:border-gold sm:bg-transparent"
                : "border border-border bg-white text-grey hover:border-black/20 hover:text-black sm:border-0 sm:bg-transparent",
            !vertical && id === "wishlist" && "col-span-2 sm:col-span-1",
          )}
        >
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function AccountMobileSummary({
  profile,
  stats,
  isAuthenticated,
  onLogout,
}: {
  profile: AccountProfile;
  stats: { orders: number; addresses: number; wishlist: number };
  isAuthenticated?: boolean;
  onLogout?: () => void | Promise<void>;
}) {
  const name = isAuthenticated ? profile.name.trim() || "Гость" : "Войдите в кабинет";
  const emailHint = isAuthenticated
    ? profile.email || "Добавьте email в профиле"
    : "Вход по email и паролю";

  return (
    <div className="border border-border bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center border border-gold/40 bg-cream font-display text-lg text-gold"
          aria-hidden
        >
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg tracking-wide">{name}</p>
          <p className="truncate text-xs text-grey">{emailHint}</p>
        </div>
      </div>
      {isAuthenticated && onLogout ? (
        <button
          type="button"
          onClick={() => void onLogout()}
          className="mt-3 cursor-pointer text-[10px] tracking-[0.16em] text-grey uppercase underline underline-offset-2 transition-colors hover:text-black"
        >
          Выйти из аккаунта
        </button>
      ) : null}
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
        {[
          { label: "Заказы", value: stats.orders },
          { label: "Адреса", value: stats.addresses },
          { label: "Избранное", value: stats.wishlist },
        ].map((s) => (
          <div key={s.label} className="min-w-0">
            <dd className="font-display text-xl text-gold/90 sm:text-2xl">{s.value}</dd>
            <dt className="mt-0.5 truncate text-[9px] tracking-[0.1em] text-grey uppercase">{s.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function AccountSidebar({
  active,
  onChange,
  profile,
  stats,
  isAuthenticated,
  onLogout,
}: AccountSidebarProps) {
  const name = isAuthenticated ? profile.name.trim() || "Гость" : "Войдите в кабинет";
  const emailHint = isAuthenticated
    ? profile.email || "Добавьте email в профиле"
    : "Вход по email и паролю";

  return (
    <div className="space-y-4">
      <div className="border border-border bg-white p-6">
        <div className="flex items-center gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center border border-gold/40 bg-cream font-display text-xl text-gold"
            aria-hidden
          >
            {initials(name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg tracking-wide">{name}</p>
            <p className="mt-0.5 truncate text-xs text-grey">{emailHint}</p>
            {profile.phone ? (
              <p className="mt-0.5 truncate text-xs text-grey">{profile.phone}</p>
            ) : null}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
          {[
            { label: "Заказы", value: stats.orders },
            { label: "Адреса", value: stats.addresses },
            { label: "Избранное", value: stats.wishlist },
          ].map((s) => (
            <div key={s.label} className="min-w-0">
              <dd className="font-display text-2xl text-gold/90">{s.value}</dd>
              <dt className="mt-1 truncate text-[9px] tracking-[0.12em] text-grey uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
        {isAuthenticated && onLogout ? (
          <button
            type="button"
            onClick={() => void onLogout()}
            className="mt-5 w-full cursor-pointer border border-border py-2.5 text-[10px] tracking-[0.16em] uppercase transition-colors hover:border-black hover:bg-cream"
          >
            Выйти
          </button>
        ) : null}
      </div>

      <div className="border border-border bg-white">
        <AccountNav active={active} onChange={onChange} vertical />
      </div>

      <div className="border border-border bg-cream/50 p-5">
        <p className="text-[9px] tracking-[0.18em] text-grey uppercase">Быстрые ссылки</p>
        <ul className="mt-3 space-y-1">
          {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-2 py-2 text-[10px] tracking-[0.14em] text-charcoal uppercase transition-colors hover:text-gold"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-border bg-black p-5 text-white">
        <p className="text-[9px] tracking-[0.2em] text-white/50 uppercase">AM Beauty</p>
        <p className="mt-2 text-sm leading-relaxed text-white/80">
          Доставка от 1 дня · Возврат 14 дней · Поддержка в рабочие часы
        </p>
        <Link
          href="/contacts"
          className="mt-4 inline-block text-[10px] tracking-[0.16em] text-gold uppercase underline underline-offset-4"
        >
          Написать нам
        </Link>
      </div>
    </div>
  );
}

export { TABS };
