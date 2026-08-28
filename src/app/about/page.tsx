import type { Metadata } from "next";
import Image from "next/image";
import { getPublicCatalog } from "@/lib/catalog/runtime";

export const metadata: Metadata = {
  title: "О бренде",
  description: "История и миссия AM Beauty — премиальная косметика из Москвы.",
};

export default async function AboutPage() {
  const { site } = await getPublicCatalog();
  const about = site.about;

  return (
    <div className="container-page section-pad">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label-caps">{about.label}</p>
          <h1 className="headline-xl mt-6">{about.title}</h1>
          <p className="mt-8 leading-relaxed text-grey">{about.paragraph1}</p>
          <p className="mt-4 leading-relaxed text-grey">{about.paragraph2}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-cream">
          <Image
            src={about.image}
            alt="Продукция AM Beauty"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      <div className="hairline my-20" />

      <div className="grid gap-px bg-border sm:grid-cols-3">
        {about.badges.map((c) => (
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
