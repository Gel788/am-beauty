import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { company } from "@/data/company";

type LegalDocumentProps = {
  title: string;
  description?: string;
  updatedAt?: string;
  children: ReactNode;
};

export function LegalDocument({ title, description, updatedAt, children }: LegalDocumentProps) {
  return (
    <article className="container-page section-pad pb-20">
      <PageHeader title={title} description={description} align="left" className="!text-left" />
      {updatedAt ? (
        <p className="mt-4 text-xs text-grey">Редакция от {updatedAt}</p>
      ) : null}
      <div className="legal-prose mt-10 max-w-3xl">{children}</div>
      <aside className="mt-16 max-w-3xl border-t border-border pt-8 text-sm text-grey">
        <p className="text-[10px] tracking-[0.18em] text-black uppercase">Реквизиты продавца</p>
        <p className="mt-3">{company.legalName}</p>
        <p>ИНН {company.inn} · ОГРНИП {company.ogrnip}</p>
        <p className="mt-2">{company.legalAddress}</p>
        <p className="mt-2">
          <a href={`mailto:${company.email}`} className="underline underline-offset-2">
            {company.email}
          </a>
          {" · "}
          <a href={`tel:${company.phoneHref}`} className="underline underline-offset-2">
            {company.phone}
          </a>
        </p>
      </aside>
      <p className="mt-8 text-xs text-grey">
        <Link href="/contacts" className="underline underline-offset-2">
          Контакты
        </Link>
        {" · "}
        <Link href="/catalog" className="underline underline-offset-2">
          Каталог
        </Link>
      </p>
    </article>
  );
}
