import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "О бренде",
  description: "История и миссия AM Beauty — премиальная косметика из Москвы.",
};

export default function AboutPage() {
  return (
    <div className="container-page section-pad">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label-caps">О бренде</p>
          <h1 className="headline-xl mt-6">Ателье, а не конвейер</h1>
          <p className="mt-8 leading-relaxed text-grey">
            AM Beauty основан в 2019 году в Москве. Мы создаём уход и макияж в малых партиях —
            с прозрачным составом и формулами, которые действительно работают.
          </p>
          <p className="mt-4 leading-relaxed text-grey">
            Наша миссия — дать женщинам 20–40 лет продукты, которым можно доверять: без
            агрессивных отдушек, с натуральными активами и дерматологическим контролем.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src="/images/bakuchiol-v2.jpg"
            alt="Продукция AM Beauty"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      <div className="hairline my-20" />

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {["ISO 22716", "Dermatologically Tested", "Cruelty Free"].map((c) => (
          <div
            key={c}
            className="bg-white px-6 py-12 text-center text-[10px] tracking-[0.2em] uppercase"
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
