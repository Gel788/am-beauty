import { ContentImage } from "@/components/ui/content-image";
import { formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { ShippingProgress } from "@/components/commerce/shipping-progress";
import { cn } from "@/lib/utils";

export type OrderLine = { product: Product; qty: number };

type OrderSummaryProps = {
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  className?: string;
  showShippingBar?: boolean;
  showThumbnails?: boolean;
};

export function OrderSummary({
  lines,
  subtotal,
  discount,
  shipping,
  total,
  promoCode,
  className,
  showShippingBar = true,
  showThumbnails = true,
}: OrderSummaryProps) {
  return (
    <aside className={cn("border border-border bg-cream/40 p-6 md:p-8", className)}>
      <h2 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.24em] uppercase">
        Итого
      </h2>

      {showShippingBar ? <ShippingProgress subtotal={subtotal} className="mt-5" compact /> : null}

      {showThumbnails && lines.length > 0 ? (
        <ul className="mt-6 space-y-3 border-b border-border pb-5">
          {lines.map((l) => (
            <li key={l.product.slug} className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 bg-white">
                <div className="absolute inset-1">
                  <ContentImage
                    src={l.product.image}
                    alt=""
                    fill
                    objectFit="contain"
                    sizes="48px"
                    className="object-bottom"
                  />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] tracking-[0.12em] uppercase">
                  {l.product.shortName}
                </p>
                <p className="text-xs text-grey">× {l.qty}</p>
              </div>
              <p className="shrink-0 text-sm tabular-nums">{formatPrice(l.product.price * l.qty)}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <dl className={cn("space-y-3 text-sm", showThumbnails ? "mt-5" : "mt-6")}>
        {!showThumbnails
          ? lines.map((l) => (
              <div key={l.product.slug} className="flex justify-between gap-4 text-grey">
                <dt className="min-w-0 truncate">
                  {l.product.shortName} × {l.qty}
                </dt>
                <dd className="shrink-0 text-black">{formatPrice(l.product.price * l.qty)}</dd>
              </div>
            ))
          : null}
        <div className="flex justify-between">
          <dt className="text-grey">Товары</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between text-grey">
            <dt>
              Скидка <span className="text-gold">{promoCode}</span>
            </dt>
            <dd className="tabular-nums text-gold">−{formatPrice(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-grey">Доставка</dt>
          <dd className="tabular-nums">{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-4">
          <dt className="text-[10px] tracking-[0.2em] uppercase">К оплате</dt>
          <dd className="font-display text-xl tracking-wide tabular-nums">{formatPrice(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
