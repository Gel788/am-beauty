"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { QuickProductCreate } from "@/components/admin/quick-product-create";
import {
  AdminBadge,
  AdminPanel,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/components/admin/admin-ui";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  const load = () => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([productsRes, categoriesRes]) => {
      setProducts(productsRes.products);
      setCategories(categoriesRes.categories);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const patchProduct = async (slug: string, patch: Record<string, unknown>) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...patch }),
    });
    if (res.ok) {
      toast.success("Товар обновлён");
      load();
    }
  };

  return (
    <AdminShell
      title="Товары"
      description="Быстрое редактирование и полные карточки"
    >
      <div className="space-y-6">
        {categories.length > 0 ? (
          <QuickProductCreate categories={categories} onCreated={load} />
        ) : null}
      <AdminPanel
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 border border-black/15 px-4 py-2 text-[10px] tracking-[0.14em] uppercase hover:border-gold hover:text-gold"
          >
            <Plus className="size-3.5" />
            Новый товар
          </Link>
        }
      >
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Товар</AdminTh>
              <AdminTh>Цена</AdminTh>
              <AdminTh>Остаток</AdminTh>
              <AdminTh>Статус</AdminTh>
              <AdminTh>Бейдж</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.slug}>
                <AdminTd>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 border border-black/10 bg-cream">
                      <div className="absolute inset-1">
                        <Image src={product.image} alt="" fill className="object-contain object-bottom" sizes="48px" />
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="text-[11px] tracking-[0.12em] uppercase hover:text-gold"
                      >
                        {product.shortName}
                      </Link>
                      <p className="text-xs text-grey">{product.volume}</p>
                    </div>
                  </div>
                </AdminTd>
                <AdminTd>
                  <input
                    type="number"
                    defaultValue={product.price}
                    className="h-9 w-28 border border-black/15 px-2 text-sm tabular-nums"
                    onBlur={(e) => {
                      const price = Number(e.target.value);
                      if (price !== product.price && price > 0) patchProduct(product.slug, { price });
                    }}
                  />
                </AdminTd>
                <AdminTd>
                  <input
                    type="number"
                    defaultValue={product.stock}
                    className={`h-9 w-20 border px-2 text-sm tabular-nums ${
                      product.stock <= 10 ? "border-gold bg-gold/5" : "border-black/15"
                    }`}
                    onBlur={(e) => {
                      const stock = Number(e.target.value);
                      if (stock !== product.stock && stock >= 0) patchProduct(product.slug, { stock });
                    }}
                  />
                </AdminTd>
                <AdminTd>
                  <button
                    type="button"
                    onClick={() => patchProduct(product.slug, { published: !product.published })}
                    className="cursor-pointer"
                  >
                    <AdminBadge variant={product.published ? "gold" : "muted"}>
                      {product.published ? "Опубликован" : "Скрыт"}
                    </AdminBadge>
                  </button>
                </AdminTd>
                <AdminTd>
                  <input
                    defaultValue={product.badge ?? ""}
                    placeholder="—"
                    className="h-9 w-28 border border-black/15 px-2 text-xs"
                    onBlur={(e) => {
                      const badge = e.target.value.trim() || null;
                      if (badge !== (product.badge ?? null)) patchProduct(product.slug, { badge });
                    }}
                  />
                  {product.isBestseller ? (
                    <span className="ml-2 inline-flex">
                      <AdminBadge variant="default">Hit</AdminBadge>
                    </span>
                  ) : null}
                </AdminTd>
                <AdminTd>
                  <Link
                    href={`/admin/products/${product.slug}`}
                    className="text-[10px] tracking-[0.14em] text-grey uppercase hover:text-gold"
                  >
                    Редактировать
                  </Link>
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
