"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OrderSummary } from "@/components/commerce/order-summary";
import { ConsentFields } from "@/components/legal/consent-fields";
import { formatPrice } from "@/data/products";
import { createPayment } from "@/lib/payment";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

const steps = ["Доставка", "Оплата", "Подтверждение"] as const;

type DeliveryForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
};

const emptyForm: DeliveryForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
};

export function CheckoutView() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DeliveryForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof DeliveryForm, string>>>({});
  const [payment, setPayment] = useState<"card" | "sbp">("card");
  const [acceptOffer, setAcceptOffer] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [consentErrors, setConsentErrors] = useState<{ offer?: string; privacy?: string }>({});
  const { lines, subtotal, discount, shipping, total, promoCode } = useCartTotals();
  const clearCart = useCartStore((s) => s.clearCart);

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
    const next: Partial<Record<keyof DeliveryForm, string>> = {};
    if (!form.name.trim()) next.name = "Укажите имя";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Укажите email";
    if (!form.phone.trim()) next.phone = "Укажите телефон";
    if (!form.city.trim()) next.city = "Укажите город";
    if (!form.address.trim()) next.address = "Укажите адрес";
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
    const result = await createPayment({
      orderId,
      amount: total,
      description: `Заказ AM Beauty ${orderId}`,
      returnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/success`,
    });
    setLoading(false);
    if (result.ok) {
      clearCart();
      router.push(result.redirectUrl);
    } else {
      toast.error(result.error);
    }
  };

  const field = (key: keyof DeliveryForm, label: string, type = "text") => (
    <div>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [key]: e.target.value }));
          if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
        }}
        placeholder={label}
        aria-label={label}
        aria-invalid={Boolean(errors[key])}
        className="h-11"
      />
      {errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null}
    </div>
  );

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
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateDelivery()) setStep(1);
              }}
            >
              <h2 className="text-[10px] tracking-[0.22em] uppercase">Адрес доставки</h2>
              {field("name", "Имя и фамилия")}
              {field("email", "Email", "email")}
              {field("phone", "Телефон", "tel")}
              {field("city", "Город")}
              {field("address", "Адрес доставки")}
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
                  <dd className="mt-1 text-black">
                    {form.name}, {form.city}, {form.address}
                  </dd>
                  <dd className="text-black">
                    {form.phone} · {form.email}
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
