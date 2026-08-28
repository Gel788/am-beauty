import { applyFreeShipping, getFallbackPickupPoints, getFallbackTariffs } from "../fallback";
import type { DeliveryTariff, PickupPoint, TariffRequest } from "../types";
import { CARRIER_LABELS, MODE_LABELS } from "../types";

const YANDEX_API = "https://b2b.taxi.yandex.net/b2b/cargo/integration/v2";

function getYandexToken(): string | null {
  return process.env.YANDEX_DELIVERY_TOKEN ?? null;
}

async function calculateYandexTariff(
  token: string,
  request: TariffRequest,
  mode: "courier" | "pickup",
): Promise<{ price: number; minDays: number; maxDays: number } | null> {
  try {
    const res = await fetch(`${YANDEX_API}/offers/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": "ru",
      },
      body: JSON.stringify({
        route_points: [
          { fullname: "Москва, ул. Тверская, 1" },
          { fullname: `${request.city}, центр` },
        ],
        items: [
          {
            quantity: 1,
            weight: request.weightGrams / 1000,
            size: {
              length: (request.dimensions?.length ?? 20) / 100,
              width: (request.dimensions?.width ?? 15) / 100,
              height: (request.dimensions?.height ?? 10) / 100,
            },
          },
        ],
        requirements: {
          taxi_class: mode === "courier" ? "express" : "cargo",
        },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      offers?: Array<{ price?: { total_price?: string }; delivery_interval?: { from?: string; to?: string } }>;
    };
    const offer = data.offers?.[0];
    if (!offer?.price?.total_price) return null;
    const price = Math.round(parseFloat(offer.price.total_price));
    return { price, minDays: 1, maxDays: mode === "courier" ? 2 : 3 };
  } catch {
    return null;
  }
}

export async function getYandexTariffs(request: TariffRequest): Promise<DeliveryTariff[]> {
  const token = getYandexToken();
  if (!token) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "yandex");
  }

  const modes: Array<"courier" | "pickup"> = ["courier", "pickup"];
  const tariffs: DeliveryTariff[] = [];

  for (const mode of modes) {
    const result = await calculateYandexTariff(token, request, mode);
    if (result) {
      tariffs.push({
        carrier: "yandex",
        mode,
        price: applyFreeShipping(result.price, request.subtotal),
        minDays: result.minDays,
        maxDays: result.maxDays,
        label: `${CARRIER_LABELS.yandex} · ${MODE_LABELS[mode]}`,
        estimated: false,
      });
    }
  }

  if (tariffs.length === 0) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "yandex");
  }

  return tariffs;
}

export async function getYandexPickupPoints(city: string): Promise<PickupPoint[]> {
  const token = getYandexToken();
  if (!token) return getFallbackPickupPoints("yandex", city);

  try {
    const res = await fetch(`${YANDEX_API}/pickup-points?city=${encodeURIComponent(city)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": "ru",
      },
    });
    if (!res.ok) return getFallbackPickupPoints("yandex", city);

    const data = (await res.json()) as {
      points?: Array<{
        id: string;
        name?: string;
        address?: { full_address?: string; city?: string };
        schedule?: { text?: string };
      }>;
    };

    if (!data.points?.length) return getFallbackPickupPoints("yandex", city);

    return data.points.map((point) => ({
      id: point.id,
      carrier: "yandex" as const,
      name: point.name ?? `Яндекс ПВЗ ${point.id}`,
      address: point.address?.full_address ?? "",
      city: point.address?.city ?? city,
      schedule: point.schedule?.text,
    }));
  } catch {
    return getFallbackPickupPoints("yandex", city);
  }
}
