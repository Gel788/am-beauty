"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { legalLinks } from "@/data/company";
import { Input } from "@/components/ui/input";
import { useSite } from "@/context/catalog-context";
import { HomeSectionHeader } from "@/components/home/section-header";
import { submitInquiry } from "@/lib/inquiries/submit-inquiry";

export function HomeNewsletter() {
  const { home } = useSite();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

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
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email.trim() || sending) return;
            setSending(true);
            try {
              await submitInquiry({ type: "newsletter", email: email.trim() });
              toast.success("Спасибо! Промокод WELCOME15 действует в корзине.");
              setEmail("");
            } catch {
              toast.error("Не удалось оформить подписку");
            } finally {
              setSending(false);
            }
          }}
        >
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email для подписки"
            className="h-11 flex-1 border-border bg-white text-center sm:text-left"
          />
          <button type="submit" disabled={sending} className="btn-chanel shrink-0 cursor-pointer disabled:opacity-50">
            {sending ? "..." : "Подписаться"}
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
