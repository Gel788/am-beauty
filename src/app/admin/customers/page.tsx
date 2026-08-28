"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminPanel, AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-ui";
import type { AdminCustomer } from "@/lib/admin/types";
import { formatAdminDate, formatAdminPrice } from "@/lib/admin/format";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers));
  }, []);

  return (
    <AdminShell title="Клиенты" description="Покупатели на основе заказов">
      <AdminPanel>
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Клиент</AdminTh>
              <AdminTh>Контакты</AdminTh>
              <AdminTh>Заказов</AdminTh>
              <AdminTh>LTV</AdminTh>
              <AdminTh>Последний заказ</AdminTh>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <AdminTd>
                  <p className="text-sm font-medium">{customer.name}</p>
                </AdminTd>
                <AdminTd>
                  <p className="text-sm">{customer.email}</p>
                  <p className="text-xs text-grey">{customer.phone}</p>
                </AdminTd>
                <AdminTd>
                  <span className="font-display text-xl">{customer.ordersCount}</span>
                </AdminTd>
                <AdminTd>
                  <span className="font-medium tabular-nums text-gold">{formatAdminPrice(customer.totalSpent)}</span>
                </AdminTd>
                <AdminTd>
                  <span className="text-sm text-grey">{formatAdminDate(customer.lastOrderDate)}</span>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
        {customers.length === 0 ? (
          <p className="py-8 text-center text-sm text-grey">Клиентов пока нет</p>
        ) : null}
      </AdminPanel>
    </AdminShell>
  );
}
