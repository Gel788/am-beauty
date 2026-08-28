"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import type { AdminCategory } from "@/lib/admin/types";

export default function AdminNewProductPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories));
  }, []);

  return (
    <AdminShell title="Новый товар" description="Полная карточка товара">
      <ProductForm mode="create" categories={categories} />
    </AdminShell>
  );
}
