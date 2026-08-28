"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminButton, AdminField, AdminGrid, AdminInput, AdminTextarea } from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import type { AdminSiteSettings } from "@/lib/admin/types";

export default function AdminSitePage() {
  const [site, setSite] = useState<AdminSiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then((d) => setSite(d.site));
  }, []);

  const save = async () => {
    if (!site) return;
    setSaving(true);
    const res = await fetch("/api/admin/site", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setSaving(false);
    if (res.ok) toast.success("Настройки сохранены");
    else toast.error("Ошибка сохранения");
  };

  if (!site) {
    return (
      <AdminShell title="Сайт" description="Загрузка…">
        <p className="text-sm text-grey">Загрузка…</p>
      </AdminShell>
    );
  }

  const set = <K extends keyof AdminSiteSettings>(key: K, value: AdminSiteSettings[K]) => {
    setSite((s) => (s ? { ...s, [key]: value } : s));
  };

  return (
    <AdminShell title="Сайт" description="Hero, контакты и доставка">
      <div className="mx-auto max-w-3xl space-y-6">
        <AdminPanel title="Бренд">
          <AdminGrid>
            <AdminField label="Название">
              <AdminInput value={site.brand} onChange={(e) => set("brand", e.target.value)} />
            </AdminField>
            <AdminField label="Слоган">
              <AdminInput value={site.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </AdminField>
          </AdminGrid>
        </AdminPanel>

        <AdminPanel title="Hero (главная)">
          <div className="space-y-5">
            <AdminField label="Метка">
              <AdminInput value={site.heroLabel} onChange={(e) => set("heroLabel", e.target.value)} />
            </AdminField>
            <AdminField label="Заголовок">
              <AdminInput value={site.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} />
            </AdminField>
            <AdminField label="Подзаголовок">
              <AdminTextarea
                value={site.heroSubtitle}
                onChange={(e) => set("heroSubtitle", e.target.value)}
              />
            </AdminField>
            <AdminField label="Изображение hero (URL)">
              <AdminInput value={site.heroImage} onChange={(e) => set("heroImage", e.target.value)} />
            </AdminField>
          </div>
        </AdminPanel>

        <AdminPanel title="Контакты">
          <AdminGrid>
            <AdminField label="Email">
              <AdminInput value={site.email} onChange={(e) => set("email", e.target.value)} />
            </AdminField>
            <AdminField label="Телефон">
              <AdminInput value={site.phone} onChange={(e) => set("phone", e.target.value)} />
            </AdminField>
            <AdminField label="Телефон (href)">
              <AdminInput value={site.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} />
            </AdminField>
            <AdminField label="Часы работы">
              <AdminInput
                value={site.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
              />
            </AdminField>
          </AdminGrid>
        </AdminPanel>

        <AdminPanel title="Доставка">
          <AdminGrid>
            <AdminField label="Бесплатная доставка от, ₽">
              <AdminInput
                type="number"
                value={site.freeShippingThreshold}
                onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
              />
            </AdminField>
            <AdminField label="Стоимость доставки, ₽">
              <AdminInput
                type="number"
                value={site.shippingCost}
                onChange={(e) => set("shippingCost", Number(e.target.value))}
              />
            </AdminField>
          </AdminGrid>
        </AdminPanel>

        <AdminButton onClick={save} disabled={saving}>
          {saving ? "Сохранение…" : "Сохранить"}
        </AdminButton>
      </div>
    </AdminShell>
  );
}
