/**
 * Single source of truth for the SaaS brand.
 *
 * The platform in this monorepo was built for BóHub (a real 25-branch Egyptian
 * chain). DevyaPOS is the productised version of that platform sold to other
 * restaurants.
 *
 * It is named as a Devya product rather than a sister brand, so it lives on a
 * subdomain of the studio's own `devya.dev` instead of taking a new `.dev`
 * registration. Note the house rule: the company is Devya Solutions but the
 * domain is devya.dev, never devya.solutions.
 *
 * The wordmark is Latin in both locales. Arabic copy writes "DevyaPOS" inline,
 * which is how Latin product names are normally set in Arabic technical prose.
 *
 * Rename the product here and the whole site follows.
 */
export const brand = {
  name: { ar: "DevyaPOS", en: "DevyaPOS" },
  /** Latin wordmark — used in the logo lockup in both locales. */
  wordmark: "DevyaPOS",
  domain: "pos.devya.dev",
  url: "https://pos.devya.dev",
  email: "devya.solutions@gmail.com",
  /** E.164, no plus — used to build wa.me deep links and tel: hrefs. */
  whatsapp: "201055930032",
  /** Same number, grouped for display. */
  phoneDisplay: "+20 105 593 0032",
  /**
   * The studio that built and runs the platform. The public URL is devya.dev
   * — the company is Devya Solutions, but the domain is NOT devya.solutions.
   */
  parent: { name: "Devya Solutions", url: "https://devya.dev" },
  /** The flagship reference deployment this whole platform was proven on. */
  flagship: { name: { ar: "بوهَب", en: "BóHub" }, url: "https://bohubegy.com" },
  social: {
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
  },
  /** Where the CTAs point. Swap for the real dashboard once it ships. */
  signupUrl: "/ar/contact",
  loginUrl: "/ar/contact",
  demoUrl: "https://bohub-c4.vercel.app",
} as const;

/** wa.me link with a prefilled, locale-aware first message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** `tel:` href for the same business number the WhatsApp CTAs use. */
export const telLink = `tel:+${brand.whatsapp}`;

/** `mailto:` href for the business inbox, optionally with a subject. */
export function mailtoLink(subject?: string) {
  return subject
    ? `mailto:${brand.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${brand.email}`;
}
