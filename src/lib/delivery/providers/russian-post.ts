import { applyFreeShipping, getFallbackPickupPoints, getFallbackTariffs } from "../fallback";
import type { DeliveryTariff, PickupPoint, TariffRequest } from "../types";
import { CARRIER_LABELS, MODE_LABELS } from "../types";

const POCHTA_API = "https://otpravka-api.pochta.ru";

function getPochtaHeaders(): Record<string, string> | null {
  const token = process.env.POCHTA_TOKEN;
  const key = process.env.POCHTA_KEY;
  if (!token || !key) return null;
  return {
    Authorization: `AccessToken ${token}`,
    "X-User-Authorization": `Basic ${key}`,
    "Content-Type": "application/json",
  };
}

async function calculatePochtaTariff(
  headers: Record<string, string>,
  request: TariffRequest,
  isCourier: boolean,
): Promise<{ price: number; minDays: number; maxDays: number } | null> {
  try {
    const res = await fetch(`${POCHTA_API}/1.0/tariff`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "index-from": "101000",
        "index-to": request.postalCode ?? "190000",
        "mail-category": "ORDINARY",
        "mail-type": isCourier ? "ONLINE_PARCEL" : "POSTAL_PARCEL",
        mass: request.weightGrams,
        dimension: {
          height: request.dimensions?.height ?? 10,
          length: request.dimensions?.length ?? 20,
          width: request.dimensions?.width ?? 15,
        },
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      "total-rate"?: number;
      "delivery-time"?: { "min-days"?: number; "max-days"?: number };
    };
    if (typeof data["total-rate"] !== "number") return null;
    return {
      price: Math.round(data["total-rate"] / 100),
      minDays: data["delivery-time"]?.["min-days"] ?? 3,
      maxDays: data["delivery-time"]?.["max-days"] ?? 10,
    };
  } catch {
    return null;
  }
}

export async function getRussianPostTariffs(request: TariffRequest): Promise<DeliveryTariff[]> {
  const headers = getPochtaHeaders();
  if (!headers) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "russian_post");
  }

  const modes = [
    { mode: "courier" as const, isCourier: true },
    { mode: "pickup" as const, isCourier: false },
  ];

  const tariffs: DeliveryTariff[] = [];

  for (const { mode, isCourier } of modes) {
    const result = await calculatePochtaTariff(headers, request, isCourier);
    if (result) {
      tariffs.push({
        carrier: "russian_post",
        mode,
        price: applyFreeShipping(result.price, request.subtotal),
        minDays: result.minDays,
        maxDays: result.maxDays,
        label: `${CARRIER_LABELS.russian_post} · ${MODE_LABELS[mode]}`,
        estimated: false,
      });
    }
  }

  if (tariffs.length === 0) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "russian_post");
  }

  return tariffs;
}

export async function getRussianPostPickupPoints(city: string): Promise<PickupPoint[]> {
  const headers = getPochtaHeaders();
  if (!headers) return getFallbackPickupPoints("russian_post", city);

  try {
    const res = await fetch(`${POCHTA_API}/1.0/postoffice?city=${encodeURIComponent(city)}&size=30`, {
      headers,
    });
    if (!res.ok) return getFallbackPickupPoints("russian_post", city);

    const data = (await res.json()) as Array<{
      "postal-code"?: string;
      "address-source"?: string;
      "working-hours"?: string;
    }>;

    if (!Array.isArray(data) || data.length === 0) {
      return getFallbackPickupPoints("russian_post", city);
    }

    return data.map((office, i) => ({
      id: `rp-${office["postal-code"] ?? i}`,
      carrier: "russian_post" as const,
      name: `Отделение ${office["postal-code"] ?? i + 1}`,
      address: office["address-source"] ?? "",
      city,
      postalCode: office["postal-code"],
      schedule: office["working-hours"],
    }));
  } catch {
    return getFallbackPickupPoints("russian_post", city);
  }
}
