"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPanel, AdminStatCard } from "@/components/admin/admin-ui";
import type { DashboardStats } from "@/lib/admin/types";
import { formatAdminDate, formatAdminPrice } from "@/lib/admin/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, []);

  return (
    <AdminShell title="Дашборд" description="Обзор магазина AM Beauty в реальном времени">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard
            label="Выручка"
            value={stats ? formatAdminPrice(stats.revenue) : "—"}
            hint="Все заказы"
            accent
          />
          <AdminStatCard label="Заказы" value={stats?.ordersTotal ?? "—"} hint={`${stats?.ordersPending ?? 0} в работе`} />
          <AdminStatCard label="Клиенты" value={stats?.customersTotal ?? "—"} />
          <AdminStatCard
            label="Низкий остаток"
            value={stats?.lowStock ?? "—"}
            hint="≤ 10 шт."
            accent={Boolean(stats && stats.lowStock > 0)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminPanel title="Выручка за 7 дней">
            {stats?.revenueByDay.length ? (
              <ul className="space-y-3">
                {stats.revenueByDay.map((day) => (
                  <li key={day.date} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-grey">{formatAdminDate(day.date)}</span>
                    <span className="font-medium tabular-nums">{formatAdminPrice(day.revenue)}</span>
                    <span className="text-xs text-grey">{day.orders} зак.</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-grey">Нет данных</p>
            )}
          </AdminPanel>

          <AdminPanel title="Топ товаров">
            {stats?.topProducts.length ? (
              <ul className="space-y-3">
                {stats.topProducts.map((p, i) => (
                  <li key={p.slug} className="flex items-center gap-4">
                    <span className="font-display text-lg text-gold/80">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] tracking-[0.12em] uppercase">{p.name}</p>
                      <p className="text-xs text-grey">{p.qty} шт.</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums">{formatAdminPrice(p.revenue)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-grey">Нет продаж</p>
            )}
          </AdminPanel>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <AdminStatCard label="Товаров" value={stats?.productsTotal ?? "—"} />
          <AdminStatCard label="Отзывов на модерации" value={stats?.reviewsPending ?? "—"} />
          <AdminStatCard label="Промокодов" value="3" hint="2 активных" />
        </div>
      </div>
    </AdminShell>
  );
}
