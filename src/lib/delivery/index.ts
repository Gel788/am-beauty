import { getCdekPickupPoints, getCdekTariffs } from "./providers/cdek";
import { getRussianPostPickupPoints, getRussianPostTariffs } from "./providers/russian-post";
import { getYandexPickupPoints, getYandexTariffs } from "./providers/yandex";
import type { DeliveryCarrier, DeliveryTariff, PickupPoint, PickupPointsRequest, TariffRequest } from "./types";

export * from "./types";

export async function calculateTariffs(request: TariffRequest): Promise<DeliveryTariff[]> {
  const [cdek, russianPost, yandex] = await Promise.all([
    getCdekTariffs(request),
    getRussianPostTariffs(request),
    getYandexTariffs(request),
  ]);

  return [...cdek, ...russianPost, ...yandex];
}

export async function listPickupPoints(request: PickupPointsRequest): Promise<PickupPoint[]> {
  switch (request.carrier) {
    case "cdek":
      return getCdekPickupPoints(request.city);
    case "russian_post":
      return getRussianPostPickupPoints(request.city);
    case "yandex":
      return getYandexPickupPoints(request.city);
    default:
      return [];
  }
}

export function getCarrierTariffs(
  tariffs: DeliveryTariff[],
  carrier: DeliveryCarrier,
): DeliveryTariff[] {
  return tariffs.filter((t) => t.carrier === carrier);
}

export function formatEta(minDays: number, maxDays: number): string {
  if (minDays === maxDays) return `${minDays} дн.`;
  return `${minDays}–${maxDays} дн.`;
}

export const DEFAULT_ITEM_WEIGHT_GRAMS = 350;

export function estimateCartWeightGrams(itemCount: number): number {
  return Math.max(300, itemCount * DEFAULT_ITEM_WEIGHT_GRAMS);
}
