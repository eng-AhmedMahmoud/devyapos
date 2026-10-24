<!-- Snapshot of origin/main of devya-pos and devyapos, 2026-10-22. This repository is public: the reference client is never named, and contract terms stay in the private product repo. -->

# Moving POS (formerly DevyaPOS) — shipped capability vs proven POS business models

Snapshot: origin/main exports, read 2026-10-22. Read-only analysis.

Path prefixes:
- `devya-pos:` is the product monorepo (GitHub eng-AhmedMahmoud/devya-pos, private).
- `devyapos:` is the marketing site (pos.movingsystems.tech).
- `moving-landing:` is the umbrella site and help centre.

`content/en.ts` line numbers are given for devyapos. `content/ar.ts` mirrors them about 4 lines lower.

Status key:
- **Shipped** means code exists and its feature flag is `status: 'shipped'`.
- **Partial** means code exists but is gated, demo-only, pilot, or missing a piece the business model needs.
- **Missing** means not found after grepping backend, every app, the shells, `packages/`, `ops-*` and `docs/`.

Feature-flag facts (`devya-pos:packages/shared/src/feature-flags.ts`):
- The catalogue has 60 keys: 35 are `status: 'shipped'` and 25 are `status: 'planned'`. A planned flag is a switch with no code behind it.
- Nineteen keys are never read anywhere outside the catalogue:
  - reorder, digitalReceipt, guestFeedback, guestNotifications
  - scheduledOrders, upsellPrompts, daypartPricing
  - all five crm* flags
  - kitchenStations, prepSla, offlinePos
  - cashVarianceAlerts, ownerDigest, staffScheduling
  - autoPurchasing, deliveryDispatch, hr.biometric

---

## Summary table

| # | Dimension | Product | Marketing site | Key evidence |
|---|---|---|---|---|
| 1 | SaaS tiers, enforcement, billing, trial | **Partial.** Tiers are described but not enforced. The only runtime gate is per-tenant feature flags set by hand. No billing, subscription records or usage limits. No POS signup or trial. The accounting trial pool is shipped. | **Partial, out of date.** Publishes the RETIRED Growth/Scale/Enterprise ladder (199 / 499 / Custom) with a 14-day trial CTA. The CTA goes to `/contact`; it is not self-serve. A self-serve trial exists for accounting only. | `devya-pos:ops-app/lib/plans.ts:12-39,855-987`; `devya-pos:backend/src/features/features.guard.ts`; `devya-pos:ops-store/prisma/schema.prisma:20-31,169-234`; `devyapos:content/en.ts:442-585`; `devyapos:lib/trial.ts` |
| 2 | Per-branch / per-device pricing | **Partial.** The branch is the commercial unit on paper and in the contract. No metering and no branch limit. `Device` is MDM enrolment per staff user, not a billable seat. | **Consistent:** flat per branch, "no per-terminal fee", "unlimited branches". It omits the contract's hosting and app-store fees. | `devya-pos:backend/prisma/schema.prisma` (`model Device` :3108); the service agreement (private, `docs/contracts/`); `devyapos:content/en.ts:347,504,1353` |
| 3 | Payment processing | **Partial.** Online rails: Paymob (EG), Moyasar (KSA) or none. At the till, card is a standalone-terminal tender plus a reference. Split tender is shipped. No integrated terminal or softPOS, no Geidea/Fawry/PayTabs, and no payment margin captured. | **Overclaims.** "Paymob is live today, and Fawry, Kashier, Geidea, OPay or PayTabs get wired… on request"; "cards, wallets, instalments". | `devya-pos:backend/src/payments/payment-provider.ts:4`; `devya-pos:backend/prisma/schema.prisma:48` (`enum PaymentMethod`); `devyapos:content/en.ts:222,908` |
| 4 | Hardware | **Partial.** Shells for iPad, iPhone, Android and Electron desktop (unsigned). KDS and customer display are shipped. Printing is 80mm only, to a LAN Epson/ESC-POS printer. No cash-drawer kick, no scale or barcode at the till, no hardware SKUs. | Bring your own device; sells no hardware. **Overclaims** "80mm or 58mm, network or USB" and drawer kick-out. | `devya-pos:pos-app/lib/print-layout.ts` (576 dots, 80mm); `devya-pos:pos-shell-desktop/README.md:139-155`; `devyapos:content/en.ts:1364-1384,1444` |
| 5 | Marketplace / public API / webhooks | **API Shipped; marketplace Missing.** Scoped API keys, read-only `/v1` endpoints, commerce order write, and HMAC-signed webhooks for 6 events. The API sits only in the Group tier in code. | "API and webhooks" is listed in **Scale (499)**. The Foodics page says "API access inside the price". | `devya-pos:backend/src/api-keys/public-api.controller.ts:73-143`; `devya-pos:backend/src/webhooks/webhook-events.ts`; `devya-pos:ops-app/lib/plans.ts:969-979`; `devyapos:content/en.ts:551,1314` |
| 6 | Loyalty, wallet, gift cards, coupons, promotions, marketing | **Mixed.** Points loyalty, coupons, promotions and gift cards are shipped. Member wallet is built but opt-in and catalogued as "planned". There are **no tiers and no referrals**. Guest notifications are "planned". WhatsApp is not built. CRM campaigns are simulated. Campaigns reach Loyalty Garden iPhone members only. | **Overclaims:** "Loyalty, points and tiers", Bronze→Platinum, bring-a-friend, "Customer notifications and campaigns". It does not market gift cards, promotions or wallet. | `devya-pos:backend/src/loyalty/` (6 routes, no tier); `devya-pos:backend/src/garden-network/garden-campaigns.controller.ts`; `devya-pos:crm-app/app/api/campaigns/[id]/send/route.ts:27-31`; `devyapos:content/en.ts:213-217,530-532,1001-1009` |
| 7 | Inventory, recipes, supply, transfers, central kitchen | **Shipped (POS inventory, transfers); Partial (purchasing, central kitchen).** Supply-app is demo-only and being folded into accounting-app, which holds the production module (central kitchen). | Claims recipe inventory, food cost and waste. Does not market purchasing, transfers, warehouse or central kitchen. | `devya-pos:backend/src/inventory/`; `devya-pos:backend/src/transfers/` (34 files, 9.9k LOC); `devya-pos:docs/decisions/2026-10-15-supply-chain-is-an-accounting-module.md`; `devya-pos:accounting-app/app/api/supply/production/route.ts:28` |
| 8 | Online ordering, QR, aggregators, Commerce link | **Partial.**<br>Shipped: own shop-app (pickup and delivery) and QR **pay**-at-table.<br>Missing: ordering at the table; aggregator API integrations (aggregator orders are re-keyed into the till); rider dispatch.<br>Partial: the Devya Commerce link (pilot) is built. | Ordering site with 0% commission, "scan and order". The Foodics page claims "delivery integrations". The Stores link appears only on the umbrella site. | `devya-pos:backend/src/orders/dto/create-pos-order.dto.ts:237`; `devya-pos:backend/src/commerce-link/`; `devya-pos:docs/decisions/2026-10-08-devya-commerce-link.md`; `devyapos:content/en.ts:619,1314`; `moving-landing:content/en.ts:201-213` |
| 9 | E-invoicing (ETA / ZATCA) | **ZATCA Phase 2 Shipped in the POS.** Production is gated on in-Kingdom hosting.<br>**ETA from the POS: Missing.** ETA e-invoice and e-receipt are **Partial**, in accounting-app only. They need a taxpayer-run signing agent, which is not in the repo. POS sales reach accounting as daily aggregates, not as per-order receipts. | `/eta-einvoicing` honestly says the POS does not submit. The accounting pricing claims "ETA e-invoice and e-receipt… ZATCA Phase 2 in every plan". POS ZATCA is not marketed on the POS site. | `devya-pos:backend/src/zatca/` (41 files, 7.3k LOC); `devya-pos:accounting-app/lib/eta/`; `devya-pos:backend/src/accounting/day-close-payload.ts:372`; `devyapos:content/en.ts:1104,1618-1651` |
| 10 | Financing / capital / BNPL | **Missing.** | Missing; only the word "instalments" appears (:908). | Grep for capital, loan, advance, bnpl, valU, Tabby, Tamara, Souhoola, Sympl: no matches in product code |
| 11 | Analytics, reports, AI | **Shipped.**<br>Reports: 9 report routes plus CSV.<br>Insights: forecast, reorder, costing, delivery margin, shift close, themes.<br>AI assistant: chat, voice notes, live voice, approved actions, briefings.<br>Not built: no hourly or peak-hours sales report; owner digest and variance alerts are "planned". | Claims "best sellers, **peak hours**, ingredient usage, food cost". The POS AI assistant is not marketed. | `devya-pos:backend/src/reports/reports.controller.ts`; `devya-pos:backend/src/insights/`; `devya-pos:backend/src/assistant/` (30 routes); `devyapos:content/en.ts:229,1029` |
| 12 | White-label, multi-brand, reseller, referral, affiliate | **White-label and multi-brand Shipped. Reseller, partner, referral and affiliate Missing.** | "Your brand, never ours"; cloud-kitchen multi-brand. No partner, referral or affiliate programme. | `devya-pos:docs/guides/white-label.md`; `devya-pos:backend/src/brands/`; flag `multiBrand`; `devyapos:content/en.ts:474-480,928-929` |
| 13 | Onboarding and activation | **Partial, operator-led.**<br>Missing: signup route, POS trial, menu import UI (seed JSON by an engineer).<br>Present: HR CSV import, ERPNext→accounting import, demo tenants, Arabic PDF guides.<br>**One live POS client.** | "We load every item… free", free migration, 15-minute demo, help centre on moving-landing. The help centre says there is no self-signup and no self-serve POS trial. | `devya-pos:docs/guides/white-label.md:366-500`; `devya-pos:backend/src/auth/` (login only); `moving-landing:content/docs/en/parts/faq-pos.ts:103` |
| 14 | HR, accounting, CRM, garden, other add-ons | **Shipped as products, mostly unsold.**<br>HR: 15k LOC, live for the reference client.<br>Accounting: standalone, priced, with a trial pool.<br>CRM: separate, connected to nothing.<br>Also Loyalty Garden iOS and network, support calls, AI voice, MDM. | Only accounting is marketed (page and pricing). HR, CRM and garden are absent from the POS site. | `devya-pos:backend/src/hr/`; `devya-pos:hr-app/`; `devya-pos:accounting-app/`; `devya-pos:crm-app/`; `devya-pos:garden-ios/`; `devyapos:app/[locale]/accounting-trial/page.tsx` |

---

## Per-dimension detail

### 1. SaaS tiers, enforcement, billing, control plane, trial

**Product**

**Tiers are defined in `devya-pos:ops-app/lib/plans.ts`.**
- Active tiers (`PLANS`, :855-987):
  - **Counter**, EGP 199/branch/month: modules pos, kds, menu, reports, shop, delivery, loyalty, promotions, inventory, permissions, multibranch.
  - **Dining room**, EGP 499: Counter plus dinein and giftcards, with flags tableService, coursing, splitBill, dineInQr, waiterFlow and giftCards.
  - **Group**, `pricePerBranchEgp: null`, quoted per deal: adds supply, hr, accounting, api and mdm, and every catalogue key except `NEVER_IN_A_TIER` (:845).
- Retired tiers kept for id stability: **Growth 199, Scale 499, Enterprise null** (:990-1097).
- `TenantSubscription { planId, addOns }` lives at :1136 and `SUBSCRIPTIONS` at :1171:
  - The reference client is on Counter with no add-ons.
  - Demo is on Group with add-ons crm, handheld, guestcalls, gardenapp and insights.
- **The file says outright that it enforces nothing** (:12-29): "Nothing here gates anything at runtime." Its header (:31-39) records that the site "still publishes the RETIRED Growth / Scale / Enterprise ladder".

**`devya-pos:docs/specs/ops-console-spec.md:467-475` is stale.** It says "No price has been agreed for any of the three". `plans.ts:801-822` says they were priced on 2026-09-19.

**The only runtime enforcement is feature flags.**
- One `Setting` row per tenant holds `features` (`devya-pos:backend/prisma/schema.prisma:1939`).
- It is enforced by `FeaturesGuard` (`devya-pos:backend/src/features/features.guard.ts:31`) and `@RequireFeature` (`require-feature.decorator.ts`).
- The operator writes it from the console's `/capabilities` page over a per-stack `OPS_API_TOKEN`. The guard behind that is `devya-pos:backend/src/features/session-or-ops-token.guard.ts`.
- "Apply tier" writes the preset (`presetKeysFor`, plans.ts:1278).

**Control plane (`devya-pos:ops-store/`, NestJS + Postgres).**
- The schema (`ops-store/prisma/schema.prisma`) has:
  - `Tier` (:20): composable tier → feature keys.
  - `HostSample`, `HostAlert` and `HostAssessment`: host monitoring.
  - `TrialStack` and `TrialLead` (:169-234): the trial pool.
- **No billing, invoice, payment, subscription-status, dunning or usage table exists anywhere.**
- A grep of `backend/src` for stripe, subscription, licen[cs]e, billing, maxBranches, seatLimit and deviceLimit returned nothing.
- In practice billing is manual: the reference client's contract is invoiced monthly and paid by bank transfer, instant payment or cash (the service agreement in the product repo's `docs/contracts/`).

**POS trial and signup: Missing.**
- `backend/src/auth` exposes only login, logout, me and the suite/commerce/supply handoffs. None of the 602 backend routes is a signup or tenant-provisioning route.
- The help centre confirms it: "There is no self-signup and no self-serve POS trial" (`moving-landing:content/docs/en/parts/faq-pos.ts:103`).

**Accounting trial: Shipped.**
- `POST /api/trial/claim` (`devya-pos:ops-store/src/trial/routes.ts`) hands out a pre-provisioned, empty accounting stack from a warm pool. Pools exist for EG and SA.
- Durations come from `pool.ts:34,41,51`: `DEFAULT_TRIAL_DAYS = 14`, a 7-day reap grace, and 365-day lead retention.
- If the pool is empty, the lead is stored as `POOL_EMPTY` for sales to follow up.
- A trial banner shows inside the app (`accounting-app/lib/trial-banner.ts`).
- Plan limits are not enforced: there are no user, branch or AI-capture quotas in `accounting-app/lib`.

**Site**
- Publishes Growth, Scale and Enterprise (`devyapos:content/en.ts:442-585`). See "Published pricing" below.
- Every "Start your free trial" CTA links to `/contact` (`components/home/Hero.tsx:50`, `Header.tsx:106,175`, `Pricing.tsx:196`, `Steps.tsx:53`, `CtaBand.tsx:72`).
- `devyapos:lib/trial.ts` is the accounting trial only:
  - It validates name, company, email, phone and country (EG|SA).
  - It POSTs from the browser to `NEXT_PUBLIC_TRIAL_CLAIM_URL`, which is `https://ops-api.devya.dev/api/trial/claim` (`devyapos:docker-compose.prod.yml:10`; ADR `devyapos:docs/decisions/0003-trial-posts-direct-to-ops-api.md`).
  - A 201 answer gives `{url, setupUrl, setupToken, expiresAt}`.
  - The 409 codes are `POOL_EMPTY` and `ALREADY_HAS_TRIAL`. A 503 means trials are closed.
  - Fallback: WhatsApp `[P-trial]`.

**Unbacked site claims**
- "Try 14 days free" on a POS plan: no POS trial mechanism exists.
- "Change or cancel any time, and export all of your data" (:584): there is no self-serve cancel, and the help centre says a full export is requested in writing.
- Yearly billing "Save 30%" (:448): no annual-billing concept exists in code.

### 2. Per-location and per-register pricing mechanics

**Product**
- The branch is the price unit in `plans.ts` (`pricePerBranchEgp`) and in the reference client's contract, which also charges a monthly hosting fee and a yearly app-store account fee and ties a yearly uplift to the SLA (terms in the private product repo, `docs/contracts/`).
- No metering of branch count and no branch cap. `backend/src/branches` (7 routes) has no limit or quota logic.
- `BranchKind` is OUTLET or WAREHOUSE (`schema.prisma:5673`).
- Devices:
  - `model Device` (`schema.prisma:3108`) is per-staff-user MDM enrolment: platform, fingerprint, policy, compliance, revoke/wipe.
  - Routes: enrol, check-in, commands, policies (`devya-pos:backend/src/devices/devices.controller.ts`).
  - It is security tier 1 (`devya-pos:docs/specs/mdm-spec.md`), not a register licence. Nothing counts or prices devices.

**Site**
- Flat per branch, "no per-terminal fee" (:347, :504).
- "A second register is a second device with the browser open" (:1353).
- "Unlimited branches" (:99, :120, :208).
- "No setup fee or device fee" (:1352).

**Gap**
- The live contract charges a hosting fee and an app-store account fee that the site does not mention.
- No per-register monetisation, the per-terminal add-on lever Foodics uses, exists in code or copy.

### 3. Payment processing

**Product**
- Rail port: `devya-pos:backend/src/payments/payment-provider.ts`, selected per tenant by `PAYMENT_PROVIDER`. Implementations:
  - `paymob.provider.ts`: Intention API plus Unified Checkout, HMAC webhooks. Wallet integration ids such as Vodafone Cash appear in a comment at :28.
  - `moyasar.provider.ts`: KSA mada, cards and Apple Pay through a hosted invoice (`devya-pos:docs/decisions/2026-09-27-saudi-payment-rail.md`; D8 says refunds are a dashboard action).
  - `none.provider.ts`.
- Header comment, `payment-provider.ts:4`: "**Paymob is not confirmed for a single client**".
- The rails are used by shop-app checkout, dine-in pay-at-table (`dine-in/` `POST /dine-in/pay`) and wallet top-ups (`wallet-topup-payment.service.ts`).
- Till tenders (`enum PaymentMethod`, `schema.prisma:48`):
  - CASH.
  - **CARD_TERMINAL**: a standalone card machine; only the reference is stored in `OrderPayment`, `schema.prisma:1670-1680`.
  - INSTAPAY.
  - **SPLIT**: cash plus card/InstaPay slices, at most one cash slice (`backend/src/orders/orders.service.ts:649,854`; `devya-pos:docs/decisions/2026-09-14-one-payment-one-bucket.md`).
  - GIFT_CARD.
  - EXTERNAL_PREPAID: Commerce-store paid.
  - DEFERRED: retired.
- **No integrated terminal, softPOS or tap-to-pay.** Grep for Geidea, NearPay, softpos, tap to pay, Ingenico, PAX and Sunmi found nothing in code. Geidea and PayTabs appear only in docs as unbuilt alternatives (`saudi-payment-rail.md` D1 :21).
- **No margin capture.** There is no platform fee, sub-merchant, commission or merchant-of-record logic. The merchant contracts with the gateway directly, and the contract makes gateway commissions the client's cost (§7.1b).

**Site**
- "Paymob is live today, and Fawry, Kashier, Geidea, OPay or PayTabs get wired to your account on request" (:222; also :911-919, :1056).
- "Cards, wallets, instalments and cash" (:908).
- The Foodics page concedes "we integrate with your own gateway instead" (:1288).
- The help centre contradicts the site:
  - Fawry, Kashier, Geidea or PayTabs: "No" (`moving-landing:content/docs/en/parts/integrations-pos.ts:95-96`, `faq-pos.ts:179`).
  - Does the card machine connect to the POS? "No" (`faq-pos.ts:67`).

**Unbacked site claims**
- Five additional gateways "on request" (no adapters).
- Instalments (not configured).
- "Paymob is live today" (the code comment says it is unconfirmed for any client).

### 4. Hardware

**Product**
- Shells:
  - `pos-shell/` (iPad, Swift, Epson ePOS SDK through native URLSession).
  - `pos-shell-iphone/`.
  - `pos-shell-android/`: Kotlin; LAN ePOS or raw ESC/POS; kiosk/terminal mode (`TerminalMode.kt`); "never prints a ZATCA invoice without its QR".
  - `pos-shell-desktop/`: Electron; LAN printer plus silent `window.print()` to a USB/driver printer. Builds are **unsigned** (no Developer ID or Authenticode), per `README.md:139-155`.
  - `admin-shell-iphone/`.
- KDS: `pos-app/app/kds/page.tsx`, a Socket.IO room per branch. `kitchenStations` and `prepSla` are planned.
- Customer display: shipped and opt-in.
  - Code: `backend/src/customer-display/` (pairing plus gateway) and `pos-app/lib/display-client.ts`.
  - Rationale: `docs/decisions/2026-09-18-customer-display-pairing.md`.
  - It is in `NEVER_IN_A_TIER`, so it is sold only as an add-on.
- Paper: **80mm only**. `pos-app/lib/print-layout.ts` uses 576 dots, as do `ReceiptPrint.tsx` and `KitchenTicketPrint.tsx`. No 58mm layout.
- **Cash drawer kick: not implemented.** No `addPulse` or ESC p call in app or shell code; `addPulse` appears only in the vendored `pos-app/public/epos-2.27.0.js`.
- No weighing scale, no barcode-scanner sell flow (barcode appears only in accounting supply), no self-order kiosk, no label printer.
- Offline: `offlinePos` is **planned** (`feature-flags.ts:505`). The help centre says "every sale is a live server call" (`faq-pos.ts:33`).
- Field docs: `devya-pos:docs/printer-troubleshooting-ar.md`, `docs/guides/printer-dhcp-reservation-ar.pdf`.

**Site**
- Bring your own device: Android or iPad of 10 inches or more (:1364).
- "80mm or 58mm, network or USB, from any brand that speaks ESC/POS" (:1369).
- KDS on any screen (:1374).
- "Drawers that open from the printer's kick-out port carry on working" (:1384).
- "We do not sell hardware, resell it, or take a commission" (:1444).
- "Scale/Enterprise can host inside the restaurant" (:607, :1459).
- JSON-LD `operatingSystem` lists Windows and macOS (`devyapos:lib/jsonld.ts:158`).

**Unbacked site claims**
- 58mm paper.
- USB printing from a browser (it works only through the unsigned desktop shell).
- Drawer kick.
- On-prem or in-restaurant hosting: only a per-tenant VPS compose model is documented.
- Windows/macOS as production-ready: the help centre says the desktop app "isn't ready".

**Model gap:** no hardware revenue (bundles, leasing, certified-device list) and no integrated payment hardware.

### 5. Add-on marketplace, public API, webhooks, API keys

**Product (flag `publicApi`, shipped)**
- `backend/src/api-keys/`:
  - Keys are scoped, capped by the staff account behind them and pinnable to a branch.
  - Read API: `GET /v1/me`, `/v1/orders`, `/v1/orders/:id`, `/v1/branches`, `/v1/catalog` (`public-api.controller.ts:73-124`).
  - `GET /v1/menu` requires the `commerceLink` flag.
  - Write API needs `commerceLink` too: `POST /v1/orders/quote`, `/v1/orders`, `/v1/orders/:id/cancel` (`commerce-orders.controller.ts`).
  - Pairing: `/v1/commerce-link/claim|revoke|ping`.
- `backend/src/webhooks/`:
  - Events: order.created, order.paid, order.status_changed, order.completed, menu.changed, stock.low.
  - Signed (`webhook-signature.ts`) and retried (`webhook-retry.ts`), with a dead-letter list in the admin controller.
- Swagger/OpenAPI is a dev/staging aid only (`backend/src/main.ts:159-164`).
- Tier mapping: the `api` module is only in **Group** (`plans.ts:978`).
- **Marketplace: Missing**, and it is ruled out on purpose: "A marketplace… the storefront is not" (`devya-pos:docs/plans/2026-09-09-foodics-benchmark.md` §4). There is no third-party app model, OAuth or revenue share.

**Site**
- "API and webhooks" is a feature card (:1076-1079) and a **Scale** line item (:551).
- Foodics page: "Loyalty, API access, delivery integrations and reporting are inside the price here" (:1314).
- It concedes Foodics' 100+ app marketplace (:1292).

**Mismatches**
- The site sells the API at 499 (Scale), while the product sells it only in Group (quoted).
- "Inside the price" on the Foodics page implies 199 includes the API.

### 6. Loyalty, wallet, gift cards, coupons, promotions, marketing

**Product**
- **Loyalty: points only.**
  - Routes in `backend/src/loyalty/`: program GET/PUT, quote, summary, adjust, liability.
  - Ledger: `model LoyaltyLedgerEntry` (`schema.prisma:3592`), booked as a liability (`docs/decisions/2026-09-18-loyalty-points-are-a-liability.md`).
  - QR claim and branch offers: `docs/plans/2026-10-17-loyalty-qr-claim-and-branch-offers.md`.
  - **No tiers.** The only "tier" match in `backend/src/loyalty` is a spec file.
  - **No referrals.** "referral" matches only navigation referrer code.
- **Loyalty Garden** (gamified points), flags `garden`, `gardenNetwork` and `gardenAppOnly`:
  - `garden-app/`; `garden-ios/` (README: "on the App Store in Egypt and Saudi Arabia"); `garden-network/` (accounts and push).
  - Campaigns: `backend/src/garden-network/garden-campaigns.controller.ts`, with schedule, preview-count and stats. These are push to Garden iPhone app members only.
  - Behaviour analytics: `backend/src/behavior/`, flag `behaviorTracking`.
- **Gift cards: Shipped.**
  - Code: `backend/src/gift-cards/` (sell, by-code, void, liability, limits) and `model GiftCard` (`schema.prisma:3722`).
  - Tiered into Dining room.
  - Accounting: `docs/decisions/2026-09-18-gift-card-liability-ledger.md`.
- **Member wallet: built, opt-in.**
  - Code: `backend/src/member-wallet/`, 798 LOC (`/garden/wallet`, top-ups through the tenant's rail).
  - The catalogue still says `status: 'planned'` (`feature-flags.ts:574`).
  - VAT rules: `docs/decisions/2026-09-19-stored-value-and-vat.md`.
- **Coupons: Shipped** (`backend/src/coupons/`). **Promotions: Shipped**, with scheduled category %, spend threshold and BOGO (`backend/src/promotions/`, flag `promotions`).
- **Guest notifications:** `guestNotifications` is planned and never read. Shop order tracking is a live page, not a push.
- **WhatsApp: Missing.**
  - There is no WhatsApp module in `backend/src/app.module.ts`.
  - `backend/src/whatsapp/` holds only `whatsapp-signature.ts`, `egyptian-phone.ts` and an RTL probe Flow JSON (`flows/README.md`: "run this before building anything else").
  - The ordering plans are "Status: proposed" (`docs/plans/2026-09-22-whatsapp-ai-ordering.md`, `2026-09-23-whatsapp-per-client-numbers.md`; economics in `2026-09-25-whatsapp-ordering-unit-economics.md`).
  - Devya's own `support-bot/` is a WhatsApp support line for Devya, not a tenant feature.
- **Marketing module:** `backend/src/marketing/` is only the one-tap opt-out (`GET|POST /marketing/:token`).
- **CRM campaigns are simulated.** `crm-app/app/api/campaigns/[id]/send/route.ts:27-31` says "Nothing here talks to WhatsApp/SMS/email". `crmCampaigns` is planned.

**Site**
- "Loyalty, points and tiers… Bronze → Silver → Gold → Platinum… bring friends… +50% retention" (:213-217, :1001-1002).
- "Customer notifications and campaigns" is a Growth line (:532). "Push notifications and campaigns" (:332, :1008-1009).
- Coupons (:255, :530).
- Gift cards, wallet and promotions are **not mentioned**.
- The site's own SEO audit admits "the product is points only" (`devyapos:docs/seo/audit-2026-10-22.md:172-180`).
- `devyapos:docs/social-launch-plan.md:47-66` lists these claims as non-existent.
- The umbrella repeats tiers, referrals and campaigns (`moving-landing:content/en.ts:91-97,170,217`), against its own comment at :8.

**Unbacked site claims:** loyalty tiers, referrals, guest push/campaigns, "+50% retention".

### 7. Inventory, recipes/BOM, purchasing, transfers, multi-branch, central kitchen

**Product**
- **Recipe-driven inventory: Shipped.**
  - Models in `schema.prisma`: `Ingredient` :1057, `IngredientSupplierPrice` :1085, `RecipeItem` :1110, `StockMovement` :1130.
  - Routes in `backend/src/inventory/`: stock, low-stock, adjust, purchases, requests approve/fulfil/reject, analytics.
  - Auto-deduction on completed orders.
  - Reports: food-cost, ingredient-usage.
  - Insights: costing, uncosted, ingredient-pricing, reorder.
- **Multi-branch:** per-branch stock, per-branch variant prices (`/catalog/variants/:id/branch-prices`) and branch-scoped staff. A warehouse is a branch kind (`docs/decisions/2026-10-14-warehouse-is-a-branch-kind.md`).
- **Transfers: Shipped.**
  - Code: `backend/src/transfers/`, 34 files and 9.9k LOC. Models `TransferOrder`, `TransferLine`, `TransferTrip`, `TransferSchedule` and others (`schema.prisma:5792-6042`).
  - Flags: `inventoryTransfers` and `accountingTransfers` are shipped. `interBranchTransfers` is still "planned" but is referenced in `transfer-access.ts` and the POS composer.
  - Docs: `docs/specs/transfers-spec.md`, `docs/plans/2026-10-14-live-inventory-transfers.md`.
- **Purchasing and supply: Partial.**
  - `supply-app/` has its own 30-model schema and is **demo-only**: "no client stack has ever been wired to it". It is being retired into `accounting-app` (`docs/decisions/2026-10-15-supply-chain-is-an-accounting-module.md`).
  - accounting-app holds `Item`, `SupplierProfile`, `PurchaseOrder`, `GoodsReceipt` and `StockBatch`.
  - `supplyChain` (shipped) only surfaces the Supply KPIs on the POS dashboard.
  - `autoPurchasing` and `wasteLogging` are planned. Waste does exist in supply-app.
- **Central kitchen: Partial.** `accounting-app/app/api/supply/production/*` (plan, complete, cancel a prep run) is gated by `centralKitchen` (`route.ts:28`). It lives in the accounting product, not the POS.

**Site**
- Recipe-costed inventory, auto-deduction, food-cost and waste reporting, opening stock and counts (:198-202, :291, :546-548). These are Scale (499) features on the site, but Counter (199) features in the product.
- Purchasing, transfers, warehouse and central kitchen are not mentioned. Help-centre documentation exists for warehouses and transfers (`moving-landing:content/docs/en/branches.ts:42`, `pos-inventory.ts:260`).

### 8. Online ordering, QR/dine-in, delivery aggregators, Commerce link, omnichannel

**Product**
- **shop-app:** bilingual storefront with pickup or zoned delivery (`backend/src/zones`), coupons, cash or the online rail, and live tracking. Spec: `devya-pos:docs/specs/shop-app.md`.
- **web-app:** the first client's brand site (`web-app/CLAUDE.md`).
- `scheduledOrders` and `upsellPrompts` are planned and never read.
- **Dine-in QR: pay-only.**
  - `shop-app/lib/dine-in.ts`: "Pay at the table… the guest half".
  - `backend/src/dine-in/`: table codes, sessions, check, pay.
  - Guests cannot order from the table (help centre `faq-pos.ts:175`, `online-ordering.ts:229`).
  - Tables, coursing, split bill and waiter flow are shipped in the Dining room tier.
- **Delivery aggregators: manual channel, no API integration.**
  - `model DeliveryApp` (`schema.prisma:1991`) holds per-app markups, variant prices and exclusions.
  - The DTO says it is "Set when this order was phoned/relayed in from a third-party delivery app (Talabat/Elmenus-style)" (`backend/src/orders/dto/create-pos-order.dto.ts:237`).
  - `OrderChannel` is only POS or ONLINE.
  - No Talabat, Elmenus, Breadfast, Mrsool, Jahez, HungerStation or Keeta API code. Deliverect/Otter/UrbanPiper appear only in docs.
  - `deliveryDispatch` (riders) is planned. No rider or driver model exists.
- **Devya Commerce link (Moving Stores): Partial, pilot.**
  - Decision: `docs/decisions/2026-10-08-devya-commerce-link.md` ("accepted for P0 (the pilot)"; "P1 as built (2026-10-10)" at :156).
  - Code: `backend/src/commerce-link/` (pair, list, revoke) plus the keyed `/v1/commerce-link/*`, `/v1/menu` and `/v1/orders*`.
  - Supporting pieces: `EXTERNAL_PREPAID` tender, `menu.changed` webhook, `POST /auth/commerce-handoff` SSO.
  - Contracts: `docs/contracts/commerce/v1/*.schema.json`.
  - Flag `commerceLink` is opt-in and in no tier; it is sold as the `commerce` add-on.
- **Omnichannel:** menu sync goes out through `menu.changed` and the keyed menu. The POS stays the book of record and tax-invoice issuer (decision D7). There is no inventory sync to external channels beyond this.

**Site**
- Branded ordering site, pickup or zoned delivery, live tracking, QR menu, 0% commission (:191-195, :272-283, :330).
- "Scan and order straight from the browser" (:619) and a QR sticker on the table (:1379). This implies table ordering; the product offers pay-only.
- Aggregators are named only in the ROI tip: Talabat, Elmenus, Breadfast (:371).
- The Foodics page claims "delivery integrations… inside the price" (:1314).
- The Moving Stores ↔ POS link is not on the POS site. The umbrella claims a Stores→POS link with menu sourcing, online orders to the KDS and SSO (`moving-landing:content/en.ts:201-213`); this is backed by the pilot code.

**Unbacked site claims**
- QR order-at-table.
- "Delivery integrations" (the product has price lists, not integrations).

### 9. E-invoicing: Egypt ETA and KSA ZATCA

**ZATCA Phase 2 in the POS: Shipped**, flag `zatcaEInvoicing`.
- Code: `backend/src/zatca/`, 41 files and 7.3k LOC.
  - Signed, hash-chained simplified invoices.
  - Credit notes (`zatca-credit.service.ts`).
  - Onboarding and renewal of EGS units by Fatoora OTP (`zatca-onboarding.service.ts`, `zatca-renewal.service.ts`).
  - Submitter and dispatcher, archive, retention, VAT report CSV (`/zatca/vat-report/documents.csv`), monitor.
- Models: `ZatcaProfile` :5272, `ZatcaEgsUnit` :5299, `ZatcaDocument` :5359.
- QR printing in pos-app (`lib/zatca-receipt.ts`) and every shell.
- Sandbox compliance checks pass (`docs/decisions/2026-09-27-zatca-einvoicing.md:58`, `backend/scripts/zatca-sandbox-check.ts`).
- **Production is gated**: data residency must be confirmed "(the stacks run outside KSA)" (`docs/guides/zatca-go-live.md` §0; `docs/guides/ksa-client-onboarding.md`; a 2026-10-14 KSA hosting decision record).
- It is in no active POS tier list, so it is sold per tenant.

**ETA from the POS: Missing.**
- The POS has no ETA code.
- The day-close payload to accounting is one aggregate per branch per day.
- `backend/src/accounting/day-close-payload.ts:372` says "the VAT RETURN, when ETA e-invoicing lands, must be built from `Order.vatCents`… Logged as deferred".

**ETA in accounting-app: Partial.**
- `accounting-app/lib/eta/` contains:
  - `document.ts`: e-invoice, credit and debit notes, v1.0/v0.9.
  - `receipt.ts` and `pos.ts`: e-receipt per registered POS, UUID-chained.
  - `api.ts`, `cancel.ts`, `connection.ts`, `preprod-selftest.ts`.
- Migrations: `20261012…_sales_einvoicing`, `_eta_pos_preshared_key`.
- The v1.0 signature needs a **taxpayer-run signing agent** next to the USB token (`lib/eta/signer.ts` header). No agent implementation is in the repo.
- E-receipts are issued for documents in the accounting books. POS till sales are **not** fed per order, so "ETA e-receipt for that branch's tills" (`docs/decisions/2026-10-13-accounting-pricing.md:96-97`) is not backed end to end.
- The POS/Commerce → accounting e-invoice hub contract is "to be built in the accounting Wave B" (`docs/plans/2026-10-13-einvoicing-hub-contract.md:3-4`). The receiving side exists in `accounting-app/lib/hub/einvoice-request.ts`.

**Site**
- `/eta-einvoicing` is explicitly negative: "Moving POS is not an Egyptian Tax Authority e-invoicing integration… does not submit" (:1104), with no signature, no ETA reference and no date (:1162-1213).
- Accounting pricing: "E-invoicing is included in every plan: ETA e-invoice and e-receipt… ZATCA Phase 2" (:1618-1651). This is partially backed, by accounting-app only.
- POS ZATCA is **not marketed** on the POS site. It is documented in the help centre (`moving-landing:content/docs/en/parts/integrations-pos.ts:117-187`).

### 10. Financing, capital, BNPL

**Product: Missing.**
- Grep for merchant cash advance, revenue-based financing, working capital, loan, lending, bnpl, buy now pay later, instalment, valU, Souhoola, Tabby and Tamara found no matches in product code.
- The only matches are HR assignment wording and accounting chart-of-accounts templates.
- Payment data, which a financing product would underwrite, never touches Devya: merchants own their gateway accounts.

**Site: Missing**, apart from "instalments" in the payments line (:908).

### 11. Analytics, reports, insights, AI assistant

**Product**
- **Reports** (`backend/src/reports/reports.controller.ts`): `/reports/dashboard`, daily, monthly, product-mix, modifier-sales, food-cost, ingredient-usage, returns, profit-loss. CSV export (`reports/csv.ts`). Brand-scoped (`reports-brands.e2e-spec.ts`).
- **Insights** (`backend/src/insights/`, 39 files, 9.1k LOC):
  - forecast, reorder, costing, uncosted, ingredient-pricing, delivery-margin, shift-close, feedback-themes, returns-themes.
  - `companion/ask` (flag `aiCompanion`).
- **Assistant** (`backend/src/assistant/`, 64 files, 8.6k LOC, 30 routes): conversations and turns, approvals for drafted actions, briefings with audio, voice notes, live voice sessions.
- **Voice:** `ai-voice/` is a LiveKit Agents worker using Gemini Live.
- **Providers:** Gemini, Groq and Mistral fallback chain (`docs/decisions/2026-09-20-ai-provider-fallback-chain.md`).
- Flags `aiVoiceNotes`, `aiLiveVoice`, `aiActions` and `aiBriefing` are shipped and sold as the add-ons ai-voice, ai-actions and ai-briefing (`plans.ts` ModuleId; `docs/plans/2026-10-13-ai-assistant.md` D10).
- **Missing:**
  - No hourly or peak-hours sales report. Hour logic exists only for business-day windows and garden member visit patterns (`admin-app/app/garden/insights/page.tsx`).
  - `ownerDigest` and `cashVarianceAlerts` are planned and never read.
  - No ad-hoc BI.

**Site**
- "Best sellers, peak hours, ingredient usage and food cost per branch" (:229, :1029).
- The only AI mention is "AI bill captures" in accounting (:1617). The POS assistant is unmarketed.

**Unbacked site claim:** peak hours. The help centre says "no peak-hours report today" (`faq-pos.ts:223`).

### 12. White-label, multi-brand, reseller, partner, referral, affiliate

**Product**
- **White-label: Shipped.**
  - One deployment and one database per tenant.
  - Brand via `NEXT_PUBLIC_BRAND_*` env.
  - Operator-uploaded icon, OG image and logo (`ops-app` `/brand`, `backend/src/brand/`).
  - A CI gate keeps brand literals out of code (`scripts/check-tenant-isolation.sh`).
  - Docs: `docs/guides/white-label.md`, `docs/guides/tenant-isolation.md`.
- **Multi-brand per tenant: Shipped**, flag `multiBrand` (`backend/src/brands/`, `docs/decisions/2026-09-24-brand-is-a-scope-not-a-deployment.md`). This reverses the 2026-09-09 benchmark's "absent by design".
- **Reseller, partner, referral, affiliate: Missing.**
  - No model, route or doc.
  - "Partner" appears only for the first accounting client (a 2026-10-14 KSA hosting decision record).
  - "Reseller" appears only for a cloud region (`docs/guides/ksa-client-onboarding.md:33`).

**Site**
- "Your brand, never ours… Our name appears nowhere your customer looks" (:928-929).
- Cloud kitchens: "one kitchen, several brands", food cost per brand (:474-480).
- No partner, referral or affiliate programme (grep of content, app, lib and docs). Partner programmes appear only as competitor observations (`devyapos:docs/social-launch-plan.md:116,251`).

### 13. Onboarding and activation

**Product**
- **Operator-led provisioning** (`docs/guides/white-label.md:366-480`):
  1. Postgres per tenant.
  2. Seed JSON in `backend/prisma/seed-data-<client>/`: `tenant.json`, `menu.json`, `branches.json`, `ingredients.json`, `recipes.json`.
  3. Logos committed into each app.
  4. A deployment per app with brand env.
  5. Brand assets from the console.
  6. Flags from `/capabilities`.
- **No** signup route, no self-serve POS trial, and no menu, product or customer import endpoint or UI. The catalog routes are CRUD only.
- Import tools that do exist:
  - HR employee import (`POST /hr/employees/import/preview|commit`).
  - ERPNext → accounting (`accounting-app/scripts/import-erpnext.ts`, `docs/guides/erpnext-migration.md`).
  - Supply import script.
  - POS CSV ingest into accounting (`accounting-app/lib/pos-csv.ts`).
- Demo tenants: `demo` (`"features": "all"`) and `ksa-demo` (`backend/prisma/seed-data-demo/`, `seed-data-ksa-demo/`, `demo-*.ts`).
- Guidance:
  - Inline guidance audits: `docs/plans/2026-10-15-inline-guidance-audit-*.md`.
  - Arabic usage and HR guides: `docs/guides/*-ar.pdf|html`.
  - Live support calls: LiveKit, `backend/src/support-calls/`, flag `supportCalls`.
  - Devya WhatsApp support bot: `support-bot/`.
- **Traction:** "One live client today" (`docs/guides/white-label.md:481-500`), the reference client. A second pilot client was **decommissioned 2026-09-19** (`docs/ops/tenant-change-log.md`). The ops registry holds that client, demo and ksa-demo (`ops-app/lib/registry.ts`).

**Site**
- Done-for-you: "We load every item… free", gateway wired and tested, migration from an export (:303-318, :603). Free migration (compare :344).
- "Book a 15-minute demo" (:38).
- WhatsApp support on business days (:535, :796).
- Help docs are not linked from the POS site. They live at `moving-landing:content/docs/`, which states there is no self-signup (`parts/faq-pos.ts:103`, `getting-started-pos.ts:21,124`).

### 14. HR, accounting, CRM, garden, other add-on revenue lines

**HR / People**
- Code: `backend/src/hr/`, 80 files and 14.9k LOC, plus `hr-app/`.
- Flags shipped: hr.core, attendance, scheduling, payroll (Egyptian ruleset, `docs/decisions/2026-09-13-eg-payroll-ruleset.md`), tips, documents. Planned: hr.mobile, hr.biometric.
- Deployed for the reference client (`tenant-change-log.md`).
- In the Group tier. Not on the site.

**Accounting**
- Standalone `accounting-app/` with 94 Prisma models: double-entry, AP/AR, bank, FX, fixed assets, budgets, bill-capture AI, ETA, supply.
- Own trial pool and own price list (`docs/decisions/2026-10-13-accounting-pricing.md`).
- POS handoff by day-close (`accountingHandoff`).
- First client: a KSA business, via ERPNext migration.
- **The only add-on marketed** (`devyapos:app/[locale]/accounting-trial/page.tsx`; pricing at `content/en.ts:1598-1662`).

**CRM**
- `crm-app/` is a separate product, "connected to nothing else today" (`README.md`).
- Campaigns are simulated. A `deployment` enforcement add-on (`plans.ts`). Not on the site.

**Loyalty Garden**
- `garden-app/`, `garden-ios/`, `garden-network/` and `backend/src/garden*`.
- Sold as the `garden`/`gardenapp` modules. Not on the POS site; the umbrella names "Moving Loyalty" as a third product (`moving-landing:content/en.ts:55`).

**Other sellable modules in `plans.ts`:** support calls and guest calls (LiveKit), customer display, MDM, handheld (signed waiter apps), insights, commerce link, the AI add-ons.

---

## Published pricing (exact)

### POS — marketing site
Source: `devyapos:content/en.ts:442-585`; toggle in `devyapos:components/Pricing.tsx:14` (`YEARLY_RATE = 0.7`). Prices are EGP per branch per month, excluding VAT.

| Plan | Monthly | Yearly (−30%) | Includes | CTA |
|---|---|---|---|---|
| **Growth** ("Most chosen") | **199** | 139/month, 1,668/year | QR menu, ordering site with 0% commission, unlimited items/sizes, POS with shifts and drawer, KDS, zoned delivery, online payments + cash + coupons, "Loyalty, points and tiers", "Customer notifications and campaigns", sales and staff reports, AR/EN, WhatsApp support on business days (:516-536) | "Try 14 days free" → `/contact` |
| **Scale** | **499** | 349/month, 4,188/year | Growth + recipe-costed inventory, auto-deduction, food-cost and waste reports, custom role permissions, multi-branch console, **API and webhooks**, priority support + account manager (:539-552) | "Talk to us" |
| **Enterprise** | **Custom** | — | Scale + private or on-prem hosting, SLA, ERP integration, on-site training, custom contract (:556-569) | "Book a call" |

Terms and offers:
- "The trial runs 14 days with every feature and no credit card. Change or cancel any time, and export all of your data" (:584).
- "Founding offer: the first 50 restaurants lock this price for the life of their subscription" (:585).
- No setup or device fee (:1352). Free migration (:344).

Market anchor:
- "Foodics Basic Bundle 2,848.95 EGP (3,019.89 quarterly); Advanced 3,733.67 EGP", retrieved 2026-09-04 (:573-583).
- `devyapos:docs/social-launch-plan.md:210-221` and `devyapos:docs/xray/2026-10-22-xray.md:475-477` flag these figures as having no evidence on file.

Inconsistency: the hero says "from under 13 EGP a day per branch" (:99), but 199/30 is about 6.6. The social plan says "under 7".

### Accounting — marketing site
Source: `devyapos:content/en.ts:1598-1662`; yearly price = 10× monthly (`components/AccountingPricing.tsx:15`). VAT excluded.
- **Starter:** EGP 499 or SAR 119. 3 users, 1 branch, 50 AI captures.
- **Business:** EGP 999 or SAR 229. 8 users, 3 branches, 200 captures.
- **Professional:** EGP 1,999 or SAR 349. 15 users, 10 branches, 500 captures.
- **POS add-on:** EGP 299 or SAR 79 per branch per month.
- **Extras:** extra user EGP 99 or SAR 25; extra branch EGP 249 or SAR 49.
- E-invoicing is included in every plan.

These match `devya-pos:docs/decisions/2026-10-13-accounting-pricing.md:51-100`. None of the user, branch or capture caps is enforced in code.

### POS — the product's own packaging
Source: `devya-pos:ops-app/lib/plans.ts:855-987`.
- Counter **199**.
- Dining room **499**.
- Group **quoted**.

The site publishes the retired names, and its Growth/Scale feature split differs: the product's 199 tier includes inventory, permissions and multi-branch, and its 499 tier is the dine-in pack. `devyapos:docs/social-launch-plan.md:23-27` already uses Counter, Dining room and Group.

### Live client contract
The reference client's service agreement (private product repo, `docs/contracts/`) prices per branch per month close to Counter, plus a monthly hosting fee and a yearly app-store account fee, with a manual monthly invoice. Its figures are not reproduced here: this repository is public.

---

## Lead funnel
Sources: `devyapos:components/ContactForm.tsx`, `devyapos:app/api/lead/route.ts`, `devyapos:lib/lead-outbox.ts`, `devyapos:lib/brand.ts`.

**Contact form**
- Required fields: name, restaurant, Egyptian mobile. Optional: branches (1-500), message, and the plan id from the pricing CTA.
- `company` is a honeypot.
- UTM, referrer and landing path are sent only with consent.
- Three send paths:
  1. "Send my details" → `POST /api/lead`.
  2. "Send on WhatsApp" → wa.me with the composed text tagged `[P-form]`.
  3. "Send by email" → mailto `devya.solutions@gmail.com`.

**`/api/lead` handling**
- Rate limit: 12 per 10 minutes per IP.
- If `LEAD_FORWARD_URL` is set, it forwards contract v1 with a bearer token (`LEAD_FORWARD_TOKEN`) and retries once on 5xx. The payload carries the stale tag `site: "pos.devya.dev"` (:211).
- Otherwise it appends to `leads-outbox.jsonl` in `LEAD_OUTBOX_DIR=/data` (365-day retention; `scripts/leads.sh status|pull`). It returns 503 if both fail.
- **No CRM is chosen** (`devyapos:docs/decisions/0002-lead-outbox-and-jsonl-sinks.md:9`). The forward URL is not set in compose, so a VPS file is the system of record.
- No email, Telegram or Slack alert on a new lead.
- The site xray flags the lead file as not backed up (SEC-F2).

**Accounting trial signups** go straight to the ops-store (`TrialLead` table). Operators work them from the ops-app `/trials` page (`devya-pos:ops-app/app/(app)/trials/page.tsx`).

**WhatsApp**
- One number: **201041858781** (`devyapos:lib/brand.ts:39`). The same number is used for JSON-LD ContactPoint and `tel:`, and by the umbrella (`moving-landing:lib/brand.ts:27`).
- Every link carries a source tag `[P-<source>]` from `whatsappSources` (`devyapos:lib/brand.ts:101-120`). The sources are float, cta, pricing, home, contact, demo, form, foodics, hardware, eta, trial and quote.

## Site routes (devyapos)
Locales: `ar` (default) and `en`; `/` redirects to `/ar`.

**Pages** (`app/[locale]/…`):
- `/`, `/features`, `/how-it-works`, `/compare`, `/pricing`, `/about`, `/contact`
- `/eta-einvoicing`, `/foodics-alternative`, `/hardware`, `/accounting-trial`, `/privacy`
- `/terms` and `/refund` are reachable but `noindex` and kept out of the sitemap (`lib/routes.ts:54-58`). /refund is linked from the footer; /terms is not.

**API:** `POST /api/lead`, `POST /api/consent`, `GET /api/health`.

**Other:** `/llms.txt` (`app/llms.txt/route.ts`), `/robots.txt` (`app/robots.ts`), `/sitemap.xml` (`app/sitemap.ts`). The old host `pos.devya.dev` 301s to pos.movingsystems.tech (`deploy/nginx.conf`).

## Product docs on roadmap, plans, pricing and business
Docs found by grepping `devya-pos:docs/` for pricing, plan, tier, subscription, reseller, partner, referral and billing:

**Pricing, packaging and tiers**
- `docs/plans/2026-09-09-foodics-benchmark.md`: Foodics gap table (§2); Packs A (dine-in), B (commercial engine), C (platform surface/API) and D (segment packaging, no code); what not to copy (§4: marketplace, call centre, multi-brand, which was later reversed).
- `docs/specs/ops-console-spec.md` §7: the packages, and "Prices are `null` on purpose" (:467-475). This is stale against `plans.ts`.
- `docs/guides/feature-flags.md` and `docs/plans/2026-09-02-feature-flags-foundation.md`: flag catalogue, waves, `planned` vs `shipped`, the tier-preset rules.
- `docs/decisions/2026-10-13-accounting-pricing.md`: accounting EG/SA prices and the POS add-on, with competitor anchors (Wafeq, Qoyod, Rewaa, Foodics).
- `docs/decisions/2026-10-12-accounting-standalone-hosting-and-packaging.md`: one stack per client, warm trial pool (D1), e-invoicing in every package (D2).
- `docs/specs/devyapos-site.md`: the site spec. It still records Growth 199 / Scale 499 / Enterprise custom (:188-191). Moved out: `docs/DEVYAPOS-MOVED.md`.

**Contracts and client operations**
- `docs/contracts/` (the reference client's service agreement, EN/AR): the only live commercial terms (fees, SLA, uplift, exit).
- `docs/guides/white-label.md` and `docs/ops/tenant-change-log.md`: onboarding steps, tenants today, the pilot decommission.

**Integrations and channels**
- `docs/decisions/2026-10-08-devya-commerce-link.md` and `docs/contracts/commerce/`: the Commerce (Moving Stores) link.
- `docs/plans/2026-09-22-whatsapp-ai-ordering.md`, `2026-09-23-whatsapp-per-client-numbers.md`, `2026-09-25-whatsapp-ordering-unit-economics.md`, plus the Arabic HTML/PDF versions in `docs/guides/devyapos-whatsapp-*`: WhatsApp ordering (proposed).
- `docs/plans/2026-08-28-delivery-app-markup-options*.md`: aggregator price-list model.
- `docs/decisions/2026-09-04-payment-provider-port.md` and `2026-09-27-saudi-payment-rail.md`: payment rails; the alternatives were not built.

**KSA and e-invoicing**
- `docs/plans/2026-09-27-zatca-einvoicing.md` and `docs/decisions/2026-09-27-zatca-einvoicing.md`
- `docs/guides/zatca-go-live.md`, `docs/guides/ksa-client-onboarding.md`
- `docs/decisions/2026-10-03-ksa-compliance.md` and the 2026-10-14 KSA hosting decision
- `docs/plans/2026-10-12-accounting-standalone-einvoicing.md`, `2026-10-13-einvoicing-hub-contract.md`

**AI, garden and other**
- `docs/plans/2026-10-13-ai-assistant.md` (add-on modules D10), `2026-09-23-ai-integration-opportunities.md`
- `docs/plans/2026-10-08-devya-garden-ios.md`
- `docs/plans/2026-09-09-tenant-app-family.md`
- `docs/specs/mdm-spec.md` (device tiers 1 and 2)

**Not found:** no doc covers a reseller, partner, referral or affiliate programme, subscription billing or financing.
