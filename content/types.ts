import type { Locale } from "@/i18n/routing";
import type { ConsentCopy } from "@/lib/consent/copy";
import type { AccountingCardId } from "@/lib/accounting-plans";
import type { AiTierId, OfferCode, PlanCurrency, PlanId } from "@/lib/plans";

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
  /**
   * The feature's name in the structured data's `featureList` (lib/jsonld.ts),
   * where it differs from the card `title`. Set only on the loyalty card: its
   * title says tiers, the product ships points only, and markup must not
   * repeat a claim the product does not back. Drop it once the visible title
   * is corrected (docs/seo/audit-2026-10-22.md, follow-ups).
   */
  listName?: string;
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

/**
 * One plan's words. Its numbers — prices per currency, caps, AI credits — are
 * in `lib/plans.ts` under the same `id`, so a price is typed once, not once
 * per language.
 */
export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Printed instead of a figure on a quoted plan (Group). */
  priceLabel?: string;
  badge?: string;
  featured?: boolean;
  /**
   * The caps and allowances, set above the features. The figures in them must
   * match `lib/plans.ts` (`tests/pricing.test.ts` checks).
   */
  limits: string[];
  features: string[];
  /** What the plan leaves out, under its features: Free's line. */
  excludes?: string;
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
 * A calendar date written `YYYY-MM-DD`. The template type only stops the
 * grossest slips; `tests/content.test.ts` checks that the value is a real date.
 */
export type IsoDate = `${number}-${number}-${number}`;

/**
 * One dated, sourced figure in a competitor fact table.
 *
 * Same discipline as `pricing.marketAnchor`: the retrieval date (`retrievedAt`)
 * and the "ask them for a current quote" hedge live on the block that owns the
 * rows, never on the row.
 */
export interface Fact {
  label: string;
  value: string;
  note: string;
  /** Marks our own row so it can be styled apart from the competitor's. */
  ours?: boolean;
}

/**
 * A buyer segment on the pricing page. A segment points the buyer at a
 * package (quick service, cloud kitchens and chains at Counter; a dining room
 * at Dining room) but carries no price itself: the plan grid below owns the
 * numbers, so there is no `price` here on purpose.
 */
export interface PricingSegment {
  id: string;
  label: string;
  /** One line. The reason this segment cares. */
  headline: string;
  body: string;
  points: string[];
}

/** One partner programme on /partners: who it suits and what it pays. */
export interface Programme {
  id: "referral" | "reseller" | "restaurant";
  name: string;
  /** The headline figure ("20%"), set large; `figureLabel` says what it is of. */
  figure: string;
  figureLabel: string;
  body: string;
  points: string[];
}

/**
 * A module sold on top of a package. The product marks these `addOn: true`
 * (`devya-pos:ops-app/lib/plans.ts`) and prices them per tenant, so `price`
 * is the label shown — a published figure, or "Quoted" until there is one.
 */
export interface AddOn {
  id: string;
  name: string;
  body: string;
  price: string;
  /**
   * An internal path when the add-on has a page or a section of its own:
   * `/accounting-trial`, or `/pricing#ai-credits`.
   */
  href?: string;
  linkLabel?: string;
}

/** One plan-fee offer's words; its percents and dates are in `lib/plans.ts`. */
export interface OfferCopy {
  code: OfferCode;
  name: string;
  /** The terms in one sentence. The percents must match `lib/plans.ts`. */
  body: string;
}

/**
 * The AI credits block on /pricing: what a credit is, what each plan
 * includes, and the add-on tiers and packs, priced in the currency the
 * switch shows. The numbers are in `lib/plans.ts`; only the words are here.
 */
export interface AiCreditsCopy {
  eyebrow: string;
  title: string;
  sub: string;
  /** What one credit buys, in a sentence. */
  credit: string;
  included: {
    title: string;
    /** Column heads: the plan, and its credits. */
    plan: string;
    credits: string;
    /** After a monthly allowance ("a month") and after Free's one-time grant ("once"). */
    monthly: string;
    once: string;
  };
  tiers: {
    title: string;
    sub: string;
    /** Column heads: the tier, its credits a month, its price a month. */
    tier: string;
    credits: string;
    price: string;
    names: { id: AiTierId; name: string }[];
  };
  packs: {
    title: string;
    sub: string;
    /** Column heads: the credits, the price. */
    credits: string;
    price: string;
  };
  /** Prepaid, never overage; insight notes free; VAT. */
  note: string;
}

/** The e-invoicing systems a card can name (`EINVOICING_SYSTEM` in `lib/accounting-plans.ts`). */
export interface PerEinvoicingSystem<T> {
  /** Egypt: the ETA e-invoice and e-receipt. */
  eta: T;
  /** Saudi Arabia: ZATCA Phase 2. */
  zatca: T;
  /** A company billed in AED or USD: its units file with either. */
  either: T;
}

/**
 * One accounting plan's card on /accounting-trial. Every paid plan has every
 * feature; the plans differ only by size, so a card is a price and its caps,
 * not a feature list. The figures live in `lib/accounting-plans.ts`, keyed by
 * `id`; the lines here must say the same numbers
 * (`tests/accounting-pricing.test.ts`).
 */
export interface AccountingPlan {
  id: AccountingCardId;
  name: string;
  tagline: string;
  badge?: string;
  featured?: boolean;
  /** Users, branches, bill captures, storage, AI credits — the same in every currency. */
  limits: string[];
  /** Paid plans: the e-invoicing line, which names a different system per price list. */
  einvoicing?: PerEinvoicingSystem<string>;
  /** Free only: what it leaves out, in a sentence. */
  excludes?: string;
}

/**
 * The AI credits block under the accounting plans: what a credit pays for
 * here, what each plan includes, and the one-off packs (the same packs and
 * prices as Moving POS, `AI_PACKS`).
 */
export interface AccountingAiCopy {
  eyebrow: string;
  title: string;
  sub: string;
  /** What one credit buys in the books, in a sentence. */
  credit: string;
  included: {
    title: string;
    /** Column heads: the plan, its credits, its bill captures a month. */
    plan: string;
    credits: string;
    captures: string;
    /** After a monthly allowance ("a month") and after Free's one-time grant ("once, 30 days"). */
    monthly: string;
    once: string;
  };
  packs: {
    title: string;
    sub: string;
    /** Column heads: the credits, the price. */
    credits: string;
    price: string;
  };
  /** Prepaid, never overage; VAT. */
  note: string;
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
    /**
     * The help centre's label. The header sets it apart from the numbered
     * links, behind a rule and with a book icon, as the Moving family's
     * umbrella site does; it always points at /docs.
     */
    docs: string;
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
    /** The billing switch: its label and its two options. */
    billing: string;
    monthly: string;
    yearly: string;
    /** Beside "Yearly": a year costs ten months. */
    save: string;
    /** The currency switch's label, and each option's name on it. */
    currencyLabel: string;
    currencyNames: Record<PlanCurrency, string>;
    /** The unit printed after a figure ("799 EGP", "٧٩٩ ج.م"). */
    currencies: Record<PlanCurrency, string>;
    /** After a monthly figure; also the billing unit in the JSON-LD. */
    per: string;
    /** After a yearly figure. */
    perYear: string;
    perBranch: string;
    /** Under Free's figure. */
    freeNote: string;
    /** Under Group's "Quoted". */
    quotedNote: string;
    /** On a paid card with a trial. */
    trial: string;
    /** Under a monthly figure: interpolates {amount}, the yearly price with its unit. */
    orYearly: string;
    /** Under a yearly figure: interpolates {saved}, two months' price with its unit. */
    billedYearly: string;
    /**
     * The plan-fee offers. The band and each card's offer line show only
     * while an offer is open, decided in the browser from the dates in
     * `lib/plans.ts`, so the static page never sells an offer that ended.
     */
    offers: {
      /** The band's accessible name. */
      label: string;
      items: OfferCopy[];
      /** Interpolates {date}, the offer's last Cairo day. */
      ends: string;
      /** How an offer is applied. */
      how: string;
      /**
       * Under a card's price. Interpolate {name}, {percent}, {amount} (with
       * its unit) and, for the monthly line, {months}.
       */
      firstMonths: string;
      firstYear: string;
    };
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
    plans: Plan[];
    /** The AI credits block under the plan grid (`/pricing#ai-credits`). */
    ai: AiCreditsCopy;
    /**
     * Competitor pricing as we recorded it, so "affordable" is a number rather
     * than a claim. Foodics does not publish these prices (social-launch-plan
     * §1.5), so the copy must never call them published: it says whose record
     * they are and when it was taken, and hedges in `note` — these are someone
     * else's prices and they move.
     */
    marketAnchor: {
      title: string;
      /** Interpolates {date}, rendered from `retrievedAt`. */
      sub: string;
      rows: { name: string; price: string; note: string; ours?: boolean }[];
      note: string;
      /**
       * The day the competitor figures were recorded. A test fails once it is
       * more than 90 days old, so a stale price cannot ship unnoticed.
       */
      retrievedAt: IsoDate;
    };
    note: string;
    /** Modules sold on top of any package, under the plan grid. */
    addOns: {
      title: string;
      sub: string;
      items: AddOn[];
      note: string;
    };
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
  /**
   * The shared consent design's copy (lib/consent/copy.ts), word for word —
   * only the `vendors` lines are this site's own, and they must stay true to
   * what lib/consent/config.ts gates.
   */
  consent: ConsentCopy;
  footer: {
    blurb: string;
    cols: { title: string; links: { label: string; href: string }[] }[];
    legal: string;
    /** Group label for the social icon row — read by screen readers only. */
    social: string;
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
      /**
       * The collection notice, shown at the point the details are typed rather
       * than only in the policy — a form that takes a name and a mobile number
       * has to say what happens to them where the person can see it.
       */
      privacy: string;
      /** Link text to the full policy, rendered inline after `privacy`. */
      privacyLink: string;
      messagePlaceholder: string;
      /**
       * Pre-fills the message when the visitor came from a plan card
       * (`/contact?plan=<id>`); `{plan}` is the plan's name.
       */
      planInterest: string;
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
    /** The quick look a home-page screenshot opens (components/QuickLook.tsx). */
    quickLook: {
      /** Chip over a screenshot on hover and focus. */
      hint: string;
      /** Accessible name of a screenshot's button. Interpolates {caption}. */
      open: string;
      close: string;
      previous: string;
      next: string;
      /** Where the visitor is in the set. Interpolates {n} and {total}. */
      position: string;
    };
  };

  /** The home page's contact section, just above the closing CTA. */
  homeContact: {
    eyebrow: string;
    title: string;
    sub: string;
    whatsapp: string;
    phone: string;
    email: string;
    /** Subject of the email the email row starts. */
    emailSubject: string;
  };

  /** The two floating buttons on every page (components/FloatingActions.tsx). */
  floating: {
    top: string;
    whatsapp: string;
    /** The button that opens the Moving support assistant (components/SupportChat.tsx). */
    chat: string;
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
   * Moving Stores, the sister product, on the POS site: the band on /pricing
   * and the footer's family link. Every line must hold for the POS ↔ Stores
   * link as built (devya-commerce `docs/specs/pos-integration.md`): it is for
   * restaurants, it brings the menu, prices and branches over from the POS,
   * puts web orders on the kitchen display and shares one sign-in. Customers
   * and loyalty balances do not sync — do not say they do.
   */
  movingStores: {
    eyebrow: string;
    title: string;
    body: string;
    points: string[];
    note: string;
    cta: string;
    /** The footer's one-line link to the sister product. */
    footerLink: string;
  };

  /**
   * Moving Systems, the company behind Moving POS, is a subsidiary of Devya
   * Solutions. Both sentences are word for word the same on every Moving
   * property (movingsystems.tech, Moving Stores): `text` is the sentence,
   * `link` the part of it that links to devya.dev. `credit` closes every
   * footer; `notice` sits on /about and on the legal pages.
   */
  parentCompany: {
    credit: { text: string; link: string };
    notice: { text: string; link: string };
  };

  /**
   * `/eta-einvoicing`.
   *
   * The one page on this site where being unimpressive is the point. Moving POS
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
   * strictest sourcing: every Foodics figure in `facts.rows` is our own dated
   * record of its Egyptian pricing — Foodics does not publish it, so nothing
   * here may call it published — and `disclaimer` + `facts.source` must stay
   * attached wherever the rows are rendered.
   */
  foodicsAlternative: {
    badge: string;
    title: string;
    sub: string;
    /** Interpolates {date}, rendered from `facts.retrievedAt`. */
    disclaimer: string;
    positioning: { title: string; body: string; points: string[] };
    facts: {
      title: string;
      /** Interpolates {date}. */
      sub: string;
      rows: Fact[];
      /** Interpolates {date}. */
      source: string;
      /** As `pricing.marketAnchor.retrievedAt`: tested to be under 90 days old. */
      retrievedAt: IsoDate;
    };
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
   * `/partners` — the referral, reseller and restaurant-refers-restaurant
   * programmes. The terms are commercial commitments: change a figure only
   * with the owner's say-so, and in both trees in the same change.
   */
  partners: {
    badge: string;
    title: string;
    sub: string;
    who: { title: string; sub: string; items: Point[] };
    programmes: { title: string; sub: string; items: Programme[]; note: string };
    steps: { title: string; items: Point[] };
    faq: { title: string; items: Faq[] };
    cta: { title: string; body: string; primary: string; secondary: string };
  };

  /**
   * `/accounting-trial` — the self-serve trial of Moving POS Accounting.
   *
   * The form posts to Devya's control plane (`lib/trial.ts`), which hands the
   * visitor an empty accounting system of their own and its setup token,
   * ONCE. Accounting only: the POS trial is still set up with a person
   * through /contact. No e-invoicing or tax-authority claim belongs here —
   * /eta-einvoicing owns that position, and nothing may blur it.
   */
  accountingTrial: {
    badge: string;
    title: string;
    sub: string;
    /** What the trial includes, beside the form. */
    includes: { title: string; items: Point[] };
    /** What happens after the form, in order. */
    steps: { title: string; items: Step[] };
    form: {
      title: string;
      sub: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      /** Placeholder per country — a shape, never a dialable number. */
      phonePlaceholder: { EG: string; SA: string };
      country: string;
      countries: { EG: string; SA: string };
      /** What the country decides, shown under the choice. */
      countryNote: { EG: string; SA: string };
      submit: string;
      sending: string;
      /** Collection notice at the point of entry, linked to /privacy. */
      privacy: string;
      privacyLink: string;
      errorTitle: string;
      errorSummary: string;
      /** Keyed by `TrialFieldError`, plus field-specific `invalid` wording. */
      errors: {
        required: string;
        too_short: string;
        too_long: string;
        invalid: string;
        invalidEmail: string;
        invalidPhone: { EG: string; SA: string };
      };
    };
    /** The one screen that shows the link and the token. */
    result: {
      title: string;
      sub: string;
      linkLabel: string;
      tokenLabel: string;
      /** The token is shown once and never again — said where it is shown. */
      tokenWarning: string;
      /** Interpolates {date}. */
      expires: string;
      copy: string;
      copied: string;
      open: string;
      stepsTitle: string;
      steps: string[];
    };
    /** Every answer that is not a stack. */
    outcomes: {
      poolEmptyTitle: string;
      poolEmptyBody: string;
      alreadyTitle: string;
      alreadyBody: string;
      rateLimitedTitle: string;
      rateLimitedBody: string;
      closedTitle: string;
      closedBody: string;
      errorTitle: string;
      errorBody: string;
      whatsapp: string;
      /** Prefilled WhatsApp message for every fallback above. */
      waTemplate: string;
    };
    /**
     * What it costs after the trial. The switch words, the currencies and the
     * offers' words are the POS price list's (`pricing`), passed down beside
     * this block; only what is the books' own is here.
     */
    pricing: {
      eyebrow: string;
      title: string;
      sub: string;
      /** Under a paid price: the plan is per company, not per branch. */
      perCompany: string;
      /** Under Free's price. */
      freeNote: string;
      /** Under every price, per currency. */
      vat: Record<PlanCurrency, string>;
      /** Monthly, under a paid price. Interpolates {amount}: the yearly price. */
      orYearly: string;
      /** Yearly, under a paid price. Interpolates {saved}: twelve months less the year. */
      billedYearly: string;
      /** On every paid card. */
      trial: string;
      /** The line every paid card shares: what has no cap. */
      unlimited: string;
      plans: AccountingPlan[];
      /** Every card's button: back up to the form. */
      cta: string;
      /** The banner under the cards, per e-invoicing system. */
      einvoicingIncluded: PerEinvoicingSystem<string>;
      /** For a Moving POS restaurant: the plan, with the POS link included. No price of its own. */
      withPos: { title: string; body: string };
      /** Interpolates {user} and {branch}, each a formatted price with its unit. */
      extras: string;
      noSetupFee: string;
      enterprise: string;
      /** Prefilled WhatsApp message behind the Enterprise line. */
      enterpriseWa: string;
      ai: AccountingAiCopy;
    };
    faq: { title: string; items: Faq[] };
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
