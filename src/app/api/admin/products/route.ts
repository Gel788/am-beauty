import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import type { AdminProduct } from "@/lib/admin/types";
import { uniqueSlug } from "@/lib/admin/slug";

type ProductInput = Partial<AdminProduct> & { name?: string; slug?: string };

function defaultProduct(slug: string, name: string): AdminProduct {
  return {
    id: String(Date.now()),
    slug,
    name,
    shortName: name,
    category: "serums",
    line: "glow",
    skinTypes: ["all"],
    note: "",
    volume: "30 мл",
    actives: "",
    price: 5000,
    image: "/images/hero-v2.jpg",
    gallery: ["/images/hero-v2.jpg"],
    description: "",
    benefits: [],
    ingredients: [],
    howToUse: [],
    skinTypeLabel: "Все типы",
    rating: 5,
    reviewCount: 0,
    relatedSlugs: [],
    bundleSlugs: [],
    stock: 10,
    published: false,
  };
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ products: db.products });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductInput;
    const name = body.name?.trim();
    if (!name) {
      return NextResponse.json({ error: "Укажите название" }, { status: 400 });
    }

    const image = body.image?.trim() || body.gallery?.[0];
    if (!image) {
      return NextResponse.json({ error: "Добавьте фото товара" }, { status: 400 });
    }

    let createdSlug = "";

    const db = await updateDb((data) => {
      const slug =
        body.slug?.trim() ||
        uniqueSlug(name, (s) => data.products.some((p) => p.slug === s));

      if (data.products.some((p) => p.slug === slug)) {
        throw new Error("SLUG_EXISTS");
      }

      createdSlug = slug;
      const base = defaultProduct(slug, name);
      const product: AdminProduct = {
        ...base,
        ...body,
        slug,
        name,
        shortName: body.shortName?.trim() || name,
        image,
        video: body.video?.trim() || undefined,
        gallery: body.gallery?.length ? body.gallery : [image],
        benefits: body.benefits ?? base.benefits,
        ingredients: body.ingredients ?? base.ingredients,
        howToUse: body.howToUse ?? base.howToUse,
        relatedSlugs: body.relatedSlugs ?? base.relatedSlugs,
        bundleSlugs: body.bundleSlugs ?? base.bundleSlugs,
        skinTypes: body.skinTypes ?? base.skinTypes,
        published: body.published ?? true,
      };
      data.products.push(product);
    });

    const product = db.products.find((p) => p.slug === createdSlug) ?? db.products.at(-1);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "SAVE_FAILED";
    if (message === "SLUG_EXISTS") {
      return NextResponse.json({ error: "Товар с таким slug уже есть" }, { status: 409 });
    }
    console.error("[admin/products POST]", err);
    return NextResponse.json(
      { error: "Не удалось сохранить товар на сервере. Попробуйте ещё раз." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as ProductInput & { slug: string };
  if (!body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  try {
    const db = await updateDb((data) => {
      const index = data.products.findIndex((p) => p.slug === body.slug);
      if (index === -1) throw new Error("NOT_FOUND");
      const current = data.products[index];
      data.products[index] = {
        ...current,
        ...body,
        slug: body.slug,
        video:
          "video" in body ? body.video?.trim() || undefined : current.video,
      } as AdminProduct;
    });

    const product = db.products.find((p) => p.slug === body.slug);
    return NextResponse.json({ product });
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("[admin/products PATCH]", err);
    return NextResponse.json({ error: "Не удалось сохранить" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { slug: string };
  if (!body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  try {
    await updateDb((data) => {
      data.products = data.products.filter((p) => p.slug !== body.slug);
      for (const p of data.products) {
        p.relatedSlugs = p.relatedSlugs.filter((s) => s !== body.slug);
        p.bundleSlugs = p.bundleSlugs.filter((s) => s !== body.slug);
      }
      data.reviews = data.reviews.filter((r) => r.productSlug !== body.slug);
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/products DELETE]", err);
    return NextResponse.json({ error: "Не удалось удалить" }, { status: 500 });
  }
}
