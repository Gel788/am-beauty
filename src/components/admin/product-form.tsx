"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminSelect,
  AdminTextarea,
  joinLines,
  parseLines,
} from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { MediaField } from "@/components/admin/media-field";
import { MediaGallery } from "@/components/admin/media-gallery";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";
import type { ProductLine, SkinType } from "@/data/types";

const LINES: ProductLine[] = ["atelier", "glow", "pure"];
const SKIN_TYPES: SkinType[] = ["all", "dry", "oily", "combination", "sensitive"];

type ProductFormProps = {
  product?: AdminProduct;
  categories: AdminCategory[];
  mode: "create" | "edit";
};

export function ProductForm({ product, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<AdminProduct>>(
    product ?? {
      name: "",
      shortName: "",
      category: categories[0]?.id ?? "serums",
      line: "glow",
      skinTypes: ["all"],
      note: "",
      volume: "30 мл",
      actives: "",
      price: 5000,
      image: "/images/hero-v2.jpg",
      gallery: ["/images/hero-v2.jpg"],
      description: "",
      benefits: [],
      ingredients: [],
      howToUse: [],
      skinTypeLabel: "Все типы",
      rating: 5,
      reviewCount: 0,
      relatedSlugs: [],
      bundleSlugs: [],
      stock: 10,
      published: false,
    },
  );

  const set = <K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    if (!form.name?.trim()) {
      toast.error("Укажите название");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      shortName: form.shortName?.trim() || form.name.trim(),
      gallery: form.gallery?.length ? form.gallery : [form.image ?? "/images/hero-v2.jpg"],
    };

    const res = await fetch("/api/admin/products", {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mode === "create" ? payload : { ...payload, slug: product!.slug },
      ),
    });

    setSaving(false);
    if (!res.ok) {
      toast.error("Не удалось сохранить");
      return;
    }

    const data = await res.json();
    toast.success(mode === "create" ? "Товар создан" : "Сохранено");
    router.push(`/admin/products/${data.product.slug}`);
    router.refresh();
  };

  const remove = async () => {
    if (!product || !confirm("Удалить товар безвозвратно?")) return;
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: product.slug }),
    });
    if (res.ok) {
      toast.success("Товар удалён");
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <AdminPanel title="Основное">
        <AdminGrid>
          <AdminField label="Название">
            <AdminInput value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
          </AdminField>
          <AdminField label="Короткое имя">
            <AdminInput
              value={form.shortName ?? ""}
              onChange={(e) => set("shortName", e.target.value)}
            />
          </AdminField>
          <AdminField label="Категория">
            <AdminSelect
              value={form.category}
              onChange={(e) => set("category", e.target.value as AdminProduct["category"])}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Линия">
            <AdminSelect
              value={form.line}
              onChange={(e) => set("line", e.target.value as ProductLine)}
            >
              {LINES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
          <AdminField label="Цена, ₽">
            <AdminInput
              type="number"
              value={form.price ?? 0}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </AdminField>
          <AdminField label="Старая цена">
            <AdminInput
              type="number"
              value={form.compareAt ?? ""}
              onChange={(e) =>
                set("compareAt", e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </AdminField>
          <AdminField label="Остаток">
            <AdminInput
              type="number"
              value={form.stock ?? 0}
              onChange={(e) => set("stock", Number(e.target.value))}
            />
          </AdminField>
          <AdminField label="Объём">
            <AdminInput value={form.volume ?? ""} onChange={(e) => set("volume", e.target.value)} />
          </AdminField>
        </AdminGrid>
      </AdminPanel>

      <AdminPanel title="Медиа">
        <div className="space-y-6">
          <MediaField
            label="Главное фото"
            accept="image"
            value={form.image ?? ""}
            onChange={(url) => {
              set("image", url);
              if (!form.gallery?.length) set("gallery", url ? [url] : []);
            }}
          />
          <MediaField
            label="Видео товара"
            accept="video"
            value={form.video ?? ""}
            onChange={(url) => set("video", url || undefined)}
            hint="MP4, WebM или MOV — показывается в карточке товара"
          />
          <MediaGallery
            label="Галерея"
            images={form.gallery ?? []}
            mainImage={form.image}
            onChange={(gallery) => set("gallery", gallery)}
            onMainChange={(url) => set("image", url)}
          />
        </div>
      </AdminPanel>

      <AdminPanel title="Контент">
        <div className="space-y-5">
          <AdminField label="Описание">
            <AdminTextarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </AdminField>
          <AdminField label="Нота">
            <AdminInput value={form.note ?? ""} onChange={(e) => set("note", e.target.value)} />
          </AdminField>
          <AdminField label="Активы">
            <AdminInput value={form.actives ?? ""} onChange={(e) => set("actives", e.target.value)} />
          </AdminField>
          <AdminField label="Преимущества" hint="По одному на строку">
            <AdminTextarea
              value={joinLines(form.benefits ?? [])}
              onChange={(e) => set("benefits", parseLines(e.target.value))}
            />
          </AdminField>
          <AdminField label="Состав" hint="По одному на строку">
            <AdminTextarea
              value={joinLines(form.ingredients ?? [])}
              onChange={(e) => set("ingredients", parseLines(e.target.value))}
            />
          </AdminField>
          <AdminField label="Применение" hint="По одному на строку">
            <AdminTextarea
              value={joinLines(form.howToUse ?? [])}
              onChange={(e) => set("howToUse", parseLines(e.target.value))}
            />
          </AdminField>
        </div>
      </AdminPanel>

      <AdminPanel title="Связи и флаги">
        <AdminGrid>
          <AdminField label="Связанные товары (slug)" hint="По одному на строку">
            <AdminTextarea
              value={joinLines(form.relatedSlugs ?? [])}
              onChange={(e) => set("relatedSlugs", parseLines(e.target.value))}
            />
          </AdminField>
          <AdminField label="Бандл (slug)" hint="По одному на строку">
            <AdminTextarea
              value={joinLines(form.bundleSlugs ?? [])}
              onChange={(e) => set("bundleSlugs", parseLines(e.target.value))}
            />
          </AdminField>
          <AdminField label="Тип кожи (label)">
            <AdminInput
              value={form.skinTypeLabel ?? ""}
              onChange={(e) => set("skinTypeLabel", e.target.value)}
            />
          </AdminField>
          <AdminField label="Бейдж">
            <AdminInput
              value={form.badge ?? ""}
              onChange={(e) => set("badge", e.target.value || undefined)}
            />
          </AdminField>
          <AdminField label="Типы кожи (фильтр)">
            <div className="flex flex-wrap gap-2">
              {SKIN_TYPES.map((st) => {
                const active = form.skinTypes?.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? (form.skinTypes ?? []).filter((x) => x !== st)
                        : [...(form.skinTypes ?? []), st];
                      set("skinTypes", next.length ? next : ["all"]);
                    }}
                    className={`cursor-pointer border px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase ${
                      active ? "border-gold bg-gold/10 text-gold" : "border-black/15"
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </AdminField>
          <AdminField label="Публикация">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published ?? false}
                onChange={(e) => set("published", e.target.checked)}
              />
              Опубликован на сайте
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isBestseller ?? false}
                onChange={(e) => set("isBestseller", e.target.checked)}
              />
              Бестселлер
            </label>
          </AdminField>
        </AdminGrid>
      </AdminPanel>

      <div className="flex flex-wrap gap-3">
        <AdminButton onClick={save} disabled={saving}>
          {saving ? "Сохранение…" : mode === "create" ? "Создать" : "Сохранить"}
        </AdminButton>
        {mode === "edit" ? (
          <AdminButton variant="danger" onClick={remove}>
            Удалить
          </AdminButton>
        ) : null}
      </div>
    </div>
  );
}
