import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliverySelection } from "@/lib/delivery/types";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type AccountProfile = {
  name: string;
  email: string;
  phone: string;
};

export type AccountAddress = {
  id: string;
  label: string;
  city: string;
  address: string;
  postalCode?: string;
  isDefault: boolean;
};

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  price: number;
  image: string;
};

export type AccountOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  delivery: DeliverySelection;
  payment: "card" | "sbp";
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  trackingNumber?: string;
};

type AccountState = {
  profile: AccountProfile;
  addresses: AccountAddress[];
  orders: AccountOrder[];
  updateProfile: (profile: Partial<AccountProfile>) => void;
  addAddress: (address: Omit<AccountAddress, "id" | "isDefault">) => void;
  updateAddress: (id: string, patch: Partial<Omit<AccountAddress, "id">>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: AccountOrder) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
};

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

const defaultProfile: AccountProfile = {
  name: "",
  email: "",
  phone: "",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Ожидает",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      addresses: [],
      orders: [],

      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      addAddress: (address) =>
        set((state) => {
          const isFirst = state.addresses.length === 0;
          const newAddress: AccountAddress = {
            ...address,
            id: generateId("addr"),
            isDefault: isFirst,
          };
          return { addresses: [...state.addresses, newAddress] };
        }),

      updateAddress: (id, patch) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      removeAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((a) => a.id !== id);
          const removed = state.addresses.find((a) => a.id === id);
          if (removed?.isDefault && remaining.length > 0) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { addresses: remaining };
        }),

      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: "am-beauty-account" },
  ),
);
