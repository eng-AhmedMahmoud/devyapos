import type { Locale } from "@/i18n/routing";

/**
 * Marketing copy lives in typed modules rather than next-intl message JSON.
 *
 * next-intl still owns locale routing and negotiation, but the copy on a
 * landing page is deeply structured (feature grids, comparison matrices,
 * pricing plans with feature arrays) and reading that back through
 * `t.raw("...")` loses every type guarantee. Typed content modules keep the
 * Arabic and English trees provably identical in shape.
 */

export type Hue =
  | "brand"
  | "sky"
  | "violet"
  | "amber"
  | "rose"
  | "emerald"
  | "blue";

export interface Stat {
  value: string;
  label: string;
}

export interface Card {
  icon: string;
  title: string;
  body: string;
}

export interface Feature extends Card {
  badge: string;
  hue: Hue;
}

/** A problem paired with the line that cancels it, for the before/after ledger. */
export interface Pain extends Card {
  fix: string;
}

export interface Step {
  n: string;
  title: string;
  body: string;
}

export interface CompareRow {
  label: string;
  /** `true` = full support, `"partial"` = limited, `false` = absent. */
  us: boolean | "partial" | string;
  them: boolean | "partial" | string;
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** EGP per branch per month, billed monthly. `null` = custom pricing. */
  price: number | null;
  /** Rendered instead of a number when `price` is null. */
  priceLabel?: string;
  badge?: string;
  featured?: boolean;
  features: string[];
  cta: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface TourTab {
  id: string;
  label: string;
  title: string;
  body: string;
  points: string[];
}

export interface SiteContent {
  meta: Record<string, { title: string; description: string }>;
  nav: { links: { label: string; href: string }[]; login: string; cta: string };
  hero: {
    badge: string;
    line1: string;
    line2: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust: string;
    stats: Stat[];
  };
  /** Scrolling ribbon of capability phrases on the espresso band. */
  marquee: string[];
  pain: {
    eyebrow: string;
    title: string;
    sub: string;
    beforeLabel: string;
    afterLabel: string;
    items: Pain[];
  };
  bridge: { eyebrow: string; title: string; sub: string; chips: string[] };
  features: {
    eyebrow: string;
    title: string;
    sub: string;
    items: Feature[];
    more: string;
  };
  tour: { eyebrow: string; title: string; sub: string; tabs: TourTab[] };
  steps: {
    eyebrow: string;
    title: string;
    sub: string;
    items: Step[];
    cta: string;
  };
  compare: {
    eyebrow: string;
    title: string;
    sub: string;
    us: string;
    them: string;
    rows: CompareRow[];
    note: string;
  };
  roi: {
    eyebrow: string;
    title: string;
    sub: string;
    fields: {
      orders: string;
      aov: string;
      commission: string;
      branches: string;
    };
    hints: { orders: string; aov: string; commission: string; branches: string };
    results: {
      paid: string;
      recovered: string;
      cost: string;
      net: string;
      payback: string;
      paybackUnit: string;
    };
    assumption: string;
    note: string;
    cta: string;
  };
  caseStudy: {
    eyebrow: string;
    title: string;
    body: string;
    stats: Stat[];
    link: string;
  };
  testimonials: { eyebrow: string; title: string; items: Testimonial[] };
  pricing: {
    eyebrow: string;
    title: string;
    sub: string;
    monthly: string;
    yearly: string;
    save: string;
    currency: string;
    per: string;
    perBranch: string;
    plans: Plan[];
    note: string;
    founding: string;
    compareLink: string;
  };
  faq: { eyebrow: string; title: string; sub: string; items: Faq[] };
  cta: {
    title: string;
    sub: string;
    primary: string;
    secondary: string;
    trust: string;
  };
  notFound: { title: string; body: string; cta: string };
  footer: {
    blurb: string;
    cols: { title: string; links: { label: string; href: string }[] }[];
    legal: string;
    madeBy: string;
  };
  about: {
    badge: string;
    title: string;
    sub: string;
    storyTitle: string;
    story: string[];
    principlesTitle: string;
    principlesSub: string;
    principles: Card[];
    numbersTitle: string;
    numbers: Stat[];
    timelineTitle: string;
    timeline: Step[];
    plansTitle: string;
    plansSub: string;
    ctaTitle: string;
    ctaBody: string;
  };
  contact: {
    badge: string;
    title: string;
    sub: string;
    form: {
      name: string;
      restaurant: string;
      branches: string;
      phone: string;
      message: string;
      submit: string;
      hint: string;
      messagePlaceholder: string;
    };
    channels: { title: string; items: Card[] };
    waTemplate: string;
  };
  featuresPage: {
    badge: string;
    title: string;
    sub: string;
    groups: { title: string; body: string; items: Feature[] }[];
  };
}

export type SiteContentMap = Record<Locale, SiteContent>;
