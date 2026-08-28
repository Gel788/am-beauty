"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeliveryCarrierSelect } from "@/components/checkout/delivery-carrier-select";
import { PickupPointPicker } from "@/components/checkout/pickup-point-picker";
import { OrderSummary } from "@/components/commerce/order-summary";
import { ConsentFields } from "@/components/legal/consent-fields";
import { formatPrice } from "@/data/products";
import { useDeliveryQuote, usePickupPointsQuote } from "@/hooks/use-delivery-quote";
import { useOrderTotals } from "@/hooks/use-order-totals";
import { createPayment } from "@/lib/payment";
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
import { PageHeader } from "@/components/ui/page-header";

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

export function CheckoutView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<"card" | "sbp">("card");
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [consentErrors, setConsentErrors] = useState<{ offer?: string; privacy?: string }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const profileName = useAccountStore((s) => s.profile.name);
  const profileEmail = useAccountStore((s) => s.profile.email);
  const profilePhone = useAccountStore((s) => s.profile.phone);
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
      pickupPoint: mode === "pickup" ? pickupPoint ?? undefined : undefined,
    };

    const result = await createPayment({
      orderId,
      amount: total,
      description: `Заказ AM Beauty ${orderId}`,
      returnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/success`,
    });

    if (result.ok) {
      updateProfile(contact);
      addOrder({
        id: orderId,
        date: new Date().toISOString().slice(0, 10),
        status: "processing",
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
      });

      clearCart();
      resetDelivery();

      const deliveryParam = encodeURIComponent(
        `${CARRIER_LABELS[carrier!]} · ${mode === "pickup" && pickupPoint ? pickupPoint.name : address}`,
      );
      const redirectUrl = result.redirectUrl.includes("?")
        ? `${result.redirectUrl}&delivery=${deliveryParam}`
        : `${result.redirectUrl}?delivery=${deliveryParam}`;
      router.push(redirectUrl);
    } else {
      toast.error(result.error);
    }

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

  return (
    <div className="container-page section-pad pb-16">
      <PageHeader label="Оформление" title="Ваш заказ" align="left" />

      <ol className="mt-10 flex gap-0 border-b border-border" aria-label="Шаги оформления">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex-1 pb-3 text-center text-[10px] tracking-[0.16em] uppercase ${
              i <= step ? "border-b-2 border-black text-black" : "text-grey"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {step === 0 ? (
            <form
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateDelivery()) setStep(1);
              }}
            >
              <div className="space-y-4">
                <h2 className="text-[10px] tracking-[0.22em] uppercase">Контактные данные</h2>
                {contactField("name", "Имя и фамилия")}
                {contactField("email", "Email", "email")}
                {contactField("phone", "Телефон", "tel")}
              </div>

              <div className="space-y-4">
                <h2 className="text-[10px] tracking-[0.22em] uppercase">Город доставки</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Input
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors((err) => ({ ...err, city: "" }));
                      }}
                      placeholder="Город"
                      aria-label="Город"
                      aria-invalid={Boolean(errors.city)}
                      className="h-11"
                    />
                    {errors.city ? <p className="mt-1 text-xs text-destructive">{errors.city}</p> : null}
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
                <h2 className="text-[10px] tracking-[0.22em] uppercase">Служба доставки</h2>
                <DeliveryCarrierSelect
                  tariffs={tariffs}
                  selectedCarrier={carrier}
                  selectedMode={mode}
                  loading={tariffsLoading && tariffs.length === 0}
                  onSelectCarrier={handleCarrierSelect}
                  onSelectMode={handleModeSelect}
                />
                {errors.carrier ? <p className="text-xs text-destructive">{errors.carrier}</p> : null}
              </div>

              {mode === "courier" ? (
                <div className="space-y-4">
                  <h2 className="text-[10px] tracking-[0.22em] uppercase">Адрес курьера</h2>
                  <Input
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((err) => ({ ...err, address: "" }));
                    }}
                    placeholder="Улица, дом, квартира"
                    aria-label="Адрес доставки"
                    aria-invalid={Boolean(errors.address)}
                    className="h-11"
                  />
                  {errors.address ? <p className="text-xs text-destructive">{errors.address}</p> : null}
                </div>
              ) : null}

              {mode === "pickup" && carrier ? (
                <div className="space-y-4">
                  <h2 className="text-[10px] tracking-[0.22em] uppercase">Пункт выдачи</h2>
                  <PickupPointPicker
                    points={pickupPoints}
                    selected={pickupPoint}
                    loading={pickupPointsLoading && pickupPoints.length === 0}
                    onSelect={(point) => {
                      setPickupPoint(point);
                      if (errors.pickup) setErrors((err) => ({ ...err, pickup: "" }));
                    }}
                  />
                  {errors.pickup ? <p className="text-xs text-destructive">{errors.pickup}</p> : null}
                </div>
              ) : null}

              <Button type="submit" className="mt-2 cursor-pointer">
                Далее
              </Button>
            </form>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-[10px] tracking-[0.22em] uppercase">Способ оплаты</h2>
              <label className="flex cursor-pointer items-center gap-4 border border-border p-4 has-[:checked]:border-black">
                <input
                  type="radio"
                  name="pay"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                  className="accent-black"
                />
                <span className="text-sm">Банковская карта</span>
              </label>
              <label className="flex cursor-pointer items-center gap-4 border border-border p-4 has-[:checked]:border-black">
                <input
                  type="radio"
                  name="pay"
                  checked={payment === "sbp"}
                  onChange={() => setPayment("sbp")}
                  className="accent-black"
                />
                <span className="text-sm">СБП</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="cursor-pointer" onClick={() => setStep(0)}>
                  Назад
                </Button>
                <Button className="cursor-pointer" onClick={() => setStep(2)}>
                  Далее
                </Button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <h2 className="text-[10px] tracking-[0.22em] uppercase">Проверьте заказ</h2>
              <dl className="space-y-2 text-sm text-grey">
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase">Доставка</dt>
                  <dd className="mt-1 text-black">{deliverySummary()}</dd>
                  <dd className="text-black">
                    {contact.name} · {contact.phone} · {contact.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] tracking-[0.16em] uppercase">Оплата</dt>
                  <dd className="mt-1 text-black">{payment === "card" ? "Карта" : "СБП"}</dd>
                </div>
              </dl>
              <ul className="divide-y divide-border border-t border-border">
                {lines.map((l) => (
                  <li key={l.product.slug} className="flex items-center gap-4 py-4">
                    <div className="relative size-14 shrink-0 bg-cream">
                      <div className="absolute inset-1.5">
                        <Image
                          src={l.product.image}
                          alt=""
                          fill
                          className="object-contain object-bottom"
                          sizes="56px"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] tracking-[0.14em] uppercase">{l.product.shortName}</p>
                      <p className="text-xs text-grey">× {l.qty}</p>
                    </div>
                    <p className="text-sm">{formatPrice(l.product.price * l.qty)}</p>
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
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="cursor-pointer" onClick={() => setStep(1)}>
                  Назад
                </Button>
                <Button className="cursor-pointer" disabled={loading} onClick={handlePay}>
                  {loading ? "Обработка…" : `Оплатить ${formatPrice(total)}`}
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <OrderSummary
          lines={lines}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          total={total}
          promoCode={promoCode}
          className="lg:sticky lg:top-24"
        />
      </div>
    </div>
  );
}
