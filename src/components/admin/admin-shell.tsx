"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  FolderTree,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  Percent,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Заказы", icon: Package },
  { href: "/admin/products", label: "Товары", icon: ShoppingBag },
  { href: "/admin/categories", label: "Категории", icon: FolderTree },
  { href: "/admin/media", label: "Медиа", icon: ImageIcon },
  { href: "/admin/site", label: "Контент сайта", icon: Globe },
  { href: "/admin/blog", label: "Блог", icon: FileText },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/customers", label: "Клиенты", icon: Users },
  { href: "/admin/promos", label: "Промокоды", icon: Percent },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full min-h-0 w-[260px] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-black text-white">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-[10px] tracking-[0.32em] text-gold uppercase">AM Beauty</p>
        <h1 className="mt-2 font-display text-xl font-light tracking-wide">Admin</h1>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-4" aria-label="Админ-навигация">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-[11px] tracking-[0.14em] uppercase transition-colors",
                active
                  ? "border-l-2 border-gold bg-white/5 pl-[14px] text-white"
                  : "border-l-2 border-transparent text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.25} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          className="mb-2 block px-4 py-2 text-[10px] tracking-[0.14em] text-white/45 uppercase hover:text-gold"
        >
          ← На сайт
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-[11px] tracking-[0.14em] text-white/55 uppercase transition-colors hover:text-white"
        >
          <LogOut className="size-4" strokeWidth={1.25} aria-hidden />
          Выйти
        </button>
      </div>
    </aside>
  );
}

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="admin-shell fixed inset-0 z-[200] flex h-[100dvh] overflow-hidden bg-[#f5f2ec]">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-black/10 bg-white px-6 py-5 md:px-8 md:py-6">
          <p className="text-[10px] tracking-[0.28em] text-grey uppercase">Панель управления</p>
          <h2 className="mt-1 font-display text-2xl font-light tracking-wide text-black">{title}</h2>
          {description ? <p className="mt-1 text-sm text-grey">{description}</p> : null}
        </header>
        <main className="admin-shell-main min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-6 [-webkit-overflow-scrolling:touch] md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
