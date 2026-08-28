"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/admin-form";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import { MediaField } from "@/components/admin/media-field";
import type { AdminCategory } from "@/lib/admin/types";

const emptyForm = { title: "", description: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<AdminCategory | null>(null);

  const load = () => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.title.trim()) {
      toast.error("Укажите название");
      return;
    }
    if (!form.image) {
      toast.error("Загрузите изображение");
      return;
    }
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Категория создана");
      setForm(emptyForm);
      load();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Ошибка");
    }
  };

  const patch = async (id: string, patch: Partial<AdminCategory>) => {
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (res.ok) {
      toast.success("Обновлено");
      load();
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Укажите название");
      return;
    }
    await patch(editing.id, {
      title: editing.title,
      description: editing.description,
      image: editing.image,
    });
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить категорию?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Удалено");
      load();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Ошибка");
    }
  };

  return (
    <AdminShell title="Категории" description="Разделы каталога — фото, порядок, публикация">
      <div className="space-y-6">
        <AdminPanel title="Новая категория">
          <AdminGrid>
            <AdminField label="Название">
              <AdminInput
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </AdminField>
            <div className="md:col-span-2">
              <MediaField
                label="Обложка"
                accept="image"
                value={form.image}
                onChange={(url) => setForm((f) => ({ ...f, image: url }))}
              />
            </div>
            <AdminField label="Описание" className="md:col-span-2">
              <AdminTextarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </AdminField>
          </AdminGrid>
          <AdminButton className="mt-5" onClick={create}>
            <Plus className="mr-2 inline size-4" />
            Добавить
          </AdminButton>
        </AdminPanel>

        {editing ? (
          <AdminPanel title={`Редактирование: ${editing.id}`}>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="cursor-pointer text-grey hover:text-black"
              aria-label="Закрыть"
            >
              <X className="size-4" />
            </button>
          </div>
            <AdminGrid>
              <AdminField label="Название">
                <AdminInput
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </AdminField>
              <div className="md:col-span-2">
                <MediaField
                  label="Обложка"
                  accept="image"
                  value={editing.image}
                  onChange={(url) => setEditing({ ...editing, image: url })}
                />
              </div>
              <AdminField label="Описание" className="md:col-span-2">
                <AdminTextarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </AdminField>
            </AdminGrid>
            <AdminButton className="mt-5" onClick={() => void saveEdit()}>
              Сохранить изменения
            </AdminButton>
          </AdminPanel>
        ) : null}

        <AdminPanel title="Все категории">
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>Категория</AdminTh>
                <AdminTh>Порядок</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 border border-black/10 bg-cream">
                        {cat.image ? (
                          <Image src={cat.image} alt="" fill className="object-cover" sizes="48px" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cat.title}</p>
                        <p className="text-xs text-grey">{cat.id}</p>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <AdminInput
                      type="number"
                      className="w-20"
                      defaultValue={cat.sortOrder}
                      onBlur={(e) => {
                        const sortOrder = Number(e.target.value);
                        if (sortOrder !== cat.sortOrder) patch(cat.id, { sortOrder });
                      }}
                    />
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => patch(cat.id, { published: !cat.published })}
                    >
                      <AdminBadge variant={cat.published ? "gold" : "muted"}>
                        {cat.published ? "Опубликована" : "Скрыта"}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditing(cat)}
                        className="cursor-pointer text-grey hover:text-gold"
                        aria-label="Редактировать"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(cat.id)}
                        className="cursor-pointer text-grey hover:text-red-600"
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
