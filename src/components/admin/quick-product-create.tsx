"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { MediaField } from "@/components/admin/media-field";
import { MediaGallery } from "@/components/admin/media-gallery";
import type { AdminCategory } from "@/lib/admin/types";

type Props = {
  categories: AdminCategory[];
  onCreated: () => void;
};

export function QuickProductCreate({ categories, onCreated }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: 5000,
    category: categories[0]?.id ?? "serums",
    image: "",
    gallery: [] as string[],
    video: "",
  });

  const create = async () => {
    if (!form.name.trim()) {
      toast.error("Укажите название");
      return;
    }
    const image = form.image || form.gallery[0];
    if (!image) {
      toast.error("Добавьте хотя бы одно фото");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        shortName: form.name.trim(),
        category: form.category,
        price: form.price,
        image,
        gallery: form.gallery.length ? form.gallery : [image],
        video: form.video || undefined,
        published: true,
        stock: 10,
        description: "",
        note: "",
        actives: "",
      }),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(data.error ?? "Не удалось создать");
      return;
    }
    toast.success("Товар создан");
    setOpen(false);
    setForm({
      name: "",
      price: 5000,
      category: categories[0]?.id ?? "serums",
      image: "",
      gallery: [],
      video: "",
    });
    onCreated();
    router.push(`/admin/products/${data.product.slug}`);
  };

  if (!open) {
    return (
      <AdminButton onClick={() => setOpen(true)} className="w-full sm:w-auto">
        Быстрое добавление
      </AdminButton>
    );
  }

  return (
    <AdminPanel title="Быстрое добавление товара">
      <div className="space-y-5">
        <AdminGrid>
          <AdminField label="Название">
            <AdminInput
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Например, Peptide Dew"
            />
          </AdminField>
          <AdminField label="Цена, ₽">
            <AdminInput
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            />
          </AdminField>
          <AdminField label="Категория">
            <AdminSelect
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </AdminSelect>
          </AdminField>
        </AdminGrid>
        <MediaGallery
          label="Фото"
          images={form.gallery}
          mainImage={form.image || form.gallery[0]}
          onChange={(gallery) =>
            setForm((f) => ({
              ...f,
              gallery,
              image: f.image && gallery.includes(f.image) ? f.image : gallery[0] ?? "",
            }))
          }
          onMainChange={(url) => setForm((f) => ({ ...f, image: url }))}
        />
        <MediaField
          label="Видео (необязательно)"
          accept="video"
          value={form.video}
          onChange={(url) => setForm((f) => ({ ...f, video: url }))}
          hint="MP4 предпочтительнее MOV — лучше работает в Chrome"
        />
        <div className="flex flex-wrap gap-3">
          <AdminButton onClick={create} disabled={saving}>
            {saving ? "Создание…" : "Создать и открыть"}
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => setOpen(false)}>
            Отмена
          </AdminButton>
        </div>
      </div>
    </AdminPanel>
  );
}
