import { getPublicCatalog } from "@/lib/catalog/runtime";
import type { AdminSiteSettings } from "@/lib/admin/types";

export async function getRuntimeCompany() {
  const { site } = await getPublicCatalog();
  return siteToCompany(site);
}

export function siteToCompany(site: AdminSiteSettings) {
  return {
    brand: site.brand,
    legalName: site.company.legalName,
    shortLegalName: site.company.shortLegalName,
    inn: site.company.inn,
    ogrnip: site.company.ogrnip,
    okved: site.company.okved,
    okpo: "",
    legalAddress: site.company.legalAddress,
    postalAddress: site.company.postalAddress,
    email: site.email,
    phone: site.phone,
    phoneHref: site.phoneHref,
    siteUrl: site.company.siteUrl,
    bankName: site.company.bankName,
    bik: site.company.bik,
    account: site.company.account,
    corrAccount: site.company.corrAccount,
    headName: site.company.headName,
    workingHours: site.workingHours,
    supportResponse: site.company.supportResponse,
  };
}
