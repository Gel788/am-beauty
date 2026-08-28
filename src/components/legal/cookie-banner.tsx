"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { legalLinks } from "@/data/company";

const STORAGE_KEY = "am-beauty-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Уведомление о cookie"
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-border bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:p-6"
    >
      <div className="container-page flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-grey">
          Мы используем cookie и локальное хранилище браузера для работы корзины, оформления заказа и
          улучшения сайта. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <Link href={legalLinks.cookies} className="text-black underline underline-offset-2">
            политикой cookie
          </Link>{" "}
          и{" "}
          <Link href={legalLinks.privacy} className="text-black underline underline-offset-2">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button type="button" onClick={accept} className="btn-chanel shrink-0 cursor-pointer">
          Принять
        </button>
      </div>
    </div>
  );
}
