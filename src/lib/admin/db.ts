import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AdminCustomer, AdminDatabase, DashboardStats } from "@/lib/admin/types";
import { seedDatabase } from "@/lib/admin/seed";
import { mergeSiteSettings } from "@/lib/admin/site-merge";

export const DB_DIR = path.join(process.cwd(), ".data");
export const DB_PATH = path.join(DB_DIR, "admin-db.json");

function normalizeDb(partial: Partial<AdminDatabase>): AdminDatabase {
  const seed = seedDatabase();
  return {
    version: 3,
    updatedAt: partial.updatedAt ?? seed.updatedAt,
    products: partial.products?.length ? partial.products : seed.products,
    categories: partial.categories?.length ? partial.categories : seed.categories,
    site: mergeSiteSettings(partial.site),
    blog: partial.blog?.length ? partial.blog : seed.blog,
    orders: partial.orders ?? seed.orders,
    reviews: partial.reviews ?? seed.reviews,
    promos: partial.promos ?? seed.promos,
  };
}

async function ensureDir() {
  await mkdir(DB_DIR, { recursive: true });
}

export async function readDb(): Promise<AdminDatabase> {
  try {
    const raw = await readFile(DB_PATH, "utf-8");
    return normalizeDb(JSON.parse(raw) as Partial<AdminDatabase>);
  } catch {
    const db = seedDatabase();
    await writeDb(db);
    return db;
  }
}

export async function writeDb(db: AdminDatabase) {
  await ensureDir();
  db.updatedAt = new Date().toISOString();
  const json = JSON.stringify(db, null, 2);
  const tmp = `${DB_PATH}.${process.pid}.tmp`;
  await writeFile(tmp, json, "utf-8");
  await rename(tmp, DB_PATH);
}

export async function updateDb(mutator: (db: AdminDatabase) => void) {
  const db = await readDb();
  mutator(db);
  await writeDb(db);
  return db;
}

export function deriveCustomers(orders: AdminDatabase["orders"]): AdminCustomer[] {
  const map = new Map<string, AdminCustomer>();

  for (const order of orders) {
    const key = order.customerEmail.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      if (order.date > existing.lastOrderDate) existing.lastOrderDate = order.date;
      if (order.customerName) existing.name = order.customerName;
      if (order.customerPhone) existing.phone = order.customerPhone;
    } else {
      map.set(key, {
        id: key.replace(/[^a-z0-9]/gi, "-"),
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.date,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

export function computeDashboardStats(db: AdminDatabase): DashboardStats {
  const revenue = db.orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const ordersPending = db.orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;

  const lowStock = db.products.filter((p) => p.stock <= 10).length;
  const reviewsPending = db.reviews.filter((r) => !r.published).length;

  const dayMap = new Map<string, { revenue: number; orders: number }>();
  for (const order of db.orders) {
    if (order.status === "cancelled") continue;
    const day = order.date;
    const entry = dayMap.get(day) ?? { revenue: 0, orders: 0 };
    entry.revenue += order.total;
    entry.orders += 1;
    dayMap.set(day, entry);
  }

  const revenueByDay = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, data]) => ({ date, ...data }));

  const productMap = new Map<string, { slug: string; name: string; qty: number; revenue: number }>();
  for (const order of db.orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const entry = productMap.get(item.slug) ?? {
        slug: item.slug,
        name: item.name,
        qty: 0,
        revenue: 0,
      };
      entry.qty += item.qty;
      entry.revenue += item.price * item.qty;
      productMap.set(item.slug, entry);
    }
  }

  const topProducts = [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return {
    revenue,
    ordersTotal: db.orders.length,
    ordersPending,
    productsTotal: db.products.length,
    categoriesTotal: db.categories.length,
    lowStock,
    customersTotal: deriveCustomers(db.orders).length,
    reviewsPending,
    revenueByDay,
    topProducts,
  };
}
