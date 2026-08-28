"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { DeliveryTariff, PickupPoint } from "@/lib/delivery/types";
import { useCheckoutStore } from "@/store/checkout-store";

type QuoteInput = {
  city: string;
  postalCode: string;
  subtotal: number;
  itemCount: number;
};

function tariffKey(tariff: DeliveryTariff | null): string {
  if (!tariff) return "";
  return `${tariff.carrier}:${tariff.mode}:${tariff.price}`;
}

export function useDeliveryQuote({ city, postalCode, subtotal, itemCount }: QuoteInput) {
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmedCity = city.trim();
    const store = useCheckoutStore.getState();

    if (!trimmedCity) {
      store.clearQuote();
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    store.setTariffsLoading(true);

    void (async () => {
      try {
        const res = await fetch("/api/delivery/tariffs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            city: trimmedCity,
            postalCode: postalCode || undefined,
            subtotal,
            itemCount,
          }),
        });

        if (!res.ok) throw new Error("tariffs failed");

        const data = (await res.json()) as { tariffs: DeliveryTariff[] };
        if (requestId !== requestIdRef.current) return;

        const next = useCheckoutStore.getState();
        next.setTariffs(data.tariffs);

        if (data.tariffs.length === 0) {
          next.selectTariff(null);
          return;
        }

        const existing = next.tariff;
        if (existing) {
          const match =
            data.tariffs.find(
              (t) => t.carrier === existing.carrier && t.mode === existing.mode,
            ) ?? data.tariffs.find((t) => t.carrier === existing.carrier);

          if (match && tariffKey(match) !== tariffKey(existing)) {
            next.selectTariff(match);
          }
          return;
        }

        const preferred =
          data.tariffs.find((t) => t.mode === next.mode) ?? data.tariffs[0];
        if (preferred) next.selectTariff(preferred);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Не удалось рассчитать доставку");
      } finally {
        if (requestId === requestIdRef.current) {
          useCheckoutStore.getState().setTariffsLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [city, postalCode, subtotal, itemCount]);
}

export function usePickupPointsQuote(city: string, postalCode: string) {
  const carrier = useCheckoutStore((s) => s.carrier);
  const mode = useCheckoutStore((s) => s.mode);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const trimmedCity = city.trim();
    const store = useCheckoutStore.getState();

    if (!carrier || mode !== "pickup" || !trimmedCity) {
      store.setPickupPoints([]);
      store.setPickupPointsLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    store.setPickupPointsLoading(true);

    void (async () => {
      try {
        const params = new URLSearchParams({
          carrier,
          city: trimmedCity,
          ...(postalCode ? { postalCode } : {}),
        });
        const res = await fetch(`/api/delivery/pickup-points?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("pickup points failed");

        const data = (await res.json()) as { points: PickupPoint[] };
        if (requestId !== requestIdRef.current) return;
        useCheckoutStore.getState().setPickupPoints(data.points);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Не удалось загрузить пункты выдачи");
      } finally {
        if (requestId === requestIdRef.current) {
          useCheckoutStore.getState().setPickupPointsLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [carrier, mode, city, postalCode]);
}
