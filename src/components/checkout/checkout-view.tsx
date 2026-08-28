"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { DeliveryCarrierSelect } from "@/components/checkout/delivery-carrier-select";
import { PickupPointPicker } from "@/components/checkout/pickup-point-picker";
import { SavedAddressPicker } from "@/components/checkout/saved-address-picker";
import { CommercePageHeader } from "@/components/commerce/commerce-page-header";
import { CommerceTrustMarquee } from "@/components/commerce/commerce-trust-marquee";
import { OrderSummary } from "@/components/commerce/order-summary";
import { ConsentFields } from "@/components/legal/consent-fields";
import { formatPrice } from "@/data/products";
import { useDeliveryQuote, usePickupPointsQuote } from "@/hooks/use-delivery-quote";
import { useOrderTotals } from "@/hooks/use-order-totals";
import {
  CARRIER_LABELS,
  MODE_LABELS,
  type DeliveryCarrier,
  type DeliveryMode,
} from "@/lib/delivery/types";
import { useAccountStore } from "@/store/account-store";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const steps = ["Доставка", "Оплата", "Подтверждение"] as const;

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase">
      {children}
    </h2>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<"card" | "sbp">("card");
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [consentErrors, setConsentErrors] = useState<{ offer?: string; privacy?: string }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useManualAddress, setUseManualAddress] = useState(true);

  const profileName = useAccountStore((s) => s.profile.name);
  const profileEmail = useAccountStore((s) => s.profile.email);
  const profilePhone = useAccountStore((s) => s.profile.phone);
  const addresses = useAccountStore((s) => s.addresses);
  const updateProfile = useAccountStore((s) => s.updateProfile);
  const addOrder = useAccountStore((s) => s.addOrder);

  const [contact, setContact] = useState<ContactForm>({
    name: profileName,
    email: profileEmail,
    phone: profilePhone,
  });

  const carrier = useCheckoutStore((s) => s.carrier);
  const mode = useCheckoutStore((s) => s.mode);
  const tariff = useCheckoutStore((s) => s.tariff);
  const tariffs = useCheckoutStore((s) => s.tariffs);
  const tariffsLoading = useCheckoutStore((s) => s.tariffsLoading);
  const pickupPoint = useCheckoutStore((s) => s.pickupPoint);
  const pickupPoints = useCheckoutStore((s) => s.pickupPoints);
  const pickupPointsLoading = useCheckoutStore((s) => s.pickupPointsLoading);
  const city = useCheckoutStore((s) => s.city);
  const postalCode = useCheckoutStore((s) => s.postalCode);
  const address = useCheckoutStore((s) => s.address);
  const setCarrier = useCheckoutStore((s) => s.setCarrier);
  const setMode = useCheckoutStore((s) => s.setMode);
  const setPickupPoint = useCheckoutStore((s) => s.setPickupPoint);
  const setCity = useCheckoutStore((s) => s.setCity);
  const setPostalCode = useCheckoutStore((s) => s.setPostalCode);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const resetDelivery = useCheckoutStore((s) => s.resetDelivery);

  const { lines, subtotal, discount, shipping, total, promoCode } = useOrderTotals();
  const clearCart = useCartStore((s) => s.clearCart);
  const cartItems = useCartStore((s) => s.items);
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  const debouncedCity = useDebouncedValue(city, 500);

  useDeliveryQuote({
    city: debouncedCity,
    postalCode,
    subtotal,
    itemCount,
  });
  usePickupPointsQuote(debouncedCity, postalCode);

  useEffect(() => {
    if (!profileName && !profileEmail && !profilePhone) return;
    setContact((c) => ({
      name: c.name || profileName,
      email: c.email || profileEmail,
      phone: c.phone || profilePhone,
    }));
  }, [profileName, profileEmail, profilePhone]);

  useEffect(() => {
    if (addresses.length === 0) return;
    const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (!defaultAddr) return;
    setSelectedAddressId(defaultAddr.id);
    setUseManualAddress(false);
    setCity(defaultAddr.city);
    setPostalCode(defaultAddr.postalCode ?? "");
    setAddress(defaultAddr.address);
  }, [addresses, setCity, setPostalCode, setAddress]);

  const handleAddressSelect = (addr: (typeof addresses)[number] | null) => {
    if (!addr) {
      setSelectedAddressId(null);
      setUseManualAddress(true);
      return;
    }
    setSelectedAddressId(addr.id);
    setUseManualAddress(false);
    setCity(addr.city);
    setPostalCode(addr.postalCode ?? "");
    setAddress(addr.address);
    setErrors((e) => ({ ...e, city: "", address: "" }));
  };

  const handleCarrierSelect = (nextCarrier: DeliveryCarrier) => {
    setCarrier(nextCarrier);
  };

  const handleModeSelect = (nextMode: DeliveryMode) => {
    setMode(nextMode);
  };

  if (lines.length === 0) {
    return (
      <div className="container-page section-pad">
        <EmptyState
          title="Корзина пуста"
          description="Добавьте товары перед оформлением заказа."
          actionLabel="В каталог"
          actionHref="/catalog"
        />
      </div>
    );
  }

  const validateDelivery = () => {
    const next: Record<string, string> = {};
    if (!contact.name.trim()) next.name = "Укажите имя";
    if (!contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      next.email = "Укажите email";
    }
    if (!contact.phone.trim()) next.phone = "Укажите телефон";
    if (!city.trim()) next.city = "Укажите город";
    if (!carrier || !tariff) next.carrier = "Выберите службу доставки";
    if (mode === "courier" && !address.trim()) next.address = "Укажите адрес";
    if (mode === "pickup" && !pickupPoint) next.pickup = "Выберите пункт выдачи";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePay = async () => {
    const nextConsent: { offer?: string; privacy?: string } = {};
    if (!acceptPrivacy) nextConsent.privacy = "Необходимо согласие на обработку персональных данных";
    if (!acceptOffer) nextConsent.offer = "Необходимо принять условия оферты";
    setConsentErrors(nextConsent);
    if (Object.keys(nextConsent).length > 0) return;

    setLoading(true);
    const orderId = `AM-${Date.now()}`;

    const deliverySelection = {
      carrier: carrier!,
      mode,
      price: shipping,
      minDays: tariff!.minDays,
      maxDays: tariff!.maxDays,
      city,
      postalCode: postalCode || undefined,
      address: mode === "courier" ? address : undefined,
      pickupPoint: mode === "pickup" ? (pickupPoint ?? undefined) : undefined,
    };

    const orderPayload = {
      id: orderId,
      date: new Date().toISOString().slice(0, 10),
      status: "processing" as const,
      items: lines.map((l) => ({
        slug: l.product.slug,
        name: l.product.shortName,
        qty: l.qty,
        price: l.product.price,
        image: l.product.image,
      })),
      delivery: deliverySelection,
      payment,
      subtotal,
      discount,
      shipping,
      total,
      promoCode,
      customerName: contact.name.trim(),
      customerEmail: contact.email.trim(),
      customerPhone: contact.phone.trim(),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(data.error ?? "Не удалось оформить заказ");
      setLoading(false);
      return;
    }

    updateProfile(contact);
    addOrder({
      id: orderPayload.id,
      date: orderPayload.date,
      status: orderPayload.status,
      items: orderPayload.items,
      delivery: orderPayload.delivery,
      payment: orderPayload.payment,
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount,
      shipping: orderPayload.shipping,
      total: orderPayload.total,
      promoCode: orderPayload.promoCode,
    });

    clearCart();
    resetDelivery();

    const deliveryParam = encodeURIComponent(
      `${CARRIER_LABELS[carrier!]} · ${mode === "pickup" && pickupPoint ? pickupPoint.name : address}`,
    );
    const redirectUrl = String(data.redirectUrl).includes("?")
      ? `${data.redirectUrl}&delivery=${deliveryParam}`
      : `${data.redirectUrl}?delivery=${deliveryParam}`;
    router.push(redirectUrl);

    setLoading(false);
  };

  const contactField = (key: keyof ContactForm, label: string, type = "text") => (
    <div>
      <Input
        type={type}
        value={contact[key]}
        onChange={(e) => {
          setContact((f) => ({ ...f, [key]: e.target.value }));
          if (errors[key]) setErrors((err) => ({ ...err, [key]: "" }));
        }}
        placeholder={label}
        aria-label={label}
        aria-invalid={Boolean(errors[key])}
        className="h-11"
      />
      {errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null}
    </div>
  );

  const deliverySummary = () => {
    if (!carrier || !tariff) return null;
    const carrierLabel = CARRIER_LABELS[carrier];
    const modeLabel = MODE_LABELS[mode];
    if (mode === "pickup" && pickupPoint) {
      return `${carrierLabel} · ${modeLabel} — ${pickupPoint.name}, ${pickupPoint.address}`;
    }
    return `${carrierLabel} · ${modeLabel} — ${city}, ${address}`;
  };

  const paymentOptions = [
    { id: "card" as const, label: "Банковская карта", hint: "Visa, Mastercard, МИР", icon: CreditCard },
    { id: "sbp" as const, label: "СБП", hint: "Оплата по QR-коду", icon: Smartphone },
  ];

  return (
    <>
      <div className="container-page section-pad pb-16">
        <CommercePageHeader
          label="Оформление"
          title="Ваш заказ"
          description="Заполните данные доставки и выберите способ оплаты."
        />

        <div className="mt-10">
          <CheckoutSteps steps={steps} current={step} onStepClick={setStep} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div>
            {step === 0 ? (
              <form
                className="space-y-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateDelivery()) setStep(1);
                }}
              >
                <div className="space-y-4">
                  <SectionTitle>Контактные данные</SectionTitle>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">{contactField("name", "Имя и фамилия")}</div>
                    {contactField("email", "Email", "email")}
                    {contactField("phone", "Телефон", "tel")}
                  </div>
                </div>

                {addresses.length > 0 ? (
                  <SavedAddressPicker
                    addresses={addresses}
                    selectedId={useManualAddress ? null : selectedAddressId}
                    onSelect={handleAddressSelect}
                  />
                ) : null}

                <div className="space-y-4">
                  <SectionTitle>Город доставки</SectionTitle>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Input
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setUseManualAddress(true);
                          setSelectedAddressId(null);
                          if (errors.city) setErrors((err) => ({ ...err, city: "" }));
                        }}
                        placeholder="Город"
                        aria-label="Город"
                        aria-invalid={Boolean(errors.city)}
                        className="h-11"
                      />
                      {errors.city ? (
                        <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                      ) : null}
                    </div>
                    <Input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Индекс (необязательно)"
                      aria-label="Почтовый индекс"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <SectionTitle>Служба доставки</SectionTitle>
                  <DeliveryCarrierSelect
                    tariffs={tariffs}
                    selectedCarrier={carrier}
                    selectedMode={mode}
                    loading={tariffsLoading && tariffs.length === 0}
                    onSelectCarrier={handleCarrierSelect}
                    onSelectMode={handleModeSelect}
                  />
                  {errors.carrier ? (
                    <p className="text-xs text-destructive">{errors.carrier}</p>
                  ) : null}
                </div>

                {mode === "courier" ? (
                  <div className="space-y-4">
                    <SectionTitle>Адрес курьера</SectionTitle>
                    <Input
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setUseManualAddress(true);
                        setSelectedAddressId(null);
                        if (errors.address) setErrors((err) => ({ ...err, address: "" }));
                      }}
                      placeholder="Улица, дом, квартира"
                      aria-label="Адрес доставки"
                      aria-invalid={Boolean(errors.address)}
                      className="h-11"
                    />
                    {errors.address ? (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    ) : null}
                  </div>
                ) : null}

                {mode === "pickup" && carrier ? (
                  <div className="space-y-4">
                    <SectionTitle>Пункт выдачи</SectionTitle>
                    <PickupPointPicker
                      points={pickupPoints}
                      selected={pickupPoint}
                      loading={pickupPointsLoading && pickupPoints.length === 0}
                      onSelect={(point) => {
                        setPickupPoint(point);
                        if (errors.pickup) setErrors((err) => ({ ...err, pickup: "" }));
                      }}
                    />
                    {errors.pickup ? (
                      <p className="text-xs text-destructive">{errors.pickup}</p>
                    ) : null}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="h-11 cursor-pointer text-[10px] tracking-[0.2em] uppercase"
                >
                  Далее — оплата
                </Button>
              </form>
            ) : null}

            {step === 1 ? (
              <div className="space-y-6">
                <SectionTitle>Способ оплаты</SectionTitle>
                <div className="space-y-3" role="radiogroup" aria-label="Способ оплаты">
                  {paymentOptions.map(({ id, label, hint, icon: Icon }) => {
                    const selected = payment === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setPayment(id)}
                        className={cn(
                          "flex w-full items-center gap-4 border p-5 text-left transition-colors cursor-pointer motion-safe:duration-300",
                          selected
                            ? "border-black bg-cream/80 ring-1 ring-black"
                            : "border-border hover:border-black/40",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-11 shrink-0 items-center justify-center border bg-white",
                            selected ? "border-gold" : "border-border",
                          )}
                        >
                          <Icon className="size-5" strokeWidth={1} aria-hidden />
                        </span>
                        <span>
                          <span className="block text-[11px] tracking-[0.14em] uppercase">
                            {label}
                          </span>
                          <span className="mt-0.5 block text-xs text-grey">{hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer text-[10px] tracking-[0.16em] uppercase"
                    onClick={() => setStep(0)}
                  >
                    Назад
                  </Button>
                  <Button
                    className="cursor-pointer text-[10px] tracking-[0.2em] uppercase"
                    onClick={() => setStep(2)}
                  >
                    Далее — проверка
                  </Button>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-8">
                <SectionTitle>Проверьте заказ</SectionTitle>

                <div className="border border-border bg-cream/40 p-6">
                  <dl className="space-y-4 text-sm">
                    <div>
                      <dt className="text-[10px] tracking-[0.16em] text-grey uppercase">
                        Доставка
                      </dt>
                      <dd className="mt-1 text-charcoal">{deliverySummary()}</dd>
                      <dd className="mt-1 text-grey">
                        {contact.name} · {contact.phone} · {contact.email}
                      </dd>
                    </div>
                    <div className="hairline" />
                    <div>
                      <dt className="text-[10px] tracking-[0.16em] text-grey uppercase">Оплата</dt>
                      <dd className="mt-1 text-charcoal">
                        {payment === "card" ? "Банковская карта" : "СБП"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <ul className="divide-y divide-border border border-border bg-white">
                  {lines.map((l) => (
                    <li key={l.product.slug} className="flex items-center gap-4 p-4">
                      <div className="relative size-16 shrink-0 bg-cream">
                        <div className="absolute inset-2">
                          <Image
                            src={l.product.image}
                            alt=""
                            fill
                            className="object-contain object-bottom"
                            sizes="64px"
                          />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] tracking-[0.14em] uppercase">
                          {l.product.shortName}
                        </p>
                        <p className="text-xs text-grey">× {l.qty}</p>
                      </div>
                      <p className="shrink-0 text-sm tabular-nums">
                        {formatPrice(l.product.price * l.qty)}
                      </p>
                    </li>
                  ))}
                </ul>

                <ConsentFields
                  acceptOffer={acceptOffer}
                  acceptPrivacy={acceptPrivacy}
                  onAcceptOfferChange={(v) => {
                    setAcceptOffer(v);
                    if (v) setConsentErrors((e) => ({ ...e, offer: undefined }));
                  }}
                  onAcceptPrivacyChange={(v) => {
                    setAcceptPrivacy(v);
                    if (v) setConsentErrors((e) => ({ ...e, privacy: undefined }));
                  }}
                  offerError={consentErrors.offer}
                  privacyError={consentErrors.privacy}
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer text-[10px] tracking-[0.16em] uppercase"
                    onClick={() => setStep(1)}
                  >
                    Назад
                  </Button>
                  <Button
                    className="h-12 flex-1 cursor-pointer text-[10px] tracking-[0.2em] uppercase sm:flex-none sm:px-10"
                    disabled={loading}
                    onClick={handlePay}
                  >
                    {loading ? "Обработка…" : `Оплатить ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <OrderSummary
              lines={lines}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              promoCode={promoCode}
            />
            <p className="text-center text-xs text-grey">
              <Link href="/cart" className="underline underline-offset-4 hover:text-black">
                Вернуться в корзину
              </Link>
            </p>
          </div>
        </div>
      </div>

      <CommerceTrustMarquee />
    </>
  );
}
