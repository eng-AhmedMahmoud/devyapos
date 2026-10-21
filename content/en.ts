import { consentCopyBase } from "@/lib/consent/copy";
import type { SiteContent } from "./types";

/** English mirror of `ar.ts` — same tree, same order, same claims. */
export const en: SiteContent = {
  meta: {
    home: {
      title: "Moving POS | The restaurant OS — register, kitchen, online, stock",
      description:
        "One system runs the whole restaurant: POS, live kitchen display, your own online ordering, loyalty, and recipe-costed inventory. Bilingual AR/EN, EGP-native, multi-branch.",
    },
    features: {
      title: "Features | Moving POS",
      description:
        "Everything Moving POS runs: point of sale, kitchen display, online ordering, loyalty, recipe-costed inventory, Egyptian payments and reporting.",
    },
    pricing: {
      title: "Pricing | Moving POS",
      description:
        "A 14-day free trial, and Growth at 199 EGP per branch per month. Clear prices in EGP, and zero commission on your orders.",
    },
    about: {
      title: "About Moving POS | Why we built this",
      description:
        "Moving POS was built inside a working restaurant — now 25 branches, a real menu, real rush hours. The story, the principles, and the plans.",
    },
    howItWorks: {
      title: "How it works | Moving POS",
      description:
        "One order, four screens: register or phone to kitchen display in under a second, stock deducting itself, and the cost report ready at close. Plus what it takes to switch.",
    },
    compare: {
      title: "Moving POS vs enterprise POS platforms | Pricing compared",
      description:
        "Enterprise restaurant platforms bill per terminal and charge again per module. See the feature-by-feature comparison, and work out what aggregator commission is costing you a year.",
    },
    contact: {
      title: "Contact | Moving POS",
      description:
        "Book a 15-minute demo or message us on WhatsApp. We load your menu and migrate your data for free.",
    },
    etaInvoicing: {
      title: "Egyptian VAT and ETA e-invoicing | Moving POS",
      description:
        "Where Moving POS stands on Egyptian tax, in plain words: 14% VAT computed on every line, exportable sales records — and no ETA submission yet.",
    },
    foodicsAlternative: {
      title: "Foodics alternative in Egypt | Moving POS",
      description:
        "The published Egyptian entry bundle is 2,848.95 EGP per branch per month. Moving POS Growth is 199 EGP with every module included. Compared honestly.",
    },
    hardware: {
      title: "POS hardware | Run Moving POS on what you own",
      description:
        "No terminal to buy. Moving POS runs in a browser on any tablet, laptop or touchscreen and prints to any ESC/POS thermal printer. What a branch really needs.",
    },
    accountingTrial: {
      title: "Free 14-day accounting trial | Moving POS",
      description:
        "Your own accounting system in a minute: ledger, invoices, receivables, payables, bank and VAT reports, for Egypt or Saudi Arabia. 14 days free, no card.",
    },
    terms: {
      title: "Terms of service | Moving POS",
      description:
        "The terms behind a Moving POS subscription: the 14-day trial, billing per branch in EGP, support, cancellation, and who owns your data. Updated September 2026.",
    },
    privacy: {
      title: "Privacy policy | Moving POS",
      description:
        "What this site collects, which is very little: a contact form you send yourself from your own WhatsApp or email, a server we run ourselves, and no cookies of our own.",
    },
    refund: {
      title: "Refund and cancellation | Moving POS",
      description:
        "14 days free with no card, monthly or yearly billing, cancel any time, and a full export of your data on the way out. The policy in plain words.",
    },
  },

  nav: {
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Compare", href: "/compare" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ],
    extra: [
      { label: "Foodics alternative", href: "/foodics-alternative" },
      { label: "Hardware", href: "/hardware" },
      { label: "VAT and e-invoicing", href: "/eta-einvoicing" },
    ],
    cta: "Try it free",
  },

  hero: {
    badge: "The restaurant OS — built in Egypt, for Egypt",
    line1: "Run the whole restaurant",
    line2: "from one system",
    sub: "Register + live kitchen display + your own online ordering + loyalty + recipe-costed inventory. Arabic and English, priced in EGP, unlimited branches — from under 13 EGP a day per branch.",
    ctaPrimary: "Start your free trial",
    ctaSecondary: "See it running",
    trust: "14-day free trial • No credit card • Live the same day",
    stats: [
      { value: "25", label: "branches running on it" },
      { value: "679", label: "items and sizes in the catalog" },
      { value: "< 1s", label: "register to kitchen screen" },
    ],
  },

  marquee: [
    "Point of sale",
    "Live kitchen display",
    "Online ordering",
    "Recipe-costed inventory",
    "Loyalty and points",
    "Delivery zones",
    "Shifts and cash drawer",
    "Food-cost reporting",
    "Online payments and cash",
    "Unlimited branches",
    "Arabic and English",
  ],

  pain: {
    eyebrow: "The daily reality",
    title: "The restaurant is busy — so where is the profit going?",
    sub: "This was never a menu problem. Every part of your restaurant is running on its own — and each of these has exactly one line that cancels it.",
    beforeLabel: "Today",
    afterLabel: "With Moving POS",
    items: [
      {
        icon: "coins",
        title: "Aggregators take a quarter of the bill",
        body: "You pay commission on every order, and the customer stays theirs — their name, their number, their repeat business.",
        fix: "A branded ordering channel, zero commission, and the customer data is yours.",
      },
      {
        icon: "link",
        title: "Three systems that never talk",
        body: "The register is one app, the online menu another, stock lives in a spreadsheet. Month-end reconciliation is manual and the gap shows up late.",
        fix: "One system, one database — the number on the receipt is the number in the report.",
      },
      {
        icon: "printer",
        title: "The kitchen still runs on paper",
        body: "Tickets get lost, modifiers never arrive, orders run late — and the customer is the first one to notice.",
        fix: "A live kitchen display with a new-order chime and a delay counter per ticket.",
      },
      {
        icon: "warn",
        title: "You don't know what a cup really costs",
        body: "You price on instinct. Waste and ingredient usage eat the margin, and no single number tells you where it went.",
        fix: "A costed recipe per size, automatic deduction, and food-cost reporting per branch.",
      },
    ],
  },

  bridge: {
    eyebrow: "The fix",
    title: "Moving POS connects the register, the kitchen, the storefront and the stockroom",
    sub: "An order enters from anywhere — register, a customer's phone, or delivery — hits the kitchen screen in under a second, deducts its ingredients from that branch's stock, and lands in the cost report at close. Nobody re-types anything.",
    chips: [
      "One order",
      "Four screens",
      "Stock deducts itself",
      "Cost report ready",
    ],
  },

  features: {
    eyebrow: "Features",
    title: "Everything a restaurant needs — on one platform",
    sub: "Not separate tools wired together. One system, one database, one version of the numbers.",
    more: "Explore every feature",
    items: [
      {
        icon: "register",
        title: "Full point of sale",
        body: "Fast touch register, shifts and cash drawer, ESC/POS thermal printing, and per-role permissions for every staff member.",
        badge: "Touch-fast",
        hue: "brand",
      },
      {
        icon: "kds",
        title: "Live kitchen display (KDS)",
        body: "A Socket.IO room per branch, a chime on every new ticket, and status changes that land on every screen in the same instant.",
        badge: "< 1 second",
        hue: "sky",
      },
      {
        icon: "cart",
        title: "Online ordering under your brand",
        body: "A bilingual ordering site in your name and colours — pickup or zoned delivery, coupons, and live order tracking.",
        badge: "0% commission",
        hue: "emerald",
      },
      {
        icon: "stock",
        title: "Recipe-costed inventory",
        body: "Every size and paid topping maps to a costed recipe. Completed orders deduct automatically and feed the food-cost report.",
        badge: "Real cost",
        hue: "amber",
      },
      {
        icon: "branches",
        title: "Multi-branch from one console",
        body: "Per-branch stock, delivery zones and order counters, staff scoped to their own branch — with you seeing all of it.",
        badge: "Unlimited",
        hue: "violet",
      },
      {
        icon: "loyalty",
        title: "Loyalty, points and tiers",
        body: "Bronze → Silver → Gold → Platinum. Customers earn, come back to spend, and bring friends — with notifications and campaigns that reach them directly.",
        badge: "+50% retention",
        hue: "rose",
      },
      {
        icon: "pay",
        title: "Payments built for Egypt",
        body: "Card payments through your Egyptian gateway — Paymob is live today, and Fawry, Kashier, Geidea, OPay or PayTabs get wired to your account on request. Plus cash on pickup or delivery, and HMAC-verified webhooks.",
        badge: "EGP + 14% VAT",
        hue: "blue",
      },
      {
        icon: "chart",
        title: "Reports you can act on",
        body: "Best sellers, peak hours, ingredient usage and food cost per branch — numbers that change a decision, not numbers you stare at.",
        badge: "Real data",
        hue: "sky",
      },
      {
        icon: "lang",
        title: "Fully bilingual",
        body: "Genuine RTL from the menu to the receipt to the report — not a translation layer bolted onto an English UI.",
        badge: "2 languages",
        hue: "violet",
      },
    ],
  },

  tour: {
    eyebrow: "Quick tour",
    title: "Four interfaces, one system underneath",
    sub: "Each screen is built for whoever stands in front of it: the cashier, the chef, the customer, and the owner.",
    tabs: [
      {
        id: "pos",
        label: "Register",
        title: "The cashier screen",
        body: "Items with photos, sizes and add-ons in two taps, and a running VAT-inclusive total. Shifts open and close against a counted drawer.",
        points: [
          "Instant search across the whole menu",
          "Discounts and coupons applied automatically",
          "Bilingual thermal receipt printing",
          "Shift handover with a clear drawer variance",
        ],
      },
      {
        id: "kds",
        label: "Kitchen",
        title: "Kitchen display (KDS)",
        body: "Tickets appear instantly with a chime, ordered by time, and colour-shift as they age. The chef changes status and the register and the customer see it the same second.",
        points: [
          "A separate room per branch",
          "New-order chime",
          "Per-ticket delay counter",
          "Live updates over Socket.IO",
        ],
      },
      {
        id: "shop",
        label: "Customer",
        title: "Your branded ordering site",
        body: "A fast digital menu in your name and colours — pickup or delivery, card or cash, and live order tracking without installing anything.",
        points: [
          "No app download",
          "Instant Arabic/English switch",
          "Delivery zones with their own fees",
          "Live order status tracking",
        ],
      },
      {
        id: "admin",
        label: "Back office",
        title: "The admin console",
        body: "Menu, recipes, inventory, staff, branches and coupons — all in one place, with role-based permissions and reports on demand.",
        points: [
          "Menu edits land on every screen instantly",
          "Opening stock and counts per branch",
          "Roles: admin, branch manager, cashier, barista",
          "Sales and food-cost reporting",
        ],
      },
    ],
  },

  steps: {
    eyebrow: "The steps",
    title: "Live the same day — without closing for an hour",
    sub: "We do the setup. You just open the shift.",
    items: [
      {
        n: "01",
        title: "Send us your menu",
        body: "A link, a spreadsheet, or even photos of the printed menu. We load every item, size, add-on and image — free.",
      },
      {
        n: "02",
        title: "We wire branches and payments",
        body: "Each branch with its stock, delivery zones, printer and staff. Your payment gateway account gets connected and tested with a real order.",
      },
      {
        n: "03",
        title: "Open the shift",
        body: "The register starts, the kitchen sees tickets, customers order online. After day one you're looking at your real numbers.",
      },
    ],
    cta: "Start your free trial",
  },

  compare: {
    eyebrow: "Comparison",
    title: "Enterprise power, without the enterprise invoice",
    sub: "The big platforms — Foodics and the like — do the job, then bill per terminal and charge again for each module. Moving POS gives you the whole system for a flat price per branch, and the parts you need changed, we change.",
    us: "Moving POS",
    them: "Enterprise POS platforms",
    rows: [
      { label: "Digital QR menu", us: true, them: true },
      { label: "Loyalty, points and tiers", us: true, them: true },
      { label: "Push notifications and campaigns", us: true, them: true },
      { label: "Online ordering under your brand", us: true, them: "partial" },
      { label: "Full point of sale (register)", us: true, them: false },
      { label: "Live kitchen display (KDS)", us: true, them: false },
      { label: "Shifts and cash drawer", us: true, them: false },
      { label: "Recipe-costed inventory", us: true, them: false },
      { label: "Food-cost reporting", us: true, them: false },
      { label: "Delivery zones and fees", us: true, them: false },
      { label: "Multi-branch with separate stock", us: true, them: "partial" },
      { label: "Online payments + cash on pickup", us: true, them: true },
      { label: "Full bilingual RTL", us: true, them: true },
      { label: "On-premise or your-own-server hosting", us: true, them: false },
      { label: "Menu and data migration", us: "Free", them: "Paid" },
      { label: "Custom features built for your chain", us: true, them: false },
      { label: "Workflow changed to match how you work", us: true, them: false },
      { label: "Billing model", us: "Flat, per branch", them: "Per terminal + modules" },
      { label: "Price per branch per month", us: "199 EGP", them: "Quote only" },
    ],
    note: "Moving POS's figures are our own published prices. The right-hand column describes how enterprise restaurant platforms are typically licensed in this market — per terminal, with paid modules and quoted pricing — not any single vendor's rates. Ask any vendor for a written quote and compare it against ours.",
  },

  roi: {
    eyebrow: "Do the math",
    title: "How much commission do you pay a year?",
    sub: "Move the numbers to match your restaurant, and see the difference if those orders arrived on your own site.",
    fields: {
      orders: "Delivery orders per branch",
      aov: "Average order value",
      commission: "Aggregator commission",
      branches: "Number of branches",
    },
    hints: {
      orders: "orders/mo",
      aov: "EGP",
      commission: "%",
      branches: "branches",
    },
    tips: {
      orders:
        "Orders one branch takes through Talabat, Elmenus or Breadfast in a month — not the whole chain. A busy branch is usually somewhere between 300 and 1,200.",
      aov: "The average bill on a delivery order, before the aggregator's cut. Take last month's delivery revenue and divide it by the number of delivery orders.",
      commission:
        "The cut the aggregator keeps on every order. Egyptian restaurants are typically quoted between 15% and 25%, depending on volume, area, and whether you list exclusively.",
      branches: "Branches you would run on Moving POS. Pricing is per branch, so this drives the cost side.",
      paid: "Orders per branch x branches x average order value x commission, over twelve months.",
      recovered:
        "What you keep if only 30% of those orders come to your own site instead. The other 70% stay on the aggregator.",
      cost: "199 EGP per branch per month on the Growth plan, for twelve months.",
      net: "Recovered commission minus what Moving POS costs you. This is the number that matters.",
      payback:
        "How long the recovered commission takes to cover a full year of Moving POS. Shorter is better.",
    },
    rateNote: "Typical range quoted to Egyptian restaurants.",
    summary: "That is {orders} delivery orders a month across the whole chain.",
    results: {
      paid: "Commission you pay per year",
      recovered: "Recovered if 30% shift to your own site",
      cost: "Moving POS cost per year",
      net: "Net saving per year",
      payback: "You break even in",
      paybackUnit: "days",
      paybackNone: "Not at these numbers",
    },
    assumption:
      "The math assumes only 30% of aggregator orders move to your direct channel — a conservative figure once loyalty and notifications are running.",
    note: "Estimates for guidance only, not a promise of return.",
    cta: "Want us to review your real numbers?",
  },

  caseStudy: {
    eyebrow: "Our first client, still our toughest",
    title: "Moving POS isn't slideware — 25 branches run on it daily",
    body: "The first chain to put Moving POS on its tills still shapes the roadmap: a real menu, real rush hours, and 25 branches that call the moment something is wrong. Every feature here exists because a shift needed it — not because it looked good in a deck.",
    statsTitle: "The deployment, in numbers",
    stats: [
      { value: "25", label: "live branches" },
      { value: "249", label: "products" },
      { value: "430", label: "size variants" },
      { value: "29", label: "menu categories" },
    ],
    facts: [
      {
        title: "It was never a pilot",
        body: "The system went into working branches with paying customers in front of them. No sandbox phase, no parallel run — the old way stopped and this started.",
      },
      {
        title: "The menu is the hard part",
        body: "249 products across 29 categories, 430 costed size variants, and add-ons that change the price and the recipe at once. Loading that properly is what makes the first shift boring, which is the whole goal.",
      },
      {
        title: "It gets fixed the same shift",
        body: "25 branches call when something is wrong, and they call during service. Most of what is in Moving POS today exists because a shift needed it before the next rush.",
      },
      {
        title: "The same code runs your restaurant",
        body: "There is no enterprise edition held back for bigger accounts. What runs those branches is what you get on the trial.",
      },
    ],
    anonymity: "The chain is not named here. They asked us to keep their brand out of our marketing and we agreed, so the numbers are theirs and the logo stays off this page.",
    link: "See the system architecture",
  },

  testimonials: {
    eyebrow: "Customer stories",
    title: "Restaurant owners on Moving POS",
    // Intentionally empty until real, signed customer quotes exist —
    // the section hides itself while this array is empty.
    items: [],
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Clear prices — and zero commission on your orders",
    sub: "Try every feature for 14 days. Pay when the system is already making you money.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 30%",
    currency: "EGP",
    per: "/mo",
    perBranch: "per branch",
    compareLink: "See the full comparison",
    segments: {
      eyebrow: "Start here",
      title: "What kind of restaurant are you?",
      sub: "The price is the same whichever one you pick. What changes is the part of the system you will live in.",
      note: "One platform, one price per branch. These are listed separately because a cloud kitchen and a dining room are shopping for different things, not because they are billed differently.",
      items: [
        {
          id: "qsr",
          label: "QSR and cafés",
          headline: "Speed at the till, and a delivery channel that is not costing you a quarter of the bill.",
          body: "Counter service is decided by how fast the cashier moves and how much of your delivery volume you keep. The register is built for two-tap ordering, and the same order comes through your own site at zero commission.",
          points: [
            "Sizes and add-ons in two taps",
            "Kitchen display instead of paper tickets",
            "Your own ordering site, zero commission",
            "Loyalty that brings the morning regular back",
          ],
        },
        {
          id: "cloud",
          label: "Cloud kitchens",
          headline: "One kitchen, several brands, and a cost per dish you can actually see.",
          body: "With no dining room, the business is the order flow and the food cost. Orders from every channel land on one kitchen screen, and every recipe carries its own costed ingredients.",
          points: [
            "Every channel on one kitchen screen",
            "Recipe-costed inventory per dish",
            "Delivery zones and fees you set yourself",
            "Food-cost reporting per brand and per branch",
          ],
        },
        {
          id: "dinein",
          label: "Dine-in restaurants",
          headline: "Shifts, drawer counts, and a kitchen that hears the order as it is taken.",
          body: "A dining room is a staffing and timing problem before it is a software problem. Shifts open and close against a counted drawer, and tickets reach the kitchen in under a second with a delay counter running.",
          points: [
            "Shifts and drawer variance by staff member",
            "Live kitchen display with per-ticket timing",
            "Bilingual thermal receipts",
            "Role-scoped permissions for every position",
          ],
        },
        {
          id: "chain",
          label: "Multi-branch chains",
          headline: "Every branch on its own stock and its own numbers, with one console above all of them.",
          body: "Past the second branch the question stops being the till and becomes comparison. Each branch keeps its own stock, zones and order numbering, and you see all of them side by side.",
          points: [
            "Independent stock and delivery zones per branch",
            "Staff scoped to their own branch",
            "One console across every branch",
            "Flat price per branch, no per-terminal fee",
          ],
        },
      ],
    },
    annual: {
      label: "Billed once a year",
      total: "{total} EGP per branch for twelve months",
      saving: "You keep {saved} EGP per branch a year against paying monthly.",
      note: "The yearly price is the monthly price less 30%, charged once for twelve months. Cancel and you keep access until the year you paid for ends, with a full export of your data before you go.",
    },
    plans: [
      {
        id: "growth",
        name: "Growth",
        tagline: "The whole restaurant runs from here",
        price: 199,
        badge: "Most chosen",
        featured: true,
        features: [
          "Branded digital QR menu",
          "Online ordering site — zero commission",
          "Unlimited items and sizes",
          "Full POS + shifts and drawer",
          "Live kitchen display (KDS)",
          "Zoned delivery with fees",
          "Online payments + cash + coupons",
          "Loyalty, points and tiers",
          "Customer notifications and campaigns",
          "Sales and staff reporting",
          "Full Arabic/English",
          "WhatsApp support on business days",
        ],
        cta: "Try 14 days free",
      },
      {
        id: "scale",
        name: "Scale",
        tagline: "When margin becomes the game",
        price: 499,
        features: [
          "Everything in Growth",
          "Recipe-costed inventory",
          "Automatic ingredient deduction",
          "Food-cost and waste reporting",
          "Custom role permissions",
          "Unified multi-branch console",
          "API and webhooks",
          "Priority support + account manager",
        ],
        cta: "Talk to us",
      },
      {
        id: "enterprise",
        name: "Enterprise",
        tagline: "Chains and franchises",
        price: null,
        priceLabel: "Custom",
        features: [
          "Everything in Scale",
          "Private or on-premise hosting",
          "Service level agreement (SLA)",
          "ERP and existing-system integration",
          "On-site team training",
          "Custom contractual terms",
        ],
        cta: "Book a call",
      },
    ],
    marketAnchor: {
      title: "What the market charges",
      sub: "Published Egyptian pricing, retrieved 4 September 2026. Compare per branch, per month.",
      rows: [
        { name: "Foodics — Basic Bundle", price: "2,848.95 EGP", note: "Billed annually (3,019.89 quarterly). Loyalty, API, delivery aggregators and BI all cost extra" },
        { name: "Foodics — Advanced Bundle", price: "3,733.67 EGP", note: "Billed annually (3,957.69 quarterly). Top published Egyptian tier" },
        { name: "Moving POS — Growth", price: "199 EGP", note: "The whole system, every module included", ours: true },
      ],
      note: "Competitor figures are their own published Egyptian prices at the date above and may change — check them yourself before deciding. Ours is the full platform: register, kitchen display, your own ordering site, loyalty and reporting, with no per-terminal fee and no per-module upsell.",
    },
    note: "Prices are in EGP per branch, excluding VAT. The trial runs 14 days with every feature and no credit card. Change or cancel any time, and export all of your data before you go.",
    founding: "Founding offer: the first 50 restaurants lock this price for the life of their subscription.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "The questions people ask before signing",
    sub: "If yours isn't here, message us on WhatsApp — a human answers.",
    items: [
      {
        q: "Is there a free trial?",
        a: "Yes — 14 days with every feature of the Growth plan and no credit card. We load your menu before the trial starts, so you are testing on your own data rather than on a demo.",
      },
      {
        q: "Do I have to buy new hardware?",
        a: "No. It runs on any device with a browser — a tablet, a laptop, or the touchscreen you already own. Printing works with any ESC/POS thermal printer.",
      },
      {
        q: "Can I move my menu and customer data across?",
        a: "Yes, and we do the moving. Send the menu in any form — a link, a spreadsheet, or an export from your current system — and we load it and review it with you before you go live.",
      },
      {
        q: "What if the branch has weak internet?",
        a: "Screens run on the branch network with live updates over Socket.IO. On Scale and Enterprise we can host the system inside the restaurant itself or on your own server.",
      },
      {
        q: "How are prices and VAT handled?",
        a: "Every amount is stored as whole piasters — no floating-point drift. The 14% VAT is included in the price and shown on the receipt and in reports for clarity.",
      },
      {
        q: "Who owns my data?",
        a: "You do. Full export of your customers, orders and menu at any time at no charge, and we'll help you self-host if you want to.",
      },
      {
        q: "Does the customer need an app?",
        a: "No. They scan and order straight from the browser. Notifications reach them without an app too.",
      },
      {
        q: "Do you take a cut of orders?",
        a: "Never. A flat per-branch subscription, that's it. Every pound from your own site is yours.",
      },
    ],
  },

  cta: {
    title: "Ready to run the whole restaurant from one system?",
    sub: "Start your free trial today, or book a 15-minute demo and we'll show it running on your own menu.",
    primary: "Start your free trial",
    secondary: "Book a 15-min demo",
    trust: "14 days free • No credit card • Free migration • Cancel any time",
  },

  notFound: {
    title: "This page doesn't exist",
    body: "The link may have changed or been mistyped. Head back home, or take a look at the pricing.",
    cta: "Back to home",
  },

  // The shared consent copy (lib/consent/copy.ts); only the `vendors` lines
  // are this site's own and must match lib/consent/config.ts.
  consent: {
    ...consentCopyBase.en,
    necessary: {
      ...consentCopyBase.en.necessary,
      vendors:
        "On this site: devyapos.consent.v2 (this choice) and devyapos-theme (the appearance you pick) in your browser's local storage. No cookies.",
    },
    categories: {
      marketing: {
        ...consentCopyBase.en.categories.marketing,
        vendors:
          "On this site: the campaign link that brought you (UTM tags, the referring site and your first page), kept in this tab's storage until you close it and sent only with a form you choose to submit. No ad platform receives it.",
      },
    },
  },

  footer: {
    blurb:
      "The restaurant OS — register, kitchen, online ordering, loyalty and inventory on one platform, in Arabic and in EGP.",
    cols: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Hardware", href: "/hardware" },
          { label: "Accounting free trial", href: "/accounting-trial" },
          { label: "How it works", href: "/#how" },
        ],
      },
      {
        title: "Compare",
        links: [
          { label: "Foodics alternative", href: "/foodics-alternative" },
          { label: "Enterprise POS platforms", href: "/compare" },
          { label: "VAT and e-invoicing", href: "/eta-einvoicing" },
          { label: "Commission calculator", href: "/#roi" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          /* Terms of service is deliberately absent rather than pointed at
             /contact. It is the one page with liability caps, IP assignment
             and a jurisdiction clause, it still carries the unreviewed-draft
             gate, and a link labelled "Terms of service" that lands on a
             contact form is a broken promise to everyone who clicks it. It
             comes back the day a lawyer has read it.

             Privacy and refund are both live: the first is a notice about what
             we already do, and the second only restates the trial and
             cancellation terms the marketing pages already promise out loud —
             a page that matches those claims lowers the risk rather than
             raising it. */
          { label: "Privacy policy", href: "/privacy" },
          { label: "Refund policy", href: "/refund" },
        ],
      },
    ],
    legal: "All rights reserved.",
    social: "Moving POS on social media",
  },

  about: {
    badge: "About Moving POS",
    title: "Built inside a restaurant — not inside a meeting",
    sub: "Every feature in Moving POS came out of something that went wrong during a real shift, in a real branch, at peak hour.",
    storyTitle: "The story",
    story: [
      "It started as one project: build a complete system for an Egyptian bubble-tea chain with ten branches. Not a QR menu, not an ordering page — the whole thing: register, kitchen display, storefront, inventory and reporting.",
      "The moment it went into the branches, the real problem became obvious. It was never any single tool. It was that the market sells restaurants pieces: a menu tool, a loyalty tool, register software, and a spreadsheet for stock. Each piece works alone and they contradict each other together.",
      "What we learned there — that money must be stored as whole piasters, that Arabic has to be a first-class language rather than a translation, that an order must reach the kitchen in under a second, and that every cup needs a known cost — became the product's principles.",
      "Moving POS is that same system, packaged so any Egyptian restaurant can be live on it the same day. The same code that runs 25 branches right now.",
    ],
    principlesTitle: "The principles we build on",
    principlesSub: "Engineering decisions made once that protect you every day.",
    principles: [
      {
        icon: "coins",
        title: "Money in piasters, never in floats",
        body: "Every amount is a whole-number of piasters. No end-of-day one-piaster drift, and no mismatch between the receipt and the report.",
      },
      {
        icon: "lang",
        title: "Arabic as a first language",
        body: "RTL from the ground up — menu, register, thermal receipt and report. Not a translation layered onto an English UI.",
      },
      {
        icon: "bolt",
        title: "Realtime isn't a luxury",
        body: "Orders reach the kitchen display in under a second over a live channel, with an isolated room per branch.",
      },
      {
        icon: "users",
        title: "Your customer stays yours",
        body: "A direct channel makes you the owner of the relationship and the data. Full export whenever you want, and no commission on any order.",
      },
      {
        icon: "stock",
        title: "Every item has a cost",
        body: "Recipes map to costed ingredients, and a completed order deducts from its own branch's stock and feeds the food-cost report.",
      },
      {
        icon: "shield",
        title: "Permissions by role",
        body: "Admin, branch manager, cashier, barista — each sees their own branch and their own screen, and sensitive actions stay protected.",
      },
    ],
    numbersTitle: "The system today",
    numbers: [
      { value: "25", label: "branches on the platform" },
      { value: "249", label: "products in the live catalog" },
      { value: "430", label: "costed size variants" },
      { value: "4", label: "apps over one database" },
      { value: "2", label: "first-class languages (AR/EN)" },
      { value: "14%", label: "VAT computed automatically" },
    ],
    timelineTitle: "Timeline",
    timeline: [
      {
        n: "01",
        title: "The first deployment",
        body: "A complete system for a ten-branch chain: register, kitchen, ordering site, inventory and reports.",
      },
      {
        n: "02",
        title: "Hardened in the field",
        body: "Peak shifts, printer failures, and mid-service menu edits — the system was forged by whatever broke.",
      },
      {
        n: "03",
        title: "Turned into a product",
        body: "The same system was decoupled from one brand and became a platform any restaurant can run the same day — Moving POS.",
      },
    ],
    plansTitle: "The plans, briefly",
    plansSub:
      "Growth for a working restaurant, Scale for when margin becomes the game, Enterprise for chains — all of them starting with a 14-day trial.",
    builtByTitle: "Who builds it",
    builtByBody:
      "Moving POS is a product of Devya Solutions — an Egyptian software engineering studio that builds complete operating systems: backends, web apps, payments and infrastructure. This platform was built and is maintained entirely in-house, so support and new work come from the same team that wrote the code.",
    builtByCta: "devya.dev",
    ctaTitle: "Want to see it on your own menu?",
    ctaBody:
      "Send us your menu, we'll load it into the system and show it running — no commitment.",
  },

  contact: {
    badge: "Contact",
    title: "Let's look at your restaurant",
    sub: "Fill in the form or message us on WhatsApp directly. We reply the same business day, and we load your menu for free before you decide.",
    form: {
      name: "Your name",
      restaurant: "Restaurant name",
      branches: "Number of branches",
      phone: "Mobile number",
      message: "Anything we should know",
      submitLead: "Send my details",
      submit: "Send on WhatsApp",
      submitEmail: "Send by email",
      hint: "Your details come straight to the Moving POS team so we can call you back — or send them on WhatsApp instead, if that suits you better.",
      privacy:
        "We use what you send here to answer you about Moving POS and nothing else. We don't sell it, share it with advertisers, or add you to a marketing list. Ask us to delete it any time.",
      privacyLink: "Read the privacy policy",
      messagePlaceholder:
        "e.g. Two branches, an old register, and I want to start selling online…",
      status: {
        sending: "Sending…",
        successTitle: "We've got your details",
        successBody: "We'll reach out on the number you gave us, the same business day.",
        errorTitle: "Couldn't send that",
        errorBody: "Something went wrong at our end. Try again, or send it on WhatsApp instead.",
        errorSummary: "Please check the following fields:",
        rateLimited: "That's a few attempts in a row. Give it a minute and try again.",
        optional: "optional",
      },
      errors: {
        required: "This field is required",
        too_short: "That looks a little short",
        too_long: "That's longer than we can accept",
        invalid_phone: "Enter a valid Egyptian mobile, e.g. 01312345678",
        invalid_branches: "Enter a whole number of branches (1 or more)",
      },
    },
    channels: {
      title: "Other channels",
      items: [
        {
          icon: "bell",
          title: "WhatsApp",
          body: "Fastest route — a reply the same business day.",
        },
        {
          icon: "users",
          title: "Call us",
          body: "Reach the business line during working hours.",
        },
        {
          icon: "link",
          title: "Email",
          body: "For detailed proposals, invoices and contracts.",
        },
        {
          icon: "clock",
          title: "Live demo",
          body: "15 minutes on your own menu, no commitment.",
        },
      ],
    },
    waTemplate: "Hi Moving POS! I'd like to know more about the system for my restaurant.",
  },

  gallery: {
    eyebrow: "The real thing",
    title: "Screens from a live deployment",
    sub: "Not renders. These are captures of the system actually running.",
    items: [
      { alt: "Taking an order on the register", caption: "The register: a live ticket, sizes and totals as you tap" },
      { alt: "The kitchen display screen", caption: "Kitchen display: every ticket, with a delay counter running" },
      { alt: "The branded ordering site", caption: "Your own ordering site — your name, your photography" },
      { alt: "The admin dashboard", caption: "Revenue, orders and payment mix across every branch" },
      { alt: "The reporting console", caption: "Daily report: channel, payment method and status" },
      { alt: "Menu management", caption: "Categories, products and ingredients in one place" },
      { alt: "Branch inventory", caption: "Stock per branch, deducting itself as orders complete" },
    ],
    quickLook: {
      hint: "Quick look",
      open: "Quick look: {caption}",
      close: "Close",
      previous: "Previous screen",
      next: "Next screen",
      position: "{n} of {total}",
    },
  },

  homeContact: {
    eyebrow: "Contact",
    title: "Reach us the way that suits you",
    sub: "A WhatsApp message, a call or an email. We reply the same business day, and we load your menu for free before you decide.",
    whatsapp: "WhatsApp",
    phone: "Call",
    email: "Email",
    emailSubject: "About Moving POS",
  },

  floating: {
    top: "Back to top",
    whatsapp: "Message us on WhatsApp",
  },

  promo: {
    eyebrow: "Four seconds",
    title: "A whole order, from first tap to receipt number",
    sub: "Taken from the running system, not a mockup: pick the item, choose the size, take the cash, issue the number.",
    steps: ["Pick the item", "Choose the size", "Take the cash", "Order number"],
    alt: "Recording of the register: two items added, payment taken, order number issued",
    play: "Play the recording",
  },

  payments: {
    eyebrow: "Payments",
    title: "Take money the way Egypt actually pays",
    sub: "Cards, wallets, instalments and cash — through the gateway you already have a contract with, into the same reports as everything else.",
    liveLabel: "Live today",
    onRequestLabel: "Connected on request",
    providers: [
      { name: "Paymob", live: true },
      { name: "Fawry", live: false },
      { name: "Kashier", live: false },
      { name: "Geidea", live: false },
      { name: "OPay", live: false },
      { name: "PayTabs", live: false },
    ],
    note: "Paymob ships integrated — Intention API, Unified Checkout and HMAC-verified webhooks. The others we connect to your own merchant account as part of onboarding, because we wrote the payment layer and can extend it. Cash on pickup and delivery is always supported and lands in the same daily report.",
  },

  promise: {
    eyebrow: "How we work",
    title: "We don't sell you a system. We build the experience your brand runs on.",
    sub: "Moving POS is the foundation. What your customer actually sees is yours — your name, your colours, your menu, your flow. Every deployment is fitted to the restaurant instead of the restaurant being fitted to the software.",
    items: [
      {
        title: "Your brand, never ours",
        body: "The ordering site, the receipt, the loyalty tiers and the notifications all carry your name. Our name appears nowhere your customer looks.",
      },
      {
        title: "Fitted to how you already work",
        body: "Your menu structure, your delivery zones, your shift rules, your printer layout. We shape the system around the operation you have, not a template you have to move into.",
      },
      {
        title: "Missing something? We build it",
        body: "A gateway, a report, an integration with the accounting system you already use. We are the team that wrote the code, so it gets built — not filed as a feature request behind someone else's roadmap.",
      },
    ],
  },

  featuresPage: {
    badge: "Full capabilities",
    title: "Everything that runs your restaurant — in detail",
    sub: "From the moment the cashier opens a shift to the food-cost report at month end.",
    groups: [
      {
        title: "Daily operations",
        body: "The screens your team stands in front of every day.",
        items: [
          {
            icon: "register",
            title: "Touch register",
            body: "Instant search, sizes and add-ons in two taps, and a live VAT-inclusive total.",
            badge: "POS",
            hue: "brand",
          },
          {
            icon: "kds",
            title: "Live kitchen display",
            body: "A room per branch, a chime on every new ticket, and a delay counter per ticket.",
            badge: "KDS",
            hue: "sky",
          },
          {
            icon: "clock",
            title: "Shifts and cash drawer",
            body: "Open and close shifts against a counted drawer, with variance attributed by staff member.",
            badge: "Accounting",
            hue: "amber",
          },
          {
            icon: "printer",
            title: "Thermal printing",
            body: "Bilingual ESC/POS receipts with a customisable footer per branch.",
            badge: "ESC/POS",
            hue: "violet",
          },
        ],
      },
      {
        title: "Your direct sales channel",
        body: "You own the customer, the relationship and the data — with no commission.",
        items: [
          {
            icon: "qr",
            title: "Digital QR menu",
            body: "A price or availability change lands instantly — no reprinting.",
            badge: "Instant",
            hue: "emerald",
          },
          {
            icon: "cart",
            title: "Branded ordering site",
            body: "Pickup or delivery, coupons, and live tracking — with no app to install.",
            badge: "0% commission",
            hue: "brand",
          },
          {
            icon: "loyalty",
            title: "Loyalty and tiers",
            body: "Points, rewards and a Bronze-to-Platinum climb that drives repeat visits.",
            badge: "Retention",
            hue: "rose",
          },
          {
            icon: "bell",
            title: "Notifications and campaigns",
            body: "Your offers reach your customers directly, with no ad budget.",
            badge: "Direct reach",
            hue: "blue",
          },
        ],
      },
      {
        title: "Profitability and control",
        body: "The part that turns sales into profit you can trace.",
        items: [
          {
            icon: "stock",
            title: "Recipe-costed inventory",
            body: "Every size and add-on maps to costed ingredients, deducted automatically when an order completes.",
            badge: "Cost",
            hue: "amber",
          },
          {
            icon: "chart",
            title: "Performance reporting",
            body: "Best sellers, peak hours, ingredient usage and food cost per branch.",
            badge: "Analytics",
            hue: "sky",
          },
          {
            icon: "branches",
            title: "Branch management",
            body: "Independent stock, zones and order counters per branch, with one console above them.",
            badge: "Scale",
            hue: "violet",
          },
          {
            icon: "shield",
            title: "Permissions and precision",
            body: "Scoped roles, and amounts as whole piasters so the numbers always reconcile.",
            badge: "Trust",
            hue: "emerald",
          },
        ],
      },
      {
        title: "Payments and integration",
        body: "Built for the Egyptian market from day one.",
        items: [
          {
            icon: "pay",
            title: "Online payments",
            body: "Paymob is live today with Intention API, Unified Checkout and HMAC-verified webhooks. Already on Fawry, Kashier, Geidea, OPay or PayTabs? We connect yours during onboarding.",
            badge: "Cards",
            hue: "blue",
          },
          {
            icon: "coins",
            title: "Cash on pickup/delivery",
            body: "The offline rail is fully supported and lands in the same reports.",
            badge: "Cash",
            hue: "emerald",
          },
          {
            icon: "lang",
            title: "Fully bilingual",
            body: "Arabic and English on every screen, receipt and report, switchable instantly.",
            badge: "AR/EN",
            hue: "violet",
          },
          {
            icon: "link",
            title: "API and webhooks",
            body: "Connect your existing systems — accounting, ERP, or your own reporting.",
            badge: "Integration",
            hue: "brand",
          },
        ],
      },
    ],
  },

  trustLine: {
    short: "Moving POS is a product of Devya Solutions, the Egyptian software studio that built the platform and runs it.",
    withCr: "Moving POS is a product of Devya Solutions, the Egyptian software studio that built the platform and runs it — commercial registration {cr}.",
  },

  parentCompany: {
    credit: { text: "Moving Systems is a Devya Solutions company", link: "Devya Solutions" },
    notice: {
      text: "Moving Systems is a subsidiary of Devya Solutions, its parent company.",
      link: "Devya Solutions",
    },
  },

  etaInvoicing: {
    badge: "VAT and e-invoicing in Egypt",
    title: "Where Moving POS stands on Egyptian tax",
    sub: "Most systems sold to Egyptian restaurants say nothing at all about this. Here is what the law asks of you, what this system does for you today, and what it does not do yet.",
    standfirst:
      "Moving POS is not an Egyptian Tax Authority e-invoicing integration. It computes and shows 14% VAT, holds your tax registration number, and exports the sales records your accountant works from. It does not submit anything to the ETA on your behalf. If a vendor tells you their point of sale makes you compliant, ask them to show you a submitted document with an ETA reference on it, in a live account.",
    updated: "Reviewed 4 September 2026. Tax rules move; this page moves with them.",
    required: {
      title: "What a VAT-registered restaurant in Egypt is actually asked to do",
      sub: "The short version, in the order owners ask us about it. This is not legal advice — the Egyptian Tax Authority's own guidance and your accountant are the authority.",
      items: [
        {
          title: "Register for VAT once you cross the threshold",
          body: "Registration follows the turnover threshold set in the VAT law. Check the current figure with the ETA or your accountant. Once you are registered you hold a tax registration number and you are inside the system, whether or not your till knows it.",
        },
        {
          title: "Charge the right rate, and keep it visible",
          body: "The standard rate is 14%. The figure you file has to be supported by what you actually charged, line by line, not reconstructed from a total at the end of the month.",
        },
        {
          title: "File returns on the authority's schedule",
          body: "Returns are filed periodically through the ETA, out of your own sales records. No point-of-sale system files them for you by simply existing.",
        },
        {
          title: "Keep records that survive a question",
          body: "Sales per branch, per day, with tax separated out, retrievable months later — not sitting in a cash drawer or in a spreadsheet somebody overwrote.",
        },
        {
          title: "Know which electronic system applies to you",
          body: "The ETA runs an e-invoice system for business-to-business documents and an e-receipt system for business-to-consumer sales, phased in by taxpayer group. Whether your restaurant is already inside a mandated group is a question for the ETA or your accountant, and the answer changes over time.",
        },
      ],
      note: "We build software, not tax positions. Every line above is a question worth asking, not a substitute for asking it.",
    },
    does: {
      title: "What Moving POS does for you today",
      sub: "All of it ships now, on every plan, and you can watch it working during the trial on your own menu.",
      items: [
        {
          title: "14% VAT computed on every line",
          body: "Tax is calculated per line item as the order is built, not estimated at the end, and it appears on the receipt the customer takes away.",
        },
        {
          title: "Your tax registration number is held on the business record",
          body: "Stored once against the business, so it lives in the system rather than on a sticker behind the till.",
        },
        {
          title: "Amounts stored as whole piasters",
          body: "No floating-point drift. The total on the receipt is the total in the report, to the piaster, months later.",
        },
        {
          title: "Sales records you can export",
          body: "By branch, by day, by payment method, with tax separated — the raw material an accountant needs to prepare a return.",
        },
        {
          title: "One set of numbers for the whole chain",
          body: "Two branches or twenty-five, the sales behind a filing come out of one database instead of being stitched together by hand at month end.",
        },
      ],
    },
    doesNot: {
      title: "What Moving POS does not do yet",
      sub: "Written here so you read it now rather than discover it after signing.",
      items: [
        {
          title: "No submission to the ETA",
          body: "Moving POS does not send invoices or receipts to the Egyptian Tax Authority's systems. Nothing is transmitted on your behalf, to anyone.",
        },
        {
          title: "No signed electronic documents",
          body: "There is no e-signature, no e-seal, and no ETA-format document produced. A Moving POS receipt is a receipt, not a registered electronic tax document.",
        },
        {
          title: "No ETA reference on the receipt",
          body: "You will not find a submission identifier or status on the printout, because there is no submission behind it.",
        },
        {
          title: "No accreditation",
          body: "Moving POS holds no certification, accreditation or approval from the Egyptian Tax Authority, and this site claims none anywhere.",
        },
      ],
      note: "None of that is priced into what you pay. You are not being billed for a compliance module that does not exist.",
    },
    meaning: {
      title: "What that means if you are choosing a system now",
      body: "The honest answer turns on one thing: whether your restaurant is already required to submit electronically.",
      points: [
        "If you are not yet in a mandated group, Moving POS covers the daily part — correct VAT on every line, clean records per branch, and an export your accountant can work from.",
        "If you are already required to submit e-receipts or e-invoices, you need a route that submits. Run one alongside Moving POS, or wait for us. Do not buy this expecting it to close that gap today.",
        "Ask every vendor you are talking to the same question in writing: does your system submit to the ETA, under whose accreditation, and can you show it happening in a live account? A logo on a slide is not an answer.",
        "When submission ships here, this page changes the same day, with the date on it. That is the only promise on this page.",
      ],
    },
    faq: {
      title: "The awkward questions, answered",
      items: [
        {
          q: "Is Moving POS compliant with Egyptian e-invoicing?",
          a: "No, and we will not say otherwise. Moving POS computes and shows VAT and keeps your sales records. It does not submit documents to the Egyptian Tax Authority, and it holds no accreditation from them.",
        },
        {
          q: "Does it calculate VAT correctly?",
          a: "Yes. 14% is computed per line item as the order is built, and shown on the receipt and in reports. Amounts are stored as whole piasters, so the receipt and the report never disagree.",
        },
        {
          q: "Can I file my VAT return from Moving POS?",
          a: "You can export the sales records a return is built from — by branch, by day, with tax separated. The filing itself happens through the Egyptian Tax Authority, by you or your accountant.",
        },
        {
          q: "My accountant says I have to submit e-receipts. What now?",
          a: "Then you need a submission route Moving POS does not provide today. Tell us during the trial and we will say plainly whether the rest of the system is still worth your time — sometimes it is, sometimes it is not.",
        },
        {
          q: "Is ETA submission on the roadmap?",
          a: "It is on the list. We are not putting a date on it on a marketing page, because a date here is not something you could hold us to. If it decides your purchase, ask us directly and we will tell you where it actually stands.",
        },
        {
          q: "Do you store my tax registration number?",
          a: "Yes, on your business record, so it is in the system rather than on a note behind the till. It is your data — export it or have it deleted whenever you want.",
        },
      ],
    },
    cta: {
      title: "Ask us the awkward question first",
      body: "Fifteen minutes, your menu, and your accountant's requirements on the table. If Moving POS is the wrong fit for where your restaurant stands, we would rather say so now than after you have paid.",
      primary: "Book a 15-min demo",
      secondary: "Message us on WhatsApp",
    },
  },

  foodicsAlternative: {
    badge: "Moving POS vs Foodics",
    title: "Looking for a Foodics alternative in Egypt?",
    sub: "Foodics is a serious product. It is also priced for a different restaurant than the one this page is written for. Here is the comparison with the numbers left in.",
    disclaimer:
      "Foodics is a trademark of its owner and has no affiliation with Moving POS. Every figure below comes from Foodics' own published Egyptian pricing, retrieved September 2026. Their prices are theirs to change — check foodics.com yourself before you decide anything.",
    positioning: {
      title: "The honest version",
      body: "Foodics is a regional platform with its own hardware, its own payment rail and a marketplace of add-ons behind it. Moving POS is one system, built in Egypt for Egyptian restaurants, at a flat price per branch with every module already inside it. Neither sentence is an insult to the other product. They are two different bets, and which one is right depends on the size of your operation and how much of your budget you want going to software.",
      points: [
        "Same job: take the order, feed the kitchen, sell online, count the stock.",
        "Different billing: bundles per branch with paid add-ons, against one flat per-branch price.",
        "Different depth: regional scale and hardware, against a team that will change the software for you.",
      ],
    },
    facts: {
      title: "What Foodics publishes for Egypt",
      sub: "Per branch, per month. Retrieved September 2026.",
      rows: [
        {
          label: "Entry bundle, Egypt",
          value: "2,848.95 EGP",
          note: "Per branch per month billed annually, or 3,019.89 EGP billed quarterly. Egypt is not offered a Starter tier at all.",
        },
        {
          label: "Advanced bundle, Egypt",
          value: "3,733.67 EGP",
          note: "Per branch per month billed annually. The top published Egyptian bundle.",
        },
        {
          label: "Pay, Pay at Table, Kitchen Display, Customer Display, Foodics One",
          value: "In no Egyptian tier",
          note: "These appear on other markets' pages. None of them is listed in an Egyptian bundle.",
        },
        {
          label: "Loyalty, API access, delivery-aggregator integrations, BI",
          value: "Paid add-ons",
          note: "On the Egyptian Basic bundle each of these is charged on top of the bundle price.",
        },
        {
          label: "Moving POS — Growth",
          value: "199 EGP",
          note: "Per branch per month. Register, kitchen display, ordering site, loyalty and reporting included, with no per-terminal fee.",
          ours: true,
        },
      ],
      source: "Foodics figures are their own published Egyptian pricing, retrieved September 2026, and may have changed since. Moving POS figures are our own published prices.",
    },
    pickThem: {
      title: "Pick Foodics if this is you",
      sub: "Written straight. There are restaurants we are not the right answer for, and you should know which ones before you talk to us.",
      items: [
        {
          title: "You want hardware and software from one supplier",
          body: "Foodics sells terminals, printers and drawers as part of the deal. One invoice, one warranty, one number to call for the metal as well as the software is a real advantage, and we do not offer it.",
        },
        {
          title: "You want payments from the same vendor",
          body: "Foodics Pay puts the card rail inside the platform in the markets where it is offered. We integrate with your own Egyptian gateway instead — better if you already hold a merchant account, worse if you wanted it all on one contract.",
        },
        {
          title: "You depend on a large add-on marketplace",
          body: "Foodics lists a marketplace of more than a hundred apps. If your operation already runs on a specific accounting, delivery or workforce tool with a listing there, an existing connector beats our promise to build one.",
        },
        {
          title: "You are expanding across the Gulf",
          body: "Foodics operates across the region with local entities and local compliance work behind it. If your next five branches are in Riyadh or Dubai rather than Alexandria, that coverage is worth paying for.",
        },
        {
          title: "Procurement requires a vendor of a certain size",
          body: "Some franchise agreements and some landlords do. That is a legitimate constraint, and we would rather hear it in the first call than at signing.",
        },
      ],
    },
    pickUs: {
      title: "Pick Moving POS if this is you",
      sub: "The cases where the flat per-branch price and an in-house team are the whole argument.",
      items: [
        {
          title: "Software cost has to make sense at your volume",
          body: "At the published Egyptian entry bundle, one branch costs more per month than fourteen branches on Growth. For an independent café or a small chain, that difference is a salary.",
        },
        {
          title: "You want the whole system, not a bundle plus add-ons",
          body: "Loyalty, API access, delivery integrations and reporting are inside the price here. Nothing you need on day thirty gets quoted to you on day thirty.",
        },
        {
          title: "You want the kitchen display included",
          body: "A live kitchen display is part of Growth. It is not listed in any published Egyptian tier on the other side.",
        },
        {
          title: "You already own the hardware",
          body: "Moving POS runs in a browser on the tablet, laptop or touchscreen you have, with any ESC/POS thermal printer. Nothing to buy on the way in and nothing to return on the way out.",
        },
        {
          title: "You need the software changed to fit your operation",
          body: "We wrote the code and we are the ones who support it. A report, a gateway, a workflow that matches how your branches actually run — that gets built, not filed behind someone else's roadmap.",
        },
        {
          title: "You are Egyptian-first",
          body: "Prices in EGP, 14% VAT, Arabic as a first-class language down to the thermal receipt, and delivery zones and payment habits that match this market rather than a regional average.",
        },
      ],
    },
    cta: {
      title: "Get a straight comparison on your own numbers",
      body: "Send us your branch count and what you are quoted today. We will tell you what Moving POS costs, what it does not do, and whether switching is worth the disruption at your size.",
      primary: "Book a 15-min demo",
      secondary: "Message us on WhatsApp",
      note: "14-day free trial, no credit card, and we load your menu before you decide.",
    },
  },

  hardware: {
    badge: "Hardware",
    title: "Buy nothing. Run it on what you already own.",
    sub: "Moving POS runs in a browser. Any tablet, laptop or touchscreen big enough to tap is a register, and any ESC/POS thermal printer prints the receipt.",
    stance: {
      title: "Bring your own is the position, not the excuse",
      body: "Most point-of-sale vendors sell you a terminal, because the terminal is where the margin is — and once it is bolted to your counter, leaving costs you the hardware as well as the subscription. We took the other road deliberately. The system is a web app: it opens in a browser, on your device, and if you ever walk away, you keep the device.",
      points: [
        "No proprietary terminal to buy, lease or hand back.",
        "No device fee, no per-terminal licence, no activation charge.",
        "A second register at a branch is a second device with the browser open.",
        "A cracked screen on a Friday night is a trip to any shop that sells tablets, not a support ticket and a courier.",
      ],
    },
    works: {
      title: "What it works with",
      sub: "If it has a current browser and a network, it runs the register.",
      items: [
        {
          icon: "register",
          title: "Any tablet or touchscreen",
          body: "Android or iPad from around ten inches up, or the all-in-one touchscreen already on your counter. Chrome, Edge, Safari or Firefox, kept up to date.",
        },
        {
          icon: "printer",
          title: "Any ESC/POS thermal printer",
          body: "80mm or 58mm, network or USB, from any brand that speaks ESC/POS — which is most of them. Arabic and English print on the same roll.",
        },
        {
          icon: "kds",
          title: "Any screen in the kitchen",
          body: "The kitchen display is a web page. A cheap tablet on a stand, a retired laptop, or a TV with a stick behind it all do the job.",
        },
        {
          icon: "cart",
          title: "The customer's own phone",
          body: "The ordering site needs nothing installed, and no hardware beyond a printed QR sticker on the table.",
        },
        {
          icon: "coins",
          title: "The cash drawer you have",
          body: "Drawers that open from the printer's kick-out port carry on working exactly as they do now.",
        },
        {
          icon: "branches",
          title: "The network you have",
          body: "Screens talk over the branch network. Nothing here needs a dedicated line, a special router or a server in the back room.",
        },
      ],
    },
    need: {
      title: "What a branch actually needs to open",
      sub: "The realistic minimum for one branch on day one.",
      items: [
        {
          title: "One screen at the till",
          body: "A tablet or touchscreen for the cashier. This is the only device genuinely required to take an order.",
        },
        {
          title: "One thermal printer",
          body: "For the customer receipt, and a second copy for the kitchen if they still want paper. A branch with a kitchen screen usually needs one printer, not two.",
        },
        {
          title: "One screen in the kitchen",
          body: "Optional on day one, and the change most owners notice fastest. Any spare tablet will do until you buy something sturdier.",
        },
        {
          title: "Internet at the branch",
          body: "A normal business line. Screens update over the branch network, and your ordering site needs the branch reachable.",
        },
        {
          title: "Nothing else",
          body: "No back-office server, no dongle, no licence key, and no card reader unless you want to take cards in person through your own gateway's terminal.",
        },
      ],
    },
    buying: {
      title: "If you are buying fresh",
      sub: "Generic guidance only — no brands, no models, no prices.",
      items: [
        {
          title: "Screen: ten inches or more",
          body: "Below ten inches the menu grid gets cramped and cashiers start mis-tapping in a rush. Fifteen inches is comfortable on a busy till.",
        },
        {
          title: "Printer: 80mm thermal, ESC/POS, with a network port",
          body: "80mm fits an Arabic receipt without wrapping badly. A network port means the printer is not tied to one device, so any screen at the branch can print to it.",
        },
        {
          title: "Network: the printer on a cable, the screens on wireless",
          body: "Tablets are fine on wireless. A printer that drops off the network mid-service is the failure everybody remembers, so give it a cable if the counter allows one.",
        },
        {
          title: "Power: one battery backup for the router and the printer",
          body: "Cheap, and it turns a short cut into a pause rather than a stopped service.",
        },
        {
          title: "Buy one, work a shift on it, then buy the rest",
          body: "Run a real rush on a single setup before ordering for every branch. Whatever is wrong with a device shows up in the first hour of service, never in a specification sheet.",
        },
      ],
      note: "We do not sell hardware, resell it, or take a commission from anyone who does. Ask us what to look for and you get an opinion with nothing behind it.",
    },
    faq: {
      title: "Hardware questions",
      items: [
        {
          q: "Do I have to buy anything to start the trial?",
          a: "No. Open the browser on any device you already own — a laptop is enough to see the whole system running on your own menu.",
        },
        {
          q: "What if my printer is old?",
          a: "If it speaks ESC/POS it almost certainly works. Send us the model during onboarding and we will tell you before you spend anything.",
        },
        {
          q: "Does it work when the internet drops?",
          a: "Screens run on the branch network with live updates between them. For branches with unreliable internet, the Scale and Enterprise plans can host the system inside the restaurant or on your own server.",
        },
        {
          q: "Can I use the touchscreen from my old POS?",
          a: "Usually. If it runs a current browser it runs Moving POS. Old Windows tills locked to an ancient browser are the one case worth testing first, and we will test it with you before you commit.",
        },
        {
          q: "What happens to my hardware if I leave?",
          a: "You keep it. It was yours. Export your data and the devices carry on doing whatever else you want with them.",
        },
      ],
    },
    cta: {
      title: "Not sure what you have is enough?",
      body: "Send us a photo of your counter. We will tell you what works as it is, what needs replacing, and what you can safely ignore.",
      primary: "Message us on WhatsApp",
      secondary: "Book a 15-min demo",
    },
  },

  accountingTrial: {
    badge: "Moving POS Accounting — free trial",
    title: "Your own accounting system, ready in a minute",
    sub: "Fourteen days free, no card. You get a private accounting system of your own — not a shared demo — set up for Egypt or Saudi Arabia, in Arabic and English.",
    includes: {
      title: "What the trial includes",
      items: [
        {
          title: "Your own books",
          body: "A double-entry ledger that is yours alone: a separate system and a separate database, from the first click.",
        },
        {
          title: "Invoices and bills",
          body: "Sales and purchase documents, customers and suppliers, what is owed to you and what you owe.",
        },
        {
          title: "Cash and bank",
          body: "Bank accounts, reconciliation and payments, with reports read straight from the posted entries.",
        },
        {
          title: "VAT reports",
          body: "Output and input tax gathered from your own documents, at your country's rate.",
        },
        {
          title: "Arabic and English",
          body: "Every screen in both languages, in your currency and on your country's business day.",
        },
      ],
    },
    steps: {
      title: "How it works",
      items: [
        {
          n: "01",
          title: "Tell us who you are",
          body: "Your name, company, email and mobile, and whether the business is in Egypt or Saudi Arabia.",
        },
        {
          n: "02",
          title: "Get your link and setup token",
          body: "Both appear on this page the moment you submit. Copy them — the token is shown only once.",
        },
        {
          n: "03",
          title: "Run the setup wizard",
          body: "Open the link, enter the token, then name your company, pick a chart of accounts and create your administrator account.",
        },
        {
          n: "04",
          title: "Use it for 14 days",
          body: "Enter real transactions. Before the trial ends we call to talk about keeping your books.",
        },
      ],
    },
    form: {
      title: "Start your 14-day free trial",
      sub: "It takes a minute. No card, and nothing is charged when it ends.",
      name: "Your name",
      company: "Company name",
      email: "Work email",
      phone: "Mobile number",
      phonePlaceholder: { EG: "01X XXXX XXXX", SA: "05X XXX XXXX" },
      country: "Where is the business?",
      countries: { EG: "Egypt", SA: "Saudi Arabia" },
      countryNote: {
        EG: "Books in Egyptian pounds, on Cairo time.",
        SA: "Books in Saudi riyals, on Riyadh time.",
      },
      submit: "Start my free trial",
      sending: "Setting up your system…",
      privacy:
        "We use these details to set up your trial and to contact you about it. An ended trial's books are deleted after a short grace period.",
      privacyLink: "Privacy policy",
      errorTitle: "Please check the form",
      errorSummary: "These fields need attention:",
      errors: {
        required: "Required.",
        too_short: "Too short.",
        too_long: "Too long.",
        invalid: "Not valid.",
        invalidEmail: "Enter a valid email address.",
        invalidPhone: {
          EG: "Enter an Egyptian number, like 01X XXXX XXXX.",
          SA: "Enter a Saudi number, like 05X XXX XXXX.",
        },
      },
    },
    result: {
      title: "Your accounting system is ready",
      sub: "Here are your link and your setup token. Copy them now: for your security the token is shown only on this page, and only once.",
      linkLabel: "Your link",
      tokenLabel: "Setup token",
      tokenWarning: "Save the token before you leave this page — we cannot show it again.",
      expires: "Your trial runs until {date}.",
      copy: "Copy",
      copied: "Copied",
      open: "Open the setup wizard",
      stepsTitle: "Next steps",
      steps: [
        "Open your link — it takes you to the setup wizard.",
        "Enter the setup token when the wizard asks for it.",
        "Name your company, choose a chart of accounts and create your administrator account. Then sign in and start.",
      ],
    },
    outcomes: {
      poolEmptyTitle: "We are setting up more trial systems",
      poolEmptyBody:
        "Every trial system for that country is in use right now. We have your details and will contact you within one business day to get you started.",
      alreadyTitle: "This email already has a running trial",
      alreadyBody: "Use the link you saved when you signed up. Lost it? Message us and we will help.",
      rateLimitedTitle: "Too many attempts",
      rateLimitedBody: "Please try again in a little while, or message us and we will set it up for you.",
      closedTitle: "Sign-ups are paused for the moment",
      closedBody: "Message us on WhatsApp and we will set up your trial by hand.",
      errorTitle: "Something went wrong",
      errorBody: "Your trial was not created. Please try again, or message us on WhatsApp.",
      whatsapp: "Message us on WhatsApp",
      waTemplate: "Hello, I would like to try Moving POS Accounting.",
    },
    pricing: {
      eyebrow: "After the trial",
      title: "Every feature in every plan. You pay for your size.",
      sub: "Choose your country to see its prices. E-invoicing is included in every plan, and there is no setup fee.",
      countryLabel: "Prices for",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "2 months free",
      currency: { EG: "EGP", SA: "SAR" },
      perMonth: "/mo",
      perYear: "/year",
      vat: { EG: "VAT not included (14%)", SA: "VAT not included (15%)" },
      yearlySaving: "Paid once a year: two months free, so you save {saved}.",
      plans: [
        {
          id: "starter",
          name: "Starter",
          tagline: "One company, one branch, a small team.",
          price: { EG: 499, SA: 119 },
          limits: ["3 users", "1 branch", "50 AI bill captures a month"],
          einvoicing: {
            EG: "ETA e-invoice, and e-receipt on 1 point of sale",
            SA: "ZATCA Phase 2 on 1 e-invoicing unit",
          },
        },
        {
          id: "business",
          name: "Business",
          tagline: "A growing company with a few branches.",
          badge: "Recommended",
          featured: true,
          price: { EG: 999, SA: 229 },
          limits: ["8 users", "3 branches", "200 AI bill captures a month"],
          einvoicing: {
            EG: "ETA e-invoice, and e-receipt on 3 points of sale",
            SA: "ZATCA Phase 2 on 3 e-invoicing units",
          },
        },
        {
          id: "professional",
          name: "Professional",
          tagline: "Several branches and a finance team.",
          price: { EG: 1999, SA: 349 },
          limits: ["15 users", "10 branches", "500 AI bill captures a month"],
          einvoicing: {
            EG: "ETA e-invoice, and e-receipt on 10 points of sale",
            SA: "ZATCA Phase 2 on 10 e-invoicing units",
          },
        },
      ],
      cta: "Start the free trial",
      einvoicingIncluded: {
        EG: "E-invoicing is included in every plan: ETA e-invoice and e-receipt, at no extra cost.",
        SA: "E-invoicing is included in every plan: ZATCA Phase 2 clearance and reporting, at no extra cost.",
      },
      withPos: {
        title: "Already on Moving POS?",
        body: "Add accounting for {price} per branch a month. Each day's close posts to your books by itself, and you never pay more than the matching plan above.",
        price: { EG: 299, SA: 79 },
      },
      extras: "An extra user is {user} a month. An extra branch, with its e-invoicing unit, is {branch} a month.",
      extrasPrice: { user: { EG: 99, SA: 25 }, branch: { EG: 249, SA: 49 } },
      noSetupFee: "No setup fee. Connecting you to the tax authority is part of every plan.",
      enterprise: "More than 10 branches or 15 users? We quote an Enterprise plan.",
      enterpriseWa: "Hello, I would like an Enterprise quote for Moving POS Accounting.",
    },
    faq: {
      title: "Questions about the trial",
      items: [
        {
          q: "Is it a shared demo?",
          a: "No. Each trial is a separate accounting system with its own database. Nobody else sees your entries, and you see nobody else's.",
        },
        {
          q: "What happens when the 14 days end?",
          a: "The trial ends. We call before then; if you do not continue, the trial's books are deleted after a short grace period, so export anything you want to keep before it ends.",
        },
        {
          q: "Does it work with a point of sale?",
          a: "Accounting runs on its own, and it can also take a point of sale's daily close. Ask us about connecting yours when we talk.",
        },
        {
          q: "Do I need a card?",
          a: "No. Nothing is charged, and nothing renews by itself.",
        },
      ],
    },
  },

  legal: {
    terms: {
      title: "Terms of service",
      sub: "The agreement behind a Moving POS subscription, in the plainest language we can write it in.",
      updated: "Last updated 4 September 2026",
      sections: [
        {
          title: "1. Who you are contracting with",
          body: [
            "Moving POS is a product operated by Devya Solutions (\"we\", \"us\"), the studio that built the platform and maintains it.",
            "These terms cover your use of the Moving POS platform and of this website. Using either means you accept them. If you are agreeing on behalf of a company, you are confirming that you are allowed to.",
          ],
        },
        {
          title: "2. The free trial",
          body: [
            "Every account starts with a 14-day free trial carrying the features of the Growth plan. No card is required to start it, and nothing is charged automatically when it ends.",
            "We load your menu before the trial starts so you are testing on your own data. If you decide not to subscribe, the account stops at the end of the trial. Your data stays available for export for thirty days after that, and is then deleted.",
          ],
        },
        {
          title: "3. Subscription and billing",
          body: [
            "Subscriptions are priced per branch per month in Egyptian pounds, on the plan you choose, and are billed either monthly or once a year in advance. Published prices exclude VAT, which is added where it applies.",
            "Yearly billing is charged once for twelve months at the discounted rate shown on the pricing page.",
            "We may change published prices. An existing subscriber's price does not change during a period already paid for, and we will give at least thirty days' notice before a change takes effect at the next renewal. Restaurants on the founding offer keep the price they signed at for as long as their subscription runs without a break.",
          ],
        },
        {
          title: "4. What we provide",
          body: [
            "Access to the platform on your plan, the onboarding described on this site (menu loading, branch and payment-gateway setup, data migration from your previous system), support on business days through WhatsApp or email, and platform updates as they ship, at no extra charge.",
            "New features are released to plans as described on the pricing page at the time. We do not remove a capability you are paying for without notice.",
          ],
        },
        {
          title: "5. What we do not promise",
          body: [
            "We do not offer a contractual uptime guarantee except on Enterprise, where it is written into the agreement. We aim for continuous availability and we will tell you honestly when we fall short.",
            "Your internet connection, your branch network, your devices, your payment gateway and the delivery platforms you use are outside our control, and interruptions caused by them are not our responsibility.",
            "Figures on this site — including the commission calculator — are estimates for guidance. They are not a forecast of your results and nothing here is a promise of revenue or savings.",
          ],
        },
        {
          title: "6. Your responsibilities",
          body: [
            "Give us accurate business details, keep staff credentials under control, and tell us promptly if you think an account has been misused.",
            "Your menu, prices, images and customer communications are yours; you confirm you have the right to use them. Your tax, licensing and employment obligations stay yours — a point-of-sale system does not discharge any of them. See the VAT and e-invoicing page for exactly where the software stops.",
            "Do not use the platform for anything unlawful, and do not attempt to break, overload or reverse-engineer it.",
          ],
        },
        {
          title: "7. Your data",
          body: [
            "Your menu, orders, customers and reports belong to you. We process them to run the service for you, and for nothing else.",
            "You can export all of it at any time, at no charge, including after you cancel. We do not sell your data, and we do not market to your customers.",
            "We keep the security measures a system like this needs, and we will tell you without delay if we ever believe your data has been exposed.",
          ],
        },
        {
          title: "8. Payments and third parties",
          body: [
            "Card payments taken through the platform run on your own contract with your payment gateway. That relationship, its fees and its settlement terms are between you and the provider.",
            "We do not hold card numbers. Payment details go to the gateway, not to us.",
          ],
        },
        {
          title: "9. Ending the subscription",
          body: [
            "You can cancel at any time. Cancellation takes effect at the end of the period you have already paid for, and you keep access until then. The refund and cancellation policy sets out what is refundable.",
            "We may suspend or end an account for non-payment, or for unlawful use, after telling you and giving you a reasonable chance to put it right — except where the use is serious enough that waiting would cause harm.",
            "Whatever the reason for ending, you get your data export.",
          ],
        },
        {
          title: "10. Liability",
          body: [
            "Nothing here limits liability that cannot be limited by Egyptian law.",
            "Beyond that, our total liability in connection with the service is limited to the subscription fees you paid us in the twelve months before the claim, and we are not liable for indirect or consequential loss such as lost profit or lost business.",
          ],
        },
        {
          title: "11. Changes to these terms",
          body: [
            "We may update these terms. The current version always sits on this page with its date at the top.",
            "For a material change we will tell subscribers before it takes effect, and you can cancel if you do not accept it.",
          ],
        },
        {
          title: "12. Governing law",
          body: [
            "These terms are governed by the laws of the Arab Republic of Egypt, and the courts of Cairo have jurisdiction over any dispute arising from them.",
          ],
        },
      ],
      contact: "Anything here you want explained before you sign? Ask us on the contact page and you will get an answer from a person, not a form letter.",
    },
    privacy: {
      title: "Privacy policy",
      sub: "What this website collects, which is very little, and what happens to it.",
      updated: "Last updated 13 October 2026",
      sections: [
        {
          title: "The short version",
          body: [
            "This website has no accounts, no login and no profile of you. Two things on it send us anything at all: the contact form, and the sign-up for a free accounting trial. Everything below is the detail of what each carries and where it goes.",
          ],
        },
        {
          title: "Who is responsible for this",
          body: [
            "Moving POS is operated by Devya Solutions, in Cairo, Egypt. We decide what this website collects and what happens to it, which makes us the controller of it.",
            "For anything in this policy — a question, a correction, or a request to delete what we hold — write to devya.solutions@gmail.com or message +20 104 185 8781. A person reads both.",
          ],
        },
        {
          title: "What the contact form collects",
          body: [
            "The form asks for your name, your restaurant's name, your mobile number, how many branches you run, and anything you type into the message box. The first three are required; the rest is optional.",
            "When you press send, those details are posted to this site and passed on to the Moving POS team so somebody can call you back. Along with them we record how you reached us — the campaign link, the referring website and the page you landed on — plus your browser type, your country and the time.",
            "Your IP address is used for a moment to stop the form being hammered by a script. It is not stored with your enquiry.",
            "WhatsApp and email are offered as alternative routes for the same form. If you use one of those, the details go to us through WhatsApp or through your own email client, and no submission is recorded on this site.",
          ],
        },
        {
          title: "What the accounting trial sign-up collects",
          body: [
            "The free accounting trial asks for your name, your company's name, your email, your mobile number and whether the business is in Egypt or Saudi Arabia, and notes the language you signed up in. All of them are required: they are what sets the trial up and what we contact you about.",
            "When you press start, your browser sends them straight to a server Devya runs, outside Egypt and Saudi Arabia. It gives you an accounting system of your own and records your sign-up so that we can follow up — including when every trial system is busy, which is when we call you instead. Your IP address is used for a moment to limit repeated sign-ups and is not stored with them.",
            "What you type into the trial itself — your company, accounts and documents — stays in that trial's own database, which nobody else's trial can reach. It is deleted after the trial ends and a short grace period, and leaves our nightly backups within fourteen days after that.",
          ],
        },
        {
          title: "What we do with it",
          body: [
            "We use your details to reply to you, to prepare a demo, and to load your menu if you ask for that. We use the campaign details to know which page or advert brought you, which is how we decide what to write next. Nothing else.",
            "We do not sell any of it, we do not pass it to anyone else, and we do not add you to a mailing list you did not ask for. Ask us to delete your details and we delete them.",
          ],
        },
        {
          title: "Why we are allowed to hold it",
          body: [
            "You sent us an enquiry and asked to be contacted about a product. Answering that is the reason we hold your details, and it is the only reason — in the language of data protection law, the steps taken at your request before a contract, and our legitimate interest in running a business that replies to the people who write to it.",
            "We do not rely on consent for this, because consent you cannot meaningfully refuse is not consent. Nothing here is used for advertising, profiling or automated decisions.",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "An enquiry that goes nowhere is deleted within twelve months. If you become a customer, your contact details move into your account and are kept for as long as that account exists, and afterwards only for as long as Egyptian tax and company law requires us to keep business records.",
            "Campaign and page data is aggregated well before that and stops being about you at all.",
            "You do not have to wait for any of these periods. Ask, and it goes sooner.",
          ],
        },
        {
          title: "Hosting, and where your details are",
          body: [
            "This site runs on a server Devya operates itself — a virtual private server we rent from a hosting company. Like any web server, it processes the technical data a request carries — IP address, browser and device type, the page requested, the time — in order to serve the site and protect it from abuse. The hosting company provides the machine and its network connection; the site and everything sent through it are run by us.",
            "That server is outside Egypt, so your details are processed outside Egypt. If you would rather not send anything through this site at all, the WhatsApp and email routes on the contact page reach us directly.",
          ],
        },
        {
          title: "Analytics",
          body: [
            "There are none. This site runs no analytics product, from us or from anyone else — no advertising trackers, no third-party measurement scripts, nothing loaded to count you. We removed the last of it in September 2026.",
            "That is a real cost to us rather than a boast: we genuinely do not know how many people read this page. We decided we would rather not know than load a script onto your browser to find out.",
            "The one thing the consent banner asks about is the campaign link that brought you, described under cookies and browser storage below. Refuse it, or simply ignore the banner, and nothing at all is recorded.",
          ],
        },
        {
          title: "Cookies and browser storage",
          body: [
            "This site sets no cookies of its own — no advertising cookies, no tracking pixels, no third-party trackers.",
            "Your light or dark theme choice is saved in your browser's local storage so the site remembers it. It stays on your device and is never sent to us.",
            "Your light or dark theme choice, and your answer to the consent banner, are the two things kept without asking. Both are a direct response to something you did, both stay on your device, and neither is sent to us.",
            "The campaign details that brought you here are kept in your browser's session storage until you close the tab, so they can travel with the contact form if you decide to send it. That is not a cookie and it does not follow you to other websites — and like the analytics, it is not recorded at all unless you accepted.",
          ],
        },
        {
          title: "The product is a separate matter",
          body: [
            "This policy covers the marketing website. If you become a customer, the data your restaurant puts into the Moving POS platform — your menu, your orders, your own customers — is covered by your subscription agreement. It stays yours, we process it only to run the service for you, and you can export or delete it whenever you want.",
          ],
        },
        {
          title: "Children",
          body: [
            "This site sells a business system. It is not directed at children and we do not knowingly collect anything from them.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "Ask us what we hold about you and we will tell you, and send you a copy. Ask us to correct it, or to delete it, and we will. Ask us to stop using it, or to hand it to you in a portable form so you can take it elsewhere, and we will do that too. Where we rely on our legitimate interest, you can object — and for a sales enquiry that objection wins, because there is nothing we need it for once you have said stop.",
            "Write to devya.solutions@gmail.com or to the contact page. Normally the same business day, and in any case within a month. We do not charge for this and we will not ask you why.",
            "If you live in the European Union or the United Kingdom, you also have the right to complain to your national data protection authority. In Egypt, the Personal Data Protection Centre performs the same role. We would rather you came to us first, but the right is yours either way.",
          ],
        },
        {
          title: "Changes to this policy",
          body: [
            "If this changes, the new version sits here with a new date at the top. There is no archive of old versions; the date tells you when the current text was written.",
          ],
        },
      ],
      contact: "Questions about any of this go to the contact page, and a person answers them.",
    },
    refund: {
      title: "Refund and cancellation policy",
      sub: "The 14-day trial is meant to make this page almost unnecessary. Here it is anyway.",
      updated: "Last updated 4 September 2026",
      sections: [
        {
          title: "The offer, restated",
          body: [
            "Fourteen days free with every Growth feature and no credit card. Billing monthly or once a year after that, per branch, in Egyptian pounds. Cancel any time, and take a full export of your data with you.",
          ],
        },
        {
          title: "The trial is the real refund policy",
          body: [
            "Fourteen days on your own menu, with your own staff, in your own branch, is the point at which to decide. We load the menu before the trial starts so you are testing the real thing rather than a demo.",
            "We would far rather you walked away during the trial than paid for a month you did not want.",
          ],
        },
        {
          title: "Monthly subscriptions",
          body: [
            "Cancel at any time. Cancellation takes effect at the end of the month you have already paid for, and you keep full access until then.",
            "We do not pro-rate a part-used month.",
          ],
        },
        {
          title: "Yearly subscriptions",
          body: [
            "Cancel within fourteen days of the first annual payment and we refund it in full.",
            "After those fourteen days, cancelling stops the renewal and the year you have paid for runs to its end with full access.",
          ],
        },
        {
          title: "What is not refundable",
          body: [
            "Work already delivered at your request — custom development, migration beyond the standard menu load, on-site training — is not refundable once it has been done. We always agree the cost with you in writing before starting any of it.",
            "Fees charged by your payment gateway on transactions you took are theirs, not ours, and we cannot refund them.",
          ],
        },
        {
          title: "If the fault is ours",
          body: [
            "If the platform is unusable for a meaningful stretch of time because of something we did, tell us. We will credit the time or refund it.",
            "We would rather settle that quickly than argue about it.",
          ],
        },
        {
          title: "Getting your data out",
          body: [
            "Export your customers, orders and menu at any time, at no charge, before or after you cancel.",
            "If you are moving to another system, or to your own server, we will help with the export rather than make it difficult. Holding data hostage is not a retention strategy we are interested in.",
          ],
        },
        {
          title: "How to cancel",
          body: [
            "Message us on WhatsApp or email us from the account owner's address and say you want to cancel. We confirm it in writing, with the date access ends and the export ready.",
            "There is no retention script and nobody will keep you on the phone.",
          ],
        },
        {
          title: "How refunds are paid",
          body: [
            "Refunds go back to the method you paid with, within fourteen business days of us agreeing to one. How long your bank then takes is outside our control.",
          ],
        },
      ],
      contact: "If something about your billing does not look right, tell us on the contact page before it becomes a dispute. We would rather fix it.",
    },
  },
};
