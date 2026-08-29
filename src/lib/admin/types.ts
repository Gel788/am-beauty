import type { CategoryMeta } from "@/data/types";
import type { DeliverySelection } from "@/lib/delivery/types";
import type { OrderStatus } from "@/store/account-store";
import type { Product, Review } from "@/data/types";

export type AdminLink = {
  label: string;
  href: string;
};

export type AdminCompanyInfo = {
  legalName: string;
  shortLegalName: string;
  inn: string;
  ogrnip: string;
  okved: string;
  legalAddress: string;
  postalAddress: string;
  bankName: string;
  bik: string;
  account: string;
  corrAccount: string;
  headName: string;
  supportResponse: string;
  siteUrl: string;
};

export type AdminHomeContent = {
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta: string;
  heroFootnote: string;
  manifestoLabel: string;
  manifestoTitle: string;
  manifestoText: string;
  manifestoImage: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredHint: string;
  categoriesTitle: string;
  ritualSteps: { num: string; title: string; text: string }[];
  ritualImage: string;
  benefits: { title: string; text: string }[];
  newsletterTitle: string;
  newsletterText: string;
};

export type AdminAboutContent = {
  label: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  image: string;
  badges: string[];
};

export type AdminContactsContent = {
  title: string;
  faq: { q: string; a: string }[];
};

export type AdminCatalogContent = {
  label: string;
  defaultTitle: string;
  defaultDescription: string;
};

export type AdminBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  published: boolean;
};

export type AdminSiteSettings = {
  brand: string;
  tagline: string;
  email: string;
  phone: string;
  phoneHref: string;
  workingHours: string;
  freeShippingThreshold: number;
  shippingCost: number;
  footerTagline: string;
  marquee: string[];
  nav: AdminLink[];
  company: AdminCompanyInfo;
  home: AdminHomeContent;
  about: AdminAboutContent;
  contacts: AdminContactsContent;
  catalog: AdminCatalogContent;
};

export type AdminProduct = Product & {
  stock: number;
  published: boolean;
};

export type AdminCategory = CategoryMeta & {
  published: boolean;
  sortOrder: number;
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

export type AdminInquiry = {
  id: string;
  type: "contact" | "newsletter";
  name?: string;
  email: string;
  message?: string;
  createdAt: string;
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
  blog: AdminBlogPost[];
  orders: AdminOrder[];
  reviews: AdminReview[];
  promos: AdminPromo[];
  inquiries: AdminInquiry[];
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
  blog: AdminBlogPost[];
  site: AdminSiteSettings;
};
