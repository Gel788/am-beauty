"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice } from "@/data/products";
import {
  OrderDetailContent,
  type OrderDetailData,
} from "@/components/orders/order-detail-content";
import { ContentImage } from "@/components/ui/content-image";
import { ORDER_STATUS_LABELS, type AccountOrder } from "@/store/account-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function statusVariant(status: AccountOrder["status"]) {
  switch (status) {
    case "delivered":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function statusAccent(status: AccountOrder["status"]) {
  if (status === "processing" || status === "shipped") return "text-gold";
  if (status === "delivered") return "text-black";
  return "text-grey";
}

function toDetail(order: AccountOrder): OrderDetailData {
  return {
    id: order.id,
    date: order.date,
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
  };
}

export function AccountOrderRow({ order, defaultOpen }: { order: AccountOrder; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const previewItems = order.items.slice(0, 4);
  const extraCount = order.items.length - previewItems.length;

  return (
    <li className="border border-border bg-white transition-colors hover:border-black/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col gap-4 p-5 text-left cursor-pointer sm:flex-row sm:flex-wrap sm:items-center"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] tracking-[0.14em] uppercase">{order.id}</p>
            <Badge variant={statusVariant(order.status)} className={statusAccent(order.status)}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-grey">{order.date}</p>
        </div>

        <div className="flex items-center gap-2">
          {previewItems.map((item) => (
            <div
              key={item.slug}
              className="relative size-11 shrink-0 border border-border bg-cream"
              title={item.name}
            >
              <div className="absolute inset-1">
                <ContentImage
                  src={item.image}
                  alt=""
                  fill
                  objectFit="contain"
                  sizes="44px"
                  className="object-bottom"
                />
              </div>
            </div>
          ))}
          {extraCount > 0 ? (
            <span className="text-[10px] tracking-[0.12em] text-grey uppercase">+{extraCount}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-4 sm:ml-auto">
          <span className="font-display text-lg tracking-wide tabular-nums">{formatPrice(order.total)}</span>
          <ChevronDown
            className={cn(
              "size-4 text-grey transition-transform motion-safe:duration-300",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </div>
      </button>

      {open ? (
        <div className="border-t border-border bg-cream/20 px-5 py-5">
          <OrderDetailContent order={toDetail(order)} />
        </div>
      ) : null}
    </li>
  );
}
