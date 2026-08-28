import { company } from "@/data/company";
import type {
  AdminAboutContent,
  AdminBlogPost,
  AdminCatalogContent,
  AdminContactsContent,
  AdminHomeContent,
  AdminLink,
  AdminSiteSettings,
} from "@/lib/admin/types";

export const defaultNav: AdminLink[] = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О бренде" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/account", label: "Аккаунт" },
];

export const defaultMarquee = [
  "Малые партии",
  "Стекло и пипетка",
  "Доставка 1–3 дня",
  "Подарочная упаковка",
  "Без парабенов",
  "Сделано в Москве",
];

export function defaultHomeContent(): AdminHomeContent {
  return {
    heroLabel: "Коллекция 2026 · Москва",
    heroTitle: "Сыворотки",
    heroSubtitle:
      "Три формулы. Стекло. Малые партии. Уход, который чувствуется — без лишних слов.",
    heroImage: "/images/hero-dark.jpg",
    heroCta: "Смотреть коллекцию",
    heroFootnote: "03 формулы",
    manifestoLabel: "Манифест",
    manifestoTitle: "Less\nnoise",
    manifestoText:
      "Мы не обещаем чудес за одну ночь. Мы делаем формулы, которые работают каждый день — тихо, стабильно, честно.",
    manifestoImage: "/images/peptide-v2.jpg",
    featuredLabel: "Коллекция",
    featuredTitle: "Три формулы",
    featuredHint: "Листайте вправо — ночь, утро, восстановление.",
    categoriesTitle: "Уход и макияж",
    ritualSteps: [
      { num: "01", title: "Одна капля", text: "Густая текстура — достаточно одной капли." },
      { num: "02", title: "Ладони", text: "Согрейте сыворотку между ладонями." },
      { num: "03", title: "Тишина", text: "Дайте формуле впитаться. Не трогайте кожу." },
    ],
    ritualImage: "/images/cica-v2.jpg",
    benefits: [
      { title: "Состав", text: "Без парабенов и SLS. Только активы с доказанной эффективностью." },
      { title: "Тесты", text: "Дерматологический контроль на чувствительной коже." },
      { title: "Упаковка", text: "Стекло и перерабатываемые материалы. Малые партии." },
      { title: "Производство", text: "Собственное ателье в Москве." },
    ],
    newsletterTitle: "Будьте в курсе",
    newsletterText: "Новинки, ритуалы ухода и промокод WELCOME15 на первый заказ.",
  };
}

export function defaultAboutContent(): AdminAboutContent {
  return {
    label: "О бренде",
    title: "Ателье, а не конвейер",
    paragraph1:
      "AM Beauty основан в 2019 году в Москве. Мы создаём уход и макияж в малых партиях — с прозрачным составом и формулами, которые действительно работают.",
    paragraph2:
      "Наша миссия — дать женщинам 20–40 лет продукты, которым можно доверять: без агрессивных отдушек, с натуральными активами и дерматологическим контролем.",
    image: "/images/bakuchiol-v2.jpg",
    badges: ["ISO 22716", "Dermatologically Tested", "Cruelty Free"],
  };
}

export function defaultContactsContent(): AdminContactsContent {
  return {
    title: "Свяжитесь с нами",
    faq: [
      {
        q: "Как долго идёт доставка?",
        a: "По Москве — 1–2 дня, по России — 1–5 дней в зависимости от региона.",
      },
      {
        q: "Можно ли вернуть товар?",
        a: "Да, в течение 7 дней при дистанционной покупке, если сохранены товарный вид и упаковка не вскрыта.",
      },
      {
        q: "Есть ли тестеры?",
        a: "К каждому заказу от 5 000 ₽ добавляем набор миниатюр.",
      },
      {
        q: "Подходит ли косметика при беременности?",
        a: "Уточняйте состав конкретного продукта. Bakuchiol Night без ретинола.",
      },
    ],
  };
}

export function defaultCatalogContent(): AdminCatalogContent {
  return {
    label: "Каталог",
    defaultTitle: "Коллекция",
    defaultDescription:
      "Сыворотки, уход и декоративная косметика — малые партии, точные дозировки.",
  };
}

export function defaultBlogPosts(): AdminBlogPost[] {
  return [
    {
      slug: "ritual-triple",
      title: "Три сыворотки — один ритуал: как сочетать AM Beauty",
      excerpt: "Ночь, утро и восстановление: пошаговый гид для идеального ухода.",
      body: "Полный текст статьи будет здесь. Редактируйте в админке.",
      date: "2026-07-01",
      published: true,
    },
    {
      slug: "spf-everyday",
      title: "SPF каждый день: почему это важнее сыворотки",
      excerpt: "Разбираем мифы и показываем, как вписать защиту в утренний ритуал.",
      body: "Полный текст статьи будет здесь.",
      date: "2026-06-12",
      published: true,
    },
    {
      slug: "sensitive-skin",
      title: "Чувствительная кожа: с чего начать",
      excerpt: "Минималистичный набор из трёх продуктов для спокойной кожи.",
      body: "Полный текст статьи будет здесь.",
      date: "2026-05-20",
      published: true,
    },
  ];
}

export function createDefaultSiteSettings(): AdminSiteSettings {
  return {
    brand: company.brand,
    tagline: "Премиальная косметика",
    email: company.email,
    phone: company.phone,
    phoneHref: company.phoneHref,
    workingHours: company.workingHours,
    freeShippingThreshold: 7500,
    shippingCost: 390,
    footerTagline: "Натуральный уход и декоративная косметика. Доставка по России.",
    marquee: defaultMarquee,
    nav: defaultNav,
    company: {
      legalName: company.legalName,
      shortLegalName: company.shortLegalName,
      inn: company.inn,
      ogrnip: company.ogrnip,
      okved: company.okved,
      legalAddress: company.legalAddress,
      postalAddress: company.postalAddress,
      bankName: company.bankName,
      bik: company.bik,
      account: company.account,
      corrAccount: company.corrAccount,
      headName: company.headName,
      supportResponse: company.supportResponse,
      siteUrl: company.siteUrl,
    },
    home: defaultHomeContent(),
    about: defaultAboutContent(),
    contacts: defaultContactsContent(),
    catalog: defaultCatalogContent(),
  };
}
