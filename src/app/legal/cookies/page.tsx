import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { getRuntimeCompany } from "@/lib/catalog/company";

export const metadata: Metadata = {
  title: "Политика cookie",
  description: "Использование cookie и локального хранилища на сайте AM Beauty",
};

export default async function CookiesPage() {
  const company = await getRuntimeCompany();
  return (
    <LegalDocument title="Политика использования cookie" updatedAt="28.08.2026">
      <h2>1. Что такое cookie</h2>
      <p>
        Cookie — небольшие текстовые файлы, которые сохраняются в браузере при посещении сайта. Локальное
        хранилище браузера (localStorage) используется для сохранения содержимого корзины и настроек.
      </p>

      <h2>2. Какие данные мы используем</h2>
      <ul>
        <li>
          <strong>Технические cookie</strong> — для работы сайта, безопасности и балансировки нагрузки;
        </li>
        <li>
          <strong>Функциональные</strong> — корзина, избранное, согласие на cookie (localStorage);
        </li>
        <li>
          <strong>Аналитические</strong> — только при вашем согласии, если подключена аналитика.
        </li>
      </ul>

      <h2>3. Управление cookie</h2>
      <p>
        Вы можете удалить cookie и данные localStorage в настройках браузера. Отключение технических
        cookie может ограничить работу корзины и оформления заказа.
      </p>

      <h2>4. Контакты</h2>
      <p>
        Вопросы по обработке данных: {company.email}. Подробнее — в{" "}
        <a href="/legal/privacy">политике конфиденциальности</a>.
      </p>
    </LegalDocument>
  );
}
