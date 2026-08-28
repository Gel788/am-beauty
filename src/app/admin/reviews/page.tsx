"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/admin-form";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminProduct, AdminReview } from "@/lib/admin/types";
import { formatAdminDate } from "@/lib/admin/format";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState({
    productSlug: "",
    author: "",
    rating: 5,
    text: "",
  });

  const load = () => {
    Promise.all([
      fetch("/api/admin/reviews").then((r) => r.json()),
      fetch("/api/admin/products").then((r) => r.json()),
    ]).then(([reviewsRes, productsRes]) => {
      setReviews(reviewsRes.reviews);
      setProducts(productsRes.products);
      if (!form.productSlug && productsRes.products[0]) {
        setForm((f) => ({ ...f, productSlug: productsRes.products[0].slug }));
      }
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async (id: string, published: boolean) => {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, published }),
    });
    if (res.ok) {
      toast.success(published ? "Отзыв опубликован" : "Отзыв скрыт");
      load();
    }
  };

  const create = async () => {
    if (!form.author.trim() || !form.text.trim() || !form.productSlug) {
      toast.error("Заполните все поля");
      return;
    }
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Отзыв добавлен");
      setForm((f) => ({ ...f, author: "", text: "" }));
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    const res = await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Удалено");
      load();
    }
  };

  return (
    <AdminShell title="Отзывы" description="Модерация и добавление отзывов">
      <div className="space-y-6">
        <AdminPanel title="Новый отзыв">
          <AdminGrid>
            <AdminField label="Товар">
              <AdminSelect
                value={form.productSlug}
                onChange={(e) => setForm((f) => ({ ...f, productSlug: e.target.value }))}
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.shortName}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Автор">
              <AdminInput
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Оценка">
              <AdminInput
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              />
            </AdminField>
            <AdminField label="Текст" className="md:col-span-2">
              <AdminTextarea
                value={form.text}
                onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              />
            </AdminField>
          </AdminGrid>
          <AdminButton className="mt-5" onClick={create}>
            Добавить отзыв
          </AdminButton>
        </AdminPanel>

        <AdminPanel>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>Автор</AdminTh>
                <AdminTh>Товар</AdminTh>
                <AdminTh>Оценка</AdminTh>
                <AdminTh>Текст</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <AdminTd>
                    <p className="text-sm">{review.author}</p>
                    <p className="text-xs text-grey">{formatAdminDate(review.date)}</p>
                  </AdminTd>
                  <AdminTd>
                    <p className="text-[11px] tracking-[0.12em] uppercase">{review.productSlug}</p>
                  </AdminTd>
                  <AdminTd>
                    <span className="font-display text-lg text-gold">{review.rating}</span>
                  </AdminTd>
                  <AdminTd>
                    <p className="max-w-md text-sm leading-relaxed text-charcoal">«{review.text}»</p>
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => toggle(review.id, !review.published)}
                      className="cursor-pointer"
                    >
                      <AdminBadge variant={review.published ? "gold" : "muted"}>
                        {review.published ? "Опубликован" : "Скрыт"}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => remove(review.id)}
                      className="cursor-pointer text-grey hover:text-red-600"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
