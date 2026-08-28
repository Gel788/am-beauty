"use client";

import { Package, Mail, Truck } from "lucide-react";
import { formatPrice } from "@/data/products";
import { formatEta } from "@/lib/delivery/types";
import type { DeliveryCarrier, DeliveryMode, DeliveryTariff } from "@/lib/delivery/types";
import { CARRIER_LABELS, MODE_LABELS } from "@/lib/delivery/types";
import { cn } from "@/lib/utils";

const CARRIER_ICONS: Record<DeliveryCarrier, typeof Truck> = {
  cdek: Package,
  russian_post: Mail,
  yandex: Truck,
};

type DeliveryCarrierSelectProps = {
  tariffs: DeliveryTariff[];
  selectedCarrier: DeliveryCarrier | null;
  selectedMode: DeliveryMode;
  loading?: boolean;
  onSelectCarrier: (carrier: DeliveryCarrier) => void;
  onSelectMode: (mode: DeliveryMode) => void;
};

function getCarrierTariff(tariffs: DeliveryTariff[], carrier: DeliveryCarrier, mode: DeliveryMode) {
  return tariffs.find((t) => t.carrier === carrier && t.mode === mode);
}

function getBestTariff(tariffs: DeliveryTariff[], carrier: DeliveryCarrier, mode: DeliveryMode) {
  return getCarrierTariff(tariffs, carrier, mode) ?? tariffs.find((t) => t.carrier === carrier);
}

export function DeliveryCarrierSelect({
  tariffs,
  selectedCarrier,
  selectedMode,
  loading,
  onSelectCarrier,
  onSelectMode,
}: DeliveryCarrierSelectProps) {
  const carriers: DeliveryCarrier[] = ["cdek", "russian_post", "yandex"];

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Расчёт доставки">
        {carriers.map((c) => (
          <div key={c} className="h-20 animate-pulse border border-border bg-cream/60" />
        ))}
      </div>
    );
  }

  if (tariffs.length === 0) {
    return (
      <p className="border-l-2 border-gold py-1 pl-4 text-sm text-grey">
        Укажите город, чтобы рассчитать стоимость доставки.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["courier", "pickup"] as DeliveryMode[]).map((mode) => {
          const hasMode = tariffs.some((t) => t.mode === mode);
          if (!hasMode) return null;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelectMode(mode)}
              className={cn(
                "flex-1 border px-3 py-2.5 text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer motion-safe:duration-300",
                selectedMode === mode
                  ? "border-black bg-black text-white"
                  : "border-border text-grey hover:border-black hover:text-black",
              )}
            >
              {MODE_LABELS[mode]}
            </button>
          );
        })}
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="Служба доставки">
        {carriers.map((carrier) => {
          const tariff = getBestTariff(tariffs, carrier, selectedMode);
          if (!tariff) return null;
          const Icon = CARRIER_ICONS[carrier];
          const isSelected = selectedCarrier === carrier;

          return (
            <button
              key={carrier}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectCarrier(carrier)}
              className={cn(
                "flex w-full items-center gap-4 border p-4 text-left transition-colors cursor-pointer motion-safe:duration-300",
                isSelected
                  ? "border-black bg-cream/80 ring-1 ring-black"
                  : "border-border hover:border-black/40",
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center border bg-white",
                  isSelected ? "border-gold" : "border-border",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] tracking-[0.14em] uppercase">
                  {CARRIER_LABELS[carrier]}
                </span>
                <span className="mt-0.5 block text-xs text-grey">
                  {formatEta(tariff.minDays, tariff.maxDays)}
                  {tariff.estimated ? " · ориентировочно" : ""}
                </span>
              </span>
              <span className="shrink-0 text-sm tabular-nums">
                {tariff.price === 0 ? (
                  <span className="text-gold">Бесплатно</span>
                ) : (
                  formatPrice(tariff.price)
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
