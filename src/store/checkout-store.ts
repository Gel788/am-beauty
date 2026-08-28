import { create } from "zustand";
import type { DeliveryCarrier, DeliveryMode, DeliveryTariff, PickupPoint } from "@/lib/delivery/types";

type CheckoutState = {
  carrier: DeliveryCarrier | null;
  mode: DeliveryMode;
  tariff: DeliveryTariff | null;
  tariffs: DeliveryTariff[];
  tariffsLoading: boolean;
  pickupPoint: PickupPoint | null;
  pickupPoints: PickupPoint[];
  pickupPointsLoading: boolean;
  city: string;
  postalCode: string;
  address: string;
  setCarrier: (carrier: DeliveryCarrier) => void;
  setMode: (mode: DeliveryMode) => void;
  setTariff: (tariff: DeliveryTariff | null) => void;
  setTariffs: (tariffs: DeliveryTariff[]) => void;
  setTariffsLoading: (loading: boolean) => void;
  setPickupPoint: (point: PickupPoint | null) => void;
  setPickupPoints: (points: PickupPoint[]) => void;
  setPickupPointsLoading: (loading: boolean) => void;
  setCity: (city: string) => void;
  setPostalCode: (postalCode: string) => void;
  setAddress: (address: string) => void;
  resetDelivery: () => void;
};

const initialDelivery = {
  carrier: null as DeliveryCarrier | null,
  mode: "courier" as DeliveryMode,
  tariff: null as DeliveryTariff | null,
  tariffs: [] as DeliveryTariff[],
  tariffsLoading: false,
  pickupPoint: null as PickupPoint | null,
  pickupPoints: [] as PickupPoint[],
  pickupPointsLoading: false,
  city: "",
  postalCode: "",
  address: "",
};

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...initialDelivery,

  setCarrier: (carrier) => {
    const { tariffs, mode } = get();
    const match = tariffs.find((t) => t.carrier === carrier && t.mode === mode)
      ?? tariffs.find((t) => t.carrier === carrier);
    set({
      carrier,
      tariff: match ?? null,
      mode: match?.mode ?? mode,
      pickupPoint: null,
    });
  },

  setMode: (mode) => {
    const { carrier, tariffs } = get();
    const match = carrier
      ? tariffs.find((t) => t.carrier === carrier && t.mode === mode)
      : null;
    set({
      mode,
      tariff: match ?? null,
      pickupPoint: mode === "courier" ? null : get().pickupPoint,
    });
  },

  setTariff: (tariff) =>
    set({
      tariff,
      carrier: tariff?.carrier ?? null,
      mode: tariff?.mode ?? get().mode,
    }),

  setTariffs: (tariffs) => set({ tariffs }),
  setTariffsLoading: (tariffsLoading) => set({ tariffsLoading }),
  setPickupPoint: (pickupPoint) => set({ pickupPoint }),
  setPickupPoints: (pickupPoints) => set({ pickupPoints }),
  setPickupPointsLoading: (pickupPointsLoading) => set({ pickupPointsLoading }),
  setCity: (city) => set({ city }),
  setPostalCode: (postalCode) => set({ postalCode }),
  setAddress: (address) => set({ address }),
  resetDelivery: () => set(initialDelivery),
}));
