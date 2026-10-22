<!-- Research copy, 2026-10-22. Keep the source numbers when editing; re-check a figure before changing it and move its date. -->

# POS competitive landscape: Egypt first, then KSA/UAE, with a global benchmark

**For:** Moving POS (pos.movingsystems.tech). It is a restaurant operating system covering POS, KDS, admin, an online shop, an accounting add-on, ETA and hardware pages. It runs live on a 25-branch Egyptian chain.
**Retrieved:** every figure was retrieved on **2026-10-22** unless another date is shown. Each source in §9 repeats this.

**Source tags:**
- **[P]** is a primary source: a vendor page, a regulator page or a filing, read directly.
- **[P-snip]** is a vendor page that blocked scripted fetching. The figure comes from a search engine's extract of that page.
- **[S]** is press or a third party.
- "Unconfirmed" means no primary source could be found. Nothing here was guessed.

**FX, for orientation only:** about EGP 51 per USD on 23 Aug 2026 [145]. SAR 3.75 and AED 3.6725 per USD are the official pegs.

---

## 0. Decision-relevant findings in brief

1. **Foodics' Egyptian prices are public.** They are on foodics.com/foodics-pricing-egypt/, in both English and Arabic [1][2].
   - Basic: **EGP 2,848.95 per branch per month billed annually**, or 3,019.89 billed quarterly.
   - Advanced: **EGP 3,733.67** annually, or 3,957.69 quarterly.
   - These match our 2026-09-04 record. Our site's statement that this is "not a public price list you can check" is wrong.
2. **Foodics raised its Egyptian prices in 2026 and removed the entry tier.** Wayback snapshots [3][4][5] show the change happened between 16 Feb and 21 May 2026.
   - Starter was EGP 1,421 a month on annual billing. It is gone.
   - Basic went from 2,435 to 2,848.95, a 17% rise. Advanced went from 3,247 to 3,733.67, a 15% rise.
3. **Foodics Egypt is about 3.5× cheaper in USD than Foodics KSA, but still about 14× Moving's Growth plan.**
   - Egypt Basic is roughly $56 a month [1]. KSA Basic is SAR 742, roughly $198 [6].
   - Moving Growth is EGP 199, roughly $3.90.
   - Moving is also below what local classified ads ask for basic "cashier software", which is EGP 199 a month [118]. It is far below accounting-led POS: Daftra charges EGP 490–1,960 a month on annual billing [79].
4. **Foodics does not put KDS, Foodics Pay or accounting into any Egyptian bundle.**
   - Online ordering, loyalty, delivery-aggregator integrations and BI only come with Advanced, or as paid add-ons on Basic [1].
   - Its card product is sold separately (Foodics Pay EG) [9].
   - We found no native ETA e-receipt in Foodics. It routes Egyptian e-receipts through marketplace partners, and "Digital Receipts" is a paid add-on [1][14].
5. **ETA e-receipts are the main compliance gate in Egypt.**
   - The ministerial schedule named restaurants: Greater Cairo and Alexandria from 15 Apr 2023, every other governorate from 15 Jul 2024 [126][127].
   - Since then the ETA has added named waves, most recently Decision 361/2025, in force 15 Nov 2025 [128].
   - Moving's own site contradicts itself on this. The ETA page says the product does not submit to the ETA [149]. The accounting page says "ETA e-invoice and e-receipt included in every plan" [148].
6. **Payments are where the money is in POS everywhere.**
   - Toast earns **82%** of its revenue from fintech; subscription is 15% and hardware 3% [35].
   - Lightspeed earns **66%** from transactions [49].
   - Both companies sell hardware at a gross loss. Toast and Lightspeed make their own processing mandatory [40][47]. Shopify charges a 0.6–2% surcharge when a merchant uses another processor [67].
7. **In Egypt the card rate is a commodity, quoted at 2.75% + EGP 3** by Paymob and Kashier [107][110].
   - The central bank (CBE) fully approved SoftPOS in Feb 2026 [125].
   - Egypt had about 1.6M POS terminals [125], 60M mobile wallets [124] and about 22M InstaPay users [123].
8. **ZATCA wave 25 brings in almost every VAT-registered Saudi restaurant.** It covers anyone above SAR 187.5k of turnover, with a deadline of **1 Feb 2027** [91].
   - Moving's Saudi accounting prices are in line with the market: SAR 119–349 against Wafeq at SAR 99–249 [81] and Qoyod at SAR 138–379.5 [76].
   - Foodics already bundles ZATCA-compliant accounting into KSA Basic [6][13].
9. **Lending tied to POS data is proven.**
   - Square has lent $32.8B in total [32].
   - Foodics launched Capital 2.0 on 14 Sep 2026, targeting SAR 375m in its first year with funds disbursed within 4 hours [17].
   - Fawry's loan book stands at EGP 5.7bn [112], and valU's GMV at EGP 24.5bn [135].
10. **Aggregator commission is still the clearest return-on-investment story for a direct ordering channel.**
    - Egypt: 15–25% per order. The source is old (2021) [143], but the in-house figure matches it.
    - KSA: 15–25% plus advertising [100]. UAE: 25–30% [105].
    - Egypt's Competition Authority (ECA) barred a dominant platform's exclusivity and most-favoured-nation (MFN, price-parity) clauses in 2022 [144], so restaurants may price their own channel lower.

---

## 1. In-house figures compared with what we found today

Sources checked: `content/en.ts`, `docs/spec.md`, `docs/social-launch-plan.md` and `docs/decisions/README.md`.

| # | In-house claim (location) | Finding on 2026-10-22 | Verdict |
|---|---|---|---|
| 1 | Foodics EG Basic is EGP 2,848.95/branch/mo billed annually, or 3,019.89 quarterly (`en.ts` pricing.marketAnchor and foodicsAlternative.facts, `retrievedAt: 2026-09-04`) | Same figures on the live page [1][2]. The page's own markup confirms 2,848.95 is the yearly price and 3,019.89 the quarterly one. | **Correct** |
| 2 | Foodics EG Advanced is EGP 3,733.67 annual, 3,957.69 quarterly | Same [1] | **Correct** |
| 3 | "not a public price list you can look up/check" (`en.ts`, live /pricing and /foodics-alternative [146][147]); "never 'published'" decision of 2026-10-22, PR #49; social plan §1.5 says "foodics.com/eg/pricing redirects… not currently verifiable" | Public at **https://www.foodics.com/foodics-pricing-egypt/** [1] and its Arabic twin [2]. Wayback shows the current prices live since at least 21 May 2026 [5]. The social plan checked the wrong URL. | **Wrong. Cite the URL instead.** |
| 4 | `docs/spec.md:204-211`: Foodics is 1,506 / 2,582 / 3,442 EGP "as of August 2026" | Those are the **quarterly** prices of Starter, Basic and Advanced from the 11 Nov 2025 and 16 Feb 2026 snapshots. The annual prices then were 1,421 / 2,435 / 3,247 [3][4]. They were replaced by 21 May 2026 [5]. | **Stale and mislabelled** |
| 5 | "Egypt is not offered a Starter tier at all" | True today [1]. Egypt did have a Starter tier until at least Feb 2026 [4]. | Correct now; add "since 2026" |
| 6 | "Pay, Pay at Table, KDS, Customer Display, Foodics One: in no Egyptian tier" | True of the bundle lists [1]. But **Foodics Pay EG is sold** in Egypt (Visa, Mastercard and Meeza cards, 24-hour settlement, terminal) [9], and Foodics has integrated Paymob terminals since 2022 [10]. | Accurate but could mislead; reword "Pay" |
| 7 | Loyalty, API, delivery aggregators and BI are paid add-ons on Basic | Confirmed [1] | **Correct** |
| 8 | Foodics has "more than a hundred apps" | The page title says "100+ App Integrations". The page body says "dozens… 15+ categories" [11]. | Soft; say "100+ integrations (vendor's figure)" |
| 9 | `/compare` table: the "Enterprise POS platforms" column has no POS register, KDS, shifts/drawer, recipe-costed inventory, food-cost reports or delivery zones, and only "partial" own-brand ordering; the subtitle names Foodics | Foodics EG Basic includes the cloud POS, inventory and delivery zones. KSA Starter includes KDS. Foodics Online is a full own-brand web and app channel [1][6][12]. | **Inaccurate for the named example** (comparative-advertising risk) |
| 10 | Aggregator commission "15–25%" in Egypt (ROI calculator) | The only Egypt-specific source is Enterprise, 2021 [143]. No current rate card exists. | Plausible but dated; cite it and add a date |
| 11 | ETA page: "does not submit anything to the ETA" [149], against the accounting trial: "ETA e-invoice, and e-receipt… included in every plan" [148] | The two live pages contradict each other | **Reconcile before any ETA marketing** |
| 12 | "One Foodics branch costs more per month than fourteen branches on Growth" | 2,848.95 ÷ 199 = 14.3 | **Correct** (Foodics annual price against Moving's monthly price) |

---

## 2. Competitor matrix (summary)

| Player | Home / markets | Segment | Pricing model and entry price | Processing | Hardware | E-invoicing | Financing | Onboarding |
|---|---|---|---|---|---|---|---|---|
| **Moving POS** | Egypt (KSA for accounting) | F&B chains and independents | Flat per branch: Growth **EGP 199**, Scale 499, Enterprise custom; −30% on annual billing. Accounting EGP 499–1,999 / SAR 119–349; add-on EGP 299 / SAR 79 per branch [146][148] | Merchant's own gateway (Paymob live) | Bring your own device | Accounting page says ETA and ZATCA included; ETA page says no ETA submission [148][149] | None | Self-serve 14-day trial, no card |
| **Foodics** | KSA HQ; UAE, EG, KW, JO | F&B: QSR, cloud kitchen, dine-in, enterprise | Per-branch bundles plus add-ons. EG Basic **EGP 2,848.95** (annual); KSA Starter SAR 392; UAE Starter AED 199 [1][6][7] | Foodics Pay (licensed by the Saudi central bank, SAMA); Pay EG; rates not published [8][9] | Sold, quoted with the software; free hardware under Forward Together [1][20] | ZATCA at no extra cost; no native ETA found [13][14] | Capital 2.0, SAR 20k–2m+ [17] | Sales-led demo and quote |
| **Square** | US + 7 other countries; not MENA | Micro to mid-market, all verticals | Per location: Free $0, Plus $49, Premium $149; KDS $30 or $20 per device [27] | Bundled: 2.6/2.5/2.4% + 15¢ in person [28] | Sold, financed at 15% APR [30] | n/a | Square Loans, $32.8B cumulative [32] | Self-serve, 30-day trial |
| **Toast** | US, UK, IE, CA, AU | Restaurants (and retail) from SMB to enterprise | $0 Starter Kit, or $69/mo POS, then custom [37] | **Mandatory**: about 2.49% + 15¢, or 3.09% + 15¢ on pay-as-you-go [38][40] | Sold below cost; $0 upfront on pay-as-you-go [35][38] | n/a | Toast Capital via WebBank [41] | Sales-led, 2–3 year contracts [39] |
| **Lightspeed** | CA HQ; NA and EU | Complex retail (NA) and hospitality (EU) | Restaurant $69/189/399; Retail $89/149/289 (annual) [45][46] | **Mandatory**, or a $400/mo / 0.58% fee for other processors [47][48] | Sold below cost [49] | n/a | Lightspeed Capital, a cash advance [51] | Sales-led |
| **Loyverse** | Global, 170+ countries | Micro and small | Free core; add-ons $5–25 per store or employee per month [53] | Third-party in 30+ countries; **none in EG, KSA or UAE** [54] | Third-party (Sunmi and others) [55] | None found | None | Self-serve |
| **Odoo POS** | BE HQ; global partner network | SMB to mid-market ERP buyers | One App Free (POS alone is free); Standard $7.25–9.10 per user per month (first-year promo) [57] | Adyen, Stripe and others; no MENA acquirer [63] | Third-party | ETA e-invoice module; ZATCA plus POS module; ETA e-receipt only via a $449 third-party module [64][65][66] | None | Self-serve or partner; Success Packs $977–6,800 [58] |
| **Rewaa** | KSA | Retail (F&B added) | SAR 275 / 367 / 708 per month on 1-year contracts [71] | Rewaa Pay (add-on) | Sold; 70% off the starter kit [71] | ZATCA Phase 2 included | None found | 14-day trial |
| **Marn** | KSA | F&B and retail, iPad | Not published; sales-led [75] | Partner PSPs, Nearpay SoftPOS [74] | iPad-based | Says it is ZATCA-approved | Not found | Sales-led |
| **Qoyod** | KSA | Accounting-led SME | SAR 138–379.5/mo incl. VAT; POS add-on SAR 50 per user per month [76][77] | "Hala" device SAR 99–149/mo [78] | Sold, SAR 747.5 | ZATCA | Not found | 14-day trial |
| **Daftra** | EG and KSA | Accounting/ERP with POS | EGP 489.5–1,960/mo annual; 733–2,448 monthly [79] | Not bundled | Third-party | ETA e-invoice "no additional fees"; e-receipt **unconfirmed**; ZATCA [80] | None | 14-day trial, no card |
| **Paymob / Kashier / Geidea / Fawry / OPay** | EG (+ GCC) | Acquiring and PSP | 2.75% + EGP 3 card rate (Paymob, Kashier); POS and SoftPOS pricing **unconfirmed** [107][110] | Their core business | Terminals: Fawry 377k, OPay 90k+ [112][113] | Fawry and Geidea on the ETA's approved POS-vendor list [115] | Fawry MSME lending | Sales and field teams |

---

## 3. Competitor profiles

### 3.1 Foodics (the reference competitor)

**Segment.** F&B only: QSR and cafés, cloud kitchens, dine-in, and enterprise. **Foodics Black** launched in KSA on 1 Sep 2026 for full-service dine-in, with new hardware and a waiter device; it is promised for "all markets soon" [21].

**Scale**
- B.Laban runs Foodics in **150 Egyptian branches** and renewed for two more years on 24 Aug 2026 [22].
- Foodics claims over 6bn orders since 2014 [21].
- Last funding was a $170m Series C on 20 Apr 2022, led by Prosus and Sanabil [23].
- In Sep 2023 the Egyptian team was about 108 people [150].
- No current merchant count is published.

**Pricing (per branch per month; annual billing, with the monthly or quarterly price in brackets)**

| Market | Tier | Price | Notes |
|---|---|---|---|
| Egypt | Basic | EGP 2,848.95 (3,019.89 quarterly) | No Starter tier today [1] |
| Egypt | Advanced | EGP 3,733.67 (3,957.69 quarterly) | [1] |
| Egypt, Nov 2025 – Feb 2026 | Starter / Basic / Advanced | 1,421 / 2,435 / 3,247 (quarterly 1,506 / 2,582 / 3,442) | Wayback [3][4] |
| KSA, QSR and cafés | Starter / Basic / Advanced | SAR 392 / 742 / 1,133 (monthly 423 / 801 / 1,224) | Shown with the riyal glyph [6] |
| KSA, cloud kitchen | Basic / Advanced | SAR 567 / 867 (612 / 936) | [6] |
| KSA, dine-in | Basic | SAR 1,096 (1,183) | [6] |
| UAE | Starter / Basic / Advanced | AED 199 / 375 / 556 | Annual only [7] |

**What the Egyptian bundles contain** [1]
- **Basic:** cloud POS, menu management, customer module, dashboards, reporting, inventory, table management, marketplace, timed events, coupons, delivery zones, gift cards and promotions.
- **Advanced adds:** loyalty, API, Foodics Online web, delivery aggregators and BI.
- **Paid add-ons on Basic:** loyalty, API, web cashier, digital receipts, delivery aggregators, Foodics BI, cloud kitchen (multi-brand) and Online web.
- **No Egyptian bundle lists:** KDS, customer display, Pay, accounting.
- **By contrast, KSA Starter already includes** KDS, customer display and Foodics Pay. KSA Basic adds inventory, Online web and **Accounting & HR** [6].

**Processing**
- Foodics Pay is licensed by SAMA. mada payments settle next day; other cards settle within 3 days [8].
- Foodics Pay EG accepts Visa, Mastercard and Meeza and settles within 24 hours [9].
- Rates are not published anywhere.
- In Egypt, Foodics has been integrated with Paymob terminals since Nov 2022, with Banque Misr as acquirer [10].

**Hardware and payment flexibility**
- Hardware is sold. Foodics quotes "based on your ideal hardware and software" [1].
- **FLEX** (KSA, Oct 2023) lets merchants pay for subscriptions and hardware in zero-interest instalments deducted from Foodics Pay takings [19].
- **Forward Together** (6 May 2026; covers Egypt) offers flexible subscription terms, free online-ordering and kiosk tools, free hardware and free AI analytics [20].

**Ecosystem and ordering**
- Marketplace: "100+ App Integrations", "15+ categories" [11].
- **Foodics Online** is pitched directly at "saving up on third-party commission fees" and "no set up costs" [12]. In Egypt it is only in Advanced, or bought as an add-on.
- Aggregators: KSA has native connectors (e.g. Jahez, Keeta). Talabat and Deliveroo come through Deliverect, and HungerStation through FeedUs [15][16]. A native Talabat Egypt link is **unconfirmed**.

**E-invoicing and accounting**
- ZATCA compliance is "Out of the Box, At No Extra Cost". Foodics Accounting covers the ledger, B2B invoicing, payroll and HR, and VAT/Zakat [13].
- **Egypt ETA:** no native integration was found. The route is Marketplace → Digital Receipts partners such as InvoiceQ [14].

**Financing.** Capital 2.0 launched on 14 Sep 2026 [17][18]:
- AI pre-qualification, with funds disbursed in 4 hours;
- from about SAR 20k of working capital up to SAR 2m+ for expansion;
- repaid through deductions from daily settlements;
- a target of SAR 375m in the first year;
- Shariah-compliant financing in KSA through Funding Souq.

**Partner programmes** [24][25][26]
- A reseller programme for strategic partners.
- Referral partners earn a commission "once the sale pulls through"; the rate is not published.
- Egyptian customers who refer another customer get a cashback percentage that "may vary", is credited quarterly and is valid for 12 months.

**Onboarding.** Sales-led: a demo form, then a quote. No self-serve trial was found.

### 3.2 Square, including Square for Restaurants

**Segment.** Micro to mid-market sellers, where mid-market means more than $500k of Square GPV a year. In 2025 it had 4.5M+ sellers and $250B of Square GPV [32].

**Pricing (US)**
- Per location per month: Free $0, Plus $49, Premium $149 [27].
- Plus adds loyalty, email and text marketing (500 texts, then 3¢ each), staff management, and an Orders tab that merges DoorDash and similar delivery orders [29].
- KDS app: $30 per device per month on Plus, $20 on Premium. Kiosk $99 per device per month [27].
- Gift card loads cost 2.5% on Free and Plus [27].

**Processing** (bundled; rates fall by tier) [28]
- In person: 2.6% / 2.5% / 2.4% + 15¢.
- Online: 3.3% + 30¢ on Free, 2.9% + 30¢ on paid plans.
- Afterpay: 6% + 30¢.
- Volumes above $250k can get custom rates.

**Hardware.** Sold, with financing [30]:

| Device | Price |
|---|---|
| Reader | $59 |
| Terminal | $299 |
| Handheld | $399 |
| Register | $899 |
| Kiosk | $1,999 |

Instalment plans are issued by Block at 15% APR, over 3–24 months.

**Financing.** Square Loans offers $100 to $500k for a flat fee, repaid as a fixed share of daily sales [31].
- Block's 10-K reports more than 4.0M loans and **$32.8B** of principal to date.
- Loans are sized below 20% of a seller's annual GPV and repaid in about 10 months [32].

**Partner programmes**
- Solutions Partners earn a percentage of processing revenue for up to 24 months; the percentage is not published [33].
- The merchant referral gives both sides free processing on $1,000 of sales [34].

**Other gaps.** The size of the app marketplace is unconfirmed.

**Onboarding.** Self-serve, with a 30-day trial on Plus and Premium [27].

### 3.3 Toast

**Segment.** Restaurants from SMB to enterprise, plus retail. About **164k locations** at the end of 2025 (+22%) [36]. International: UK, IE, CA, AU.

**Sales model.** Sales-led and "substantially dependent on our direct sales force". It has over 200 partners [35].

**Pricing**
- $0 Starter Kit, or $69 a month for the POS software; larger setups get a custom quote [37].
- Add-on list prices are not public. Third-party estimates [39]: online ordering about $75 a month, loyalty about $50, gift cards about $50, delivery-app sync $30–75, KDS about $25 per screen.

**Processing.** Mandatory; outside processors are not allowed [40].
- About 2.49% + 15¢ when hardware is bought upfront.
- 3.09% + 15¢ on pay-as-you-go: $0 hardware upfront, 2-year term.
- Contracts run 2–3 years [38][39].

**Hardware is sold at a loss.** FY2025 hardware and professional-services revenue was $180M against $400M of cost [35].

**Delivery.** Native DoorDash, Grubhub and Uber Eats [43]. White-label Toast Delivery uses Uber Direct for a $6.99 base fee [44].

**Financing.** Toast Capital loans are issued by WebBank for a flat fee and repaid as a holdback on card sales; terms of 90 to 360 days [41].

**Referral.** "Up to $1,500" per new restaurant. Other Toast pages say $1,000 or $500, so the current amount is **unconfirmed** [42].

### 3.4 Lightspeed (Restaurant and Retail)

**Segment.** Its "growth engines" are complex SMB retail in North America and hospitality in Europe [50].

**Processing is mandatory.** "We now require merchants to use Lightspeed Payments." Using another processor costs $400 a month at low volume, or up to 0.58% of volume [47][48]. POS and payments have been sold as one offer since FY2024 [49].

**Restaurant pricing** [45]
- Starter $69, Essential $189, Premium $399 (USD, quote-based).
- KDS $30 per screen per month.
- Online ordering and advanced inventory are add-ons; third-party delivery requires an add-on.

**Retail pricing** [46]
- Basic $89 annual / $109 monthly; Core $149 / $179; Plus $289 / $339.
- Prices are only listed "with Lightspeed Payments"; card-present rate 1.5% on Plus.

**Hardware.** Sold below cost: FY26 hardware revenue $41.3M against $66.8M of cost [49].

**Capital.** A merchant cash advance with a flat fee, repaid as a share of sales [51]. Capital revenue grew 73% year on year in Q4 FY26 [50].

**Partners.** Referral partners choose a fixed bonus or a revenue share; the rate is not published [52].

**Gaps and onboarding.** Marketplace size is unconfirmed. Onboarding is sales-led.

### 3.5 Loyverse

**Segment.** Micro merchants, globally. An Arabic site exists [56].

**Pricing** [53]
- **Free:** POS, KDS, customer display, loyalty, multi-store, integrations, and 31 days of analytics.
- **Paid add-ons:**

| Add-on | Monthly | Annual |
|---|---|---|
| Unlimited sales history | $5 per store | $50 per store |
| Employee management | $5 per employee | $50 per employee |
| Advanced inventory | $25 per store | $250 per store |

- Each add-on has a 14-day trial.

**Payments and compliance**
- Integrated payments run through third parties in 30+ countries. **Egypt, KSA and the UAE are not among them** [54].
- No ETA or ZATCA support was found.

**Hardware and partners**
- Uses third-party hardware, such as Sunmi devices and ESC/POS printers [55].
- Takes partnership enquiries from implementers; no commission is published.
- This is the freemium floor that local resellers can offer Egyptian cafés.

### 3.6 Odoo POS

**Pricing** [57]
- **One App Free:** one app, unlimited users. POS alone qualifies, which makes it a free POS.
- **Standard:** $7.25 per user per month billed yearly, or $9.10 monthly. These are first-year prices; the regular prices appear to be $8.95 and $11.20.
- **Custom:** $13.40 or $16.90 (regular $16.40 or $20.90).
- All prices are as shown to a US visitor. **Egyptian and Saudi local prices are unconfirmed**, because Odoo prices by country.

**Implementation.** Success Packs: 25h for $977.50 up to 200h for $6,800 [58].

**Partner programmes.** Partners earn "up to 20% commission" [59]. Affiliates earn 10% of the subscription for 12 months [60].

**Features**
- KDS ("preparation display"), self-ordering, loyalty and gift cards, plus eCommerce and inventory on the same database [61].
- Delivery comes through the UrbanPiper connector, which covers Talabat, Careem, HungerStation, Jahez, Mrsool, Noon Food, Deliveroo, Uber Eats and DoorDash [62].
- Payment terminals: no MENA acquirer [63].

**E-invoicing**
- Egypt: `l10n_eg_edi_eta` covers B2B e-invoicing [64]. **POS e-receipt is not in core.** A third-party `pos_eg_eta_receipt` module costs **$449 one-time** [66].
- KSA: `l10n_sa_edi` and `l10n_sa_pos` cover ZATCA [65].

### 3.7 KSA and UAE players (excluding Foodics)

**Rewaa (KSA, retail-first)** [71][72][73]
- Prices in SAR per month, excluding VAT:

| Plan | 1-year contract | 2-year contract |
|---|---|---|
| Launch | 275 | 247 |
| Growth | 367 | 330 |
| Excellence | 708 | — |

- Extras on Launch: branch 3,198, register 249, user 149. Extras on Growth: branch 1,299, register 199, user 149. The billing unit for extras is unconfirmed (probably per year).
- ZATCA Phase 2 is included. Rewaa Pay and the e-store connector are paid add-ons.
- **70% off the hardware starter kit.** A free kit comes with the 2-year Growth plan.
- 14-day trial; 23,000+ merchants claimed; syncs with Zid and Salla stores.
- Raised a **$45M Series B** in Dec 2025.

**Marn (KSA, iPad-native)** [74][75]
- No published prices; sales-led.
- Modules: POS, KDS, customer display, kiosk and waiter apps.
- Says it is ZATCA-approved.
- Card payments run through partner PSPs, including Nearpay SoftPOS.
- 18 marketplace apps, including Bonat loyalty, STC Pay and several accounting tools. **No aggregators listed.**

**Qoyod (KSA, accounting-led)** [76][77][78]
- Plans, including VAT: SAR 138, 207 and 379.5 a month (1,380 / 2,070 / 3,795 a year).
- POS add-on: SAR 50 per user per month. Preconfigured hardware: SAR 747.5.
- "Hala" card device: SAR 149 a month, or 99 if card sales stay under SAR 15k.
- 14-day trial.

**Daftra (EG and KSA, ERP with POS)** [79][80]
- EGP prices:

| Plan | Annual billing (per month) | Monthly billing |
|---|---|---|
| Basic | 489.50 | 733 |
| Advanced | 977.58 | 1,225 |
| Comprehensive | 1,960 | 2,448 |

- An extra unit costs EGP 490–637 a month. Which item that is (branch or device) is unconfirmed.
- Unlimited cloud POS devices, plus an offline desktop POS.
- ETA e-invoice is included with "no additional fees". **ETA e-receipt is unconfirmed.** Also covers ZATCA.
- Its SAR prices are unconfirmed (the site prices by visitor location).

**Wafeq (accounting only; the comparator for Moving's accounting add-on)** [81][82]
- KSA: SAR 119 / 149 / 249 monthly, or 99 / 119 / 199 billed annually. Extra branch SAR 29 (24 on annual).
- Egypt: EGP 966 / 1,386 / 2,490 monthly, or 805 / 1,155 / 1,991 billed annually.
- Annual billing is 12 months for the price of 10.

**Zid (KSA, e-commerce plus POS)** [83]
- Starter free; Rise SAR 99 a month; Growth SAR 299; Pro on quote.
- The POS app comes with the plan; 400+ apps; merchant funding available.

**Salla Point** [84]
- Free on Salla's Special, Pro and Plus plans.
- Phone-based acceptance of mada, Visa and Apple Pay; a Geidea terminal can be ordered in the app.
- The pattern: e-commerce platforms give the POS away.

**Sapaad (UAE)** [85][86]
- Prices are quote-only.
- Offers working-capital finance through FlapKap, "funding within 48 hours".

**Payments in KSA** [87][88][89][90]
- mada merchant fees are capped at 0.8%, with a maximum of SAR 40 per transaction (secondary source).
- **Tap to Pay on iPhone, including mada, is "launching soon"**, according to SAMA in Sep 2026.
- Geidea added SoftPOS in KSA, the UAE and then Egypt (Nov 2024).
- Nearpay raised a $14M Series A.
- Merchant rates for Moyasar, Geidea, HyperPay, Tap and Network International are **unconfirmed**.

### 3.8 Egyptian payment companies (POS, terminals and SoftPOS)

**Paymob** [107][108][109][10]
- List rate 2.75% + EGP 3; no monthly fee; weekly settlement; enterprise prices by quote.
- **POS, SoftPOS and terminal rental prices are unconfirmed.**
- Tap-on-phone available since 2021.
- Profitable in Egypt (TechCrunch, Sep 2024).
- Raised a **$35M pre-Series C** led by Mubadala and EBRD in Sep 2026.
- Integrated with Foodics since 2022 [10].

**Kashier** [110][140]
- "2.75% + EGP 3.00 per successful transaction".
- Free setup and no monthly fee for online acceptance. "POS hardware… may be priced separately."
- Contact's BNPL is integrated.

**Geidea Egypt** [111][89]
- SoftPOS since Nov 2024.
- The site menu lists Restaurant POS and online ordering.
- Prices unconfirmed.
- On the ETA's approved POS-vendor list [115].

**Fawry, FY2025** [112]
- Revenue EGP 8.65bn (+57%); acceptance revenue EGP 1.79bn on EGP 290.6bn of throughput.
- **377k terminals**.
- Loan book EGP 5.70bn, of which MSME lending is EGP 2.89bn.
- 120k merchants on BNPL-for-business.
- Own SoftPOS; on the ETA vendor list.

**OPay Egypt** [113]
- More than 90k POS devices and kiosks (undated).
- Prices unconfirmed.

### 3.9 Other Egyptian POS vendors and the ETA e-receipt route

**"Orderat"** was not found. The closest name is Ordera, an order-ahead app that raised a seed round in 2020 [114]. Treat Orderat as unconfirmed.

**No Egyptian-native cloud restaurant POS of meaningful scale was found.** Foodics is the only restaurant-POS brand with a large Egyptian social presence (in-house social plan, Sep 2026). The local alternatives are:
- POSRocket, a Jordanian company in Egypt that raised $5M in 2021; its current status is unconfirmed [117];
- accounting-led SaaS such as Daftra and Wafeq;
- cheap desktop licences [118].

**ETA approval covers hardware, not POS software.**
- The ETA's approved POS-vendor list (v29, Sep 2026) names about 15–17 firms and about 20 device models. Firms include Delta, APIS, PaySky, Geidea and Fawry; device makers include PAX, Sunmi, Castles and Telpo [115].
- The list exists for taxpayers that have no e-receipt-capable system of their own.
- Software connects through the ETA API/SDK route; no software certification list exists.
- The ETA has handed free POS devices to new simplified-regime taxpayers (turnover under EGP 20M) [116].

**Typical price points in Egypt (EGP)**

| Item | Price | Source |
|---|---|---|
| Local "cashier software" subscription | EGP 199/mo | Classified listing [118] [S] |
| One-time desktop POS licence | EGP 4,500–4,800 | [118] [S] |
| Used Fawry or OPay payment terminal | EGP 3,650–6,450 | [118] [S] |
| Casio-based POS kit | EGP 12,222 | [118] [S] |
| Accounting-led SaaS with POS (Daftra) | EGP 489.5–1,960/mo (annual) | [79] |
| Accounting only (Wafeq) | EGP 805–1,991/mo (annual) | [82] |
| Own-channel ordering (Zyda, 2021) | from EGP 999/mo, zero commission | [70] [S, dated] |
| Foodics bundle | EGP 2,848.95–3,957.69 per branch per month | [1] |
| Card processing (list price) | 2.75% + EGP 3 | [107][110] |
| Moving POS | EGP 199 / 499 per branch per month | [146] |

The price of a new Sunmi-class terminal in Egypt is **unconfirmed**.

### 3.10 Ordering and aggregator middleware

**Deliverect** [68]
- 52 countries and 50k+ locations.
- Pricing "based on your… number of locations and solution". The list prices shown on the page did not render for scripted fetching, so they are unconfirmed here.

**Grubtech** (UAE) [69]
- Raised a **$15M Series B led by Jahez's investment arm** (May 2024).
- Aggregates Talabat, Deliveroo, Careem and others.
- Prices unconfirmed.

**Shopify POS** (omnichannel benchmark) [67]
- Basic $27, Grow $72, Advanced $399, Plus $2,300 a month.
- POS Pro is **+$89 per location per month**.
- Merchants pay a **2% / 1% / 0.6% fee** if they use a processor other than Shopify's.

---

## 4. Revenue mix of public POS companies

| Company (fiscal year) | Revenue | Fintech / transaction | Subscription | Hardware & services | Gross-profit notes |
|---|---|---|---|---|---|
| **Toast**, FY2025 [35][36] | $6,153M | $5,037M (**81.9%**) | $936M (15.2%) | $180M (2.9%) | Subscription GP $672M (72% margin); fintech $1,146M (23%); hardware **−$220M**. ARR $2.05B; GPV $195.1B |
| **Lightspeed**, FY2026 to 31 Mar 2026 [49] | $1,227.0M | $815.1M (**66.4%**) | $370.7M (30.2%) | $41.3M (3.4%) | Subscription GP $307.2M (83%); transaction $245.3M (30%); hardware **−$25.6M**. GTV $98.1B; payments penetration about 46% [151] |
| **Block / Square**, FY2025 [32] | $24.19B (Block) | Financial solutions $4.18B (+28%) | (no longer split out) | — | Square GP $3.9B (+9%), "driven by… Square Loans"; GPV $250B |
| **Fawry** (EG), FY2025 [112] | EGP 8.65bn | Acceptance EGP 1.79bn | — | — | Lending book EGP 5.70bn (+83%) |
| **valU** (EG BNPL), FY2025 [135] | EGP 5.6bn | — | — | — | GMV EGP 24.5bn; net income EGP 764M |
| **Jahez** (KSA delivery), FY2025 [101] | SAR 2.3bn net | — | — | — | GMV SAR 7.2bn; commission revenue +16.3% |
| **Talabat** group, 2025 [141] | $3.9bn | — | — | — | GMV about $9.5bn; Egypt, Jordan and Iraq ≈ 16–17% of GMV |

**The pattern:** subscription carries high margins (72–83%), hardware runs at a gross loss, and payments plus lending drive most of the growth.

---

## 5. Market context

### 5.1 Egypt

**Foodservice**
- Market size is USD 12.4bn in 2025 according to IMARC [119], or USD 10.35bn according to Mordor [120].
- There are **181,739 dining and drinking locations**, including 68,162 restaurants and 54,816 coffee and tea shops, as of 19 Mar 2025; 29,463 of them are flagged closed [121].
- No official count was found.
- Foodics and Paymob's 2022 release said "hundreds of thousands of restaurants… majority homegrown" [10].

**Retail.** Total retail sales above $149.7bn in 2025, according to Savills and Oxford Economics [122].

**VAT** is 14% [132].

**Digital payments**
- InstaPay: about 22M customers and 1.47bn transactions worth EGP 4.33tn by Q2 2026 (whether cumulative is unclear) [123].
- Mobile wallets: 60M by the end of 2025, about EGP 4tn transacted [124].
- POS terminals: about 1.6M, with cashless transactions up 45% year on year [125].
- **SoftPOS:** fully rolled out by CBE in Feb 2026, lifting the EGP 600 pilot cap; PIN-on-glass is allowed [125].
- The current Meeza card count is unconfirmed; the latest dated figure is over 1M users in Aug 2024.

**ETA e-receipt (B2C) timeline**
- **Ministerial Decree 230/2022**, amended by 38/2024, phases it in [126][127]:

| Phase | Who | From |
|---|---|---|
| 1 | 400 taxpayers in Cairo and Alexandria | — |
| **4.1** | Health and "tourist and non-tourist restaurants and hotels", Greater Cairo and Alexandria | **15 Apr 2023** |
| **5.1** | The same sectors, all other governorates | **15 Jul 2024** |
| 5.5 | — | 15 Jul 2025 |

- **After that, ETA-head decisions name taxpayers in waves:**

| Decision | Phase / wave | From |
|---|---|---|
| 396/2024 | 6.1 | — |
| 455/2024 | 6.2 | 15 Jan 2025 |
| 123/2025 | 7.1–7.2 | — |
| 225/2025 | 8.1 | — |
| 281/2025 | 8.2 | 15 Sep 2025 [130] |
| **361/2025** | 9.1 | 15 Nov 2025 [128] |

- Decision 361/2025 also requires registration on the "Fatortak… Hemaytak w Gaeztak" incentive portal [128].
- **No 2026 decision was found.**
- Whether a business is covered is checked by name at the ETA inquiry page [129].
- Penalties are cited inconsistently: EGP 20k–100k (Bloomberg Tax, 2021) [133]. Law 7/2025 capped late-payment additions at 100% of the tax (EY) [134]. The exact e-receipt penalty article is unconfirmed.

**ETA e-invoice (B2B).** Phased in from Nov 2020. Sources differ on when every VAT registrant was covered (2022–2023) [131].

**BNPL**
- **valU:** FY2025 revenue EGP 5.6bn, GMV EGP 24.5bn [135]. In H1 2026, 955k active customers and a 21% share [136]. 750k+ active merchants in Q1 2025 [137].
- **Souhoola:** 130k users and 1,600+ merchants; accepted on Network International POS [138].
- **Contact:** on Fawry's 370k+ POS [139] and through Kashier [140].
- Sympl and Aman are active; their current figures are unconfirmed.

**Delivery aggregators**
- **Talabat (formerly Otlob) leads.** No Egypt-only market share is disclosed [141]. Talabat Pro launched in Egypt in Q1 2025; Talabat bought InstaShop in 2024.
- **elmenus:** 12,000+ eateries in 5 cities; Careem invested in 2022 [142].
- Mrsool is active. Uber Eats left in 2020.
- Breadfast launched restaurant delivery ("Breadfast Food"); details unconfirmed.
- **Commission:** 15–25% of the bill (2021) [143]. No current rate card exists.
- **Competition Authority:** in May 2022 it found that a dominant platform's exclusivity clauses, its tying of listing to its own delivery, and its wide and narrow MFN clauses were abusive, and they were barred [144].

### 5.2 KSA

**ZATCA Phase 2 integration waves**
- Waves 1–3 [93]:

| Wave | Threshold | Live from |
|---|---|---|
| 1 | > SAR 3bn | 1 Jan 2023 |
| 2 | > SAR 500m | 1 Jul 2023 |
| 3 | > SAR 250m | 1 Oct 2023 |

- Wave 13: > SAR 7m, from 1 Jan 2025 [94].
- Wave 23: > SAR 750k, deadline 31 Mar 2026. Wave 24: > SAR 375k, deadline 30 Jun 2026 [92].
- **Wave 25: VAT-subject revenue > SAR 187.5k in any year 2022–2025, deadline 1 Feb 2027** [91]. That is effectively every VAT-registered restaurant.
- Penalties are reported to start at SAR 5k [92] [S].

**Cashless share.** Electronic payments were **85%** of retail payments in 2025, up from 79% in 2024 (14.6bn transactions) [95].

**Foodservice**
- About $28.7bn in 2024 [96], or $32.6bn in 2026 [97].
- About 132k restaurants, cafés and bakeries [98] [S]. The last official count is from 2017.

**Aggregators**
- HungerStation leads; Jahez is second; Keeta reached about 10% share within 4–5 months of its Oct 2024 launch [99][100].
- Restaurants report 15–25% commission per order, which can exceed 40% once advertising is added [100] [S].
- No cap exists. The competition regulator (GAC) is studying platform contracts; app prices run 20% to more than 80% above restaurants' own channels [102]. GAC is also reviewing Uber's purchase of Delivery Hero [103].
- For comparison, Kuwait caps commission at 10–17% [100].

### 5.3 UAE

**E-invoicing.** B2B and B2G only for now [104]:

| Who | Deadline |
|---|---|
| Revenue ≥ AED 50m | Appoint a service provider by 30 Oct 2026; go live 1 Jan 2027 |
| Revenue < AED 50m | Go live 1 Jul 2027 |

B2C receipts are not yet in scope.

**Aggregators.** Talabat and Deliveroo typically charge 25–30% [105]; 2020 reporting put it at 25–35% [106].

---

## 6. Proven business models (with evidence)

1. **Payments embedded in the POS, made mandatory or pushed by price.**
   - 82% of Toast's revenue and 66% of Lightspeed's come from payments [35][49].
   - Toast and Lightspeed make it mandatory, or charge for using an outside processor [40][47]. Shopify adds a 0.6–2% surcharge [67]. Square cuts its rate on higher tiers [28].
   - In the region: Foodics Pay is SAMA-licensed and Foodics Pay EG exists [8][9]; Rewaa Pay [71]; Qoyod's Hala device [78].
   - In Egypt the margin sits with PSPs at 2.75% + EGP 3 [107][110]. A POS vendor's realistic share there is a PSP revenue-share or referral fee.
2. **Per-location SaaS tiers gated by module.**
   - Square $49/$149 [27]; Lightspeed $69–399 [45]; Foodics bundles plus add-ons [1][6].
   - Subscription gross margins are 72–83% [35][49].
   - Foodics' 2026 price rise in Egypt (+15–17%, Starter dropped) [3][5] shows that Egyptian chains tolerate higher prices.
3. **A free POS that earns money elsewhere.**
   - Loyverse earns from add-ons [53]. Square Free earns from processing [27]. Odoo One App Free upsells the ERP [57].
   - Zid Starter [83] and Salla Point [84] use a free POS to lock in e-commerce subscriptions and payments.
4. **Hardware as a subsidised acquisition tool, not a profit line.**
   - Toast lost $220M on hardware [35]; Lightspeed lost $25.6M [49].
   - Square finances hardware at 15% APR [30]. Rewaa gives 70% off kits [71]. Foodics gives free hardware (Forward Together) and FLEX instalments [19][20].
5. **Merchant cash advances and revenue-based finance, underwritten on POS and settlement data.**
   - Square: $32.8B to date [32]. Toast Capital [41]. Lightspeed Capital revenue +73% [50].
   - Foodics Capital 2.0, targeting SAR 375m [17]. Fawry MSME loans of EGP 2.9bn [112]. Sapaad with FlapKap [86].
6. **Accounting and e-invoicing compliance bundled with the POS.**
   - Foodics bundles ZATCA-compliant accounting in KSA Basic and above [6][13]. Daftra includes ETA e-invoicing at no extra fee [80]. Qoyod sells a POS add-on [77]. Wafeq [81][82]. Odoo's ETA e-receipt module sells for $449 [66].
   - The deadlines drive demand: ZATCA wave 25 (Feb 2027) [91] and the ETA e-receipt waves [126].
7. **Own-channel ordering on a subscription instead of commission.**
   - Foodics Online is pitched as "saving up on third-party commission fees" [12]. Zyda charged a subscription in Egypt with zero commission [70].
   - Aggregators take 15–30% [100][105][143].
   - Middleware (Deliverect, Grubtech) earns per-location fees for connecting aggregators [68][69].
8. **Distribution through partners and referrals.**
   - Toast pays up to $1,500 per restaurant referral [42]. Odoo partners earn up to 20% and affiliates 10% for 12 months [59][60].
   - Square shares processing revenue with partners for 24 months [33]. Foodics runs referral, reseller and customer-cashback programmes [24][25][26].
   - In Egypt, PSPs act as distribution: the Foodics–Paymob deal [10], Geidea's restaurant POS [111], and Salla Point bundling a Geidea terminal [84].
9. **BNPL at the point of sale.**
   - valU, Contact and Souhoola reach merchants through POS networks such as Fawry and Network International [137][138][139]. Square's Afterpay costs the merchant 6% + 30¢ [28].
   - A POS vendor can capture integration or referral economics here.

---

## 7. Implications for Moving POS

1. **Fix the competitor claims now.**
   - Cite https://www.foodics.com/foodics-pricing-egypt/ [1] with a "retrieved" date.
   - Remove "not a public price list" from `en.ts` and `ar.ts` and the live pages [146][147].
   - Update `docs/spec.md:204-211` (stale 1,506 / 2,582 / 3,442) and revisit the 2026-10-22 decision.
   - Reword the `/compare` "Enterprise POS platforms" column, which wrongly denies Foodics a POS, inventory, delivery zones and KDS.
   - The 90-day `retrievedAt` test can stay; it now has a URL to check against.
2. **Reconcile the ETA messaging before selling Egyptian accounting.** The ETA page says "does not submit to the ETA" [149]; the accounting page promises "ETA e-invoice and e-receipt" [148].
   - Restaurants have been covered by the e-receipt schedule since 2023 (Cairo and Alexandria) and 2024 (everywhere else) [126].
   - Foodics has no native ETA e-receipt [14].
   - A working, demonstrable e-receipt submission is therefore the strongest product wedge in Egypt. The obvious next step would be a sample live ETA receipt reference, offered as proof.
3. **The price has room to rise.**
   - EGP 199 (about $3.90) per branch is about 7% of Foodics Basic [1]. It equals the classified-ad price of basic cashier software [118] and is below Daftra's entry plan (EGP 489.5) [79].
   - Foodics just raised prices 15–17% without losing B.Laban's 150 Egyptian branches [5][22].
   - A Growth price around EGP 499–799 and Scale around EGP 999–1,499 would still undercut Foodics by 70–80%. Keep the flat per-branch, no-per-terminal model; it is the real differentiator.
   - For a 25-branch chain:

| Option | Per year |
|---|---|
| Foodics Basic (annual) | **EGP 854,685** |
| Foodics Advanced (annual) | EGP 1,120,101 |
| Moving Growth (monthly) | EGP 59,700 |
| Moving Growth (annual billing) | EGP 41,790 |
| Moving Scale (monthly) | EGP 149,700 |

4. **Add payment economics without becoming a PSP.**
   - Negotiate a revenue share or referral fee with Paymob, Kashier or Geidea; the list rate is 2.75% + EGP 3 [107][110].
   - Add SoftPOS, which CBE fully approved in Feb 2026 [125], plus InstaPay and wallet acceptance (22M and 60M users [123][124]).
   - Bring-your-own-device plus SoftPOS fits the "buy nothing" stance, and avoids the hardware losses Toast and Lightspeed carry [35][49].
5. **Lead with the KDS, ordering and loyalty that Foodics Egypt leaves out.**
   - Foodics EG has no KDS in any tier; Online, loyalty and aggregators start at EGP 3,733.67 [1].
   - Pair zero-commission ordering with an aggregator-integration offer, since Foodics charges for that as an add-on [1].
   - Cite the ECA's 2022 ruling against exclusivity and MFN [144]: restaurants may legally price their direct channel lower.
6. **Treat KSA as an accounting-plus-ZATCA entry first.**
   - Wave 25 covers everyone above SAR 187.5k by 1 Feb 2027 [91].
   - Moving's SAR 119–349 is in line with Wafeq (99–249) and Qoyod (138–379.5) [76][81].
   - A full restaurant-POS entry would meet Foodics KSA Starter (SAR 392, with KDS and Pay) and Rewaa (SAR 247+) [6][71]. It would need a mada acquirer (Moyasar or Geidea), and Tap to Pay on iPhone is coming [88].
7. **Partner for financing; do not lend.**
   - POS-data lending works: Square, Foodics Capital 2.0, Fawry and valU [17][32][112][135].
   - A data-sharing referral with an Egyptian lender (Fawry MSME, valU business, or a FlapKap-style revenue-based financer) can earn referral income at no balance-sheet risk.
8. **Build a channel programme.**
   - Market norms: Toast pays up to $1,500 per referral [42]; Odoo partners get up to 20% and affiliates 10% for 12 months [59][60]; Foodics runs customer cashback [25].
   - Accountants are the natural reseller for the accounting add-on, which also sells into ETA and ZATCA compliance.
9. **Hardware guidance, not hardware sales.**
   - Publish which ETA-approved device models (Sunmi, PAX and others on list v29 [115]) work with Moving.
   - Financing through partners covers the "one supplier for the metal" objection that Foodics wins on.

---

## 8. Not confirmed / open gaps

**Pricing, rates and market numbers**
- Foodics Pay rates and Foodics Black pricing.
- Paymob, Geidea and Kashier card-present, SoftPOS and terminal pricing.
- Current Talabat Egypt commission and market share.
- Odoo's Egypt and KSA local prices.
- Daftra's SAR prices, and whether Daftra supports ETA e-receipts.
- Square and Lightspeed marketplace sizes and partner revenue-share percentages.
- Toast's current referral amount.
- Meeza card count after 2024.
- Any 2026 ETA e-receipt decision.
- The current official number of restaurants in KSA.

**Vendor status**
- "Orderat" could not be found.
- POSRocket's current status.
- Whether Foodics has a native Talabat Egypt integration.

---

## 9. Sources

All retrieved 2026-10-22. Wayback entries also show their snapshot date.

**Foodics**
1. Foodics Pricing Egypt [P] — https://www.foodics.com/foodics-pricing-egypt/ (retrieved 2026-10-22)
2. Foodics Pricing Egypt, Arabic [P] — https://www.foodics.com/ar/foodics-pricing-egypt/ (retrieved 2026-10-22)
3. Wayback snapshot 2025-11-11 [P] — https://web.archive.org/web/20251111131256/https://www.foodics.com/foodics-pricing-egypt/ (retrieved 2026-10-22)
4. Wayback snapshot 2026-02-16 [P] — https://web.archive.org/web/20260216225402/https://www.foodics.com/foodics-pricing-egypt/ (retrieved 2026-10-22)
5. Wayback snapshot 2026-05-21 [P] — https://web.archive.org/web/20260521130857/https://www.foodics.com/foodics-pricing-egypt/ (retrieved 2026-10-22)
6. Foodics pricing, KSA/SAR [P] — https://www.foodics.com/pricing/ (retrieved 2026-10-22)
7. Foodics pricing UAE [P] — https://www.foodics.com/foodics-pricing-uae/ (retrieved 2026-10-22)
8. Foodics Pay [P] — https://www.foodics.com/pay/ (retrieved 2026-10-22)
9. Foodics Pay EG [P] — https://www.foodics.com/pay-eg/ (retrieved 2026-10-22)
10. Foodics and Paymob partnership, 22 Nov 2022 [P] — https://www.foodics.com/press/foodics-paymob-partner/ (retrieved 2026-10-22)
11. Foodics Marketplace [P] — https://www.foodics.com/marketplace/ (retrieved 2026-10-22)
12. Foodics Online EG [P] — https://www.foodics.com/online-eg/ (retrieved 2026-10-22)
13. Foodics Accounting [P] — https://www.foodics.com/accounting-for-restaurants/ (retrieved 2026-10-22)
14. Foodics help: InvoiceQ [P-snip] — https://help.foodics.com/hc/en-us/articles/19686075569052-InvoiceQ (retrieved 2026-10-22)
15. Foodics help: Deliverect [P-snip] — https://help.foodics.com/hc/en-us/articles/7489013190684-Deliverect (retrieved 2026-10-22)
16. Foodics portfolio: FeedUs [P-snip] — https://foodics.com/portfolio/feedus (retrieved 2026-10-22)
17. Capital 2.0 press release, 14 Sep 2026 [P] — https://www.zawya.com/en/press-release/companies-news/foodics-launches-capital-2.0-at-money2020-turning-restaurant-performance-into-access-to-funding-597235 (retrieved 2026-10-22)
18. Foodics Capital [P] — https://www.foodics.com/capital/ (retrieved 2026-10-22)
19. FLEX programme, 15 Oct 2023 [P] — https://www.foodics.com/press/foodics-launches-flex-program/ (retrieved 2026-10-22)
20. Forward Together, 6 May 2026 [P, press release] — https://www.zawya.com/en/press-release/companies-news/foodics-launches-forward-together-initiative-to-support-f-and-b-operators-amid-rising-industry-pressures-iaptykx7 (retrieved 2026-10-22)
21. Foodics Black, 1 Sep 2026 [P] — https://www.foodics.com/press/foodics-unveils-foodics-black-at-leap/ (retrieved 2026-10-22)
22. B.Laban renews with Foodics, 24 Aug 2026 [P, press release] — https://www.zawya.com/en/press-release/companies-news/b.laban-renews-partnership-with-foodics-for-two-more-years-to-support-operations-and-expansion-465273 (retrieved 2026-10-22)
23. Series C, 20 Apr 2022 [P] — https://www.foodics.com/press/saas-series-c-funding/ (retrieved 2026-10-22)
24. Foodics referral partners [P] — https://www.foodics.com/referral/ (retrieved 2026-10-22)
25. Egypt customer-to-customer referral [P] — https://www.foodics.com/egypt-c2c-referral-lp/ (retrieved 2026-10-22)
26. Foodics reseller [P] — https://www.foodics.com/reseller/ (retrieved 2026-10-22)

**Square**

27. Square for Restaurants pricing [P] — https://squareup.com/us/en/point-of-sale/restaurants/pricing (retrieved 2026-10-22)
28. Square fees [P] — https://squareup.com/us/en/payments/our-fees (retrieved 2026-10-22)
29. Square pricing [P] — https://squareup.com/us/en/pricing (retrieved 2026-10-22)
30. Square hardware [P] — https://squareup.com/us/en/hardware (retrieved 2026-10-22)
31. Square Loans [P] — https://squareup.com/us/en/banking/loans (retrieved 2026-10-22)
32. Block FY2025 10-K [P] — https://www.sec.gov/Archives/edgar/data/1512673/000162828026012254/xyz-20251231.htm (retrieved 2026-10-22)
33. Square Solutions Partner Program [P] — https://squareup.com/gb/en/partnerships/solutions-partner-program (retrieved 2026-10-22)
34. Square referral help article [P-snip] — https://squareup.com/help/us/en/article/5209 (retrieved 2026-10-22)

**Toast**

35. Toast FY2025 10-K [P] — https://www.sec.gov/Archives/edgar/data/1650164/000165016426000057/tost-20251231.htm (retrieved 2026-10-22)
36. Toast FY2025 results release [P-snip] — https://www.businesswire.com/news/home/20260212058106/en/ (retrieved 2026-10-22)
37. Toast: restaurant POS cost [P-snip] — https://pos.toasttab.com/blog/on-the-line/restaurant-pos-system-cost (retrieved 2026-10-22)
38. NerdWallet Toast review [S] — https://www.nerdwallet.com/business/software/reviews/toast-pos (retrieved 2026-10-22)
39. UpMenu Toast pricing [S] — https://www.upmenu.com/blog/toast-pricing (retrieved 2026-10-22)
40. Chowly, Toast vs Square [S] — https://chowly.com/resources/blogs/toast-vs-square-for-restaurants/ (retrieved 2026-10-22)
41. Toast Capital FAQ [P-snip] — https://support.toasttab.com/en/article/Toast-Capital-FAQ (retrieved 2026-10-22)
42. Toast referral [P-snip] — https://pos.toasttab.com/us-referral (retrieved 2026-10-22)
43. Toast delivery integrations [P-snip] — https://pos.toasttab.com/third-party-delivery-integrations (retrieved 2026-10-22)
44. NRN, Toast switches to Uber Direct [S] — https://www.nrn.com/restaurant-technology/toast-switches-its-default-white-label-delivery-partner-from-doordash-to-uber (retrieved 2026-10-22)

**Lightspeed**

45. Lightspeed Restaurant pricing [P] — https://www.lightspeedhq.com/pos/restaurant/pricing/ (retrieved 2026-10-22)
46. Lightspeed Retail pricing [P] — https://www.lightspeedhq.com/pos/retail/pricing/ (retrieved 2026-10-22)
47. Lightspeed Payments FAQ [P] — https://k-series-support.lightspeedhq.com/hc/en-us/articles/15214224728987-Lightspeed-Payments-FAQ (retrieved 2026-10-22)
48. Lightspeed: switch to Lightspeed Payments [P] — https://www.lightspeedhq.com/pos/retail/switch-to-lightspeed-payments-x/ (retrieved 2026-10-22)
49. Lightspeed FY2026 MD&A [P] — https://www.sec.gov/Archives/edgar/data/0001823306/000182330626000025/mdafy26q4.htm (retrieved 2026-10-22)
50. Lightspeed Q4/FY2026 results [P] — https://www.lightspeedhq.com/news/lightspeed-announces-fourth-quarter-and-full-year-2026-financial-results-and-provides-outlook-for-fiscal-2027/ (retrieved 2026-10-22)
51. Lightspeed Capital [P] — https://www.lightspeedhq.com/capital/ (retrieved 2026-10-22)
52. Lightspeed referral partners [P] — https://www.lightspeedhq.com/partners/refer/ (retrieved 2026-10-22)

**Loyverse**

53. Loyverse pricing [P] — https://loyverse.com/pricing (retrieved 2026-10-22)
54. Loyverse payment systems [P] — https://loyverse.com/payment-systems (retrieved 2026-10-22)
55. Loyverse hardware [P] — https://loyverse.com/hardware (retrieved 2026-10-22)
56. Loyverse Arabic [P] — https://loyverse.com/ar (retrieved 2026-10-22)

**Odoo**

57. Odoo pricing [P] — https://www.odoo.com/pricing (retrieved 2026-10-22)
58. Odoo Success Packs [P] — https://www.odoo.com/pricing-packs (retrieved 2026-10-22)
59. Odoo partners [P] — https://www.odoo.com/become-a-partner (retrieved 2026-10-22)
60. Odoo affiliates [P] — https://www.odoo.com/affiliate (retrieved 2026-10-22)
61. Odoo POS docs [P] — https://www.odoo.com/documentation/18.0/applications/sales/point_of_sale.html (retrieved 2026-10-22)
62. Odoo online food delivery [P] — https://www.odoo.com/documentation/18.0/applications/sales/point_of_sale/online_food_delivery.html (retrieved 2026-10-22)
63. Odoo POS payment methods [P] — https://www.odoo.com/documentation/18.0/applications/sales/point_of_sale/payment_methods.html (retrieved 2026-10-22)
64. Odoo Egypt localisation [P] — https://www.odoo.com/documentation/18.0/applications/finance/fiscal_localizations/egypt.html (retrieved 2026-10-22)
65. Odoo Saudi localisation [P] — https://www.odoo.com/documentation/18.0/applications/finance/fiscal_localizations/saudi_arabia.html (retrieved 2026-10-22)
66. Odoo Apps: pos_eg_eta_receipt [P] — https://apps.odoo.com/apps/modules/19.0/pos_eg_eta_receipt (retrieved 2026-10-22)

**Shopify, middleware and own-channel ordering**

67. Shopify POS pricing [P] — https://www.shopify.com/pos/pricing (retrieved 2026-10-22)
68. Deliverect pricing [P] — https://www.deliverect.com/en/pricing (retrieved 2026-10-22)
69. Wamda, Grubtech $15M Series B [S] — https://www.wamda.com/2024/05/grubtech-raises-15-million-series-b-led-jahez (retrieved 2026-10-22)
70. Enterprise, Zyda enters Egypt (2021) [S] — https://enterpriseam.com/egypt/2021/02/03/gcc-firms-are-pouring-into-egypt/ (retrieved 2026-10-22)

**KSA/UAE players**

71. Rewaa pricing [P] — https://rewaa.com/pricing/ (retrieved 2026-10-22)
72. Rewaa [P] — https://rewaa.com/ (retrieved 2026-10-22)
73. Rewaa $45M Series B [S] — https://www.sharikatmubasher.com/media-hub/news/21526010/rewaa-closes-45m-series-b-to-expand-ai-powered-retail-solutions (retrieved 2026-10-22)
74. Marn marketplace [P] — https://marn.com/marketplace/ (retrieved 2026-10-22)
75. Marn get started [P] — https://marn.com/get-started/ (retrieved 2026-10-22)
76. Qoyod plans 2025 [P-snip] — https://www.qoyod.com/knowledge-base/باقات-قيود-للاشتراك-qoyod-2025/ (retrieved 2026-10-22)
77. Qoyod POS pricing [P-snip] — https://www.qoyod.com/en/knowledge-base/qoyod-point-of-sale-system-and-subscription-pricing/ (retrieved 2026-10-22)
78. Qoyod Hala device [P-snip] — https://www.qoyod.com/en/knowledge-base/hala-payment-device-by-qoyod-complete-guide-to-how-it-works/ (retrieved 2026-10-22)
79. Daftra plans [P] — https://www.daftra.com/plans (retrieved 2026-10-22)
80. Daftra Egypt e-invoice [P] — https://www.daftra.com/الفاتورة-الإلكترونية-مصر/ (retrieved 2026-10-22)
81. Wafeq KSA pricing [P] — https://wafeq.com/en-sa/pricing (retrieved 2026-10-22)
82. Wafeq Egypt pricing [P] — https://www.wafeq.com/en-eg/pricing (retrieved 2026-10-22)
83. Zid pricing [P] — https://zid.sa/en/pricing/ (retrieved 2026-10-22)
84. Salla Point [P-snip] — https://salla.com/en/tools/salla-guide/salla-point (retrieved 2026-10-22)
85. Sapaad pricing [P] — https://www.sapaad.com/pricing (retrieved 2026-10-22)
86. Gulf News, Sapaad and FlapKap [S] — https://gulfnews.com/business/corporate-news/sapaad-and-flapkap-join-forces-to-address-restaurant-working-capital-needs-in-uae-1.1709579874566 (retrieved 2026-10-22)
87. Alraedah, mada fee cap [S] — https://alraedah.sa/en/?p=26664 (retrieved 2026-10-22)
88. SAMA, Tap to Pay on iPhone [P] — https://sama.gov.sa/en-US/MediaCenter/News/Pages/news-1170.aspx (retrieved 2026-10-22)
89. Geidea SoftPOS to Egypt [S] — https://meatechwatch.com/2024/11/28/geidea-expands-softpos-service-to-egypt-after-success-in-saudi-arabia-and-uae/ (retrieved 2026-10-22)
90. Nearpay $14M Series A [S] — https://ibsintelligence.com/ibsi-news/saudi-fintech-nearpay-secures-14m-in-series-a-funding (retrieved 2026-10-22)

**KSA/UAE market**

91. ZATCA wave 25 [P] — https://zatca.gov.sa/en/MediaCenter/News/Pages/Wave25-E-invoicing.aspx (retrieved 2026-10-22)
92. Wafeq, ZATCA waves and penalties [S] — https://www.wafeq.com/en-sa/tax-and-reporting/which-zatca-wave-am-i-in-deadlines-and-what-to-do (retrieved 2026-10-22)
93. Deloitte, ZATCA waves 1–3 [S] — https://www.deloitte.com/middle-east/en/services/tax/perspectives/zatca-initiates-procedures-for-implementing-integration-phase-electronic-invoicing.html (retrieved 2026-10-22)
94. PwC, ZATCA wave 13 [S] — https://www.pwc.com/m1/en/services/tax/middle-east-tax-news-alerts/2024/saudi-arabia-thirteenth-wave-in-the-integration-phase-of-electronic-invoicing.html (retrieved 2026-10-22)
95. SAMA, e-payments 85% of retail payments in 2025 [P] — https://sama.gov.sa/en-US/MediaCenter/News/Pages/news-1139.aspx (retrieved 2026-10-22)
96. IMARC, KSA foodservice [S] — https://imarcgroup.com/saudi-arabia-foodservice-market (retrieved 2026-10-22)
97. Nexdigm, KSA foodservice [S] — https://www.nexdigm.com/market-research/insights/blog/ksa-foodservice-industry/ (retrieved 2026-10-22)
98. xMap, KSA restaurants, cafés and bakeries [S] — https://www.xmap.ai/blog/saudi-arabia-restaurants-cafes-and-bakeries-in-2023-insights-for-f-b-and-fmcg-industries (retrieved 2026-10-22)
99. Redseer, Keeta share [S] — https://redseer.com/articles/keeta-has-gained-10-market-share-in-ksa-whats-next/ (retrieved 2026-10-22)
100. AGBI, KSA delivery market [S] — https://www.agbi.com/analysis/retail/2025/09/saudi-arabia-among-worlds-most-competitive-delivery-markets/ (retrieved 2026-10-22)
101. Jahez FY2025 financial statements [P] — https://www.saudiexchange.sa/Resources/fsPdf/13918_6727_2026-03-30_08-30-26_en.pdf (retrieved 2026-10-22)
102. Argaam, GAC on app pricing [S] — https://www.argaam.com/en/article/articledetail/id/1875921 (retrieved 2026-10-22)
103. Arab News, GAC reviews Uber/Delivery Hero [S] — https://www.arabnews.com/node/2652050 (retrieved 2026-10-22)
104. KPMG, UAE e-invoicing phases [S] — https://kpmg.com/us/en/taxnewsflash/news/2026/07/tnf-uae-phased-implementation-of-e-invoicing-beginning-january-1-2027.html (retrieved 2026-10-22)
105. Oto, UAE delivery commissions [S] — https://www.tryoto.com/otopedia/blog/food-delivery (retrieved 2026-10-22)
106. Khaleej Times, UAE commissions (2020) [S] — https://www.khaleejtimes.com/business/commission-rates-by-delivery-apps-proving-costly-to-uae-restaurants (retrieved 2026-10-22)

**Egyptian payments and POS vendors**

107. Paymob pricing [P] — https://paymob.com/en/pricing (retrieved 2026-10-22)
108. TechCrunch, Paymob profitable in Egypt [S] — https://techcrunch.com/2024/09/11/paymob-lands-another-22-million-and-is-profitable-in-egypt (retrieved 2026-10-22)
109. Wamda, Paymob $35M pre-Series C [S] — https://www.wamda.com/2026/09/paymob-raises-35-million-pre-series-c-led-mubadala-ebrd (retrieved 2026-10-22)
110. Kashier pricing [P] — https://www.kashier.io/pricing (retrieved 2026-10-22)
111. Geidea Egypt SoftPOS [P] — https://geidea.net/egy/en/solutions/payments/softpos (retrieved 2026-10-22)
112. Fawry FY2025 results [P, press release] — https://www.zawya.com/en/press-release/companies-news/fawry-releases-fy2025-results-356861 (retrieved 2026-10-22)
113. Contact and OPay [S] — https://www.zawya.com/en/press-release/companies-news/contact-and-opay-collaborate-to-provide-innovative-payment-solutions-and-enhance-customer-experience-hsa81m5r (retrieved 2026-10-22)
114. Wamda, Ordera seed [S] — https://www.wamda.com/en/2020/08/ordera-raises-figure-seed-funding (retrieved 2026-10-22)
115. ETA approved POS vendors, v29 [P] — https://eta.gov.eg/sites/default/files/2026-09/pos_verified_vendors_contact_data.v29.pdf (retrieved 2026-10-22)
116. Al-Ahram Gate, free ETA POS devices [S] — https://gate.ahram.org.eg/News/5177023.aspx (retrieved 2026-10-22)
117. Wamda, POSRocket $5M [S] — https://www.wamda.com/index.php/2021/08/posrocket-raises-5-million (retrieved 2026-10-22)
118. OpenSooq, POS listings in Egypt [S] — https://eg.opensooq.com/en/computers-and-laptops/pos-systems (retrieved 2026-10-22)

**Egypt market**

119. IMARC, Egypt foodservice [S] — https://www.imarcgroup.com/egypt-foodservice-market (retrieved 2026-10-22)
120. Mordor via ResearchAndMarkets [S] — https://www.researchandmarkets.com/reports/5937122/egypt-foodservice-market-share-analysis (retrieved 2026-10-22)
121. xMap, Egypt dining and drinking locations [S] — https://www.xmap.ai/location-intelligence-reports/dining--drinking-locations-in-egypt (retrieved 2026-10-22)
122. Daily News Egypt, retail sales (Savills) [S] — https://www.dailynewsegypt.com/2025/10/13/egypts-retail-sales-to-exceed-149-7bn-in-2025-driven-by-expanding-supply-savills/ (retrieved 2026-10-22)
123. Ahram Online, InstaPay figures [S] — https://english.ahram.org.eg/News/577944.aspx (retrieved 2026-10-22)
124. Business Today Egypt, mobile wallets [S] — https://www.businesstodayegypt.com/Article/4/7346/Egypt-mobile-wallet-transactions-hit-EGP-4T-as-user-base (retrieved 2026-10-22)
125. Enterprise, CBE full SoftPOS rollout, Feb 2026 [S] — https://enterpriseam.com/egypt/2026/02/03/cbe-greenlights-full-rollout-of-soft-pos-turning-smartphones-into-payment-terminals/ (retrieved 2026-10-22)
126. ETA e-receipt decisions page [P] — https://www.eta.gov.eg/ar/content/qrarat-alalzam-baltaml-balaysal-alalktrwny (retrieved 2026-10-22)
127. Decree 230/2022 [P] — https://eta.gov.eg/sites/default/files/2024-09/decision.no_.230.for_.2022.pdf (retrieved 2026-10-22)
128. Decision 361/2025 [P] — https://eta.gov.eg/sites/default/files/2025-09/karar-361-2025-e.reciept-phase9-wave1.pdf (retrieved 2026-10-22)
129. ETA e-receipt inquiry [P] — https://www.eta.gov.eg/ar/ereceipt-inquiry (retrieved 2026-10-22)
130. KPMG, Egypt e-receipt phase 8.2 [S] — https://kpmg.com/us/en/taxnewsflash/news/2025/07/tnf-egypt-new-taxpayers-required-to-comply-with-mandate-to-issue-electronic-receipts-for-b2c-transactions.html (retrieved 2026-10-22)
131. EDICOM, Egypt e-invoicing [S] — https://edicomgroup.com/electronic-invoicing/egypt (retrieved 2026-10-22)
132. PwC, Egypt other taxes [S] — https://taxsummaries.pwc.com/egypt/corporate/other-taxes (retrieved 2026-10-22)
133. Bloomberg Tax, Egypt e-invoicing penalties [S] — https://news.bloombergtax.com/daily-tax-report-international/egypt-mof-announces-e-invoicing-framework-to-combat-tax-evasion (retrieved 2026-10-22)
134. EY, Egypt Law 7/2025 [S] — https://taxnews.ey.com/news/2025-0570 (retrieved 2026-10-22)
135. Decypha, valU FY2025 [S] — https://decypha.com/en/news/details/Valu-closes-2025-with-81--higher-net-income--revenues-hit-EGP-5-6bn/21539339?L=EN (retrieved 2026-10-22)
136. Khaleej Times, valU H1 2026 [S] — https://www.khaleejtimes.com/business/valu-profit-jumps-43-as-egypt-fintech-broadens-lending-footprint?amp=1 (retrieved 2026-10-22)
137. valU investor presentation [P] — https://efghermes.com/uploads/Valu_Investor_Presentation_b31ecf5f47.pdf (retrieved 2026-10-22)
138. Network International and Souhoola [P] — https://network.ae/news/network-international-partners-with-souhoola-to-power-bnpl-acceptance-on-its-networkpay-point-of-sale-devices-boosting-financial-inclusion-in-egypt (retrieved 2026-10-22)
139. Wamda, Fawry and Contact BNPL [S] — https://www.wamda.com/2025/03/fawry-partners-contact-broaden-bnpl-services-egypt (retrieved 2026-10-22)
140. Crowdfund Insider, Contact and Kashier [S] — https://www.crowdfundinsider.com/2025/07/244588-egypts-contact-creditech-partners-with-kashier-to-expand-bnpl-offering/ (retrieved 2026-10-22)
141. Gulf Business, Talabat 2025 results [S] — https://gulfbusiness.com/en/2026/food-industry/talabat-posts-2025-results/ (retrieved 2026-10-22)
142. Wamda, Careem invests in elmenus [S] — https://wamda.com/2022/02/careem-invests-egypt-elmenus (retrieved 2026-10-22)
143. Enterprise, delivery-app commissions in Egypt (2021) [S] — https://enterpriseam.com/egypt/2021/10/13/are-restaurant-delivery-apps-a-modern-day-mafia-in-egypt-and-abroad/ (retrieved 2026-10-22)
144. Youm7, Competition Authority ruling on a delivery platform (May 2022) [S] — https://www.youm7.com/story/2022/5/26/حماية-المنافسة-يقرر-ثبوت-مخالفة-إحدى-الشركات-العاملة-بقطاع-منصات/5776906 (retrieved 2026-10-22)
145. Ahram Online, EGP about 51/$ (23 Aug 2026) [S] — https://english.ahram.org.eg/News/575125.aspx (retrieved 2026-10-22)

**Moving POS (own pages)**

146. Moving POS pricing [P] — https://pos.movingsystems.tech/en/pricing (retrieved 2026-10-22)
147. Moving POS, Foodics alternative [P] — https://pos.movingsystems.tech/en/foodics-alternative (retrieved 2026-10-22)
148. Moving POS accounting trial [P] — https://pos.movingsystems.tech/en/accounting-trial (retrieved 2026-10-22)
149. Moving POS, ETA e-invoicing [P] — https://pos.movingsystems.tech/en/eta-einvoicing (retrieved 2026-10-22)

**Other**

150. Crowdfund Insider, Foodics 3 years in Egypt (Sep 2023) [S] — https://www.crowdfundinsider.com/2023/09/213081-mena-region-payments-and-restaurant-management-platform-foodics-marks-3-years-of-operations-in-egypt/ (retrieved 2026-10-22)
151. Barchart, Lightspeed Q4 call highlights [S] — https://www.barchart.com/story/news/2087520/lightspeed-commerce-q4-earnings-call-highlights (retrieved 2026-10-22)
