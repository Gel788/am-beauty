import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import type { AdminCategory } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({
    categories: [...db.categories].sort((a, b) => a.sortOrder - b.sortOrder),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AdminCategory>;
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const id = body.id?.trim() || slugify(body.title);
  if (!id) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    if (data.categories.some((c) => c.id === id)) {
      throw new Error("exists");
    }
    data.categories.push({
      id,
      title: body.title!.trim(),
      description: body.description?.trim() ?? "",
      image: body.image?.trim() || "/images/hero-v2.jpg",
      published: body.published ?? true,
      sortOrder: body.sortOrder ?? data.categories.length,
    });
  }).catch(() => null);

  if (!db) {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }

  const category = db.categories.find((c) => c.id === id);
  return NextResponse.json({ category }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<AdminCategory> & { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const category = data.categories.find((c) => c.id === body.id);
    if (!category) return;
    if (body.title !== undefined) category.title = body.title;
    if (body.description !== undefined) category.description = body.description;
    if (body.image !== undefined) category.image = body.image;
    if (body.published !== undefined) category.published = body.published;
    if (body.sortOrder !== undefined) category.sortOrder = body.sortOrder;
  });

  const category = db.categories.find((c) => c.id === body.id);
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ category });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const used = data.products.some((p) => p.category === body.id);
    if (used) throw new Error("in_use");
    data.categories = data.categories.filter((c) => c.id !== body.id);
  }).catch(() => null);

  if (!db) {
    return NextResponse.json(
      { error: "Категория используется товарами" },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
