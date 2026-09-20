/**
 * Single source of truth for the SaaS brand.
 *
 * The platform in this monorepo was built for a real 25-branch Egyptian
 * chain. DevyaPOS is the productised version of that platform sold to other
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
  whatsapp: "201041858781",
  /** Same number, grouped for display. */
  phoneDisplay: "+20 104 185 8781",
  /**
   * The studio that built and runs the platform. The public URL is devya.dev
   * — the company is Devya Solutions, but the domain is NOT devya.solutions.
   */
  parent: { name: "Devya Solutions", url: "https://devya.dev" },
  /*
   * `flagship` (a named, linked reference deployment) was removed on
   * 2026-08-28 at that client's request: they do not want their brand used in
   * our marketing. Reference deployments are described anonymously in the copy
   * instead ("a 25-branch Egyptian chain"). Do not reintroduce a client name
   * here without written permission from that client.
   */
  /*
   * Live profiles, restored 20 September 2026. The earlier `social` key was
   * deleted because it held bare instagram.com / linkedin.com placeholders —
   * these are the real accounts, both posting, and both are what feeds
   * `sameAs` in the Organization markup. A profile that stops being
   * maintained should come out of here rather than rot in the footer.
   *
   * The Facebook Page has no vanity username yet (Meta gates it on Page
   * maturity), so the numeric profile URL is the canonical one until it does.
   */
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61594479633675",
    instagram: "https://www.instagram.com/devyapos/",
  },
  /*
   * Removed rather than left dangling: `signupUrl` and `loginUrl` duplicated
   * the /contact route the nav already links, and `demoUrl` pointed the
   * hero's "See it running" button at a C4 architecture diagram. Neither had
   * a live consumer once the hero moved to the on-page #promo recording.
   * The architecture diagram still lives at https://bohub-c4.vercel.app if it
   * is ever wanted somewhere the label actually fits.
   */
} as const;

/** The social profiles as a flat list, in the order the footer renders them. */
export const socialLinks = [
  { key: "instagram", href: brand.social.instagram, label: "Instagram" },
  { key: "facebook", href: brand.social.facebook, label: "Facebook" },
] as const;

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
