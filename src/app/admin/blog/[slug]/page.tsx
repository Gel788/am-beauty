"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import type { AdminBlogPost } from "@/lib/admin/types";

export default function AdminBlogEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.posts as AdminBlogPost[]).find((p) => p.slug === slug);
        setPost(found ?? null);
      });
  }, [slug]);

  const save = async () => {
    if (!post) return;
    setSaving(true);
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Сохранено");
      router.push("/admin/blog");
    } else toast.error("Ошибка");
  };

  if (!post) {
    return (
      <AdminShell title="Блог" description="Загрузка…">
        <p className="text-sm text-grey">Загрузка…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Редактирование статьи" description={post.slug}>
      <div className="mx-auto max-w-3xl space-y-6">
        <AdminPanel title={post.title}>
          <div className="space-y-5">
            <AdminField label="Заголовок">
              <AdminInput
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </AdminField>
            <AdminField label="Краткое описание">
              <AdminTextarea
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              />
            </AdminField>
            <AdminField label="Текст">
              <AdminTextarea
                value={post.body}
                onChange={(e) => setPost({ ...post, body: e.target.value })}
                className="min-h-[240px]"
              />
            </AdminField>
            <AdminGrid>
              <AdminField label="Дата">
                <AdminInput
                  type="date"
                  value={post.date}
                  onChange={(e) => setPost({ ...post, date: e.target.value })}
                />
              </AdminField>
            </AdminGrid>
          </div>
        </AdminPanel>
        <div className="flex gap-3">
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => router.push("/admin/blog")}>
            Назад
          </AdminButton>
        </div>
      </div>
    </AdminShell>
  );
}
