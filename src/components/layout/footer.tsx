import Link from "next/link";
import { Input } from "@/components/ui/input";

const shop = [
  { href: "/catalog", label: "Каталог" },
  { href: "/catalog?category=serums", label: "Сыворотки" },
  { href: "/catalog?category=makeup", label: "Макияж" },
  { href: "/catalog?category=face-care", label: "Уход" },
];

const info = [
  { href: "/about", label: "О бренде" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/contacts#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="section-invert">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-4">
          <p className="text-[11px] font-medium tracking-[0.42em] uppercase">AM Beauty</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
            Натуральный уход и декоративная косметика. Москва · доставка по России.
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Магазин</p>
          <ul className="mt-5 space-y-3">
            {shop.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.18em] text-white/70 uppercase transition-opacity hover:opacity-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="label-caps">Информация</p>
          <ul className="mt-5 space-y-3">
            {info.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[10px] tracking-[0.18em] text-white/70 uppercase transition-opacity hover:opacity-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="label-caps">Рассылка</p>
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" action="#">
            <Input
              type="email"
              placeholder="Email"
              aria-label="Email"
              className="h-11 border-white/20 bg-transparent text-white placeholder:text-white/40"
            />
            <button type="submit" className="btn-chanel-outline shrink-0 cursor-pointer !border-white !text-white hover:!bg-white hover:!text-black">
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-[10px] tracking-[0.18em] text-white/40 uppercase sm:flex-row">
          <p>© 2026 AM Beauty</p>
          <div className="flex gap-8">
            <Link href="#" className="transition-opacity hover:opacity-70">
              Конфиденциальность
            </Link>
            <Link href="#" className="transition-opacity hover:opacity-70">
              Оферта
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
