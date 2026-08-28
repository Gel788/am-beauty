"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const faq = [
  {
    q: "Как долго идёт доставка?",
    a: "По Москве — 1–2 дня, по России — 1–5 дней в зависимости от региона.",
  },
  {
    q: "Можно ли вернуть товар?",
    a: "Да, в течение 14 дней при сохранении упаковки и чека.",
  },
  {
    q: "Есть ли тестеры?",
    a: "К каждому заказу от 5 000 ₽ добавляем набор миниатюр.",
  },
  {
    q: "Подходит ли косметика при беременности?",
    a: "Уточняйте состав конкретного продукта. Bakuchiol Night без ретинола.",
  },
];

export function ContactsView() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="container-page section-pad">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <PageHeader label="Контакты" title="Свяжитесь с нами" align="left" className="!text-left" />

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="label-caps">Email</dt>
              <dd className="mt-2">
                <a href="mailto:hello@ambeauty.ru" className="hover:opacity-60">
                  hello@ambeauty.ru
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Телефон</dt>
              <dd className="mt-2">
                <a href="tel:+74951234567" className="hover:opacity-60">
                  +7 (495) 123-45-67
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Шоурум</dt>
              <dd className="mt-2 text-grey">Москва, Патриаршие пруды</dd>
            </div>
            <div>
              <dt className="label-caps">Часы работы</dt>
              <dd className="mt-2 text-grey">Пн–Вс 10:00–21:00</dd>
            </div>
          </dl>

          <form
            className="mt-12 space-y-3 border-t border-border pt-12"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Сообщение отправлено. Ответим в течение 24 часов.");
              setForm({ name: "", email: "", message: "" });
            }}
          >
            <h2 className="text-[10px] tracking-[0.22em] uppercase">Написать нам</h2>
            <Input
              required
              placeholder="Имя"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-11"
              aria-label="Имя"
            />
            <Input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="h-11"
              aria-label="Email"
            />
            <textarea
              required
              placeholder="Сообщение"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={4}
              aria-label="Сообщение"
              className="w-full border border-border bg-white px-4 py-3 text-sm outline-none focus:border-black"
            />
            <Button type="submit" className="cursor-pointer">
              Отправить
            </Button>
          </form>
        </div>

        <section id="faq">
          <h2 className="headline-lg !text-left !text-xl">FAQ</h2>
          <div className="mt-8">
            {faq.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" strokeWidth={1} />
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-grey">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
