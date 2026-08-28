import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import type { AdminBlogPost } from "@/lib/admin/types";
import { uniqueSlug } from "@/lib/admin/slug";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ posts: db.blog });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AdminBlogPost>;
  const title = body.title?.trim();
  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const slug =
      body.slug?.trim() ||
      uniqueSlug(title, (s) => data.blog.some((p) => p.slug === s));
    if (data.blog.some((p) => p.slug === slug)) throw new Error("exists");
    data.blog.unshift({
      slug,
      title: title,
      excerpt: body.excerpt?.trim() ?? "",
      body: body.body?.trim() ?? "",
      date: body.date ?? new Date().toISOString().slice(0, 10),
      published: body.published ?? true,
    });
  }).catch(() => null);

  if (!db) return NextResponse.json({ error: "Slug exists" }, { status: 409 });
  return NextResponse.json({ post: db.blog[0] }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<AdminBlogPost> & { slug: string };
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const db = await updateDb((data) => {
    const post = data.blog.find((p) => p.slug === body.slug);
    if (!post) return;
    Object.assign(post, { ...body, slug: post.slug });
  });

  const post = db.blog.find((p) => p.slug === body.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { slug: string };
  if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  await updateDb((data) => {
    data.blog = data.blog.filter((p) => p.slug !== body.slug);
  });
  return NextResponse.json({ ok: true });
}
