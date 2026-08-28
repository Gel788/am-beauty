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
  selectTariff: (tariff: DeliveryTariff | null) => void;
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
  clearQuote: () => void;
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

function sameTariffs(a: DeliveryTariff[], b: DeliveryTariff[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (t, i) =>
      t.carrier === b[i]?.carrier &&
      t.mode === b[i]?.mode &&
      t.price === b[i]?.price &&
      t.minDays === b[i]?.minDays &&
      t.maxDays === b[i]?.maxDays,
  );
}

function samePickupPoints(a: PickupPoint[], b: PickupPoint[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((p, i) => p.id === b[i]?.id);
}

export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  ...initialDelivery,

  selectTariff: (tariff) => {
    if (!tariff) {
      const { carrier, tariff: current } = get();
      if (!carrier && !current) return;
      set({ carrier: null, tariff: null, pickupPoint: null });
      return;
    }
    const { carrier, mode, tariff: current } = get();
    if (
      carrier === tariff.carrier &&
      mode === tariff.mode &&
      current?.price === tariff.price &&
      current?.minDays === tariff.minDays &&
      current?.maxDays === tariff.maxDays
    ) {
      return;
    }
    set({
      carrier: tariff.carrier,
      mode: tariff.mode,
      tariff,
      pickupPoint: null,
    });
  },

  setCarrier: (carrier) => {
    const { tariffs, mode, carrier: currentCarrier } = get();
    if (currentCarrier === carrier) return;
    const match =
      tariffs.find((t) => t.carrier === carrier && t.mode === mode) ??
      tariffs.find((t) => t.carrier === carrier);
    set({
      carrier,
      tariff: match ?? null,
      mode: match?.mode ?? mode,
      pickupPoint: null,
    });
  },

  setMode: (mode) => {
    const { carrier, tariffs, mode: currentMode } = get();
    if (currentMode === mode) return;
    const match = carrier ? tariffs.find((t) => t.carrier === carrier && t.mode === mode) : null;
    set({
      mode,
      tariff: match ?? null,
      pickupPoint: mode === "courier" ? null : get().pickupPoint,
    });
  },

  setTariff: (tariff) => get().selectTariff(tariff),

  setTariffs: (tariffs) => {
    if (sameTariffs(get().tariffs, tariffs)) return;
    set({ tariffs });
  },

  setTariffsLoading: (tariffsLoading) => {
    if (get().tariffsLoading === tariffsLoading) return;
    set({ tariffsLoading });
  },

  setPickupPoint: (pickupPoint) => {
    if (get().pickupPoint?.id === pickupPoint?.id) return;
    set({ pickupPoint });
  },

  setPickupPoints: (pickupPoints) => {
    if (samePickupPoints(get().pickupPoints, pickupPoints)) return;
    set({ pickupPoints });
  },

  setPickupPointsLoading: (pickupPointsLoading) => {
    if (get().pickupPointsLoading === pickupPointsLoading) return;
    set({ pickupPointsLoading });
  },

  setCity: (city) => {
    if (get().city === city) return;
    set({ city });
  },

  setPostalCode: (postalCode) => {
    if (get().postalCode === postalCode) return;
    set({ postalCode });
  },

  setAddress: (address) => {
    if (get().address === address) return;
    set({ address });
  },

  clearQuote: () =>
    set({
      carrier: null,
      tariff: null,
      tariffs: [],
      tariffsLoading: false,
      pickupPoint: null,
      pickupPoints: [],
      pickupPointsLoading: false,
    }),

  resetDelivery: () => set(initialDelivery),
}));
