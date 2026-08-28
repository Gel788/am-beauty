"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";
import { formatPrice } from "@/data/products";
import { CARRIER_LABELS, MODE_LABELS } from "@/lib/delivery/types";
import {
  ORDER_STATUS_LABELS,
  useAccountStore,
  type AccountAddress,
  type AccountOrder,
} from "@/store/account-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ProductCard } from "@/components/catalog/product-card";
import { cn } from "@/lib/utils";

type TabId = "overview" | "orders" | "profile" | "addresses" | "wishlist";

const TABS: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "orders", label: "Заказы", icon: Package },
  { id: "profile", label: "Профиль", icon: User },
  { id: "addresses", label: "Адреса", icon: MapPin },
  { id: "wishlist", label: "Избранное", icon: Heart },
];

function statusVariant(status: AccountOrder["status"]) {
  switch (status) {
    case "delivered":
      return "secondary" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function AccountNav({
  active,
  onChange,
  vertical,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
  vertical?: boolean;
}) {
  return (
    <nav
      className={cn(
        vertical ? "flex flex-col gap-1" : "flex gap-1 overflow-x-auto border-b border-border pb-px",
      )}
      aria-label="Разделы личного кабинета"
    >
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            "flex shrink-0 items-center gap-2 px-4 py-3 text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer motion-safe:transition-colors motion-reduce:transition-none",
            vertical
              ? active === id
                ? "border-l-2 border-black bg-cream/60 pl-[14px] text-black"
                : "border-l-2 border-transparent text-grey hover:text-black"
              : active === id
                ? "border-b-2 border-black text-black"
                : "text-grey hover:text-black",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </nav>
  );
}

function OrderRow({ order }: { order: AccountOrder }) {
  const [open, setOpen] = useState(false);
  const deliveryLabel = `${CARRIER_LABELS[order.delivery.carrier]} · ${MODE_LABELS[order.delivery.mode]}`;

  return (
    <li className="border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left cursor-pointer"
      >
        <div>
          <p className="text-[11px] tracking-[0.14em] uppercase">{order.id}</p>
          <p className="mt-1 text-xs text-grey">{order.date}</p>
        </div>
        <Badge variant={statusVariant(order.status)}>{ORDER_STATUS_LABELS[order.status]}</Badge>
        <span className="text-sm">{formatPrice(order.total)}</span>
        <ChevronDown
          className={cn("size-4 text-grey transition-transform motion-safe:transition-transform motion-reduce:transition-none", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="border-t border-border bg-cream/30 px-5 py-5">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] tracking-[0.16em] uppercase text-grey">Доставка</dt>
              <dd className="mt-1">{deliveryLabel}</dd>
              <dd className="text-grey">
                {order.delivery.pickupPoint
                  ? `${order.delivery.pickupPoint.name}, ${order.delivery.pickupPoint.address}`
                  : `${order.delivery.city}${order.delivery.address ? `, ${order.delivery.address}` : ""}`}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.16em] uppercase text-grey">Оплата</dt>
              <dd className="mt-1">{order.payment === "card" ? "Карта" : "СБП"}</dd>
              <dd className="text-grey">Доставка: {order.shipping === 0 ? "Бесплатно" : formatPrice(order.shipping)}</dd>
            </div>
          </dl>

          <ul className="mt-5 divide-y divide-border border-t border-border">
            {order.items.map((item) => (
              <li key={item.slug} className="flex items-center gap-4 py-3">
                <div className="relative size-12 shrink-0 bg-cream">
                  <div className="absolute inset-1">
                    <Image src={item.image} alt="" fill className="object-contain object-bottom" sizes="48px" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] tracking-[0.12em] uppercase">{item.name}</p>
                  <p className="text-xs text-grey">× {item.qty}</p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          {order.trackingNumber ? (
            <p className="mt-4 text-xs text-grey">
              Трек-номер: <span className="text-black">{order.trackingNumber}</span>
            </p>
          ) : (
            <p className="mt-4 text-xs text-grey">Трек-номер появится после отправки</p>
          )}
        </div>
      ) : null}
    </li>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<AccountAddress>;
  onSave: (data: Omit<AccountAddress, "id" | "isDefault">) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? "");

  return (
    <form
      className="grid gap-3 border border-border bg-cream/30 p-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!label.trim() || !city.trim() || !address.trim()) {
          toast.error("Заполните все обязательные поля");
          return;
        }
        onSave({ label, city, address, postalCode: postalCode || undefined });
      }}
    >
      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Название (Дом, Офис)" aria-label="Название адреса" className="h-11" />
      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Город" aria-label="Город" className="h-11" />
      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" aria-label="Адрес" className="h-11" />
      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Индекс" aria-label="Индекс" className="h-11" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="cursor-pointer">Сохранить</Button>
        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "overview",
  );
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);

  const profile = useAccountStore((s) => s.profile);
  const orders = useAccountStore((s) => s.orders);
  const addresses = useAccountStore((s) => s.addresses);
  const updateProfile = useAccountStore((s) => s.updateProfile);
  const addAddress = useAccountStore((s) => s.addAddress);
  const updateAddress = useAccountStore((s) => s.updateAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const wishlistProducts = products.filter((p) => wishlistSlugs.includes(p.slug));

  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    });
  }, [profile.name, profile.email, profile.phone]);

  const changeTab = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      router.replace(`/account?tab=${tab}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const greeting = profile.name.trim() || "Гость";
  const recentOrder = orders[0];

  return (
    <div className="container-page section-pad pb-16">
      <PageHeader label="Аккаунт" title="Личный кабинет" align="left" />

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <AccountNav active={activeTab} onChange={changeTab} vertical />
        </aside>

        <div>
          <div className="lg:hidden">
            <AccountNav active={activeTab} onChange={changeTab} />
          </div>

          <div className="mt-8 lg:mt-0">
            {activeTab === "overview" ? (
              <div className="space-y-10">
                <div className="border border-border bg-cream/40 p-6 md:p-8">
                  <p className="text-[10px] tracking-[0.22em] uppercase text-grey">Добро пожаловать</p>
                  <h2 className="mt-2 font-display text-2xl md:text-3xl">{greeting}</h2>
                  <p className="mt-2 text-sm text-grey">
                    Управляйте заказами, адресами и избранным в одном месте.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Заказов", value: orders.length },
                    { label: "Адресов", value: addresses.length },
                    { label: "В избранном", value: wishlistSlugs.length },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-border p-5 text-center">
                      <p className="font-display text-3xl">{stat.value}</p>
                      <p className="mt-1 text-[10px] tracking-[0.16em] uppercase text-grey">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {recentOrder ? (
                  <section>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-[10px] tracking-[0.22em] uppercase">Последний заказ</h3>
                      <Button variant="link" size="sm" className="cursor-pointer" onClick={() => changeTab("orders")}>
                        Все заказы
                      </Button>
                    </div>
                    <ul className="mt-4">
                      <OrderRow order={recentOrder} />
                    </ul>
                  </section>
                ) : (
                  <EmptyState
                    className="!py-10"
                    title="Заказов пока нет"
                    description="Оформите первый заказ в каталоге."
                    actionLabel="В каталог"
                    actionHref="/catalog"
                  />
                )}
              </div>
            ) : null}

            {activeTab === "orders" ? (
              <section>
                <h2 className="text-[10px] tracking-[0.22em] uppercase">История заказов</h2>
                {orders.length === 0 ? (
                  <EmptyState
                    className="!py-12"
                    title="Заказов пока нет"
                    description="Здесь появятся ваши заказы после оформления."
                    actionLabel="В каталог"
                    actionHref="/catalog"
                  />
                ) : (
                  <ul className="mt-6 space-y-3">
                    {orders.map((order) => (
                      <OrderRow key={order.id} order={order} />
                    ))}
                  </ul>
                )}
                <p className="mt-6 text-xs text-grey">
                  Нужна помощь?{" "}
                  <Link href="/contacts" className="underline underline-offset-4">
                    Свяжитесь с нами
                  </Link>
                </p>
              </section>
            ) : null}

            {activeTab === "profile" ? (
              <section className="max-w-lg">
                <h2 className="text-[10px] tracking-[0.22em] uppercase">Профиль</h2>
                <form
                  className="mt-5 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile(form);
                    toast.success("Изменения сохранены");
                  }}
                >
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Имя"
                    aria-label="Имя"
                    className="h-11"
                  />
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email"
                    type="email"
                    aria-label="Email"
                    className="h-11"
                  />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="Телефон"
                    type="tel"
                    aria-label="Телефон"
                    className="h-11"
                  />
                  <Button type="submit" className="mt-2 w-fit cursor-pointer">
                    Сохранить
                  </Button>
                </form>
              </section>
            ) : null}

            {activeTab === "addresses" ? (
              <section className="max-w-xl">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[10px] tracking-[0.22em] uppercase">Адреса доставки</h2>
                  {!addingAddress ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => setAddingAddress(true)}
                    >
                      <Plus className="size-3.5" aria-hidden />
                      Добавить
                    </Button>
                  ) : null}
                </div>

                {addingAddress ? (
                  <div className="mt-5">
                    <AddressForm
                      onSave={(data) => {
                        addAddress(data);
                        setAddingAddress(false);
                        toast.success("Адрес добавлен");
                      }}
                      onCancel={() => setAddingAddress(false)}
                    />
                  </div>
                ) : null}

                {addresses.length === 0 && !addingAddress ? (
                  <EmptyState
                    className="!py-10"
                    title="Адресов нет"
                    description="Добавьте адрес для быстрого оформления заказов."
                    actionLabel="Добавить адрес"
                    onAction={() => setAddingAddress(true)}
                  />
                ) : (
                  <ul className="mt-6 space-y-3">
                    {addresses.map((addr) => (
                      <li key={addr.id} className="border border-border p-5">
                        {editingAddress === addr.id ? (
                          <AddressForm
                            initial={addr}
                            onSave={(data) => {
                              updateAddress(addr.id, data);
                              setEditingAddress(null);
                              toast.success("Адрес обновлён");
                            }}
                            onCancel={() => setEditingAddress(null)}
                          />
                        ) : (
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-[11px] tracking-[0.14em] uppercase">
                                {addr.label}
                                {addr.isDefault ? (
                                  <Badge variant="secondary" className="ml-2">
                                    По умолчанию
                                  </Badge>
                                ) : null}
                              </p>
                              <p className="mt-1 text-sm">{addr.city}, {addr.address}</p>
                              {addr.postalCode ? (
                                <p className="text-xs text-grey">{addr.postalCode}</p>
                              ) : null}
                            </div>
                            <div className="flex gap-2">
                              {!addr.isDefault ? (
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  className="cursor-pointer"
                                  onClick={() => {
                                    setDefaultAddress(addr.id);
                                    toast.success("Адрес по умолчанию обновлён");
                                  }}
                                >
                                  По умолчанию
                                </Button>
                              ) : null}
                              <Button
                                variant="ghost"
                                size="xs"
                                className="cursor-pointer"
                                onClick={() => setEditingAddress(addr.id)}
                              >
                                Изменить
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="cursor-pointer text-destructive"
                                aria-label="Удалить адрес"
                                onClick={() => {
                                  removeAddress(addr.id);
                                  toast.success("Адрес удалён");
                                }}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : null}

            {activeTab === "wishlist" ? (
              <section id="wishlist">
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
                  <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {wishlistProducts.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                )}
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountView() {
  return (
    <Suspense fallback={<div className="container-page section-pad">Загрузка…</div>}>
      <AccountContent />
    </Suspense>
  );
}
