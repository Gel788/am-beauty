"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export function HomeNewsletter() {
  return (
    <section className="section-pad-sm">
      <div className="container-narrow">
        <p className="label-caps">Рассылка</p>
        <h2 className="headline-lg mt-4">Будьте в курсе</h2>
        <p className="mx-auto mt-4 max-w-sm text-sm text-grey">
          Новинки, ритуалы ухода и промокод WELCOME15 на первый заказ.
        </p>
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
      </div>
    </section>
  );
}
