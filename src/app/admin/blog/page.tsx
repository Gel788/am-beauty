"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/admin-form";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminBlogPost } from "@/lib/admin/types";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const load = () => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.title.trim()) {
      toast.error("Укажите заголовок");
      return;
    }
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published: true }),
    });
    if (res.ok) {
      toast.success("Статья создана");
      setForm({ title: "", excerpt: "", body: "", date: new Date().toISOString().slice(0, 10) });
      load();
    } else {
      toast.error("Не удалось создать");
    }
  };

  const toggle = async (slug: string, published: boolean) => {
    const res = await fetch("/api/admin/blog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, published }),
    });
    if (res.ok) {
      toast.success(published ? "Опубликовано" : "Скрыто");
      load();
    }
  };

  const remove = async (slug: string) => {
    if (!confirm("Удалить статью?")) return;
    const res = await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      toast.success("Удалено");
      load();
    }
  };

  return (
    <AdminShell title="Блог" description="Статьи на сайте">
      <div className="space-y-6">
        <AdminPanel title="Новая статья">
          <div className="space-y-5">
            <AdminField label="Заголовок">
              <AdminInput
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Краткое описание">
              <AdminTextarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Текст">
              <AdminTextarea
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                className="min-h-[160px]"
              />
            </AdminField>
            <AdminGrid>
              <AdminField label="Дата">
                <AdminInput
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </AdminField>
            </AdminGrid>
            <AdminButton onClick={create}>Создать</AdminButton>
          </div>
        </AdminPanel>

        <AdminPanel title="Все статьи">
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>Заголовок</AdminTh>
                <AdminTh>Дата</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug} className="border-t border-black/10">
                  <AdminTd>
                    <p className="font-medium">{post.title}</p>
                    <p className="mt-1 text-xs text-grey">/blog/{post.slug}</p>
                  </AdminTd>
                  <AdminTd>{post.date}</AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => toggle(post.slug, !post.published)}
                    >
                      <AdminBadge variant={post.published ? "gold" : "muted"}>
                        {post.published ? "Опубликовано" : "Скрыто"}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.slug}`}
                        className="inline-flex size-9 items-center justify-center border border-black/15 hover:border-black/30"
                        aria-label="Редактировать"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        className="inline-flex size-9 cursor-pointer items-center justify-center border border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => remove(post.slug)}
                        aria-label="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </AdminTd>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
