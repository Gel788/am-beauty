"use client";

import { useState } from "react";
import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { ChevronDown, Truck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { CARRIER_LABELS, MODE_LABELS } from "@/lib/delivery/types";
import { ORDER_STATUS_LABELS, type AccountOrder } from "@/store/account-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_FLOW: AccountOrder["status"][] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

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

function OrderStatusTimeline({ status }: { status: AccountOrder["status"] }) {
  if (status === "cancelled") {
    return (
      <p className="text-xs text-grey">Заказ отменён</p>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex items-center gap-0" aria-label="Статус доставки">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full border",
                done ? "border-gold bg-gold" : "border-border bg-white",
                active && "ring-2 ring-gold/30",
              )}
              title={ORDER_STATUS_LABELS[step]}
            />
            {i < STATUS_FLOW.length - 1 ? (
              <span
                className={cn("h-px flex-1", done && i < currentIndex ? "bg-gold" : "bg-border")}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function AccountOrderRow({ order, defaultOpen }: { order: AccountOrder; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const deliveryLabel = `${CARRIER_LABELS[order.delivery.carrier]} · ${MODE_LABELS[order.delivery.mode]}`;
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
          <div className="mt-3 max-w-xs">
            <OrderStatusTimeline status={order.status} />
          </div>
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
        <div className="border-t border-border bg-cream/30 px-5 py-5">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="border border-border bg-white p-4">
              <dt className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-grey">
                <Truck className="size-3.5" aria-hidden />
                Доставка
              </dt>
              <dd className="mt-2 text-charcoal">{deliveryLabel}</dd>
              <dd className="mt-1 text-grey">
                {order.delivery.pickupPoint
                  ? `${order.delivery.pickupPoint.name}, ${order.delivery.pickupPoint.address}`
                  : `${order.delivery.city}${order.delivery.address ? `, ${order.delivery.address}` : ""}`}
              </dd>
            </div>
            <div className="border border-border bg-white p-4">
              <dt className="text-[10px] tracking-[0.16em] uppercase text-grey">Оплата</dt>
              <dd className="mt-2 text-charcoal">{order.payment === "card" ? "Карта" : "СБП"}</dd>
              <dd className="mt-1 text-grey">
                Доставка: {order.shipping === 0 ? "Бесплатно" : formatPrice(order.shipping)}
              </dd>
              {order.promoCode ? (
                <dd className="mt-1 text-gold">Промокод: {order.promoCode}</dd>
              ) : null}
            </div>
          </dl>

          <ul className="mt-5 divide-y divide-border border border-border bg-white">
            {order.items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4 p-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative size-14 shrink-0 border border-border bg-cream"
                >
                  <div className="absolute inset-1.5">
                    <ContentImage
                      src={item.image}
                      alt=""
                      fill
                      objectFit="contain"
                      sizes="56px"
                      className="object-bottom"
                    />
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="truncate text-[11px] tracking-[0.12em] uppercase hover:opacity-60"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-grey">× {item.qty}</p>
                </div>
                <p className="shrink-0 text-sm tabular-nums">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            {order.trackingNumber ? (
              <p className="text-xs text-grey">
                Трек-номер: <span className="text-black">{order.trackingNumber}</span>
              </p>
            ) : (
              <p className="text-xs text-grey">Трек-номер появится после отправки</p>
            )}
            <p className="font-display text-lg tabular-nums">{formatPrice(order.total)}</p>
          </div>
        </div>
      ) : null}
    </li>
  );
}
