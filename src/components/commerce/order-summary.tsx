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
}: OrderSummaryProps) {
  return (
    <aside className={cn("border border-border bg-cream/40 p-6 md:p-8", className)}>
      <h2 className="text-[10px] tracking-[0.24em] uppercase">Итого</h2>

      {showShippingBar ? <ShippingProgress subtotal={subtotal} className="mt-5" compact /> : null}

      <dl className="mt-6 space-y-3 text-sm">
        {lines.map((l) => (
          <div key={l.product.slug} className="flex justify-between gap-4 text-grey">
            <dt className="min-w-0 truncate">
              {l.product.shortName} × {l.qty}
            </dt>
            <dd className="shrink-0 text-black">{formatPrice(l.product.price * l.qty)}</dd>
          </div>
        ))}
        <div className="hairline !my-4" />
        <div className="flex justify-between">
          <dt className="text-grey">Товары</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between text-grey">
            <dt>Скидка {promoCode}</dt>
            <dd>−{formatPrice(discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-grey">Доставка</dt>
          <dd>{shipping === 0 ? "Бесплатно" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-base">
          <dt className="text-[10px] tracking-[0.2em] uppercase">К оплате</dt>
          <dd className="font-medium">{formatPrice(total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
