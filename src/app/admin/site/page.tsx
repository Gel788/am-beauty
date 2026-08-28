"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { SiteEditor } from "@/components/admin/site-editor";
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
    if (res.ok) toast.success("Контент сайта сохранён");
    else toast.error("Ошибка сохранения");
  };

  if (!site) {
    return (
      <AdminShell title="Контент сайта" description="Загрузка…">
        <p className="text-sm text-grey">Загрузка…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Контент сайта"
      description="Главная, о бренде, контакты, меню, реквизиты и доставка"
    >
      <SiteEditor site={site} onChange={setSite} onSave={save} saving={saving} />
    </AdminShell>
  );
}
