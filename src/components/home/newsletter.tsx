"use client";

import Link from "next/link";
import { toast } from "sonner";
import { legalLinks } from "@/data/company";
import { Input } from "@/components/ui/input";
import { useSite } from "@/context/catalog-context";
import { HomeSectionHeader } from "@/components/home/section-header";

export function HomeNewsletter() {
  const { home } = useSite();

  return (
    <section className="border-t border-border bg-cream/50 py-16 md:py-24">
      <div className="container-page mx-auto max-w-xl text-center">
        <HomeSectionHeader
          label="Рассылка"
          title={home.newsletterTitle}
          description={home.newsletterText}
          align="center"
          className="mx-auto"
        />
        <form
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Спасибо! Промокод WELCOME15 отправлен на email.");
          }}
        >
          <Input
            type="email"
            required
            placeholder="Email"
            aria-label="Email для подписки"
            className="h-11 flex-1 border-border bg-white text-center sm:text-left"
          />
          <button type="submit" className="btn-chanel shrink-0 cursor-pointer">
            Подписаться
          </button>
        </form>
        <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-grey">
          Нажимая «Подписаться», вы соглашаетесь с{" "}
          <Link href={legalLinks.privacy} className="underline underline-offset-2">
            политикой конфиденциальности
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
