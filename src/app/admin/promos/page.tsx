"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBadge, AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminPromo } from "@/lib/admin/types";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<AdminPromo[]>([]);

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

  return (
    <AdminShell title="Промокоды" description="Управление скидочными кодами">
      <AdminPanel>
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Код</AdminTh>
              <AdminTh>Скидка</AdminTh>
              <AdminTh>Использований</AdminTh>
              <AdminTh>Статус</AdminTh>
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
                  <span className="font-display text-xl text-gold">−{Math.round(promo.discountPercent * 100)}%</span>
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
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>
    </AdminShell>
  );
}
