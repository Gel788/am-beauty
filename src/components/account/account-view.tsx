"use client";

import Link from "next/link";
import { toast } from "sonner";
import { products } from "@/data/products";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ProductCard } from "@/components/catalog/product-card";

const mockOrders = [
  { id: "AM-28491", date: "2026-07-20", status: "Доставлен", total: 17100 },
  { id: "AM-27102", date: "2026-06-05", status: "Доставлен", total: 8200 },
];

export function AccountView() {
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const wishlistProducts = products.filter((p) => wishlistSlugs.includes(p.slug));

  return (
    <div className="container-page section-pad">
      <PageHeader label="Аккаунт" title="Личный кабинет" align="left" />

      <section className="mt-14 max-w-lg">
        <h2 className="text-[10px] tracking-[0.22em] uppercase">Профиль</h2>
        <form
          className="mt-5 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Изменения сохранены");
          }}
        >
          <Input placeholder="Имя" defaultValue="Алина" aria-label="Имя" className="h-11" />
          <Input placeholder="Email" type="email" defaultValue="alina@example.com" aria-label="Email" className="h-11" />
          <Input placeholder="Телефон" type="tel" defaultValue="+7 900 000-00-00" aria-label="Телефон" className="h-11" />
          <Button type="submit" className="mt-2 w-fit cursor-pointer">
            Сохранить
          </Button>
        </form>
      </section>

      <section id="wishlist" className="mt-16 border-t border-border pt-16">
        <h2 className="text-[10px] tracking-[0.22em] uppercase">Избранное</h2>
        {wishlistProducts.length === 0 ? (
          <EmptyState
            className="!py-12"
            title="Список пуст"
            description="Сохраняйте любимые продукты, чтобы вернуться к ним позже."
            actionLabel="В каталог"
            actionHref="/catalog"
          />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 border-t border-border pt-16">
        <h2 className="text-[10px] tracking-[0.22em] uppercase">История заказов</h2>
        <ul className="mt-6 divide-y divide-border">
          {mockOrders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm">
              <div>
                <p className="text-[11px] tracking-[0.14em] uppercase">{o.id}</p>
                <p className="mt-1 text-xs text-grey">{o.date}</p>
              </div>
              <span className="text-xs text-grey">{o.status}</span>
              <span>{o.total.toLocaleString("ru-RU")} ₽</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-grey">
          Нужна помощь?{" "}
          <Link href="/contacts" className="underline underline-offset-4">
            Свяжитесь с нами
          </Link>
        </p>
      </section>
    </div>
  );
}
