"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminReview } from "@/lib/admin/types";
import { formatAdminDate } from "@/lib/admin/format";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);

  const load = () => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews));
  };

  useEffect(() => {
    load();
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

  return (
    <AdminShell title="Отзывы" description="Модерация отзывов покупателей">
      <AdminPanel>
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Автор</AdminTh>
              <AdminTh>Товар</AdminTh>
              <AdminTh>Оценка</AdminTh>
              <AdminTh>Текст</AdminTh>
              <AdminTh>Статус</AdminTh>
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
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>
    </AdminShell>
  );
}
