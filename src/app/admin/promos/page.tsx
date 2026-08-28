"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
} from "@/components/admin/admin-form";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminPromo } from "@/lib/admin/types";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [form, setForm] = useState({ code: "", discountPercent: 10 });

  const load = () => {
    fetch("/api/admin/promos")
      .then((r) => r.json())
      .then((d) => setPromos(d.promos));
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (code: string, active: boolean) => {
    const res = await fetch("/api/admin/promos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, active }),
    });
    if (res.ok) {
      toast.success(active ? "Промокод активирован" : "Промокод отключён");
      load();
    }
  };

  const create = async () => {
    if (!form.code.trim()) {
      toast.error("Укажите код");
      return;
    }
    const res = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discountPercent: form.discountPercent / 100,
      }),
    });
    if (res.ok) {
      toast.success("Промокод создан");
      setForm({ code: "", discountPercent: 10 });
      load();
    } else {
      toast.error("Код уже существует");
    }
  };

  const remove = async (code: string) => {
    if (!confirm("Удалить промокод?")) return;
    const res = await fetch("/api/admin/promos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      toast.success("Удалено");
      load();
    }
  };

  return (
    <AdminShell title="Промокоды" description="Создание и управление скидками">
      <div className="space-y-6">
        <AdminPanel title="Новый промокод">
          <AdminGrid>
            <AdminField label="Код">
              <AdminInput
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SALE20"
              />
            </AdminField>
            <AdminField label="Скидка, %">
              <AdminInput
                type="number"
                min={1}
                max={90}
                value={form.discountPercent}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
              />
            </AdminField>
          </AdminGrid>
          <AdminButton className="mt-5" onClick={create}>
            Создать
          </AdminButton>
        </AdminPanel>

        <AdminPanel>
          <AdminTable>
            <thead>
              <tr>
                <AdminTh>Код</AdminTh>
                <AdminTh>Скидка</AdminTh>
                <AdminTh>Использований</AdminTh>
                <AdminTh>Статус</AdminTh>
                <AdminTh />
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.code}>
                  <AdminTd>
                    <span className="border-l-2 border-gold py-0.5 pl-3 font-mono text-sm tracking-wider">
                      {promo.code}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="font-display text-xl text-gold">
                      −{Math.round(promo.discountPercent * 100)}%
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="tabular-nums">{promo.uses}</span>
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => toggle(promo.code, !promo.active)}
                      className="cursor-pointer"
                    >
                      <AdminBadge variant={promo.active ? "gold" : "muted"}>
                        {promo.active ? "Активен" : "Выключен"}
                      </AdminBadge>
                    </button>
                  </AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => remove(promo.code)}
                      className="cursor-pointer text-grey hover:text-red-600"
                      aria-label="Удалить"
                    >
                      <Trash2 className="size-4" />
                    </button>
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
