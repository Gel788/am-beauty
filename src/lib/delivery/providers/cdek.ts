import { applyFreeShipping, getFallbackPickupPoints, getFallbackTariffs } from "../fallback";
import type { DeliveryTariff, PickupPoint, TariffRequest } from "../types";
import { CARRIER_LABELS, MODE_LABELS } from "../types";

const CDEK_API = "https://api.cdek.ru/v2";

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getCdekToken(): Promise<string | null> {
  const clientId = process.env.CDEK_CLIENT_ID;
  const clientSecret = process.env.CDEK_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const res = await fetch(`${CDEK_API}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token: string; expires_in: number };
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return data.access_token;
  } catch {
    return null;
  }
}

async function calculateCdekTariff(
  token: string,
  tariffCode: number,
  request: TariffRequest,
): Promise<{ price: number; minDays: number; maxDays: number } | null> {
  try {
    const res = await fetch(`${CDEK_API}/calculator/tariff`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: 1,
        tariff_code: tariffCode,
        from_location: { city: "Москва", postal_code: "101000" },
        to_location: {
          city: request.city,
          ...(request.postalCode ? { postal_code: request.postalCode } : {}),
        },
        packages: [
          {
            weight: request.weightGrams,
            length: request.dimensions?.length ?? 20,
            width: request.dimensions?.width ?? 15,
            height: request.dimensions?.height ?? 10,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      total_sum?: number;
      period_min?: number;
      period_max?: number;
    };
    if (typeof data.total_sum !== "number") return null;
    return {
      price: Math.round(data.total_sum),
      minDays: data.period_min ?? 2,
      maxDays: data.period_max ?? 5,
    };
  } catch {
    return null;
  }
}

export async function getCdekTariffs(request: TariffRequest): Promise<DeliveryTariff[]> {
  const token = await getCdekToken();
  if (!token) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "cdek");
  }

  const modes = [
    { mode: "courier" as const, tariffCode: 137 },
    { mode: "pickup" as const, tariffCode: 136 },
  ];

  const tariffs: DeliveryTariff[] = [];

  for (const { mode, tariffCode } of modes) {
    const result = await calculateCdekTariff(token, tariffCode, request);
    if (result) {
      tariffs.push({
        carrier: "cdek",
        mode,
        price: applyFreeShipping(result.price, request.subtotal),
        minDays: result.minDays,
        maxDays: result.maxDays,
        label: `${CARRIER_LABELS.cdek} · ${MODE_LABELS[mode]}`,
        estimated: false,
      });
    }
  }

  if (tariffs.length === 0) {
    return getFallbackTariffs(request).filter((t) => t.carrier === "cdek");
  }

  return tariffs;
}

export async function getCdekPickupPoints(city: string): Promise<PickupPoint[]> {
  const token = await getCdekToken();
  if (!token) return getFallbackPickupPoints("cdek", city);

  try {
    const params = new URLSearchParams({ city, type: "PVZ", size: "50" });
    const res = await fetch(`${CDEK_API}/deliverypoints?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return getFallbackPickupPoints("cdek", city);

    const data = (await res.json()) as Array<{
      code: string;
      name?: string;
      location?: {
        address?: string;
        city?: string;
        postal_code?: string;
        latitude?: number;
        longitude?: number;
      };
      work_time?: string;
    }>;

    if (!Array.isArray(data) || data.length === 0) {
      return getFallbackPickupPoints("cdek", city);
    }

    return data.map((point) => ({
      id: point.code,
      carrier: "cdek" as const,
      name: point.name ?? `СДЭК ${point.code}`,
      address: point.location?.address ?? "",
      city: point.location?.city ?? city,
      postalCode: point.location?.postal_code,
      lat: point.location?.latitude,
      lng: point.location?.longitude,
      schedule: point.work_time,
    }));
  } catch {
    return getFallbackPickupPoints("cdek", city);
  }
}
