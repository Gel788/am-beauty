/**
 * Реквизиты продавца — обязательны для оферты, ЮKassa/Робокассы и 152-ФЗ.
 * Замените значения на актуальные данные вашего ИП/ООО перед подключением эквайринга.
 */
export const company = {
  brand: "AM Beauty",
  legalName: "Индивидуальный предприниматель Гилоян Альберт Мамиконович",
  shortLegalName: "ИП Гилоян А.М.",
  inn: "000000000000",
  ogrnip: "000000000000000",
  legalAddress: "109012, г. Москва, ул. Примерная, д. 1, офис 1",
  postalAddress: "109012, г. Москва, ул. Примерная, д. 1, офис 1",
  email: "hello@ambeauty.ru",
  phone: "+7 (495) 123-45-67",
  phoneHref: "+74951234567",
  siteUrl: "https://ambeauty-cosmetica.ru",
  bankName: "ПАО «Сбербанк»",
  bik: "044525225",
  account: "40802810000000000000",
  corrAccount: "30101810400000000225",
  workingHours: "Пн–Вс 10:00–21:00 (МСК)",
  supportResponse: "в течение 24 часов в рабочие дни",
} as const;

export const legalLinks = {
  offer: "/legal/offer",
  privacy: "/legal/privacy",
  returns: "/legal/returns",
  delivery: "/legal/delivery",
  cookies: "/legal/cookies",
} as const;
