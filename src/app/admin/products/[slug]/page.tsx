"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";

export default function AdminEditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([productsRes, categoriesRes]) => {
      setCategories(categoriesRes.categories);
      setProduct(productsRes.products.find((p: AdminProduct) => p.slug === slug) ?? null);
    });
  }, [slug]);

  if (!product) {
    return (
      <AdminShell title="Товар" description="Загрузка…">
        <p className="text-sm text-grey">Загрузка…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={product.name} description={`Редактирование · ${product.slug}`}>
      <ProductForm mode="edit" product={product} categories={categories} />
    </AdminShell>
  );
}
