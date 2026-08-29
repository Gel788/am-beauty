"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { legalLinks } from "@/data/company";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSite } from "@/context/catalog-context";
import { submitInquiry } from "@/lib/inquiries/submit-inquiry";

export function ContactsView() {
  const site = useSite();
  const faq = site.contacts.faq;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  return (
    <div className="container-page section-pad">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <PageHeader
            label="Контакты"
            title={site.contacts.title}
            align="left"
            className="!text-left"
          />

          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="label-caps">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${site.email}`} className="hover:opacity-60">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Телефон</dt>
              <dd className="mt-2">
                <a href={`tel:${site.phoneHref}`} className="hover:opacity-60">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="label-caps">Адрес</dt>
              <dd className="mt-2 text-grey">{site.company.postalAddress}</dd>
            </div>
            <div>
              <dt className="label-caps">Часы работы</dt>
              <dd className="mt-2 text-grey">{site.workingHours}</dd>
            </div>
          </dl>

          <form
            className="mt-12 space-y-3 border-t border-border pt-12"
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending) return;
              setSending(true);
              try {
                await submitInquiry({
                  type: "contact",
                  name: form.name.trim(),
                  email: form.email.trim(),
                  message: form.message.trim(),
                });
                toast.success("Сообщение отправлено. Ответим в течение 24 часов.");
                setForm({ name: "", email: "", message: "" });
              } catch {
                toast.error("Не удалось отправить сообщение");
              } finally {
                setSending(false);
              }
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
            <Button type="submit" disabled={sending} className="cursor-pointer">
              {sending ? "Отправка..." : "Отправить"}
            </Button>
            <p className="text-xs text-grey">
              Отправляя форму, вы соглашаетесь с{" "}
              <Link href={legalLinks.privacy} className="underline underline-offset-2">
                политикой конфиденциальности
              </Link>
              .
            </p>
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
