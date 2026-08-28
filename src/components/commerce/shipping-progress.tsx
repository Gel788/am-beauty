import Image from "next/image";
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
    <div className={cn("space-y-3", className)}>
      <p className={cn("text-grey", compact ? "text-xs leading-relaxed" : "text-sm")}>
        {free ? (
          <>
            <span className="text-gold">Бесплатная доставка</span> — порог{" "}
            {formatPrice(FREE_SHIPPING_THRESHOLD)} достигнут
          </>
        ) : (
          <>
            До бесплатной доставки{" "}
            <span className="text-black">{formatPrice(remaining)}</span>
          </>
        )}
      </p>
      <div className="h-0.5 w-full bg-border">
        <div
          className={cn(
            "h-0.5 transition-all duration-500 motion-reduce:transition-none",
            free ? "bg-gold" : "bg-black",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
