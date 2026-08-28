import type { AdminSiteSettings } from "@/lib/admin/types";
import { createDefaultSiteSettings } from "@/lib/admin/site-defaults";

type LegacySite = Partial<AdminSiteSettings> & {
  heroLabel?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
};

export function mergeSiteSettings(partial?: LegacySite): AdminSiteSettings {
  const defaults = createDefaultSiteSettings();
  if (!partial) return defaults;

  const home = {
    ...defaults.home,
    ...partial.home,
    ...(partial.heroLabel ? { heroLabel: partial.heroLabel } : {}),
    ...(partial.heroTitle ? { heroTitle: partial.heroTitle } : {}),
    ...(partial.heroSubtitle ? { heroSubtitle: partial.heroSubtitle } : {}),
    ...(partial.heroImage ? { heroImage: partial.heroImage } : {}),
  };

  return {
    ...defaults,
    ...partial,
    company: { ...defaults.company, ...partial.company },
    home,
    about: { ...defaults.about, ...partial.about },
    contacts: {
      ...defaults.contacts,
      ...partial.contacts,
      faq: partial.contacts?.faq?.length ? partial.contacts.faq : defaults.contacts.faq,
    },
    catalog: { ...defaults.catalog, ...partial.catalog },
    nav: partial.nav?.length ? partial.nav : defaults.nav,
    marquee: partial.marquee?.length ? partial.marquee : defaults.marquee,
  };
}
