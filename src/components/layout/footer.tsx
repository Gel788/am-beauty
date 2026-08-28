"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { legalLinks } from "@/data/company";
import { useSite } from "@/context/catalog-context";

const shop = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=serums", label: "Сыворотки" },
  { href: "/catalog?category=makeup", label: "Макияж" },
  { href: "/catalog?category=face-care", label: "Уход" },
];

const info = [
  { href: "/about", label: "О бренде" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/contacts#faq", label: "FAQ" },
];

const legal = [
  { href: legalLinks.offer, label: "Оферта" },
  { href: legalLinks.privacy, label: "Конфиденциальность" },
  { href: legalLinks.delivery, label: "Доставка и оплата" },
  { href: legalLinks.returns, label: "Возврат" },
  { href: legalLinks.cookies, label: "Cookie" },
];

export function Footer() {
  const site = useSite();
  const company = site.company;

  return (
    <footer className="section-invert">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-4">
          <p className="text-[11px] font-medium tracking-[0.42em] uppercase">{site.brand}</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">{site.footerTagline}</p>
          <address className="mt-6 not-italic text-xs leading-relaxed text-white/45">
            <p>{company.shortLegalName}</p>
            <p className="mt-1">
              ИНН {company.inn} · ОГРНИП {company.ogrnip}
            </p>
            <p className="mt-2">{company.legalAddress}</p>
            <p className="mt-2">
              <a href={`mailto:${site.email}`} className="hover:text-white/70">
                {site.email}
              </a>
            </p>
            <p>
              <a href={`tel:${site.phoneHref}`} className="hover:text-white/70">
                {site.phone}
              </a>
            </p>
          </address>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Магазин</p>
          <ul className="mt-5 space-y-3">
            {shop.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.18em] text-white/70 uppercase transition-opacity hover:opacity-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Информация</p>
          <ul className="mt-5 space-y-3">
            {info.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.18em] text-white/70 uppercase transition-opacity hover:opacity-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Правовая информация</p>
          <ul className="mt-5 space-y-3">
            {legal.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.18em] text-white/70 uppercase transition-opacity hover:opacity-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Рассылка</p>
          <form className="mt-5 flex flex-col gap-3" action="#">
            <Input
              type="email"
              placeholder="Email"
              aria-label="Email"
              className="h-11 border-white/20 bg-transparent text-white placeholder:text-white/40"
            />
            <button
              type="submit"
              className="btn-chanel-outline shrink-0 cursor-pointer !border-white !text-white hover:!bg-white hover:!text-black"
            >
              OK
            </button>
            <p className="text-[10px] leading-relaxed text-white/40">
              Нажимая OK, вы соглашаетесь с{" "}
              <Link href={legalLinks.privacy} className="underline underline-offset-2">
                политикой конфиденциальности
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-[10px] tracking-[0.18em] text-white/40 uppercase sm:flex-row">
          <p>© 2026 {site.brand}</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href={legalLinks.privacy} className="transition-opacity hover:opacity-70">
              Конфиденциальность
            </Link>
            <Link href={legalLinks.offer} className="transition-opacity hover:opacity-70">
              Оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
