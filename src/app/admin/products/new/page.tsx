"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import type { AdminCategory } from "@/lib/admin/types";

export default function AdminNewProductPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminShell title="Новый товар" description="Загрузка…">
        <p className="text-sm text-grey">Загрузка категорий…</p>
      </AdminShell>
    );
  }

  if (!categories.length) {
    return (
      <AdminShell title="Новый товар" description="Сначала создайте категорию">
        <p className="text-sm text-grey">
          Нет категорий. Добавьте хотя бы одну в разделе «Категории», затем вернитесь сюда.
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Новый товар" description="Заполните карточку и нажмите «Создать»">
      <ProductForm key="new" mode="create" categories={categories} />
    </AdminShell>
  );
}
