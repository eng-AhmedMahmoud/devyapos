/**
 * Single source of truth for the SaaS brand.
 *
 * The platform in this monorepo was built for a real 25-branch Egyptian
 * chain. Moving POS is the productised version of that platform sold to other
 * restaurants. It was called DevyaPOS until 18 October 2026 and Drinki POS
 * until 19 October 2026; each rename is the visible name only, so identifiers
 * keep `devyapos`: storage keys, file and image paths, the container, the
 * repo, and the social handles below.
 *
 * It lives on a subdomain of the Moving family's own domain, movingsystems.tech
 * (pos.movingsystems.tech since 22 October 2026). The old address,
 * pos.devya.dev, answers with a 301 to the same path and query here
 * (deploy/nginx.conf). The studio behind it is Devya Solutions, whose domain
 * is devya.dev, never devya.solutions.
 *
 * Moving is a product family — Moving Stores (devya-commerce) and the umbrella
 * site at movingsystems.tech (moving-landing) — and the family writes its name
 * in Arabic on Arabic pages: موفينج ستورز, موفينج POS. "POS" stays Latin, the
 * way the term is set in Arabic technical prose.
 *
 * Rename the product here and the whole site follows.
 */
export const brand = {
  name: { ar: "موفينج POS", en: "Moving POS" },
  /**
   * The lockup's two words — the family name, set bold, and the product, set
   * regular and dimmed — split the way Moving Stores' lockup splits
   * "Moving Stores" (devya-commerce apps/admin/components/brand/wordmark.tsx).
   */
  wordmark: {
    ar: ["موفينج", "POS"],
    en: ["Moving", "POS"],
  },
  domain: "pos.movingsystems.tech",
  url: "https://pos.movingsystems.tech",
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

/** The product name as a page in `locale` prints it. */
export function brandName(locale: string) {
  return locale === "ar" ? brand.name.ar : brand.name.en;
}

/** The social profiles as a flat list, in the order the footer renders them. */
export const socialLinks = [
  { key: "instagram", href: brand.social.instagram, label: "Instagram" },
  { key: "facebook", href: brand.social.facebook, label: "Facebook" },
] as const;

/**
 * Every place on the site that opens a WhatsApp chat, and the reference code
 * its prefilled message ends with (`[P-float]`, `[P-pricing]`, …).
 *
 * The site runs no tracker (lib/analytics.ts), and a WhatsApp conversation is
 * the funnel the launch plan measures, so the code is how the founder labels
 * a chat by the button that started it — read off the first message, inside
 * WhatsApp, with nothing recorded on our side. It names a placement and
 * nothing else: no UTM, no stored value, nothing about the visitor, and they
 * see it in the message before they press send. The descriptions below are the
 * legend for reading a code back; docs/social-launch-plan.md §7.1 points here.
 */
export const whatsappSources = {
  float: "Floating button, every page",
  cta: "Closing band (CtaBand), every page that has one except /pricing",
  pricing: "Closing band on /pricing",
  home: "Home page contact section",
  contact: "Contact page, 'message us' card",
  demo: "Contact page, 'book a demo' card",
  form: "Contact form, 'send on WhatsApp' route",
  foodics: "Closing card on /foodics-alternative",
  hardware: "Closing card on /hardware",
  partners: "Closing card on /partners",
  eta: "Closing card on /eta-einvoicing",
  trial: "Accounting trial, fallback after a failed sign-up",
  quote: "Accounting pricing, Enterprise quote",
} as const;

export type WhatsappSource = keyof typeof whatsappSources;

/** The reference code a placement's prefilled message ends with. */
export function whatsappCode(source: WhatsappSource) {
  return `[P-${source}]`;
}

/**
 * wa.me link with a prefilled, locale-aware first message, tagged with the
 * placement it was opened from. The code goes on a line of its own: a
 * Latin-only line keeps its left-to-right order after an Arabic message
 * instead of having its brackets reordered into the sentence before it.
 */
export function whatsappLink(message: string, source: WhatsappSource) {
  const text = `${message}\n\n${whatsappCode(source)}`;
  return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** `tel:` href for the same business number the WhatsApp CTAs use. */
export const telLink = `tel:+${brand.whatsapp}`;

/** `mailto:` href for the business inbox, optionally with a subject. */
export function mailtoLink(subject?: string) {
  return subject
    ? `mailto:${brand.email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${brand.email}`;
}
