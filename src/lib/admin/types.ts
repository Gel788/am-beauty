import type { CategoryMeta } from "@/data/types";
import type { DeliverySelection } from "@/lib/delivery/types";
import type { OrderStatus } from "@/store/account-store";
import type { Product, Review } from "@/data/types";

export type AdminProduct = Product & {
  stock: number;
  published: boolean;
};

export type AdminCategory = CategoryMeta & {
  published: boolean;
  sortOrder: number;
};

export type AdminSiteSettings = {
  brand: string;
  tagline: string;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  email: string;
  phone: string;
  phoneHref: string;
  workingHours: string;
  freeShippingThreshold: number;
  shippingCost: number;
};

export type AdminOrderItem = {
  slug: string;
  name: string;
  qty: number;
  price: number;
  image: string;
};

export type AdminOrder = {
  id: string;
  date: string;
  status: OrderStatus;
  items: AdminOrderItem[];
  delivery: DeliverySelection;
  payment: "card" | "sbp";
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  trackingNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

export type AdminPromo = {
  code: string;
  discountPercent: number;
  active: boolean;
  uses: number;
};

export type AdminReview = Review & {
  published: boolean;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
};

export type AdminDatabase = {
  version: number;
  updatedAt: string;
  products: AdminProduct[];
  categories: AdminCategory[];
  site: AdminSiteSettings;
  orders: AdminOrder[];
  reviews: AdminReview[];
  promos: AdminPromo[];
};

export type DashboardStats = {
  revenue: number;
  ordersTotal: number;
  ordersPending: number;
  productsTotal: number;
  categoriesTotal: number;
  lowStock: number;
  customersTotal: number;
  reviewsPending: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topProducts: { slug: string; name: string; qty: number; revenue: number }[];
};

export type PublicCatalog = {
  products: Product[];
  categories: AdminCategory[];
  reviews: Review[];
  site: AdminSiteSettings;
};
