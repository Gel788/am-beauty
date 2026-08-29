"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/catalog/product-card";
import { CommercePageHeader } from "@/components/commerce/commerce-page-header";
import { CommerceTrustMarquee, CommerceTrustPills } from "@/components/commerce/commerce-trust-marquee";
import { AccountMobileSummary, AccountNav, AccountSidebar, type AccountTabId } from "@/components/account/account-sidebar";
import { AccountLoginForm } from "@/components/account/account-login-form";
import { AccountLoginGate } from "@/components/account/account-login-gate";
import { AccountOrderRow } from "@/components/account/account-order-row";
import { formatPrice, getBestsellers } from "@/data/products";
import { useCatalogProducts } from "@/context/catalog-context";
import {
  useAccountStore,
  type AccountAddress,
  type AccountOrder,
} from "@/store/account-store";
import { adminOrderToAccount } from "@/lib/orders/account-orders";
import { useCustomerSession } from "@/hooks/use-customer-session";
import { useWishlistStore } from "@/store/wishlist-store";
import { BrandLoader } from "@/components/ui/brand-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Название (Дом, Офис)" aria-label="Название адреса" className="h-11 bg-white" />
      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Город" aria-label="Город" className="h-11 bg-white" />
      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес" aria-label="Адрес" className="h-11 bg-white" />
      <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Индекс" aria-label="Индекс" className="h-11 bg-white" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="cursor-pointer text-[10px] tracking-[0.14em] uppercase">
          Сохранить
        </Button>
        <Button type="button" variant="outline" size="sm" className="cursor-pointer" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase">
      {children}
    </h2>
  );
}

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as AccountTabId | null;
  const [activeTab, setActiveTab] = useState<AccountTabId>(
    tabParam && ["overview", "orders", "profile", "addresses", "wishlist"].includes(tabParam)
      ? tabParam
      : "overview",
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
  const syncOrders = useAccountStore((s) => s.syncOrders);
  const { customer, isAuthenticated, logout, refresh: refreshSession, loading: sessionLoading } =
    useCustomerSession();

  const catalogProducts = useCatalogProducts();
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const wishlistProducts = catalogProducts.filter((p) => wishlistSlugs.includes(p.slug));

  const [form, setForm] = useState(profile);
  const [savingProfile, setSavingProfile] = useState(false);

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders],
  );
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status === "processing" || o.status === "shipped").length,
    [orders],
  );

  useEffect(() => {
    setForm({ name: profile.name, email: profile.email, phone: profile.phone });
  }, [profile.name, profile.email, profile.phone]);

  const refreshOrders = useCallback(async () => {
    if (!customer?.email || !customer.phone) return;

    const email = customer.email.trim();
    const phone = customer.phone.trim();
    const localOrders = useAccountStore.getState().orders;
    const remote: AccountOrder[] = [];

    try {
      const res = await fetch(
        `/api/account/orders?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const data = (await res.json()) as { orders: AccountOrder[] };
        remote.push(...data.orders);
      }

      const knownIds = new Set(remote.map((o) => o.id));
      const missing = localOrders.filter((o) => !knownIds.has(o.id));
      if (missing.length > 0) {
        const byId = await Promise.all(
          missing.map(async (local) => {
            const res = await fetch(
              `/api/orders?id=${encodeURIComponent(local.id)}&email=${encodeURIComponent(email)}`,
              { cache: "no-store" },
            );
            if (!res.ok) return null;
            const data = (await res.json()) as { order: Parameters<typeof adminOrderToAccount>[0] };
            return adminOrderToAccount(data.order);
          }),
        );
        remote.push(...byId.filter((o): o is AccountOrder => o !== null));
      }

      if (remote.length > 0) syncOrders(remote);
    } catch {
      /* ignore network errors */
    }
  }, [customer?.email, customer?.phone, syncOrders]);

  useEffect(() => {
    if (customer) {
      updateProfile({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    }
  }, [customer, updateProfile]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void refreshOrders();
    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshOrders();
    };
    window.addEventListener("focus", refreshOrders);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refreshOrders);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAuthenticated, refreshOrders]);

  useEffect(() => {
    if (isAuthenticated && (activeTab === "orders" || activeTab === "overview")) void refreshOrders();
  }, [activeTab, isAuthenticated, refreshOrders]);

  const changeTab = useCallback(
    (tab: AccountTabId) => {
      setActiveTab(tab);
      router.replace(`/account?tab=${tab}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (tabParam && ["overview", "orders", "profile", "addresses", "wishlist"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#wishlist") {
      changeTab("wishlist");
    }
  }, [changeTab]);

  const handleLoginSuccess = useCallback(
    (c: { email: string; name: string; phone: string }) => {
      updateProfile(c);
      void refreshSession();
      void refreshOrders();
    },
    [refreshOrders, refreshSession, updateProfile],
  );

  const handleLogout = useCallback(async () => {
    await logout();
    toast.success("Вы вышли из аккаунта");
    changeTab("overview");
  }, [changeTab, logout]);

  const handleProfileSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isAuthenticated) {
        setSavingProfile(true);
        try {
          const res = await fetch("/api/account/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              phone: form.phone,
              email: form.email,
            }),
          });
          const data = (await res.json()) as {
            customer?: { email: string; name: string; phone: string };
            error?: string;
          };
          if (!res.ok || !data.customer) {
            toast.error(data.error ?? "Не удалось сохранить профиль");
            return;
          }
          updateProfile(data.customer);
          await refreshSession();
          void refreshOrders();
          toast.success("Изменения сохранены");
        } catch {
          toast.error("Не удалось сохранить профиль");
        } finally {
          setSavingProfile(false);
        }
        return;
      }

      updateProfile(form);
      toast.success("Сохранено локально — войдите, чтобы синхронизировать с аккаунтом");
    },
    [form, isAuthenticated, refreshOrders, refreshSession, updateProfile],
  );

  const displayProfile = isAuthenticated
    ? { name: customer?.name ?? profile.name, email: customer?.email ?? profile.email, phone: customer?.phone ?? profile.phone }
    : { name: "", email: "", phone: "" };

  const cabinetStats = isAuthenticated
    ? { orders: orders.length, addresses: addresses.length, wishlist: wishlistSlugs.length }
    : { orders: 0, addresses: 0, wishlist: wishlistSlugs.length };

  const greeting = isAuthenticated ? (customer?.name ?? profile.name).trim() || "Гость" : "Войдите в кабинет";
  const showLoginGate = !sessionLoading && !isAuthenticated && activeTab !== "wishlist";
  const recentOrder = isAuthenticated ? orders[0] : undefined;
  const defaultAddress = isAuthenticated ? addresses.find((a) => a.isDefault) ?? addresses[0] : undefined;
  const suggestions = getBestsellers(3);

  return (
    <div className="bg-cream/30">
      <div className="container-page pt-8 pb-12 sm:pt-12 sm:pb-16 md:py-20 lg:py-24">
        <CommercePageHeader
          label="Аккаунт"
          title="Личный кабинет"
          description="Заказы, адреса, профиль и избранное — всё для вашего ритуала ухода."
        />

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <AccountSidebar
              active={activeTab}
              onChange={changeTab}
              profile={displayProfile}
              stats={cabinetStats}
              isAuthenticated={isAuthenticated}
              onLogout={handleLogout}
            />
          </aside>

          <div className="min-w-0">
            <div className="space-y-3 lg:hidden">
              <AccountMobileSummary
                profile={displayProfile}
                stats={cabinetStats}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
              />
              <div className="border border-border bg-white p-3 sm:p-4">
                <AccountNav active={activeTab} onChange={changeTab} />
              </div>
            </div>

            <div className="mt-3 border border-border bg-white p-4 sm:mt-4 sm:p-6 md:p-8 lg:mt-0">
              {sessionLoading ? (
                <div className="flex justify-center py-16">
                  <BrandLoader />
                </div>
              ) : showLoginGate ? (
                <AccountLoginGate
                  onSuccess={handleLoginSuccess}
                  onOpenWishlist={() => changeTab("wishlist")}
                />
              ) : null}

              {!sessionLoading && !showLoginGate && activeTab === "overview" ? (
                <div className="space-y-10">
                  <div className="border border-border bg-cream/50 p-4 sm:p-6 md:p-8">
                    <p className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase text-grey">
                      Добро пожаловать
                    </p>
                    <h2 className="mt-3 font-display text-xl sm:mt-4 sm:text-2xl md:text-3xl">{greeting}</h2>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-grey">
                      Здесь собраны ваши заказы, сохранённые адреса и любимые продукты AM Beauty.
                      {!isAuthenticated ? (
                        <> Оформите заказ — аккаунт создастся автоматически, пароль придёт на email.</>
                      ) : null}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        nativeButton={false}
                        className="h-11 cursor-pointer text-[10px] tracking-[0.18em] uppercase"
                        render={<Link href="/catalog" />}
                      >
                        В каталог
                      </Button>
                      <Button
                        variant="outline"
                        className="h-11 cursor-pointer text-[10px] tracking-[0.18em] uppercase"
                        onClick={() => changeTab("orders")}
                      >
                        Мои заказы
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:gap-4">
                    {[
                      { label: "Заказов", value: orders.length, hint: activeOrders ? `${activeOrders} в пути` : "История" },
                      { label: "Потрачено", value: formatPrice(totalSpent), hint: "Всего" },
                      { label: "Избранное", value: wishlistSlugs.length, hint: "Продуктов" },
                    ].map((stat) => (
                      <div key={stat.label} className="border border-border bg-white p-4 text-center sm:p-5">
                        <p className="font-display text-xl text-gold/90 sm:text-2xl md:text-3xl">{stat.value}</p>
                        <p className="mt-2 text-[10px] tracking-[0.16em] uppercase text-grey">{stat.label}</p>
                        <p className="mt-1 text-xs text-grey">{stat.hint}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <section>
                      <div className="flex items-center justify-between gap-4">
                        <SectionHeading>Последний заказ</SectionHeading>
                        {orders.length > 0 ? (
                          <Button variant="link" size="sm" className="cursor-pointer" onClick={() => changeTab("orders")}>
                            Все
                            <ArrowRight className="ml-1 size-3" aria-hidden />
                          </Button>
                        ) : null}
                      </div>
                      {recentOrder ? (
                        <ul className="mt-4">
                          <AccountOrderRow order={recentOrder} defaultOpen />
                        </ul>
                      ) : (
                        <div className="mt-4 border border-dashed border-border bg-cream/30 p-8 text-center">
                          <p className="text-sm text-grey">Заказов пока нет</p>
                          <Button
                            nativeButton={false}
                            variant="outline"
                            size="sm"
                            className="mt-4 cursor-pointer"
                            render={<Link href="/catalog" />}
                          >
                            Собрать ритуал
                          </Button>
                        </div>
                      )}
                    </section>

                    <section className="space-y-6">
                      <div>
                        <SectionHeading>Профиль</SectionHeading>
                        <dl className="mt-4 space-y-3 border border-border bg-cream/30 p-4 text-sm sm:p-5">
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                            <dt className="text-grey">Имя</dt>
                            <dd className="break-words text-charcoal sm:text-right">{profile.name || "—"}</dd>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                            <dt className="text-grey">Email</dt>
                            <dd className="break-all text-charcoal sm:text-right">{profile.email || "—"}</dd>
                          </div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                            <dt className="text-grey">Телефон</dt>
                            <dd className="break-words text-charcoal sm:text-right">{profile.phone || "—"}</dd>
                          </div>
                        </dl>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 cursor-pointer text-[10px] tracking-[0.14em] uppercase"
                          onClick={() => changeTab("profile")}
                        >
                          Редактировать
                        </Button>
                      </div>

                      <div>
                        <SectionHeading>Адрес доставки</SectionHeading>
                        {defaultAddress ? (
                          <div className="mt-4 border border-gold/40 bg-cream/40 p-5">
                            <p className="text-[11px] tracking-[0.14em] uppercase">{defaultAddress.label}</p>
                            <p className="mt-1 text-sm">{defaultAddress.city}, {defaultAddress.address}</p>
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-2 cursor-pointer px-0"
                              onClick={() => changeTab("addresses")}
                            >
                              Все адреса
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-4 border border-dashed border-border p-5 text-sm text-grey">
                            Добавьте адрес для быстрого оформления
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-1 cursor-pointer px-0"
                              onClick={() => changeTab("addresses")}
                            >
                              Добавить
                            </Button>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {wishlistProducts.length > 0 ? (
                    <section>
                      <div className="flex items-center justify-between gap-4">
                        <SectionHeading>Избранное</SectionHeading>
                        <Button variant="link" size="sm" className="cursor-pointer" onClick={() => changeTab("wishlist")}>
                          Смотреть все
                        </Button>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                        {wishlistProducts.slice(0, 3).map((p) => (
                          <ProductCard key={p.slug} product={p} />
                        ))}
                      </div>
                    </section>
                  ) : (
                    <section className="border border-border bg-cream/30 p-6">
                      <SectionHeading>Рекомендуем</SectionHeading>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                        {suggestions.map((p) => (
                          <ProductCard key={p.slug} product={p} />
                        ))}
                      </div>
                    </section>
                  )}

                  <CommerceTrustPills className="flex flex-wrap gap-2" />
                </div>
              ) : null}

              {!sessionLoading && !showLoginGate && activeTab === "orders" ? (
                <section className="space-y-6">
                  <SectionHeading>История заказов</SectionHeading>

                  {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 border border-border bg-cream/40 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5">
                      <div>
                        <p className="text-[9px] tracking-[0.16em] text-grey uppercase">Всего заказов</p>
                        <p className="mt-1 font-display text-2xl">{orders.length}</p>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.16em] text-grey uppercase">В обработке</p>
                        <p className="mt-1 font-display text-2xl text-gold">{activeOrders}</p>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.16em] text-grey uppercase">Сумма покупок</p>
                        <p className="mt-1 font-display text-2xl">{formatPrice(totalSpent)}</p>
                      </div>
                    </div>
                  ) : null}

                  {orders.length === 0 ? (
                    <EmptyState
                      className="!py-12"
                      title="Заказов пока нет"
                      description="Здесь появятся ваши заказы после оформления."
                      actionLabel="В каталог"
                      actionHref="/catalog"
                    />
                  ) : (
                    <ul className="space-y-4">
                      {orders.map((order) => (
                        <AccountOrderRow key={order.id} order={order} />
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-grey">
                    Нужна помощь?{" "}
                    <Link href="/contacts" className="underline underline-offset-4 hover:text-black">
                      Свяжитесь с нами
                    </Link>
                  </p>
                </section>
              ) : null}

              {!sessionLoading && !showLoginGate && activeTab === "profile" ? (
                <section className="grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-8">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <SectionHeading>Профиль</SectionHeading>
                      {isAuthenticated ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] tracking-[0.14em] uppercase"
                          onClick={() => void handleLogout()}
                        >
                          Выйти
                        </Button>
                      ) : null}
                    </div>
                    {isAuthenticated ? (
                      <p className="mt-2 text-xs text-grey">
                        Вход выполнен: <span className="text-charcoal">{customer?.email}</span>
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm text-grey">
                      {isAuthenticated
                        ? "Данные сохраняются в аккаунте и отображаются в админке."
                        : "Данные подставляются при оформлении заказа. Войдите, чтобы сохранить на сервере."}
                    </p>
                    <form className="mt-6 grid gap-3" onSubmit={(e) => void handleProfileSave(e)}>
                      <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Имя" aria-label="Имя" className="h-11" />
                      <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" aria-label="Email" className="h-11" />
                      <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Телефон" type="tel" aria-label="Телефон" className="h-11" />
                      <Button
                        type="submit"
                        disabled={savingProfile}
                        className="mt-2 w-fit cursor-pointer text-[10px] tracking-[0.18em] uppercase"
                      >
                        {savingProfile ? "Сохранение…" : "Сохранить"}
                      </Button>
                    </form>
                  </div>
                  <aside className="border border-border bg-cream/40 p-4 sm:p-5">
                    {isAuthenticated ? (
                      <>
                        <p className="text-[9px] tracking-[0.18em] text-grey uppercase">Вход</p>
                        <p className="mt-3 text-sm text-charcoal">
                          Вы вошли как <span className="font-medium">{customer?.email}</span>
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4 w-full cursor-pointer sm:w-auto"
                          onClick={() => void handleLogout()}
                        >
                          Выйти из аккаунта
                        </Button>
                        <Link
                          href="/account/forgot-password"
                          className="mt-4 block text-[10px] tracking-[0.14em] text-grey uppercase underline"
                        >
                          Сменить пароль
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-[9px] tracking-[0.18em] text-grey uppercase">Вход в кабинет</p>
                        <div className="mt-4">
                          <AccountLoginForm
                            onSuccess={(c) => {
                              updateProfile(c);
                              void refreshSession();
                              void refreshOrders();
                            }}
                          />
                        </div>
                      </>
                    )}
                  </aside>
                </section>
              ) : null}

              {!sessionLoading && !showLoginGate && activeTab === "addresses" ? (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <SectionHeading>Адреса доставки</SectionHeading>
                    {!addingAddress ? (
                      <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setAddingAddress(true)}>
                        <Plus className="size-3.5" aria-hidden />
                        Добавить
                      </Button>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-grey">
                    Сохранённые адреса доступны при оформлении заказа.
                  </p>

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
                    <div className="mt-6 border border-dashed border-border bg-cream/30 p-10">
                      <EmptyState
                        className="!py-4"
                        title="Адресов нет"
                        description="Добавьте адрес для быстрого оформления заказов."
                        actionLabel="Добавить адрес"
                        onAction={() => setAddingAddress(true)}
                      />
                    </div>
                  ) : (
                    <ul className="mt-6 space-y-4">
                      {addresses.map((addr) => (
                        <li
                          key={addr.id}
                          className={cn(
                            "border p-5",
                            addr.isDefault ? "border-gold/60 bg-cream/40" : "border-border bg-white",
                          )}
                        >
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
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] tracking-[0.14em] uppercase">
                                  {addr.label}
                                  {addr.isDefault ? (
                                    <Badge variant="secondary" className="ml-2 text-gold">
                                      По умолчанию
                                    </Badge>
                                  ) : null}
                                </p>
                                <p className="mt-1 break-words text-sm">{addr.city}, {addr.address}</p>
                                {addr.postalCode ? <p className="text-xs text-grey">{addr.postalCode}</p> : null}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {!addr.isDefault ? (
                                  <Button variant="ghost" size="xs" className="cursor-pointer" onClick={() => { setDefaultAddress(addr.id); toast.success("Адрес по умолчанию обновлён"); }}>
                                    По умолчанию
                                  </Button>
                                ) : null}
                                <Button variant="ghost" size="xs" className="cursor-pointer" onClick={() => setEditingAddress(addr.id)}>
                                  Изменить
                                </Button>
                                <Button variant="ghost" size="icon-xs" className="cursor-pointer text-destructive" aria-label="Удалить адрес" onClick={() => { removeAddress(addr.id); toast.success("Адрес удалён"); }}>
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

              {!sessionLoading && activeTab === "wishlist" ? (
                <section id="wishlist">
                  <SectionHeading>Избранное</SectionHeading>
                  {wishlistProducts.length > 0 ? (
                    <>
                      <p className="mt-3 text-sm text-grey">
                        {wishlistProducts.length} продуктов в вашей коллекции
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-6 md:grid-cols-3">
                        {wishlistProducts.map((p) => (
                          <ProductCard key={p.slug} product={p} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 border border-border bg-cream/30 p-8">
                      <EmptyState
                        title="Список пуст"
                        description="Сохраняйте любимые продукты, чтобы вернуться к ним позже."
                        actionLabel="В каталог"
                        actionHref="/catalog"
                      />
                      <div className="mt-10 border-t border-border pt-10">
                        <p className="text-center text-[10px] tracking-[0.24em] text-grey uppercase">Хиты</p>
                        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                          {getBestsellers(3).map((p) => (
                            <ProductCard key={p.slug} product={p} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <CommerceTrustMarquee />
    </div>
  );
}

export function AccountView() {
  return (
    <Suspense fallback={<BrandLoader className="container-page min-h-[50vh]" />}>
      <AccountContent />
    </Suspense>
  );
}
