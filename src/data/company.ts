/**
 * Реквизиты продавца — оферта, эквайринг (ЮKassa и др.), 152-ФЗ.
 */
export const company = {
  brand: "AM Beauty",
  legalName: "Индивидуальный предприниматель Карян Ася Араевна",
  shortLegalName: "ИП Карян Ася Араевна",
  inn: "770876080915",
  ogrnip: "323774600353252",
  okved: "90.02",
  okpo: "20413968",
  legalAddress:
    "Московская обл., г. Химки, ул. Зеленая, д. 6, корп. 1, кв. 184",
  postalAddress:
    "Московская обл., г. Химки, ул. Зеленая, д. 6, корп. 1, кв. 184",
  email: "info@ambeauty-cosmetica.ru",
  phone: "+7 (926) 235-51-41",
  phoneHref: "+79262355141",
  siteUrl: "https://ambeauty-cosmetica.ru",
  bankName: 'ООО «Банк Точка»',
  bik: "044525104",
  account: "40802810720000041400",
  corrAccount: "30101810745374525104",
  headName: "Карян Ася Араевна",
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
