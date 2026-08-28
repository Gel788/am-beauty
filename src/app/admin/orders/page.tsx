"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminBadge,
  AdminPanel,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/admin-ui";
import type { AdminOrder } from "@/lib/admin/types";
import {
  ORDER_STATUS_OPTIONS,
  formatAdminDate,
  formatAdminPrice,
  orderStatusLabel,
} from "@/lib/admin/format";
import type { OrderStatus } from "@/store/account-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const load = () => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders));
  };

  useEffect(() => {
    load();
  }, []);

  const updateOrder = async (id: string, patch: { status?: OrderStatus; trackingNumber?: string }) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      toast.success("Заказ обновлён");
      load();
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <AdminShell title="Заказы" description="Управление статусами и трек-номерами">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(["all", ...ORDER_STATUS_OPTIONS] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`cursor-pointer border px-3 py-2 text-[10px] tracking-[0.14em] uppercase transition-colors ${
                filter === status
                  ? "border-black bg-black text-white"
                  : "border-black/15 bg-white text-grey hover:border-black"
              }`}
            >
              {status === "all" ? "Все" : orderStatusLabel(status)}
            </button>
          ))}
        </div>

        <AdminPanel>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>Заказ</AdminTh>
                <AdminTh>Клиент</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh>Сумма</AdminTh>
                <AdminTh>Трек</AdminTh>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <AdminTd>
                    <p className="text-[11px] tracking-[0.12em] uppercase">{order.id}</p>
                    <p className="text-xs text-grey">{formatAdminDate(order.date)}</p>
                  </AdminTd>
                  <AdminTd>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-xs text-grey">{order.customerEmail}</p>
                  </AdminTd>
                  <AdminTd>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder(order.id, { status: e.target.value as OrderStatus })}
                      className="h-9 border border-black/15 bg-white px-2 text-xs"
                      aria-label={`Статус заказа ${order.id}`}
                    >
                      {ORDER_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {orderStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </AdminTd>
                  <AdminTd>
                    <p className="font-medium tabular-nums">{formatAdminPrice(order.total)}</p>
                    <p className="text-xs text-grey">{order.items.length} поз.</p>
                  </AdminTd>
                  <AdminTd>
                    <input
                      defaultValue={order.trackingNumber ?? ""}
                      placeholder="Трек-номер"
                      className="h-9 w-full min-w-[120px] border border-black/15 px-2 text-xs"
                      onBlur={(e) => {
                        if (e.target.value !== (order.trackingNumber ?? "")) {
                          updateOrder(order.id, { trackingNumber: e.target.value });
                        }
                      }}
                    />
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-grey">Заказов нет</p>
          ) : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
