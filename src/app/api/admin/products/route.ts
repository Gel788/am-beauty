import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ products: db.products });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    slug: string;
    price?: number;
    compareAt?: number | null;
    stock?: number;
    published?: boolean;
    badge?: string | null;
    isBestseller?: boolean;
  };

  if (!body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const product = data.products.find((p) => p.slug === body.slug);
    if (!product) return;
    if (body.price !== undefined) product.price = body.price;
    if (body.compareAt !== undefined) product.compareAt = body.compareAt ?? undefined;
    if (body.stock !== undefined) product.stock = body.stock;
    if (body.published !== undefined) product.published = body.published;
    if (body.badge !== undefined) product.badge = body.badge ?? undefined;
    if (body.isBestseller !== undefined) product.isBestseller = body.isBestseller;
  });

  const product = db.products.find((p) => p.slug === body.slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
