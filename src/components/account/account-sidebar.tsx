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

const TABS: { id: AccountTabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "orders", label: "Заказы", icon: Package },
  { id: "profile", label: "Профиль", icon: User },
  { id: "addresses", label: "Адреса", icon: MapPin },
  { id: "wishlist", label: "Избранное", icon: Heart },
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
        vertical ? "flex flex-col gap-0.5" : "flex gap-1 overflow-x-auto border-b border-border pb-px",
      )}
      aria-label="Разделы личного кабинета"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex shrink-0 items-center gap-2.5 px-4 py-3 text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer",
            vertical
              ? active === id
                ? "border-l-2 border-gold bg-cream/80 pl-[14px] text-black"
                : "border-l-2 border-transparent text-grey hover:bg-cream/40 hover:text-black"
              : active === id
                ? "border-b-2 border-gold text-black"
                : "text-grey hover:text-black",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </nav>
  );
}

export function AccountSidebar({ active, onChange, profile, stats }: AccountSidebarProps) {
  const name = profile.name.trim() || "Гость";

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
            <p className="mt-0.5 truncate text-xs text-grey">
              {profile.email || "Добавьте email в профиле"}
            </p>
            {profile.phone ? (
              <p className="mt-0.5 text-xs text-grey">{profile.phone}</p>
            ) : null}
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
          {[
            { label: "Заказы", value: stats.orders },
            { label: "Адреса", value: stats.addresses },
            { label: "Избранное", value: stats.wishlist },
          ].map((s) => (
            <div key={s.label}>
              <dd className="font-display text-2xl text-gold/90">{s.value}</dd>
              <dt className="mt-1 text-[9px] tracking-[0.12em] text-grey uppercase">{s.label}</dt>
            </div>
          ))}
        </dl>
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
