"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Smartphone,
  Truck,
  User,
} from "lucide-react";
import { ContentImage } from "@/components/ui/content-image";
import { formatPrice } from "@/data/products";
import { CARRIER_LABELS, MODE_LABELS } from "@/lib/delivery/types";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/store/account-store";
import type { AdminOrderItem } from "@/lib/admin/types";
import type { DeliverySelection } from "@/lib/delivery/types";
import { cn } from "@/lib/utils";

export type OrderDetailData = {
  id: string;
  date: string;
  status: OrderStatus;
  items: AdminOrderItem[];
  delivery: DeliverySelection;
  payment: "card" | "sbp";
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  trackingNumber?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
};

const STATUS_FLOW: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function statusVariant(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-black/5 text-black";
    case "cancelled":
      return "bg-red-50 text-red-700";
    case "shipped":
    case "processing":
      return "bg-gold/15 text-gold";
    default:
      return "bg-black/5 text-grey";
  }
}

function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="text-xs text-grey">Заказ отменён</p>;
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <ol className="flex items-center gap-0" aria-label="Статус доставки">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full border",
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
            </div>
            <span
              className={cn(
                "hidden text-[9px] tracking-[0.1em] uppercase sm:block",
                active ? "text-black" : "text-grey",
              )}
            >
              {ORDER_STATUS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-border bg-white p-4">
      <p className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-grey">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        {title}
      </p>
      <div className="mt-3 space-y-1 text-sm text-charcoal">{children}</div>
    </div>
  );
}

type OrderDetailContentProps = {
  order: OrderDetailData;
  variant?: "storefront" | "admin";
  productLinks?: boolean;
};

export function OrderDetailContent({
  order,
  variant = "storefront",
  productLinks = true,
}: OrderDetailContentProps) {
  const delivery = order.delivery;
  const deliveryTitle = `${CARRIER_LABELS[delivery.carrier]} · ${MODE_LABELS[delivery.mode]}`;
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const isAdmin = variant === "admin";

  return (
    <div className={cn("space-y-6", isAdmin && "text-charcoal")}>
      <header className="border border-border bg-cream/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.2em] uppercase text-grey">Заказ</p>
            <p className="mt-1 font-display text-2xl tracking-wide">{order.id}</p>
            <p className="mt-1 text-xs text-grey">{order.date}</p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "inline-flex px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase",
                statusVariant(order.status),
              )}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <p className="mt-3 font-display text-2xl tracking-wide tabular-nums">
              {formatPrice(order.total)}
            </p>
            <p className="text-xs text-grey">
              {itemCount} {itemCount === 1 ? "позиция" : itemCount < 5 ? "позиции" : "позиций"}
            </p>
          </div>
        </div>
        <div className="mt-5 max-w-md">
          <OrderStatusTimeline status={order.status} />
        </div>
      </header>

      <div
        className={cn(
          "grid gap-4",
          order.customer ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {order.customer ? (
          <InfoCard icon={User} title="Клиент">
            <p className="font-medium">{order.customer.name}</p>
            <p className="flex items-center gap-2 text-grey">
              <Mail className="size-3.5 shrink-0" aria-hidden />
              {order.customer.email}
            </p>
            <p className="flex items-center gap-2 text-grey">
              <Phone className="size-3.5 shrink-0" aria-hidden />
              {order.customer.phone}
            </p>
          </InfoCard>
        ) : null}

        <InfoCard icon={Truck} title="Доставка">
          <p>{deliveryTitle}</p>
          {delivery.mode === "pickup" && delivery.pickupPoint ? (
            <>
              <p className="text-grey">{delivery.city}</p>
              <p className="flex items-start gap-2 text-grey">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>
                  {delivery.pickupPoint.name}
                  <br />
                  {delivery.pickupPoint.address}
                </span>
              </p>
            </>
          ) : (
            <p className="flex items-start gap-2 text-grey">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                {delivery.city}
                {delivery.address ? `, ${delivery.address}` : ""}
                {delivery.postalCode ? ` · ${delivery.postalCode}` : ""}
              </span>
            </p>
          )}
          {delivery.minDays || delivery.maxDays ? (
            <p className="text-xs text-grey">
              Срок доставки: {delivery.minDays}–{delivery.maxDays} дн.
            </p>
          ) : null}
        </InfoCard>

        <InfoCard icon={order.payment === "card" ? CreditCard : Smartphone} title="Оплата">
          <p>{order.payment === "card" ? "Банковская карта" : "СБП"}</p>
          {order.promoCode ? (
            <p className="text-gold">Промокод: {order.promoCode}</p>
          ) : null}
          {order.trackingNumber ? (
            <p className="text-xs text-grey">
              Трек: <span className="text-black">{order.trackingNumber}</span>
            </p>
          ) : (
            <p className="text-xs text-grey">Трек-номер появится после отправки</p>
          )}
        </InfoCard>
      </div>

      <section>
        <h3 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.2em] uppercase">
          Состав заказа
        </h3>
        <ul className="mt-4 divide-y divide-border border border-border bg-white">
          {order.items.map((item) => (
            <li key={`${order.id}-${item.slug}`} className="flex items-center gap-4 p-4 sm:p-5">
              {productLinks ? (
                <Link
                  href={`/products/${item.slug}`}
                  className="relative size-16 shrink-0 border border-border bg-cream sm:size-20"
                >
                  <div className="absolute inset-2">
                    <ContentImage
                      src={item.image}
                      alt=""
                      fill
                      objectFit="contain"
                      sizes="80px"
                      className="object-bottom"
                    />
                  </div>
                </Link>
              ) : (
                <div className="relative size-16 shrink-0 border border-border bg-cream sm:size-20">
                  <div className="absolute inset-2">
                    <ContentImage
                      src={item.image}
                      alt=""
                      fill
                      objectFit="contain"
                      sizes="80px"
                      className="object-bottom"
                    />
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1">
                {productLinks ? (
                  <Link
                    href={`/products/${item.slug}`}
                    className="block truncate text-[11px] tracking-[0.12em] uppercase hover:opacity-60"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <p className="truncate text-[11px] tracking-[0.12em] uppercase">{item.name}</p>
                )}
                <p className="mt-1 text-xs text-grey">
                  {formatPrice(item.price)} × {item.qty}
                </p>
              </div>
              <p className="shrink-0 font-medium tabular-nums">{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="border border-border bg-cream/30 p-5 sm:p-6">
        <h3 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.2em] uppercase">
          Итого
        </h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-grey">Товары</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 ? (
            <div className="flex justify-between gap-4 text-grey">
              <dt>
                Скидка
                {order.promoCode ? <span className="text-gold"> · {order.promoCode}</span> : null}
              </dt>
              <dd className="tabular-nums text-gold">−{formatPrice(order.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <dt className="text-grey">Доставка</dt>
            <dd className="tabular-nums">
              {order.shipping === 0 ? "Бесплатно" : formatPrice(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-4">
            <dt className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase">
              <Package className="size-3.5" aria-hidden />
              К оплате
            </dt>
            <dd className="font-display text-xl tracking-wide tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
