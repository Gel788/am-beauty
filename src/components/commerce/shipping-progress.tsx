import { formatPrice } from "@/data/products";
import {
  FREE_SHIPPING_THRESHOLD,
  hasFreeShipping,
  shippingProgress,
  shippingRemaining,
} from "@/lib/commerce";
import { cn } from "@/lib/utils";

type ShippingProgressProps = {
  subtotal: number;
  className?: string;
  compact?: boolean;
};

export function ShippingProgress({ subtotal, className, compact }: ShippingProgressProps) {
  const free = hasFreeShipping(subtotal);
  const remaining = shippingRemaining(subtotal);
  const progress = shippingProgress(subtotal);

  if (subtotal <= 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className={cn("text-grey", compact ? "text-xs" : "text-sm")}>
        {free ? (
          <>Бесплатная доставка — вы достигли порога {formatPrice(FREE_SHIPPING_THRESHOLD)}</>
        ) : (
          <>
            До бесплатной доставки осталось{" "}
            <span className="text-black">{formatPrice(remaining)}</span>
          </>
        )}
      </p>
      <div className="h-px w-full bg-border">
        <div
          className="h-px bg-black transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
