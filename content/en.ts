import type { SiteContent } from "./types";

/** English mirror of `ar.ts` — same tree, same order, same claims. */
export const en: SiteContent = {
  meta: {
    home: {
      title: "Sufra | The restaurant OS — register, kitchen, online, stock",
      description:
        "One system runs the whole restaurant: POS, live kitchen display, your own online ordering, loyalty, and recipe-costed inventory. Bilingual AR/EN, EGP-native, multi-branch.",
    },
    features: {
      title: "Features | Sufra",
      description:
        "Everything Sufra runs: point of sale, kitchen display, online ordering, loyalty, recipe-costed inventory, Egyptian payments and reporting.",
    },
    pricing: {
      title: "Pricing | Sufra",
      description:
        "Free forever plan, and Growth at 399 EGP per branch per month. Clear prices in EGP, and zero commission on your orders.",
    },
    about: {
      title: "About Sufra | Why we built this",
      description:
        "Sufra was built inside a working restaurant — ten branches, a real menu, real rush hours. The story, the principles, and the plans.",
    },
    contact: {
      title: "Contact | Sufra",
      description:
        "Book a 15-minute demo or message us on WhatsApp. We load your menu and migrate your data for free.",
    },
  },

  nav: {
    links: [
      { label: "Features", href: "/features" },
      { label: "How it works", href: "/#how" },
      { label: "Compare", href: "/#compare" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ],
    login: "Log in",
    cta: "Start free",
  },

  hero: {
    badge: "✦ The restaurant OS — built in Egypt, for Egypt",
    line1: "Run the whole restaurant",
    line2: "from one system",
    sub: "Register + live kitchen display + your own online ordering + loyalty + recipe-costed inventory. Arabic and English, priced in EGP, unlimited branches — from under 13 EGP a day per branch.",
    ctaPrimary: "Start free — forever",
    ctaSecondary: "See it running",
    trust: "Free forever plan • No credit card • Live the same day",
    stats: [
      { value: "10", label: "branches running on it" },
      { value: "402", label: "items and sizes in the catalog" },
      { value: "< 1s", label: "register to kitchen screen" },
    ],
  },

  pain: {
    eyebrow: "The daily reality",
    title: "The restaurant is busy — so where is the profit going?",
    sub: "This was never a menu problem. Every part of your restaurant is running on its own.",
    items: [
      {
        icon: "coins",
        title: "Aggregators take a quarter of the bill",
        body: "You pay commission on every order, and the customer stays theirs — their name, their number, their repeat business.",
      },
      {
        icon: "link",
        title: "Three systems that never talk",
        body: "The register is one app, the online menu another, stock lives in a spreadsheet. Month-end reconciliation is manual and the gap shows up late.",
      },
      {
        icon: "printer",
        title: "The kitchen still runs on paper",
        body: "Tickets get lost, modifiers never arrive, orders run late — and the customer is the first one to notice.",
      },
      {
        icon: "warn",
        title: "You don't know what a cup really costs",
        body: "You price on instinct. Waste and ingredient usage eat the margin, and no single number tells you where it went.",
      },
    ],
  },

  bridge: {
    eyebrow: "The fix",
    title: "Sufra connects the register, the kitchen, the storefront and the stockroom",
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
        body: "Paymob (Intention API + Unified Checkout) for cards, cash on pickup or delivery, and HMAC-verified webhooks.",
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
        body: "Each branch with its stock, delivery zones, printer and staff. Your Paymob account gets connected and tested with a real order.",
      },
      {
        n: "03",
        title: "Open the shift",
        body: "The register starts, the kitchen sees tickets, customers order online. After day one you're looking at your real numbers.",
      },
    ],
    cta: "Start now — free",
  },

  compare: {
    eyebrow: "Comparison",
    title: "A QR menu is not a restaurant system",
    sub: "Menu-and-loyalty tools solve part of the picture. Sufra runs the whole picture.",
    us: "Sufra",
    them: "Menu & loyalty tools",
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
      { label: "Paymob + cash on pickup", us: true, them: true },
      { label: "Full bilingual RTL", us: true, them: true },
      { label: "Free forever plan", us: true, them: false },
      { label: "Menu and data migration", us: "Free", them: "Paid" },
      { label: "Price per branch per month", us: "399 EGP", them: "500 EGP" },
    ],
    note: "Based on the published pricing and feature lists of the menu-and-loyalty tools commonly sold in the Egyptian market at time of writing.",
  },

  roi: {
    eyebrow: "Do the math",
    title: "How much commission do you pay a year?",
    sub: "Move the numbers to match your restaurant, and see the difference if those orders arrived on your own site.",
    fields: {
      orders: "Monthly orders via aggregators",
      aov: "Average order value (EGP)",
      commission: "Aggregator commission",
      branches: "Number of branches",
    },
    hints: {
      orders: "orders/mo",
      aov: "EGP",
      commission: "%",
      branches: "branches",
    },
    results: {
      paid: "Commission you pay per year",
      recovered: "Recovered if 30% shift to your own site",
      cost: "Sufra cost per year",
      net: "Net saving per year",
      payback: "You break even in",
      paybackUnit: "days",
    },
    assumption:
      "The math assumes only 30% of aggregator orders move to your direct channel — a conservative figure once loyalty and notifications are running.",
    note: "Estimates for guidance only, not a promise of return.",
    cta: "Want us to review your real numbers?",
  },

  caseStudy: {
    eyebrow: "Built inside a working restaurant",
    title: "Sufra isn't slideware — ten branches run on it",
    body: "The platform was built and hardened on the BóHub chain: a real menu, real branches, real rush hours. Every feature here came out of something that actually broke during a shift.",
    stats: [
      { value: "10", label: "branches" },
      { value: "18", label: "menu categories" },
      { value: "134", label: "products" },
      { value: "268", label: "size variants" },
    ],
    link: "See the system architecture",
  },

  testimonials: {
    eyebrow: "Customer stories",
    title: "Restaurant owners on Sufra",
    // Intentionally empty until real, signed customer quotes exist —
    // the section hides itself while this array is empty.
    items: [],
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Clear prices — and zero commission on your orders",
    sub: "Start free forever. Pay when the system is already making you money.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 30%",
    currency: "EGP",
    per: "/mo",
    perBranch: "per branch",
    compareLink: "See the full comparison",
    plans: [
      {
        id: "free",
        name: "Free",
        tagline: "Get your digital presence up today",
        price: 0,
        priceLabel: "Free",
        features: [
          "Branded digital QR menu",
          "Online ordering page (one branch)",
          "Unlimited items and sizes",
          "Pickup + cash payment",
          "Full Arabic/English",
          "Basic sales reporting",
        ],
        cta: "Start free",
      },
      {
        id: "growth",
        name: "Growth",
        tagline: "The whole restaurant runs from here",
        price: 399,
        badge: "Most chosen",
        featured: true,
        features: [
          "Everything in Free",
          "Full POS + shifts and drawer",
          "Live kitchen display (KDS)",
          "Zoned delivery with fees",
          "Paymob payments + coupons",
          "Loyalty, points and tiers",
          "Customer notifications and campaigns",
          "Sales and staff reporting",
          "WhatsApp support on business days",
        ],
        cta: "Try 14 days free",
      },
      {
        id: "scale",
        name: "Scale",
        tagline: "When margin becomes the game",
        price: 899,
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
    note: "Prices are in EGP per branch, excluding VAT. Change or cancel any time — you drop to the free plan without losing your data.",
    founding: "Founding offer: the first 50 restaurants lock this price for the life of their subscription.",
  },

  faq: {
    eyebrow: "FAQ",
    title: "The questions people ask before signing",
    sub: "If yours isn't here, message us on WhatsApp — a human answers.",
    items: [
      {
        q: "Is the free plan actually free?",
        a: "Yes, free forever rather than a trial. You get a QR menu and an online ordering page for one branch with unlimited items. Move up to Growth when you need the register, the kitchen screen and loyalty.",
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
    sub: "Start on the free plan today, or book a 15-minute demo and we'll show it running on your own menu.",
    primary: "Start free now",
    secondary: "Book a 15-min demo",
    trust: "No credit card • Free migration • Cancel any time",
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
          { label: "How it works", href: "/#how" },
          { label: "Comparison", href: "/#compare" },
          { label: "Commission calculator", href: "/#roi" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms of service", href: "/contact" },
          { label: "Privacy policy", href: "/contact" },
          { label: "Refund policy", href: "/contact" },
        ],
      },
    ],
    legal: "All rights reserved.",
    madeBy: "A product by",
  },

  about: {
    badge: "About Sufra",
    title: "Built inside a restaurant — not inside a meeting",
    sub: "Every feature in Sufra came out of something that went wrong during a real shift, in a real branch, at peak hour.",
    storyTitle: "The story",
    story: [
      "It started as one project: build a complete system for an Egyptian bubble-tea chain with ten branches. Not a QR menu, not an ordering page — the whole thing: register, kitchen display, storefront, inventory and reporting.",
      "The moment it went into the branches, the real problem became obvious. It was never any single tool. It was that the market sells restaurants pieces: a menu tool, a loyalty tool, register software, and a spreadsheet for stock. Each piece works alone and they contradict each other together.",
      "What we learned there — that money must be stored as whole piasters, that Arabic has to be a first-class language rather than a translation, that an order must reach the kitchen in under a second, and that every cup needs a known cost — became the product's principles.",
      "Sufra is that same system, packaged so any Egyptian restaurant can be live on it the same day. The same code that runs ten branches right now.",
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
      { value: "10", label: "branches on the platform" },
      { value: "134", label: "products in the live catalog" },
      { value: "268", label: "costed size variants" },
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
        body: "The same system was decoupled from one brand and became a platform any restaurant can run the same day — Sufra.",
      },
    ],
    plansTitle: "The plans, briefly",
    plansSub:
      "Free forever to start, Growth for a working restaurant, and Scale for when margin becomes the game.",
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
      submit: "Send on WhatsApp",
      hint: "The form opens a WhatsApp conversation with these details — nothing is stored on this site.",
      messagePlaceholder:
        "e.g. Two branches, an old register, and I want to start selling online…",
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
    waTemplate: "Hi Sufra! I'd like to know more about the system for my restaurant.",
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
            title: "Paymob",
            body: "Intention API and Unified Checkout, with HMAC-verified confirmation webhooks.",
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
};
