"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Copy, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { AdminBadge } from "@/components/admin/admin-ui";
import { AdminButton } from "@/components/admin/admin-form";
import {
  OrderDetailContent,
  type OrderDetailData,
} from "@/components/orders/order-detail-content";
import {
  ORDER_STATUS_OPTIONS,
  formatAdminDate,
  formatAdminPrice,
  orderStatusLabel,
} from "@/lib/admin/format";
import type { AdminOrder } from "@/lib/admin/types";
import type { OrderStatus } from "@/store/account-store";

function toDetail(order: AdminOrder): OrderDetailData {
  return {
    id: order.id,
    date: formatAdminDate(order.date),
    status: order.status,
    items: order.items,
    delivery: order.delivery,
    payment: order.payment,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    promoCode: order.promoCode,
    trackingNumber: order.trackingNumber,
    customer: {
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
  };
}

type AdminOrderPreviewProps = {
  order: AdminOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, patch: { status?: OrderStatus; trackingNumber?: string }) => Promise<void>;
};

export function AdminOrderPreview({
  order,
  open,
  onOpenChange,
  onUpdate,
}: AdminOrderPreviewProps) {
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setTracking(order.trackingNumber ?? "");
  }, [order]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const copyId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.id);
      toast.success("Номер заказа скопирован");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  const copyTracking = async () => {
    if (!tracking.trim()) return;
    try {
      await navigator.clipboard.writeText(tracking.trim());
      toast.success("Трек-номер скопирован");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  const saveChanges = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const patch: { status?: OrderStatus; trackingNumber?: string } = {};
      if (status !== order.status) patch.status = status;
      if (tracking !== (order.trackingNumber ?? "")) patch.trackingNumber = tracking;
      if (Object.keys(patch).length > 0) {
        await onUpdate(order.id, patch);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open || !order) return null;

  const dirty = status !== order.status || tracking !== (order.trackingNumber ?? "");
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4 md:p-8"
      onClick={() => onOpenChange(false)}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-preview-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col border border-black/10 bg-[#faf9f7] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 border-b border-black/10 bg-white px-5 py-5 md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <AdminBadge variant="gold">Заказ</AdminBadge>
                <AdminBadge>{orderStatusLabel(order.status)}</AdminBadge>
              </div>
              <h2
                id="admin-order-preview-title"
                className="mt-3 font-display text-2xl tracking-wide text-black md:text-3xl"
              >
                {order.id}
              </h2>
              <p className="mt-1 text-sm text-grey">
                {formatAdminDate(order.date)} · {order.customerName}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-9 cursor-pointer items-center justify-center border border-black/15 bg-white text-grey transition-colors hover:border-black hover:text-black"
                aria-label="Закрыть"
              >
                <X className="size-4" />
              </button>
              <p className="font-display text-xl tracking-wide tabular-nums md:text-2xl">
                {formatAdminPrice(order.total)}
              </p>
              <p className="text-xs text-grey">{itemCount} поз.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 border border-black/10 bg-cream/40 p-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[10px] tracking-[0.16em] uppercase text-grey">Статус</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="h-10 border border-black/15 bg-white px-3 text-sm"
              >
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {orderStatusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-[10px] tracking-[0.16em] uppercase text-grey">Трек-номер</span>
              <div className="flex gap-2">
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="Введите трек"
                  className="h-10 min-w-0 flex-1 border border-black/15 bg-white px-3 text-sm"
                />
                <button
                  type="button"
                  onClick={copyTracking}
                  disabled={!tracking.trim()}
                  className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center border border-black/15 bg-white hover:border-black disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Скопировать трек-номер"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </label>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-6">
          <OrderDetailContent
            order={toDetail(order)}
            variant="admin"
            productLinks
            hideHeader
          />
        </div>

        <footer className="flex shrink-0 flex-wrap gap-2 border-t border-black/10 bg-white px-5 py-4 md:px-6">
          <AdminButton onClick={saveChanges} disabled={!dirty || saving}>
            {saving ? "Сохранение…" : "Сохранить изменения"}
          </AdminButton>
          <AdminButton variant="ghost" onClick={copyId}>
            <Copy className="size-3.5" />
            Скопировать № заказа
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => onOpenChange(false)}>
            Закрыть
          </AdminButton>
        </footer>
      </div>
    </div>
  );
}

export function AdminOrderPreviewButton({
  onClick,
}: {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 border border-black/15 px-2.5 py-1.5 text-[10px] tracking-[0.12em] uppercase transition-colors hover:border-gold hover:text-gold"
    >
      <Eye className="size-3.5" aria-hidden />
      Просмотр
    </button>
  );
}
