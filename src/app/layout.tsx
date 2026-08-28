import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const sans = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "AM Beauty — премиальная косметика",
    template: "%s · AM Beauty",
  },
  description:
    "Интернет-магазин AM Beauty: уход за кожей и декоративная косметика. Натуральный состав, доставка по России.",
  openGraph: {
    title: "AM Beauty",
    description: "Премиальная косметика для ухода и макияжа",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={cn("h-full", sans.variable)}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <Providers>
          <Header />
          <main id="main" className="flex-1 pt-[3.75rem]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
