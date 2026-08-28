import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import type { DeliveryCarrier, DeliveryMode, DeliveryTariff, PickupPoint, TariffRequest } from "./types";
import { CARRIER_LABELS, MODE_LABELS } from "./types";

const MOSCOW_ALIASES = ["москва", "moscow"];
const SPB_ALIASES = ["санкт-петербург", "спб", "петербург", "saint-petersburg"];

function isMajorCity(city: string): boolean {
  const normalized = city.trim().toLowerCase();
  return MOSCOW_ALIASES.some((a) => normalized.includes(a)) || SPB_ALIASES.some((a) => normalized.includes(a));
}

function basePrice(carrier: DeliveryCarrier, mode: DeliveryMode, city: string, weightGrams: number): number {
  const major = isMajorCity(city);
  const weightFactor = Math.max(1, Math.ceil(weightGrams / 500));

  const table: Record<DeliveryCarrier, Record<DeliveryMode, number>> = {
    cdek: { courier: major ? 390 : 490, pickup: major ? 290 : 390 },
    russian_post: { courier: major ? 350 : 420, pickup: major ? 280 : 360 },
    yandex: { courier: major ? 450 : 550, pickup: major ? 320 : 420 },
  };

  return table[carrier][mode] * weightFactor;
}

function eta(carrier: DeliveryCarrier, mode: DeliveryMode, city: string): { minDays: number; maxDays: number } {
  const major = isMajorCity(city);
  const table: Record<DeliveryCarrier, Record<DeliveryMode, { minDays: number; maxDays: number }>> = {
    cdek: {
      courier: major ? { minDays: 1, maxDays: 2 } : { minDays: 2, maxDays: 5 },
      pickup: major ? { minDays: 1, maxDays: 3 } : { minDays: 3, maxDays: 7 },
    },
    russian_post: {
      courier: major ? { minDays: 2, maxDays: 4 } : { minDays: 5, maxDays: 14 },
      pickup: major ? { minDays: 2, maxDays: 5 } : { minDays: 7, maxDays: 21 },
    },
    yandex: {
      courier: major ? { minDays: 1, maxDays: 2 } : { minDays: 2, maxDays: 4 },
      pickup: major ? { minDays: 1, maxDays: 2 } : { minDays: 2, maxDays: 6 },
    },
  };
  return table[carrier][mode];
}

export function applyFreeShipping(price: number, subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return price;
}

export function getFallbackTariffs(request: TariffRequest): DeliveryTariff[] {
  const carriers: DeliveryCarrier[] = ["cdek", "russian_post", "yandex"];
  const modes: DeliveryMode[] = ["courier", "pickup"];
  const tariffs: DeliveryTariff[] = [];

  for (const carrier of carriers) {
    for (const mode of modes) {
      const { minDays, maxDays } = eta(carrier, mode, request.city);
      const rawPrice = basePrice(carrier, mode, request.city, request.weightGrams);
      const price = applyFreeShipping(rawPrice, request.subtotal);
      tariffs.push({
        carrier,
        mode,
        price,
        minDays,
        maxDays,
        label: `${CARRIER_LABELS[carrier]} · ${MODE_LABELS[mode]}`,
        estimated: true,
      });
    }
  }

  return tariffs;
}

export function getFallbackPickupPoints(carrier: DeliveryCarrier, city: string): PickupPoint[] {
  const trimmedCity = city.trim() || "Москва";
  const baseNames: Record<DeliveryCarrier, string[]> = {
    cdek: ["СДЭК ПВЗ", "СДЭК Box", "СДЭК Express"],
    russian_post: ["Отделение №1", "Отделение №2", "Почтомат"],
    yandex: ["Яндекс ПВЗ", "Яндекс Маркет", "Яндекс Пункт"],
  };

  return baseNames[carrier].map((name, i) => ({
    id: `${carrier}-${i + 1}-${trimmedCity.toLowerCase().replace(/\s+/g, "-")}`,
    carrier,
    name: `${name} — ${trimmedCity}`,
    address: `ул. Примерная, ${10 + i * 4}`,
    city: trimmedCity,
    postalCode: `${101000 + i}`,
    schedule: "Пн–Вс 10:00–21:00",
  }));
}
