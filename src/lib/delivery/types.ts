export type DeliveryCarrier = "cdek" | "russian_post" | "yandex";

export type DeliveryMode = "courier" | "pickup";

export type PickupPoint = {
  id: string;
  carrier: DeliveryCarrier;
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  schedule?: string;
};

export type DeliveryTariff = {
  carrier: DeliveryCarrier;
  mode: DeliveryMode;
  price: number;
  minDays: number;
  maxDays: number;
  label: string;
  estimated?: boolean;
};

export type DeliverySelection = {
  carrier: DeliveryCarrier;
  mode: DeliveryMode;
  price: number;
  minDays: number;
  maxDays: number;
  city: string;
  postalCode?: string;
  address?: string;
  pickupPoint?: PickupPoint;
};

export type TariffRequest = {
  city: string;
  postalCode?: string;
  weightGrams: number;
  dimensions?: { length: number; width: number; height: number };
  subtotal: number;
};

export type PickupPointsRequest = {
  carrier: DeliveryCarrier;
  city: string;
  postalCode?: string;
};

export const CARRIER_LABELS: Record<DeliveryCarrier, string> = {
  cdek: "СДЭК",
  russian_post: "Почта России",
  yandex: "Яндекс Доставка",
};

export const MODE_LABELS: Record<DeliveryMode, string> = {
  courier: "Курьер",
  pickup: "ПВЗ / отделение",
};
