import type { SiteContent } from "./types";

/** English mirror of `ar.ts` — same tree, same order, same claims. */
export const en: SiteContent = {
  meta: {
    home: {
      title: "DevyaPOS | The restaurant OS — register, kitchen, online, stock",
      description:
        "One system runs the whole restaurant: POS, live kitchen display, your own online ordering, table service with pay-at-table, loyalty, and recipe-costed inventory. Bilingual AR/EN, EGP-native, multi-branch.",
    },
    features: {
      title: "Features | DevyaPOS",
      description:
        "Everything DevyaPOS runs: point of sale, kitchen display, online ordering, table service and split checks, loyalty and gift cards, recipe-costed inventory, Egyptian payments and reporting.",
    },
    pricing: {
      title: "Pricing | DevyaPOS",
      description:
        "A 14-day free trial, then Counter at 199 EGP or Dining room at 499 EGP per branch per month, and Group quoted per deal. Clear prices in EGP, and zero commission on your orders.",
    },
    about: {
      title: "About DevyaPOS | Why we built this",
      description:
        "DevyaPOS was built inside a working restaurant — now 25 branches, a real menu, real rush hours. The story, the principles, and the plans.",
    },
    howItWorks: {
      title: "How it works | DevyaPOS",
      description:
        "One order, four screens: register or phone to kitchen display in under a second, stock deducting itself, and the cost report ready at close. Plus what it takes to switch.",
    },
    compare: {
      title: "DevyaPOS vs enterprise POS platforms | Pricing compared",
      description:
        "Enterprise restaurant platforms bill per terminal and charge again per module. See the feature-by-feature comparison, and work out what aggregator commission is costing you a year.",
    },
    contact: {
      title: "Contact | DevyaPOS",
      description:
        "Book a 15-minute demo or message us on WhatsApp. We load your menu and migrate your data for free.",
    },
    etaInvoicing: {
      title: "Egyptian VAT and ETA e-invoicing | DevyaPOS",
      description:
        "Where DevyaPOS stands on Egyptian tax, in plain words: 14% VAT computed on every line, exportable sales records — and no ETA submission yet.",
    },
    foodicsAlternative: {
      title: "Foodics alternative in Egypt | DevyaPOS",
      description:
        "The published Egyptian entry bundle is 2,848.95 EGP per branch per month. DevyaPOS Counter is 199 EGP, and 499 EGP buys the dining room as well. Compared honestly.",
    },
    hardware: {
      title: "POS hardware | Run DevyaPOS on what you own",
      description:
        "No terminal to buy. DevyaPOS runs in a browser on any tablet, laptop or touchscreen and prints to any ESC/POS thermal printer. What a branch really needs.",
    },
    terms: {
      title: "Terms of service | DevyaPOS",
      description:
        "The terms behind a DevyaPOS subscription: the 14-day trial, billing per branch in EGP, support, cancellation, and who owns your data. Updated September 2026.",
    },
    privacy: {
      title: "Privacy policy | DevyaPOS",
      description:
        "What this site collects and why: the contact form, hosting, and analytics you have to opt into. Your rights under the GDPR, and how to exercise them. A draft pending legal review.",
    },
    refund: {
      title: "Refund and cancellation | DevyaPOS",
      description:
        "14 days free with no card, monthly or yearly billing, cancel any time, and a full export of your data on the way out. The policy in plain words.",
    },
    cookies: {
      title: "Cookie policy | DevyaPOS",
      description:
        "Every cookie and browser store this site uses, why, and for how long — with analytics and marketing off until you opt in. How to change your choice. A draft pending legal review.",
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
    login: "Log in",
    cta: "Try it free",
  },

  hero: {
    badge: "✦ The restaurant OS — built in Egypt, for Egypt",
    line1: "Run the whole restaurant",
    line2: "from one system",
    sub: "Register + live kitchen display + your own online ordering + table service + recipe-costed inventory. Arabic and English, priced in EGP, unlimited branches — from under 7 EGP a day per branch.",
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
    "Table service and coursing",
    "Pay at the table",
    "Recipe-costed inventory",
    "Loyalty and points",
    "Gift cards",
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
    afterLabel: "With DevyaPOS",
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
    title: "DevyaPOS connects the register, the kitchen, the storefront and the stockroom",
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
        icon: "users",
        title: "The dining room, on the same till",
        body: "A floor plan with live table states, courses held back and fired when the room is ready, and a check that splits between guests — evenly or by what each one ordered.",
        badge: "Dine-in",
        hue: "rose",
      },
      {
        icon: "qr",
        title: "Pay at the table by QR",
        body: "The guest scans the code on their table, sees the check that is running, and settles it — all of it, or just their share. A second round goes onto the same check and reaches the kitchen as the next course.",
        badge: "No second scan",
        hue: "emerald",
      },
      {
        icon: "loyalty",
        title: "Loyalty, offers and gift cards",
        body: "Points earned at the till and spent there too. Offers that apply themselves by schedule and branch — a typed coupon always beats one and they never stack, so a discount is never counted twice. Gift cards are sold as a product and taken as payment, with the balance derived from a ledger.",
        badge: "Repeat trade",
        hue: "amber",
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
        body: "Items with photos, sizes and add-ons in two taps, and a running VAT-inclusive total. Shifts open and close against a counted drawer, and the same screen carries the floor plan when there is a room to run.",
        points: [
          "Instant search across the whole menu",
          "Offers and coupons applied automatically",
          "Floor plan, coursing and split checks on the same till",
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
    sub: "The big platforms — Foodics and the like — do the job, then bill per terminal and charge again for each module. DevyaPOS charges one flat price per branch for the service model you actually run — a counter at 199, a dining room at 499 — and the parts you need changed, we change.",
    us: "DevyaPOS",
    them: "Enterprise POS platforms",
    rows: [
      { label: "Digital QR menu", us: true, them: true },
      { label: "Loyalty points, earned and spent", us: true, them: true },
      { label: "Scheduled, branch-scoped offers", us: true, them: true },
      { label: "Gift cards sold and redeemed at the till", us: true, them: true },
      { label: "Online ordering under your brand", us: true, them: "partial" },
      { label: "Full point of sale (register)", us: true, them: false },
      { label: "Live kitchen display (KDS)", us: true, them: false },
      { label: "Table floor plan and coursing", us: true, them: true },
      { label: "Split checks, evenly or by item", us: true, them: true },
      { label: "Pay at the table by QR", us: true, them: "partial" },
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
      { label: "Price per branch per month", us: "199 or 499 EGP", them: "Quote only" },
    ],
    note: "DevyaPOS's figures are our own published prices: 199 EGP on Counter, 499 EGP on Dining room, and a quote on Group. Rows marked for us are what ships today — Counter carries the counter half, and the dine-in rows are what the 499 buys. The right-hand column describes how enterprise restaurant platforms are typically licensed in this market — per terminal, with paid modules and quoted pricing — not any single vendor's rates. Ask any vendor for a written quote and compare it against ours.",
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
      branches: "Branches you would run on DevyaPOS. Pricing is per branch, so this drives the cost side.",
      paid: "Orders per branch x branches x average order value x commission, over twelve months.",
      recovered:
        "What you keep if only 30% of those orders come to your own site instead. The other 70% stay on the aggregator.",
      cost: "199 EGP per branch per month on Counter, for twelve months. A dining room on the 499 package costs more; the payback is shown at the cheaper of the two.",
      net: "Recovered commission minus what DevyaPOS costs you. This is the number that matters.",
      payback:
        "How long the recovered commission takes to cover a full year of DevyaPOS. Shorter is better.",
    },
    rateNote: "Typical range quoted to Egyptian restaurants.",
    summary: "That is {orders} delivery orders a month across the whole chain.",
    results: {
      paid: "Commission you pay per year",
      recovered: "Recovered if 30% shift to your own site",
      cost: "DevyaPOS cost per year",
      net: "Net saving per year",
      payback: "You break even in",
      paybackUnit: "days",
      paybackNone: "Not at these numbers",
    },
    assumption:
      "The math assumes only 30% of aggregator orders move to your direct channel — a conservative figure once your own ordering site, loyalty points and scheduled offers are running.",
    note: "Estimates for guidance only, not a promise of return.",
    cta: "Want us to review your real numbers?",
  },

  caseStudy: {
    eyebrow: "Our first client, still our toughest",
    title: "DevyaPOS isn't slideware — 25 branches run on it daily",
    body: "The first chain to put DevyaPOS on its tills still shapes the roadmap: a real menu, real rush hours, and 25 branches that call the moment something is wrong. Every feature here exists because a shift needed it — not because it looked good in a deck.",
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
        body: "25 branches call when something is wrong, and they call during service. Most of what is in DevyaPOS today exists because a shift needed it before the next rush.",
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
    title: "Restaurant owners on DevyaPOS",
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
      sub: "The package follows the service model, not the size. A counter operator is not a dining room that has been given less.",
      note: "Counter and Dining room are the same platform with a different half of it switched on. Nothing is held back to make the bigger number look better: a counter has no tables to plan, and that is the only reason the dine-in pack is not in it.",
      items: [
        {
          id: "qsr",
          label: "QSR and cafés",
          headline: "Speed at the till, and a delivery channel that is not costing you a quarter of the bill.",
          body: "Counter service is decided by how fast the cashier moves and how much of your delivery volume you keep. The register is built for two-tap ordering, the same order comes through your own site at zero commission, and a quiet Tuesday can be sold at a scheduled offer without printing anything.",
          points: [
            "Sizes and add-ons in two taps",
            "Kitchen display instead of paper tickets",
            "Your own ordering site, zero commission",
            "Loyalty points that bring the morning regular back",
          ],
          plan: "Counter — 199 EGP per branch per month",
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
          plan: "Counter — 199 EGP per branch per month",
        },
        {
          id: "dinein",
          label: "Dine-in restaurants",
          headline: "A floor you can see, courses that land when the room is ready, and a check that splits itself.",
          body: "A dining room is a timing problem before it is a software problem. The floor plan shows every table's state, a course is held and fired rather than dumped on the pass, the waiter takes the order on a phone at the table, and the guest can scan the code and settle their own share without waiting for anyone.",
          points: [
            "Floor plan with live table states",
            "Coursing — held back, then fired to the kitchen",
            "Split the check evenly or by what each guest ordered",
            "Pay at the table by QR, with no app to install",
          ],
          plan: "Dining room — 499 EGP per branch per month",
        },
        {
          id: "chain",
          label: "Groups and franchises",
          headline: "The back office behind the branches: stock, people and books on the same data as the till.",
          body: "Past a certain size the question stops being the till and becomes the head office. Purchasing and stock counts, attendance and payroll, and double-entry books fed by each day's close — with a scoped API and signed webhooks so whatever else you run can react to a new order or a closed day.",
          points: [
            "Purchasing, receiving, counts, waste and variance",
            "HR, attendance, rosters, payroll, tips and documents",
            "Double-entry books fed by each day's close",
            "Scoped API keys and signed webhooks",
          ],
          plan: "Group — quoted per deal",
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
        id: "counter",
        name: "Counter",
        tagline: "Quick service, cloud kitchens, takeaway",
        price: 199,
        badge: "Most chosen",
        featured: true,
        features: [
          "Full POS — shifts, drawer, thermal receipts",
          "Live kitchen display (KDS)",
          "Branded digital QR menu, unlimited items and sizes",
          "Online ordering site — zero commission",
          "Zoned delivery with its own fees",
          "Online payments, cash, and coupons",
          "Scheduled, branch-scoped offers",
          "Loyalty points, earned and spent",
          "Customer-facing second screen at the till",
          "Recipe-costed inventory and food cost",
          "Sales, staff and branch reporting",
          "Per-user permissions, unlimited branches",
          "Full Arabic/English",
          "WhatsApp support on business days",
        ],
        cta: "Try 14 days free",
      },
      {
        id: "dining",
        name: "Dining room",
        tagline: "Counter, plus the room",
        price: 499,
        features: [
          "Everything in Counter",
          "Table floor plan with live table states",
          "Coursing — held back, then fired to the kitchen",
          "Split checks, evenly or by what each guest ordered",
          "The waiter's phone flow, taken at the table",
          "Pay at the table by QR, no app to install",
          "Gift cards sold at the till and taken as payment",
        ],
        cta: "Try 14 days free",
      },
      {
        id: "group",
        name: "Group",
        tagline: "When the head office is the customer",
        price: null,
        priceLabel: "Custom",
        features: [
          "Everything in Dining room",
          "Supply — purchasing, receiving, counts, waste and variance",
          "People — HR, attendance, rosters, payroll, tips, documents",
          "Accounting — double-entry books fed by each day's close",
          "Platform API — scoped keys and signed webhooks",
          "Device management across the branch fleet",
          "Private or on-premise hosting",
          "Service level agreement (SLA)",
          "On-site team training and custom contractual terms",
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
        { name: "DevyaPOS — Counter", price: "199 EGP", note: "Register, kitchen display, ordering site, offers, loyalty, inventory and reporting", ours: true },
        { name: "DevyaPOS — Dining room", price: "499 EGP", note: "All of Counter, plus the floor plan, coursing, split checks, the waiter flow, pay-at-table QR and gift cards", ours: true },
      ],
      note: "Competitor figures are their own published Egyptian prices at the date above and may change — check them yourself before deciding. Ours is a flat per-branch price with no per-terminal fee and no per-module upsell: Counter runs a counter, Dining room adds the room, and Group adds the back office and is quoted per deal.",
    },
    note: "Prices are in EGP per branch, excluding VAT. Group is quoted per deal — branch count and which back-office systems you take — so there is no number to publish for it. The trial runs 14 days with no credit card. Move between packages, or cancel, any time, and export all of your data before you go.",
    founding: "Founding offer: the first 50 restaurants lock this price for the life of their subscription.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "The questions people ask before signing",
    sub: "If yours isn't here, message us on WhatsApp — a human answers.",
    items: [
      {
        q: "Is there a free trial?",
        a: "Yes — 14 days with no credit card, on the package that fits how you serve: Counter for a counter, Dining room if you have tables. We load your menu before the trial starts, so you are testing on your own data rather than on a demo.",
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
        a: "Screens run on the branch network with live updates over Socket.IO. On Group we can host the system inside the restaurant itself or on your own server.",
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
        a: "No. They scan and order straight from the browser, and at a table they scan the code, see the check that is running and pay their share the same way.",
      },
      {
        q: "What is the difference between Counter and Dining room?",
        a: "The room. Counter is the whole system for an operation served across a counter — till, kitchen display, your own ordering site, offers, loyalty, inventory and reporting. Dining room is all of that plus the dine-in pack: the floor plan, coursing, split checks, the waiter's phone flow, pay-at-table by QR, and gift cards. If you have no tables, there is nothing in the 499 you would use.",
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
          { label: "Terms of service", href: "/terms" },
          { label: "Privacy policy", href: "/privacy" },
          { label: "Cookie policy", href: "/cookies" },
          { label: "Refund policy", href: "/refund" },
        ],
      },
    ],
    legal: "All rights reserved.",
    madeBy: "A product by",
  },

  about: {
    badge: "About DevyaPOS",
    title: "Built inside a restaurant — not inside a meeting",
    sub: "Every feature in DevyaPOS came out of something that went wrong during a real shift, in a real branch, at peak hour.",
    storyTitle: "The story",
    story: [
      "It started as one project: build a complete system for an Egyptian bubble-tea chain with ten branches. Not a QR menu, not an ordering page — the whole thing: register, kitchen display, storefront, inventory and reporting.",
      "The moment it went into the branches, the real problem became obvious. It was never any single tool. It was that the market sells restaurants pieces: a menu tool, a loyalty tool, register software, and a spreadsheet for stock. Each piece works alone and they contradict each other together.",
      "What we learned there — that money must be stored as whole piasters, that Arabic has to be a first-class language rather than a translation, that an order must reach the kitchen in under a second, and that every cup needs a known cost — became the product's principles.",
      "DevyaPOS is that same system, packaged so any Egyptian restaurant can be live on it the same day. The same code that runs 25 branches right now.",
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
        body: "The same system was decoupled from one brand and became a platform any restaurant can run the same day — DevyaPOS.",
      },
    ],
    plansTitle: "The plans, briefly",
    plansSub:
      "Counter for an operation served across a counter, Dining room for one with tables to run, Group when the head office is the customer — all of them starting with a 14-day trial.",
    builtByTitle: "Who builds it",
    builtByBody:
      "DevyaPOS is a product of Devya Solutions — an Egyptian software engineering studio that builds complete operating systems: backends, web apps, payments and infrastructure. This platform was built and is maintained entirely in-house, so support and new work come from the same team that wrote the code.",
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
      hint: "Your details come straight to the DevyaPOS team so we can call you back — or send them on WhatsApp instead, if that suits you better.",
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
        invalid_phone: "Enter a valid Egyptian mobile, e.g. 01055930032",
        invalid_branches: "Enter a whole number of branches (1 or more)",
      },
      processingNotice:
        "When you press send, these details go to Devya Solutions (the DevyaPOS team) so we can reply to your enquiry — nobody else. We keep them only as long as needed to follow up, and you can ask us to delete them any time.",
      consent: {
        label:
          "I agree that DevyaPOS may use the details I've entered to contact me about my enquiry, as set out in the",
        linkText: "privacy policy",
        required: "Please tick the box to agree before sending your details.",
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
    waTemplate: "Hi DevyaPOS! I'd like to know more about the system for my restaurant.",
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
    sub: "DevyaPOS is the foundation. What your customer actually sees is yours — your name, your colours, your menu, your flow. Every deployment is fitted to the restaurant instead of the restaurant being fitted to the software.",
    items: [
      {
        title: "Your brand, never ours",
        body: "The ordering site, the receipt, the table QR page and the gift card all carry your name. Our name appears nowhere your customer looks.",
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
            title: "Loyalty points",
            body: "Points earned on a bill and spent against the next one, on the till and on your own site alike.",
            badge: "Retention",
            hue: "rose",
          },
          {
            icon: "coins",
            title: "Offers that apply themselves",
            body: "An offer runs on a schedule you set, on the branches you choose. A typed coupon always beats it and the two never stack, so a discount is never counted twice.",
            badge: "Scheduled",
            hue: "blue",
          },
        ],
      },
      {
        title: "The dining room",
        body: "What the 499 package adds: a room you can see, and a check the guest can settle themselves.",
        items: [
          {
            icon: "branches",
            title: "Table floor plan",
            body: "Every table's state on the till — open, seated, ordering, waiting on the kitchen, ready to settle.",
            badge: "Floor",
            hue: "rose",
          },
          {
            icon: "clock",
            title: "Coursing",
            body: "Courses are held back and fired when the room is ready. A second round joins the check that is already running and reaches the kitchen as the next course — no second order.",
            badge: "Timing",
            hue: "amber",
          },
          {
            icon: "coins",
            title: "Split checks",
            body: "One check divided between guests, evenly or by what each one ordered, and each share settles on its own.",
            badge: "Settle",
            hue: "emerald",
          },
          {
            icon: "qr",
            title: "Pay at the table",
            body: "The guest scans the code on their table, sees their own check, and pays it or their share of it. No app, no queue at the till.",
            badge: "QR",
            hue: "brand",
          },
          {
            icon: "users",
            title: "The waiter's phone flow",
            body: "Order taken at the table on a phone, against that table's check, and on the kitchen screen before the waiter has walked back.",
            badge: "Handheld",
            hue: "violet",
          },
          {
            icon: "pay",
            title: "Gift cards",
            body: "Sold at the till as a product and taken back as payment, with every balance derived from an append-only ledger rather than stored as a number.",
            badge: "Stored value",
            hue: "sky",
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
            body: "Cash is a first-class payment method, not an afterthought, and it lands in the same daily report as every card.",
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
            title: "API and signed webhooks",
            body: "Scoped API keys, and signed webhooks that let another system react to a new order, a closed day, or stock running low. On Group.",
            badge: "Integration",
            hue: "brand",
          },
        ],
      },
      {
        title: "The back office",
        body: "What a group buys that a single room does not. On Group, quoted per deal.",
        items: [
          {
            icon: "stock",
            title: "Supply",
            body: "Purchasing, receiving, stock counts, waste and variance — stock as its own application rather than a tab on the menu.",
            badge: "Supply",
            hue: "amber",
          },
          {
            icon: "users",
            title: "People",
            body: "HR records, attendance, rosters, payroll, tips and documents, on the same data the till closes on.",
            badge: "HR",
            hue: "violet",
          },
          {
            icon: "chart",
            title: "Accounting",
            body: "Double-entry books fed by each day's close, so the ledger and the drawer are the same story.",
            badge: "Books",
            hue: "sky",
          },
          {
            icon: "shield",
            title: "Device management",
            body: "The tills, screens and printers across the fleet, seen and managed from one console.",
            badge: "Fleet",
            hue: "emerald",
          },
        ],
      },
    ],
  },

  trustLine: {
    short: "DevyaPOS is a product of Devya Solutions, the Egyptian software studio that built the platform and runs it.",
    withCr: "DevyaPOS is a product of Devya Solutions, the Egyptian software studio that built the platform and runs it — commercial registration {cr}.",
  },

  consent: {
    banner: {
      title: "Your privacy, your choice",
      body: "We use cookies and similar storage. Strictly-necessary ones keep the site working; analytics and marketing stay off until you turn them on. Choose what you're happy with — you can change it any time.",
      privacyLink: "Privacy policy",
      cookiesLink: "Cookie policy",
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      customize: "Customize",
    },
    panel: {
      title: "Cookie preferences",
      intro: "Turn each category on or off, then save. Strictly-necessary storage is always on because the site can't work without it.",
      save: "Save my choices",
      acceptAll: "Accept all",
      rejectAll: "Reject all",
      on: "Always on",
      categories: {
        necessary: {
          title: "Strictly necessary",
          body: "Remembers your language and light/dark choice and keeps the site secure. No tracking, and nothing that leaves your device on its own.",
        },
        analytics: {
          title: "Analytics",
          body: "Vercel Web Analytics and Speed Insights — aggregate page counts and load times, so we can see which pages work. No profile of you, and no tracking across other sites.",
        },
        marketing: {
          title: "Marketing",
          body: "Remembers which campaign link brought you (for one visit) so a lead you send us can be credited to it. Nothing is loaded and nothing is stored until you allow this.",
        },
      },
    },
    settingsLabel: "Cookie settings",
  },

  etaInvoicing: {
    badge: "VAT and e-invoicing in Egypt",
    title: "Where DevyaPOS stands on Egyptian tax",
    sub: "Most systems sold to Egyptian restaurants say nothing at all about this. Here is what the law asks of you, what this system does for you today, and what it does not do yet.",
    standfirst:
      "DevyaPOS is not an Egyptian Tax Authority e-invoicing integration. It computes and shows 14% VAT, holds your tax registration number, and exports the sales records your accountant works from. It does not submit anything to the ETA on your behalf. If a vendor tells you their point of sale makes you compliant, ask them to show you a submitted document with an ETA reference on it, in a live account.",
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
      title: "What DevyaPOS does for you today",
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
      title: "What DevyaPOS does not do yet",
      sub: "Written here so you read it now rather than discover it after signing.",
      items: [
        {
          title: "No submission to the ETA",
          body: "DevyaPOS does not send invoices or receipts to the Egyptian Tax Authority's systems. Nothing is transmitted on your behalf, to anyone.",
        },
        {
          title: "No signed electronic documents",
          body: "There is no e-signature, no e-seal, and no ETA-format document produced. A DevyaPOS receipt is a receipt, not a registered electronic tax document.",
        },
        {
          title: "No ETA reference on the receipt",
          body: "You will not find a submission identifier or status on the printout, because there is no submission behind it.",
        },
        {
          title: "No accreditation",
          body: "DevyaPOS holds no certification, accreditation or approval from the Egyptian Tax Authority, and this site claims none anywhere.",
        },
      ],
      note: "None of that is priced into what you pay. You are not being billed for a compliance module that does not exist.",
    },
    meaning: {
      title: "What that means if you are choosing a system now",
      body: "The honest answer turns on one thing: whether your restaurant is already required to submit electronically.",
      points: [
        "If you are not yet in a mandated group, DevyaPOS covers the daily part — correct VAT on every line, clean records per branch, and an export your accountant can work from.",
        "If you are already required to submit e-receipts or e-invoices, you need a route that submits. Run one alongside DevyaPOS, or wait for us. Do not buy this expecting it to close that gap today.",
        "Ask every vendor you are talking to the same question in writing: does your system submit to the ETA, under whose accreditation, and can you show it happening in a live account? A logo on a slide is not an answer.",
        "When submission ships here, this page changes the same day, with the date on it. That is the only promise on this page.",
      ],
    },
    faq: {
      title: "The awkward questions, answered",
      items: [
        {
          q: "Is DevyaPOS compliant with Egyptian e-invoicing?",
          a: "No, and we will not say otherwise. DevyaPOS computes and shows VAT and keeps your sales records. It does not submit documents to the Egyptian Tax Authority, and it holds no accreditation from them.",
        },
        {
          q: "Does it calculate VAT correctly?",
          a: "Yes. 14% is computed per line item as the order is built, and shown on the receipt and in reports. Amounts are stored as whole piasters, so the receipt and the report never disagree.",
        },
        {
          q: "Can I file my VAT return from DevyaPOS?",
          a: "You can export the sales records a return is built from — by branch, by day, with tax separated. The filing itself happens through the Egyptian Tax Authority, by you or your accountant.",
        },
        {
          q: "My accountant says I have to submit e-receipts. What now?",
          a: "Then you need a submission route DevyaPOS does not provide today. Tell us during the trial and we will say plainly whether the rest of the system is still worth your time — sometimes it is, sometimes it is not.",
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
      body: "Fifteen minutes, your menu, and your accountant's requirements on the table. If DevyaPOS is the wrong fit for where your restaurant stands, we would rather say so now than after you have paid.",
      primary: "Book a 15-min demo",
      secondary: "Message us on WhatsApp",
    },
  },

  foodicsAlternative: {
    badge: "DevyaPOS vs Foodics",
    title: "Looking for a Foodics alternative in Egypt?",
    sub: "Foodics is a serious product. It is also priced for a different restaurant than the one this page is written for. Here is the comparison with the numbers left in.",
    disclaimer:
      "Foodics is a trademark of its owner and has no affiliation with DevyaPOS. Every figure below comes from Foodics' own published Egyptian pricing, retrieved September 2026. Their prices are theirs to change — check foodics.com yourself before you decide anything.",
    positioning: {
      title: "The honest version",
      body: "Foodics is a regional platform with its own hardware, its own payment rail and a marketplace of add-ons behind it. DevyaPOS is one system, built in Egypt for Egyptian restaurants, at a flat price per branch with every module already inside it. Neither sentence is an insult to the other product. They are two different bets, and which one is right depends on the size of your operation and how much of your budget you want going to software.",
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
          label: "DevyaPOS — Counter",
          value: "199 EGP",
          note: "Per branch per month. Register, kitchen display, ordering site, offers, loyalty, inventory and reporting included, with no per-terminal fee.",
          ours: true,
        },
        {
          label: "DevyaPOS — Dining room",
          value: "499 EGP",
          note: "Per branch per month. All of Counter, plus the floor plan, coursing, split checks, the waiter's phone flow, pay-at-table QR and gift cards — still with no per-terminal fee.",
          ours: true,
        },
      ],
      source: "Foodics figures are their own published Egyptian pricing, retrieved September 2026, and may have changed since. DevyaPOS figures are our own published prices.",
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
      title: "Pick DevyaPOS if this is you",
      sub: "The cases where the flat per-branch price and an in-house team are the whole argument.",
      items: [
        {
          title: "Software cost has to make sense at your volume",
          body: "At the published Egyptian entry bundle, one branch costs more per month than fourteen branches on Counter, or five on Dining room. For an independent café or a small chain, that difference is a salary.",
        },
        {
          title: "You want the package to match how you serve, not how big you are",
          body: "Counter is the whole counter operation at 199, with nothing withheld to make the next number look better. Dining room is 499 because it adds the room — the floor plan, coursing, split checks, the waiter's phone flow, pay-at-table and gift cards — and for nothing else.",
        },
        {
          title: "You want the kitchen display included",
          body: "A live kitchen display is part of Counter, the cheapest package we sell. It is not listed in any published Egyptian tier on the other side.",
        },
        {
          title: "You already own the hardware",
          body: "DevyaPOS runs in a browser on the tablet, laptop or touchscreen you have, with any ESC/POS thermal printer. Nothing to buy on the way in and nothing to return on the way out.",
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
      body: "Send us your branch count and what you are quoted today. We will tell you what DevyaPOS costs, what it does not do, and whether switching is worth the disruption at your size.",
      primary: "Book a 15-min demo",
      secondary: "Message us on WhatsApp",
      note: "14-day free trial, no credit card, and we load your menu before you decide.",
    },
  },

  hardware: {
    badge: "Hardware",
    title: "Buy nothing. Run it on what you already own.",
    sub: "DevyaPOS runs in a browser. Any tablet, laptop or touchscreen big enough to tap is a register, and any ESC/POS thermal printer prints the receipt.",
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
          a: "Screens run on the branch network with live updates between them. For branches with unreliable internet, Group can host the system inside the restaurant or on your own server.",
        },
        {
          q: "Can I use the touchscreen from my old POS?",
          a: "Usually. If it runs a current browser it runs DevyaPOS. Old Windows tills locked to an ancient browser are the one case worth testing first, and we will test it with you before you commit.",
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

  legal: {
    terms: {
      title: "Terms of service",
      sub: "The agreement behind a DevyaPOS subscription, in the plainest language we can write it in.",
      updated: "Last updated 4 September 2026",
      sections: [
        {
          title: "1. Who you are contracting with",
          body: [
            "DevyaPOS is a product operated by Devya Solutions (\"we\", \"us\"), the studio that built the platform and maintains it.",
            "These terms cover your use of the DevyaPOS platform and of this website. Using either means you accept them. If you are agreeing on behalf of a company, you are confirming that you are allowed to.",
          ],
        },
        {
          title: "2. The free trial",
          body: [
            "Every account starts with a 14-day free trial on the package that fits how you serve — Counter or Dining room. No card is required to start it, and nothing is charged automatically when it ends.",
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
            "We do not offer a contractual uptime guarantee except on Group, where it is written into the agreement. We aim for continuous availability and we will tell you honestly when we fall short.",
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
      sub: "What this website collects, why, who it goes to, and the rights you have over it.",
      updated: "Last updated 4 September 2026",
      disclaimer:
        "TEMPLATE / DRAFT — not legal advice. This policy is a starting template prepared for review with qualified legal counsel before it is relied upon. It has not been reviewed by a lawyer, and nothing here should be taken as a definitive statement that this site complies with the GDPR or any other law. Replace the bracketed items and confirm the detail with your advisers before publishing.",
      sections: [
        {
          title: "The short version",
          body: [
            "This website has no accounts, no login and no profile of you. One thing on it sends us anything at all: the contact form. Analytics and campaign tracking stay switched off until you opt in through the cookie banner. Everything below is the detail.",
          ],
        },
        {
          title: "Who is responsible for your data (the controller)",
          body: [
            "The controller of the personal data collected through this website is Devya Solutions, the Egyptian software studio that operates DevyaPOS (\"we\", \"us\").",
            "You can reach us about anything in this policy, including any of the rights below, by email at devya.solutions@gmail.com or through the contact page on this site.",
            "[Add the registered legal name, business address and, where one is appointed, the details of a data protection officer or an EU/UK representative under Article 27 GDPR. These are placeholders pending legal review.]",
          ],
        },
        {
          title: "What we collect, and why",
          body: [
            "Contact-form details you give us: your name, your restaurant's name and your mobile number (required), and the number of branches and a free-text message (optional). We collect these to answer your enquiry, prepare a demo and load your menu if you ask.",
            "How you reached us: if you have allowed the marketing category, the campaign link (UTM tags), the referring website and the page you landed on travel with the form so we can tell which page or advert brought you. Without that consent this is not collected.",
            "Technical data every website receives: your IP address, browser and device type, the page requested and the time. Your IP address is used momentarily to rate-limit the form against automated abuse and is not stored with your enquiry.",
            "Usage measurement: if you have allowed the analytics category, aggregate page counts, load times and a few interaction events (the form being seen, a submission going through, a WhatsApp button being pressed). Names, phone numbers and message text never go into analytics.",
            "WhatsApp and email are offered as alternative routes for the same form. If you use one of those, your details reach us through WhatsApp or your own email client, and no submission is recorded on this website.",
          ],
        },
        {
          title: "Our legal basis for using it",
          body: [
            "Contact-form details: we rely on your consent (you choose to send the form) and on our legitimate interest in responding to a business enquiry and taking steps toward a possible contract. GDPR Article 6(1)(a), (b) and (f).",
            "Analytics and campaign attribution: your consent, given through the cookie banner, and only from the moment you give it. GDPR Article 6(1)(a). You can withdraw it at any time, and doing so is as easy as giving it.",
            "Security and abuse-prevention (including the momentary use of your IP address): our legitimate interest in keeping the site available and safe. GDPR Article 6(1)(f).",
          ],
        },
        {
          title: "Who we share it with",
          body: [
            "We do not sell your data, we do not add you to a mailing list you did not ask for, and we share it only with the service providers that help us run the site, each acting as our processor under its own terms:",
            "Vercel Inc. — hosting, and (only with your analytics consent) Vercel Web Analytics and Speed Insights. Vercel processes the technical data a request carries in order to serve and protect the site.",
            "Beyond those processors, your enquiry is seen only by the Devya Solutions team who follow it up. If a request from a court or regulator legally compels disclosure, we comply with the minimum the law requires.",
          ],
        },
        {
          title: "Where your data is processed (international transfers)",
          body: [
            "We are based in Egypt, and our hosting provider operates globally, so your data may be processed on servers outside your own country — including outside the European Economic Area.",
            "Where a transfer of EEA or UK personal data takes place, it is intended to be covered by an appropriate safeguard such as the European Commission's Standard Contractual Clauses. [Confirm the transfer mechanism and the processing locations with your advisers.]",
          ],
        },
        {
          title: "How long we keep it",
          body: [
            "Contact-form enquiries: kept for as long as we are in contact about them and for a reasonable period afterwards so we can pick the conversation back up, then deleted. [Set a specific retention period with your advisers.]",
            "Analytics: held in aggregate by our analytics provider and not tied to an identifiable person.",
            "You can ask us to delete your enquiry sooner, and we will unless we are required to keep it.",
          ],
        },
        {
          title: "Your rights",
          body: [
            "Where the GDPR applies, you have the right to: access the personal data we hold about you; have it corrected (rectification); have it deleted (erasure); restrict how we use it; object to processing based on our legitimate interests; receive the data you gave us in a portable form; and withdraw any consent you have given, at any time, without affecting what we did before you withdrew it.",
            "You can exercise any of these by emailing devya.solutions@gmail.com or using the contact page. We will respond without undue delay and within one month, and we will not charge you for a reasonable request.",
            "You also have the right to complain to a data protection supervisory authority — in the EEA, the authority in your country of residence or work. [If you serve EU/UK users, name the lead authority and provide its contact details after legal review.]",
          ],
        },
        {
          title: "Cookies and browser storage",
          body: [
            "Non-essential cookies and tracking do not run until you opt in through the banner, and you can change or withdraw your choice any time from \"Cookie settings\" in the footer. The full inventory — what each item is, why it exists and how long it lasts — is on the cookie policy.",
          ],
        },
        {
          title: "The product is a separate matter",
          body: [
            "This policy covers the marketing website. If you become a customer, the data your restaurant puts into the DevyaPOS platform — your menu, your orders, your own customers — is covered by your subscription agreement, under which we act as your processor. It stays yours, we process it only to run the service for you, and you can export or delete it whenever you want.",
          ],
        },
        {
          title: "Children",
          body: [
            "This site sells a business system. It is not directed at children and we do not knowingly collect anything from them.",
          ],
        },
        {
          title: "Changes to this policy",
          body: [
            "If this changes, the new version sits here with a new date at the top. There is no archive of old versions; the date tells you when the current text was written.",
          ],
        },
      ],
      contact: "Questions about any of this, or a request to exercise one of your rights, go to the contact page, and a person answers them.",
    },
    refund: {
      title: "Refund and cancellation policy",
      sub: "The 14-day trial is meant to make this page almost unnecessary. Here it is anyway.",
      updated: "Last updated 4 September 2026",
      sections: [
        {
          title: "The offer, restated",
          body: [
            "Fourteen days free on Counter or Dining room, with no credit card. Billing monthly or once a year after that, per branch, in Egyptian pounds. Cancel any time, and take a full export of your data with you.",
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
    cookies: {
      title: "Cookie policy",
      sub: "Every cookie and browser store this site uses, why it exists, and how long it lasts.",
      updated: "Last updated 4 September 2026",
      disclaimer:
        "TEMPLATE / DRAFT — not legal advice. This policy is a starting template prepared for review with qualified legal counsel before it is relied upon. It has not been reviewed by a lawyer, and nothing here should be taken as a definitive statement that this site complies with the GDPR, the ePrivacy rules or any other law. Confirm the inventory below matches what actually loads before publishing.",
      sections: [
        {
          title: "What this covers",
          body: [
            "\"Cookies\" here is shorthand for cookies and the similar browser storage this site uses (local storage and session storage). This page lists each one, what it does, how long it lasts, and which category it belongs to.",
            "The default is privacy-preserving: nothing in the analytics or marketing categories loads or is stored until you opt in through the banner. \"Reject all\" is the same as doing nothing.",
          ],
        },
        {
          title: "The categories",
          body: [
            "Strictly necessary — always on, because the site cannot work without them. They remember your language and theme, keep the site secure, and store the cookie choice you make here. They set no third-party tracker and are not used to profile you.",
            "Analytics (opt-in) — Vercel Web Analytics and Speed Insights, which count visits and page load times in aggregate so we can see which pages work. They run only after you allow this category.",
            "Marketing (opt-in) — remembers which campaign link brought you, for the length of one visit, so a lead you choose to send us can be credited to it. It runs only after you allow this category and follows you to no other website.",
          ],
        },
        {
          title: "The inventory",
          body: [
            "The items below are what this site sets. Analytics and marketing entries are written only after you opt in.",
          ],
        },
        {
          title: "Third-party cookies",
          body: [
            "Our analytics runs on Vercel, our hosting provider, and Vercel may set technical cookies where they are needed to serve or protect the site. We set no advertising cookies and embed no third-party trackers, pixels or social widgets on this site.",
          ],
        },
        {
          title: "Changing your choice",
          body: [
            "Open \"Cookie settings\" in the footer at any time to turn categories on or off, or to withdraw a choice you made before — it is as easy as giving it. You can also clear cookies and site storage from your browser settings, though clearing the strictly-necessary items will simply make the banner ask you again and reset your theme.",
          ],
        },
        {
          title: "Changes to this policy",
          body: [
            "If the cookies we use change, this page and the table change with it, and the date at the top moves. The date tells you when the current text was written.",
          ],
        },
      ],
      cookieTable: {
        title: "Cookies and browser storage in use",
        columns: {
          name: "Name",
          purpose: "Purpose",
          duration: "Duration",
          category: "Category",
        },
        rows: [
          {
            name: "devyapos-theme",
            purpose: "Remembers your light / dark theme choice.",
            duration: "Persistent (local storage — until you clear it)",
            category: "Strictly necessary",
          },
          {
            name: "devyapos.consent.v1",
            purpose: "Stores the cookie choices you make here, so we don't ask again.",
            duration: "Persistent (local storage — until you clear it)",
            category: "Strictly necessary",
          },
          {
            name: "Vercel platform",
            purpose: "Technical cookies your host may set to route requests and protect the site from abuse.",
            duration: "Session / short-lived",
            category: "Strictly necessary",
          },
          {
            name: "Vercel Web Analytics & Speed Insights",
            purpose: "Aggregate page counts, interaction events and load times. No profile, no cross-site tracking.",
            duration: "No cookie; no persistent identifier stored on your device",
            category: "Analytics (opt-in)",
          },
          {
            name: "devyapos.attribution.v1",
            purpose: "Remembers which campaign link brought you, to attach to a lead you choose to send.",
            duration: "Session (local to the tab — cleared when you close it)",
            category: "Marketing (opt-in)",
          },
        ],
      },
      contact: "Questions about cookies, or a request to change what we store, go to the contact page, and a person answers them.",
    },
  },
};
