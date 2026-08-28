"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminOrderPreview,
  AdminOrderPreviewButton,
} from "@/components/admin/admin-order-preview";
import { AdminShell } from "@/components/admin/admin-shell";
import {
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
import { CARRIER_LABELS, MODE_LABELS } from "@/lib/delivery/types";
import type { OrderStatus } from "@/store/account-store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [previewOrder, setPreviewOrder] = useState<AdminOrder | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => toast.error("Не удалось загрузить заказы"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!previewOrder || !previewOpen) return;
    const next = orders.find((o) => o.id === previewOrder.id);
    if (next) setPreviewOrder(next);
  }, [orders, previewOpen, previewOrder?.id]);

  const updateOrder = async (id: string, patch: { status?: OrderStatus; trackingNumber?: string }) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      toast.success("Заказ обновлён");
      load();
      if (previewOrder?.id === id) {
        const data = await res.json();
        setPreviewOrder(data.order ?? previewOrder);
      }
      return;
    }
    toast.error("Не удалось обновить заказ");
  };

  const openPreview = (order: AdminOrder) => {
    setPreviewOrder(order);
    setPreviewOpen(true);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const deliveryLabel = (order: AdminOrder) => {
    const d = order.delivery;
    const carrier = CARRIER_LABELS[d.carrier];
    const mode = MODE_LABELS[d.mode];
    if (d.mode === "pickup" && d.pickupPoint) {
      return `${carrier} · ${mode} — ${d.city}, ${d.pickupPoint.name}`;
    }
    return `${carrier} · ${mode} — ${d.city}${d.address ? `, ${d.address}` : ""}`;
  };

  return (
    <AdminShell title="Заказы" description="Управление статусами, трек-номерами и составом заказов">
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
                <AdminTh>Доставка</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh>Сумма</AdminTh>
                <AdminTh>Трек</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="group">
                  <AdminTd>
                    <p className="text-[11px] tracking-[0.12em] uppercase">{order.id}</p>
                    <p className="text-xs text-grey">{formatAdminDate(order.date)}</p>
                  </AdminTd>
                  <AdminTd>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-xs text-grey">{order.customerEmail}</p>
                    <p className="text-xs text-grey">{order.customerPhone}</p>
                  </AdminTd>
                  <AdminTd>
                    <p className="max-w-[220px] text-xs leading-relaxed text-charcoal">{deliveryLabel(order)}</p>
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
                  <AdminTd>
                    <AdminOrderPreviewButton
                      onClick={(e) => {
                        e.stopPropagation();
                        openPreview(order);
                      }}
                    />
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
          {loading ? (
            <p className="py-8 text-center text-sm text-grey">Загрузка заказов…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-grey">
              {orders.length === 0
                ? "Заказов пока нет — они появятся после оформления на сайте"
                : "Нет заказов с этим статусом"}
            </p>
          ) : null}
        </AdminPanel>
      </div>

      <AdminOrderPreview
        order={previewOrder}
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewOrder(null);
        }}
        onUpdate={updateOrder}
      />
    </AdminShell>
  );
}
