"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AdminButton,
  AdminField,
  AdminGrid,
  AdminInput,
  AdminTextarea,
  joinLines,
  parseLines,
} from "@/components/admin/admin-form";
import { AdminPanel } from "@/components/admin/admin-ui";
import { MediaField } from "@/components/admin/media-field";
import type { AdminSiteSettings } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "brand", label: "Бренд" },
  { id: "home", label: "Главная" },
  { id: "about", label: "О бренде" },
  { id: "contacts", label: "Контакты" },
  { id: "catalog", label: "Каталог" },
  { id: "company", label: "Реквизиты" },
  { id: "nav", label: "Меню" },
  { id: "marquee", label: "Бегущая строка" },
  { id: "shipping", label: "Доставка" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type Props = {
  site: AdminSiteSettings;
  onChange: (site: AdminSiteSettings) => void;
  onSave: () => void;
  saving: boolean;
};

export function SiteEditor({ site, onChange, onSave, saving }: Props) {
  const [tab, setTab] = useState<TabId>("brand");

  const set = <K extends keyof AdminSiteSettings>(key: K, value: AdminSiteSettings[K]) => {
    onChange({ ...site, [key]: value });
  };

  const setHome = <K extends keyof AdminSiteSettings["home"]>(
    key: K,
    value: AdminSiteSettings["home"][K],
  ) => {
    onChange({ ...site, home: { ...site.home, [key]: value } });
  };

  const setAbout = <K extends keyof AdminSiteSettings["about"]>(
    key: K,
    value: AdminSiteSettings["about"][K],
  ) => {
    onChange({ ...site, about: { ...site.about, [key]: value } });
  };

  const setContacts = <K extends keyof AdminSiteSettings["contacts"]>(
    key: K,
    value: AdminSiteSettings["contacts"][K],
  ) => {
    onChange({ ...site, contacts: { ...site.contacts, [key]: value } });
  };

  const setCatalog = <K extends keyof AdminSiteSettings["catalog"]>(
    key: K,
    value: AdminSiteSettings["catalog"][K],
  ) => {
    onChange({ ...site, catalog: { ...site.catalog, [key]: value } });
  };

  const setCompany = <K extends keyof AdminSiteSettings["company"]>(
    key: K,
    value: AdminSiteSettings["company"][K],
  ) => {
    onChange({ ...site, company: { ...site.company, [key]: value } });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer px-3 py-2 text-[10px] tracking-[0.14em] uppercase transition-colors",
              tab === t.id ? "bg-black text-white" : "bg-white text-grey hover:text-black",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "brand" ? (
        <AdminPanel title="Бренд и футер">
          <AdminGrid>
            <AdminField label="Название">
              <AdminInput value={site.brand} onChange={(e) => set("brand", e.target.value)} />
            </AdminField>
            <AdminField label="Слоган">
              <AdminInput value={site.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </AdminField>
          </AdminGrid>
          <AdminField label="Текст в футере">
            <AdminTextarea
              value={site.footerTagline}
              onChange={(e) => set("footerTagline", e.target.value)}
            />
          </AdminField>
          <div className="mt-5">
            <AdminGrid>
            <AdminField label="Email">
              <AdminInput value={site.email} onChange={(e) => set("email", e.target.value)} />
            </AdminField>
            <AdminField label="Телефон">
              <AdminInput value={site.phone} onChange={(e) => set("phone", e.target.value)} />
            </AdminField>
            <AdminField label="Телефон (href)">
              <AdminInput value={site.phoneHref} onChange={(e) => set("phoneHref", e.target.value)} />
            </AdminField>
            <AdminField label="Часы работы">
              <AdminInput
                value={site.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
              />
            </AdminField>
          </AdminGrid>
          </div>
        </AdminPanel>
      ) : null}

      {tab === "home" ? (
        <div className="space-y-6">
          <AdminPanel title="Hero">
            <div className="space-y-5">
              <AdminField label="Метка">
                <AdminInput
                  value={site.home.heroLabel}
                  onChange={(e) => setHome("heroLabel", e.target.value)}
                />
              </AdminField>
              <AdminField label="Заголовок">
                <AdminInput
                  value={site.home.heroTitle}
                  onChange={(e) => setHome("heroTitle", e.target.value)}
                />
              </AdminField>
              <AdminField label="Подзаголовок">
                <AdminTextarea
                  value={site.home.heroSubtitle}
                  onChange={(e) => setHome("heroSubtitle", e.target.value)}
                />
              </AdminField>
              <AdminField label="Кнопка CTA">
                <AdminInput
                  value={site.home.heroCta}
                  onChange={(e) => setHome("heroCta", e.target.value)}
                />
              </AdminField>
              <AdminField label="Подпись внизу hero">
                <AdminInput
                  value={site.home.heroFootnote}
                  onChange={(e) => setHome("heroFootnote", e.target.value)}
                />
              </AdminField>
              <MediaField
                label="Изображение hero"
                accept="image"
                value={site.home.heroImage}
                onChange={(url) => setHome("heroImage", url)}
              />
            </div>
          </AdminPanel>

          <AdminPanel title="Манифест">
            <div className="space-y-5">
              <AdminGrid>
                <AdminField label="Метка">
                  <AdminInput
                    value={site.home.manifestoLabel}
                    onChange={(e) => setHome("manifestoLabel", e.target.value)}
                  />
                </AdminField>
                <AdminField label="Заголовок" hint="Перенос строки — Enter">
                  <AdminTextarea
                    value={site.home.manifestoTitle}
                    onChange={(e) => setHome("manifestoTitle", e.target.value)}
                  />
                </AdminField>
              </AdminGrid>
              <AdminField label="Текст">
                <AdminTextarea
                  value={site.home.manifestoText}
                  onChange={(e) => setHome("manifestoText", e.target.value)}
                />
              </AdminField>
              <MediaField
                label="Изображение"
                accept="image"
                value={site.home.manifestoImage}
                onChange={(url) => setHome("manifestoImage", url)}
              />
            </div>
          </AdminPanel>

          <AdminPanel title="Коллекция на главной">
            <AdminGrid>
              <AdminField label="Метка">
                <AdminInput
                  value={site.home.featuredLabel}
                  onChange={(e) => setHome("featuredLabel", e.target.value)}
                />
              </AdminField>
              <AdminField label="Заголовок">
                <AdminInput
                  value={site.home.featuredTitle}
                  onChange={(e) => setHome("featuredTitle", e.target.value)}
                />
              </AdminField>
            </AdminGrid>
            <AdminField label="Подсказка" className="mt-5">
              <AdminInput
                value={site.home.featuredHint}
                onChange={(e) => setHome("featuredHint", e.target.value)}
              />
            </AdminField>
            <AdminField label="Заголовок блока категорий" className="mt-5">
              <AdminInput
                value={site.home.categoriesTitle}
                onChange={(e) => setHome("categoriesTitle", e.target.value)}
              />
            </AdminField>
          </AdminPanel>

          <AdminPanel title="Ритуал">
            <MediaField
              label="Изображение"
              accept="image"
              value={site.home.ritualImage}
              onChange={(url) => setHome("ritualImage", url)}
            />
            <div className="mt-6 space-y-4">
              {site.home.ritualSteps.map((step, i) => (
                <div key={i} className="grid gap-3 border border-black/10 p-4 md:grid-cols-3">
                  <AdminField label="Номер">
                    <AdminInput
                      value={step.num}
                      onChange={(e) => {
                        const ritualSteps = [...site.home.ritualSteps];
                        ritualSteps[i] = { ...step, num: e.target.value };
                        setHome("ritualSteps", ritualSteps);
                      }}
                    />
                  </AdminField>
                  <AdminField label="Заголовок">
                    <AdminInput
                      value={step.title}
                      onChange={(e) => {
                        const ritualSteps = [...site.home.ritualSteps];
                        ritualSteps[i] = { ...step, title: e.target.value };
                        setHome("ritualSteps", ritualSteps);
                      }}
                    />
                  </AdminField>
                  <AdminField label="Текст">
                    <AdminInput
                      value={step.text}
                      onChange={(e) => {
                        const ritualSteps = [...site.home.ritualSteps];
                        ritualSteps[i] = { ...step, text: e.target.value };
                        setHome("ritualSteps", ritualSteps);
                      }}
                    />
                  </AdminField>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Преимущества">
            <div className="space-y-4">
              {site.home.benefits.map((item, i) => (
                <div key={i} className="grid gap-3 border border-black/10 p-4 md:grid-cols-2">
                  <AdminField label="Заголовок">
                    <AdminInput
                      value={item.title}
                      onChange={(e) => {
                        const benefits = [...site.home.benefits];
                        benefits[i] = { ...item, title: e.target.value };
                        setHome("benefits", benefits);
                      }}
                    />
                  </AdminField>
                  <AdminField label="Текст">
                    <AdminTextarea
                      value={item.text}
                      onChange={(e) => {
                        const benefits = [...site.home.benefits];
                        benefits[i] = { ...item, text: e.target.value };
                        setHome("benefits", benefits);
                      }}
                    />
                  </AdminField>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Рассылка">
            <AdminField label="Заголовок">
              <AdminInput
                value={site.home.newsletterTitle}
                onChange={(e) => setHome("newsletterTitle", e.target.value)}
              />
            </AdminField>
            <AdminField label="Текст" className="mt-5">
              <AdminTextarea
                value={site.home.newsletterText}
                onChange={(e) => setHome("newsletterText", e.target.value)}
              />
            </AdminField>
          </AdminPanel>
        </div>
      ) : null}

      {tab === "about" ? (
        <AdminPanel title="Страница «О бренде»">
          <div className="space-y-5">
            <AdminGrid>
              <AdminField label="Метка">
                <AdminInput
                  value={site.about.label}
                  onChange={(e) => setAbout("label", e.target.value)}
                />
              </AdminField>
              <AdminField label="Заголовок">
                <AdminInput
                  value={site.about.title}
                  onChange={(e) => setAbout("title", e.target.value)}
                />
              </AdminField>
            </AdminGrid>
            <AdminField label="Абзац 1">
              <AdminTextarea
                value={site.about.paragraph1}
                onChange={(e) => setAbout("paragraph1", e.target.value)}
              />
            </AdminField>
            <AdminField label="Абзац 2">
              <AdminTextarea
                value={site.about.paragraph2}
                onChange={(e) => setAbout("paragraph2", e.target.value)}
              />
            </AdminField>
            <MediaField
              label="Изображение"
              accept="image"
              value={site.about.image}
              onChange={(url) => setAbout("image", url)}
            />
            <AdminField label="Бейджи" hint="Каждый с новой строки">
              <AdminTextarea
                value={joinLines(site.about.badges)}
                onChange={(e) => setAbout("badges", parseLines(e.target.value))}
              />
            </AdminField>
          </div>
        </AdminPanel>
      ) : null}

      {tab === "contacts" ? (
        <AdminPanel title="Контакты и FAQ">
          <AdminField label="Заголовок страницы">
            <AdminInput
              value={site.contacts.title}
              onChange={(e) => setContacts("title", e.target.value)}
            />
          </AdminField>
          <div className="mt-6 space-y-4">
            {site.contacts.faq.map((item, i) => (
              <div key={i} className="space-y-3 border border-black/10 p-4">
                <AdminField label={`Вопрос ${i + 1}`}>
                  <AdminInput
                    value={item.q}
                    onChange={(e) => {
                      const faq = [...site.contacts.faq];
                      faq[i] = { ...item, q: e.target.value };
                      setContacts("faq", faq);
                    }}
                  />
                </AdminField>
                <AdminField label="Ответ">
                  <AdminTextarea
                    value={item.a}
                    onChange={(e) => {
                      const faq = [...site.contacts.faq];
                      faq[i] = { ...item, a: e.target.value };
                      setContacts("faq", faq);
                    }}
                  />
                </AdminField>
                <AdminButton
                  variant="danger"
                  onClick={() => setContacts("faq", site.contacts.faq.filter((_, j) => j !== i))}
                >
                  Удалить
                </AdminButton>
              </div>
            ))}
            <AdminButton
              variant="ghost"
              onClick={() =>
                setContacts("faq", [...site.contacts.faq, { q: "Новый вопрос", a: "Ответ" }])
              }
            >
              Добавить вопрос
            </AdminButton>
          </div>
        </AdminPanel>
      ) : null}

      {tab === "catalog" ? (
        <AdminPanel title="Страница каталога">
          <AdminField label="Метка в hero">
            <AdminInput
              value={site.catalog.label}
              onChange={(e) => setCatalog("label", e.target.value)}
            />
          </AdminField>
          <AdminField label="Заголовок по умолчанию" className="mt-5">
            <AdminInput
              value={site.catalog.defaultTitle}
              onChange={(e) => setCatalog("defaultTitle", e.target.value)}
            />
          </AdminField>
          <AdminField label="Описание по умолчанию" className="mt-5">
            <AdminTextarea
              value={site.catalog.defaultDescription}
              onChange={(e) => setCatalog("defaultDescription", e.target.value)}
            />
          </AdminField>
        </AdminPanel>
      ) : null}

      {tab === "company" ? (
        <AdminPanel title="Юридические реквизиты">
          <div className="space-y-5">
            <AdminGrid>
              <AdminField label="Полное наименование">
                <AdminInput
                  value={site.company.legalName}
                  onChange={(e) => setCompany("legalName", e.target.value)}
                />
              </AdminField>
              <AdminField label="Краткое наименование">
                <AdminInput
                  value={site.company.shortLegalName}
                  onChange={(e) => setCompany("shortLegalName", e.target.value)}
                />
              </AdminField>
              <AdminField label="ИНН">
                <AdminInput value={site.company.inn} onChange={(e) => setCompany("inn", e.target.value)} />
              </AdminField>
              <AdminField label="ОГРНИП">
                <AdminInput
                  value={site.company.ogrnip}
                  onChange={(e) => setCompany("ogrnip", e.target.value)}
                />
              </AdminField>
              <AdminField label="ОКВЭД">
                <AdminInput
                  value={site.company.okved}
                  onChange={(e) => setCompany("okved", e.target.value)}
                />
              </AdminField>
              <AdminField label="Сайт">
                <AdminInput
                  value={site.company.siteUrl}
                  onChange={(e) => setCompany("siteUrl", e.target.value)}
                />
              </AdminField>
            </AdminGrid>
            <AdminField label="Юридический адрес">
              <AdminTextarea
                value={site.company.legalAddress}
                onChange={(e) => setCompany("legalAddress", e.target.value)}
              />
            </AdminField>
            <AdminField label="Почтовый адрес">
              <AdminTextarea
                value={site.company.postalAddress}
                onChange={(e) => setCompany("postalAddress", e.target.value)}
              />
            </AdminField>
            <AdminGrid>
              <AdminField label="Банк">
                <AdminInput
                  value={site.company.bankName}
                  onChange={(e) => setCompany("bankName", e.target.value)}
                />
              </AdminField>
              <AdminField label="БИК">
                <AdminInput value={site.company.bik} onChange={(e) => setCompany("bik", e.target.value)} />
              </AdminField>
              <AdminField label="Р/с">
                <AdminInput
                  value={site.company.account}
                  onChange={(e) => setCompany("account", e.target.value)}
                />
              </AdminField>
              <AdminField label="К/с">
                <AdminInput
                  value={site.company.corrAccount}
                  onChange={(e) => setCompany("corrAccount", e.target.value)}
                />
              </AdminField>
              <AdminField label="Руководитель">
                <AdminInput
                  value={site.company.headName}
                  onChange={(e) => setCompany("headName", e.target.value)}
                />
              </AdminField>
              <AdminField label="Срок ответа поддержки">
                <AdminInput
                  value={site.company.supportResponse}
                  onChange={(e) => setCompany("supportResponse", e.target.value)}
                />
              </AdminField>
            </AdminGrid>
          </div>
        </AdminPanel>
      ) : null}

      {tab === "nav" ? (
        <AdminPanel title="Навигация в шапке">
          <div className="space-y-3">
            {site.nav.map((link, i) => (
              <div key={i} className="grid gap-3 border border-black/10 p-4 md:grid-cols-2">
                <AdminField label="Подпись">
                  <AdminInput
                    value={link.label}
                    onChange={(e) => {
                      const nav = [...site.nav];
                      nav[i] = { ...link, label: e.target.value };
                      set("nav", nav);
                    }}
                  />
                </AdminField>
                <AdminField label="Ссылка">
                  <AdminInput
                    value={link.href}
                    onChange={(e) => {
                      const nav = [...site.nav];
                      nav[i] = { ...link, href: e.target.value };
                      set("nav", nav);
                    }}
                  />
                </AdminField>
              </div>
            ))}
            <AdminButton
              variant="ghost"
              onClick={() => set("nav", [...site.nav, { label: "Новый пункт", href: "/" }])}
            >
              Добавить пункт
            </AdminButton>
          </div>
        </AdminPanel>
      ) : null}

      {tab === "marquee" ? (
        <AdminPanel title="Бегущая строка">
          <AdminField label="Фразы" hint="Каждая с новой строки">
            <AdminTextarea
              value={joinLines(site.marquee)}
              onChange={(e) => set("marquee", parseLines(e.target.value))}
              className="min-h-[200px]"
            />
          </AdminField>
        </AdminPanel>
      ) : null}

      {tab === "shipping" ? (
        <AdminPanel title="Доставка">
          <AdminGrid>
            <AdminField label="Бесплатная доставка от, ₽">
              <AdminInput
                type="number"
                value={site.freeShippingThreshold}
                onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
              />
            </AdminField>
            <AdminField label="Стоимость доставки, ₽">
              <AdminInput
                type="number"
                value={site.shippingCost}
                onChange={(e) => set("shippingCost", Number(e.target.value))}
              />
            </AdminField>
          </AdminGrid>
        </AdminPanel>
      ) : null}

      <AdminButton onClick={onSave} disabled={saving}>
        {saving ? "Сохранение…" : "Сохранить всё"}
      </AdminButton>
    </div>
  );
}
