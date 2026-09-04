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

/** A link with its label. Used by the nav and the footer columns. */
export interface NavLink {
  label: string;
  href: string;
}

/** A titled point — a `Card` without an icon. */
export interface Point {
  title: string;
  body: string;
}

/** A titled block of prose. One string per paragraph, as in `about.story`. */
export interface Prose {
  title: string;
  body: string[];
}

/**
 * One dated, sourced figure in a competitor fact table.
 *
 * Same discipline as `pricing.marketAnchor`: the retrieval date and the "check
 * it yourself" hedge live on the block that owns the rows, never on the row.
 */
export interface Fact {
  label: string;
  value: string;
  note: string;
  /** Marks our own row so it can be styled apart from the competitor's. */
  ours?: boolean;
}

/**
 * A buyer segment on the pricing page. The price is identical for every
 * segment — only the framing changes, so there is no `price` here on purpose.
 */
export interface PricingSegment {
  id: string;
  label: string;
  /** One line. The reason this segment cares. */
  headline: string;
  body: string;
  points: string[];
}

/** A standalone legal page. `updated` is rendered, not a comment. */
export interface LegalDoc {
  title: string;
  sub: string;
  /** Visible "last updated" line. Change the date whenever the text changes. */
  updated: string;
  sections: Prose[];
  /** Closing line pointing the reader at the contact route. */
  contact: string;
}

export interface SiteContent {
  meta: Record<string, { title: string; description: string }>;
  nav: {
    links: NavLink[];
    /**
     * Secondary routes the header can surface however it likes — a dropdown, a
     * mobile-only list, or not at all. Kept out of `links` so the desktop bar
     * stays at five items.
     */
    extra: NavLink[];
    login: string;
    cta: string;
  };
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
    /** Tooltip copy — one per input and per result figure. */
    tips: {
      orders: string;
      aov: string;
      commission: string;
      branches: string;
      paid: string;
      recovered: string;
      cost: string;
      net: string;
      payback: string;
    };
    /** Caption under the commission presets. */
    rateNote: string;
    /** Restates the inputs. Interpolates {orders}. */
    summary: string;
    results: {
      paid: string;
      recovered: string;
      cost: string;
      net: string;
      payback: string;
      paybackUnit: string;
      /** Shown instead of a day count when the recovery never covers the cost. */
      paybackNone: string;
    };
    assumption: string;
    note: string;
    cta: string;
  };
  /**
   * The anchor deployment. Anonymous by agreement — the client asked for their
   * brand to be withdrawn from our marketing on 2026-08-28. Describe them only
   * as the existing copy does; do not reintroduce a name.
   */
  caseStudy: {
    eyebrow: string;
    title: string;
    body: string;
    /** Heading above `stats`, so the block can stand on its own as a section. */
    statsTitle: string;
    stats: Stat[];
    facts: Point[];
    /** Fine print explaining why the client is not named. */
    anonymity: string;
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
    /**
     * Segment tabs shown above the plans so the buyer self-selects before a
     * number appears. Every segment pays the same price — `note` says so out
     * loud, because a tabbed pricing page usually implies otherwise.
     */
    segments: {
      eyebrow: string;
      title: string;
      sub: string;
      items: PricingSegment[];
      note: string;
    };
    /**
     * The yearly toggle shows a discounted monthly figure; this states the
     * amount actually charged. `total` interpolates {total} and `saving`
     * interpolates {saved} — both already formatted with `formatEgp`.
     */
    annual: {
      label: string;
      total: string;
      saving: string;
      note: string;
    };
    plans: Plan[];
    /**
     * Published competitor pricing, so "affordable" is a number a visitor can
     * check rather than a claim. Dated and hedged in `note` on purpose — these
     * are someone else's prices and they move.
     */
    marketAnchor: {
      title: string;
      sub: string;
      rows: { name: string; price: string; note: string; ours?: boolean }[];
      note: string;
    };
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
    builtByTitle: string;
    builtByBody: string;
    builtByCta: string;
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
      /** Primary submit — the one that posts to `/api/lead`. */
      submitLead: string;
      /** Secondary route: hand the filled form to WhatsApp. */
      submit: string;
      /** Tertiary route: hand it to the visitor's mail client. */
      submitEmail: string;
      /**
       * Fine print under the buttons. The form POSTs, so this must describe a
       * submission that is received and stored — never "nothing is stored".
       */
      hint: string;
      messagePlaceholder: string;
      /** Submission lifecycle. */
      status: {
        sending: string;
        successTitle: string;
        successBody: string;
        errorTitle: string;
        errorBody: string;
        /** Introduces the list of failed fields in the error summary. */
        errorSummary: string;
        rateLimited: string;
        /** Suffix on optional field labels. */
        optional: string;
      };
      /** Keyed by `LeadErrorCode` in `lib/leads.ts`. Keep the two in step. */
      errors: {
        required: string;
        too_short: string;
        too_long: string;
        invalid_phone: string;
        invalid_branches: string;
      };
    };
    channels: { title: string; items: Card[] };
    waTemplate: string;
  };
  /** Captions for the product-screenshot gallery on /features. `src` lives in
   *  the page, not here — the copy is translated, the file paths are not. */
  gallery: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { alt: string; caption: string }[];
  };

  /** Copy for the four-second register recording on the home page. As with
   *  `gallery`, the file paths are not translated and live in the manifest. */
  promo: {
    eyebrow: string;
    title: string;
    sub: string;
    /** The stages the clip walks through, shown beneath the device. */
    steps: string[];
    /** Accessible description of the recording. */
    alt: string;
    /** Accessible name for the reduced-motion play button. */
    play: string;
  };

  /** Payment gateways, and which are integrated versus wired up on request. */
  payments: {
    eyebrow: string;
    title: string;
    sub: string;
    liveLabel: string;
    onRequestLabel: string;
    /** `live: true` means shipping today; false means built during onboarding. */
    providers: { name: string; live: boolean }[];
    note: string;
  };

  /** The positioning line: a fitted experience, not an off-the-shelf system. */
  promise: {
    eyebrow: string;
    title: string;
    sub: string;
    items: { title: string; body: string }[];
  };

  featuresPage: {
    badge: string;
    title: string;
    sub: string;
    groups: { title: string; body: string; items: Feature[] }[];
  };

  /**
   * One company-identity sentence, repeated in every footer in both locales.
   *
   * The incumbent repeats a regulator line in every footer; ours is the honest
   * equivalent — who operates the product. Render `short` today. `withCr`
   * carries the literal token `{cr}` and MUST NOT reach a page until a real
   * commercial registration number replaces it.
   */
  trustLine: {
    short: string;
    withCr: string;
  };

  /**
   * `/eta-einvoicing`.
   *
   * The one page on this site where being unimpressive is the point. DevyaPOS
   * has no Egyptian Tax Authority integration; `does` and `doesNot` draw that
   * line, and nothing anywhere may blur it. Do not add a compliance,
   * certification or accreditation claim to this block.
   */
  etaInvoicing: {
    badge: string;
    title: string;
    sub: string;
    /** The whole position in one paragraph, for a callout at the top. */
    standfirst: string;
    /** Visible review date — tax rules move and a stale page is a liability. */
    updated: string;
    required: { title: string; sub: string; items: Point[]; note: string };
    does: { title: string; sub: string; items: Point[] };
    doesNot: { title: string; sub: string; items: Point[]; note: string };
    meaning: { title: string; body: string; points: string[] };
    faq: { title: string; items: Faq[] };
    cta: { title: string; body: string; primary: string; secondary: string };
  };

  /**
   * `/foodics-alternative`.
   *
   * The only page that names a competitor throughout, so it carries the
   * strictest sourcing: every figure in `facts.rows` is from Foodics' own
   * published Egyptian pricing, and `disclaimer` + `facts.source` must stay
   * attached wherever the rows are rendered.
   */
  foodicsAlternative: {
    badge: string;
    title: string;
    sub: string;
    disclaimer: string;
    positioning: { title: string; body: string; points: string[] };
    facts: { title: string; sub: string; rows: Fact[]; source: string };
    /** Deliberately not a straw man. Reasons to buy the other product. */
    pickThem: { title: string; sub: string; items: Point[] };
    pickUs: { title: string; sub: string; items: Point[] };
    cta: {
      title: string;
      body: string;
      primary: string;
      secondary: string;
      note: string;
    };
  };

  /** `/hardware` — "bring your own", argued rather than apologised for. */
  hardware: {
    badge: string;
    title: string;
    sub: string;
    stance: { title: string; body: string; points: string[] };
    works: { title: string; sub: string; items: Card[] };
    need: { title: string; sub: string; items: Point[] };
    /** Generic buying guidance. No vendor names and no prices, ever. */
    buying: { title: string; sub: string; items: Point[]; note: string };
    faq: { title: string; items: Faq[] };
    cta: { title: string; body: string; primary: string; secondary: string };
  };

  /**
   * `/terms`, `/privacy`, `/refund` — the three routes the footer used to
   * point at `/contact`. Plain-language drafts pending the owner's legal
   * review; each carries its own visible `updated` line.
   */
  legal: {
    terms: LegalDoc;
    privacy: LegalDoc;
    refund: LegalDoc;
  };
}

export type SiteContentMap = Record<Locale, SiteContent>;
