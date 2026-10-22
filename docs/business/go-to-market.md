# Moving POS — go-to-market, channels, pricing and cross-sell

**Date:** 2026-10-22. Business-development view built on
[`market-research.md`](market-research.md) (bracketed numbers there are the
sources) and [`feature-map.md`](feature-map.md). The gap list it feeds is
[`gap-analysis.md`](gap-analysis.md). Prices, commissions and partner terms
here are recommendations for the owner, not decisions.

## 1. Where Moving POS can win

**The market in one paragraph.** Foodics is effectively the only scaled
restaurant POS selling in Egypt, at EGP 2,848.95 (Basic) and 3,733.67
(Advanced) per branch per month on annual billing, after a 15–17% rise in 2026
and the removal of its entry tier. Its Egyptian bundles include no kitchen
display, no card product and no accounting; online ordering, loyalty,
aggregator integrations and BI start at Advanced or cost extra; and it has no
native ETA e-receipt. Restaurants are inside the ETA e-receipt schedule since
2023 (Cairo, Alexandria) and 2024 (everywhere). Globally, POS companies make
most of their money on payments (Toast 82%, Lightspeed 66%), and POS-data
lending (Square, Foodics Capital 2.0) and partner channels are proven.

**Moving POS' edge, in the order a buyer feels it:**

1. **Price and shape.** Flat per branch, no per-terminal fee, KDS included —
   EGP 199 is about 7% of Foodics Basic for a counter operation.
2. **Built inside a 25-branch Egyptian chain**, Arabic-first, with recipe
   costing, multi-branch and permissions in the entry package.
3. **The rest of the back office in one place**: accounting with ETA/ZATCA,
   HR and payroll, supply, an AI assistant, and an online store (Moving
   Stores) that takes the menu from the till.
4. **Own-brand ordering with 0% commission** against 15–25% aggregator
   commission (and since 2022 the competition authority bars a dominant
   platform's price-parity clauses, so a restaurant may price its own channel
   lower).

**Where not to fight (yet):** hardware supply, an app marketplace,
merchant-of-record payments, Saudi restaurants before in-Kingdom hosting.

## 2. Ideal customer profiles

| ICP | Who | Package | Why they switch | Channel |
|---|---|---|---|---|
| A. Multi-branch counter chains (3–30 branches) | QSR, cafés, bakeries, juice bars | Counter | Foodics costs 14× per branch; recipe costing and multi-branch included | Founder network, partners, outbound |
| B. Cloud kitchens and multi-brand | 1–5 kitchens, several brands | Counter + multi-brand add-on | Brand as a scope, food cost per brand, own ordering per brand | Content, partners |
| C. Dining rooms | Casual and fine dining | Dining room | Tables, coursing, split bill, QR pay, waiter flow | Partners, demos |
| D. Groups | 30+ branches or several concepts | Group | HR, accounting, supply, API, devices in one contract | Founder-led sales |
| E. Accounting-first (EG + KSA) | SMEs needing ETA / ZATCA | Accounting trial | Self-serve trial, e-invoicing in every plan | Accountants, search |

## 3. Pricing recommendation

The packages are the product's (`devya-pos:ops-app/lib/plans.ts`, priced by
the owner on 2026-09-19). What the site has to do first is publish them
(P01). What the owner should decide next (P07):

| Package | Today (product) | Founding 50 | Recommended list price after the founding 50 | Anchor |
|---|---|---|---|---|
| Counter | EGP 199 / branch / month | 199, locked for life | **299** | Foodics Basic 2,848.95; local cashier software 199; Daftra 489.50 |
| Dining room | EGP 499 | 499, locked for life | **699** | Foodics Advanced 3,733.67 (the 2.5–2.8× service-model step holds) |
| Group | Quoted | Quoted | From **EGP 999 / branch**, quoted on branches and back-office modules | — |
| Yearly | −30% on the site | keep | **−2 months (≈17%)**, as accounting already does | Industry norm 15–20% |

**Add-ons** (sold per tenant today, unpriced in the product — quote them, and
publish once decided): Moving Stores (see §7), accounting (EGP 299 / SAR 79
per branch, already published), AI assistant (voice, actions, briefings),
customer display, signed handheld apps, Loyalty Garden app, CRM, multi-brand.

**Keep:** flat per branch, no per-terminal fee, no setup fee, free menu load
and migration. These are the differentiators; Foodics' price rise shows
Egyptian chains accept higher prices, but the wedge is the gap, not the floor.

## 4. Revenue lines, in the order to open them

| # | Line | Model proven by | Needs | Gap |
|---|---|---|---|---|
| 1 | Subscriptions (per branch) | Foodics, Square, Lightspeed | Billing and enforcement in the product; the right packages on the site | P01, P07, P10 |
| 2 | Add-ons | Foodics add-ons, Loyverse, Square KDS | Published add-on prices | P01 |
| 3 | Moving Stores bundle | Foodics Online, Shopify POS | Cross-sell both ways | P02, P23 |
| 4 | Payments revenue share | Toast 82%, Lightspeed 66%, Foodics Pay | Paymob / Kashier / Geidea referral or rev-share; SoftPOS (CBE-approved Feb 2026) | P13 |
| 5 | Accounting + e-invoicing | Foodics (ZATCA accounting in KSA Basic), Daftra, Qoyod, Wafeq | ETA e-receipt from the POS; KSA hosting | P14, P09 |
| 6 | Hardware referral | Foodics Forward Together, Rewaa kits | A dealer partner | P08 |
| 7 | Financing referral | Square Loans, Foodics Capital 2.0, Fawry MSME, valU | A lender partner; data sharing with consent | P21 |

## 5. Channels

**5.1 Founder-led and the reference chain.** The 25-branch chain is the proof
(never named). Owner-to-owner WhatsApp outreach with the pricing post is the
highest-yield month-one action (`docs/social-launch-plan.md` §4.1).

**5.2 Partners** (`/partners`, P03; terms for the owner to confirm):

| Programme | Who | Proposed terms | Benchmarks |
|---|---|---|---|
| Referral partner | Accountants, consultants, suppliers, agencies | 20% of the first 12 months' subscription of each referred restaurant, paid quarterly after the restaurant pays | Odoo 10–20% for 12 months; Shopify 20% recurring; Toast up to $1,500 per referral |
| Reseller | Hardware dealers, POS installers, IT shops | Buys at 30% off list, sells at list, does first-line support and installs devices | Foodics reseller programme; Odoo partners up to 20% |
| Restaurant refers restaurant | Customers | One month free for both branches when the referred restaurant pays its first month | Foodics customer cashback |

Accountants are the natural reseller for the accounting add-on and for ETA and
ZATCA compliance; hardware dealers already stand in every new restaurant.

**5.3 Payment companies as distribution.** Paymob, Kashier and Geidea field
teams sign restaurants every day; a referral or co-sell agreement (with a
revenue share on the volume, P13) turns them into a channel, as the
Foodics–Paymob deal did.

**5.4 Moving Stores' restaurants.** A store with the FOOD vertical and no POS is
a qualified lead; the store's back office now points them to Moving POS.

**5.5 Content and search.** `/foodics-alternative` already answers the
highest-intent search; keep its figures sourced (P05). Add ETA e-receipt
content once the POS issues them (P14).

**5.6 Paid.** Click-to-WhatsApp ads; no pixel on the site, by decision (ADR
0004).

## 6. Onboarding and activation

**Activation = a branch taking real orders on Moving POS for 7 consecutive
days within 21 days of the first call.**

| Step | Today | Fix |
|---|---|---|
| First contact | Contact form or WhatsApp; leads land in a file | CRM forward and alert (P06) |
| Demo | 15-minute demo, sales-led | — |
| Trial | "Try 14 days free" goes to `/contact`; no POS trial exists | Self-serve trial (P11); until then call it a guided pilot |
| Setup | An engineer seeds JSON and deploys each app | Menu import (P12), tenant provisioning (P11) |
| Go-live | Free menu load, migration from an export | Keep free: it is the wedge |
| Paid | Manual monthly invoice | Billing (P10) |

**Until P10 and P11 ship, sell a guided pilot:** one branch, 14 days, menu
loaded by the team, a named contact on WhatsApp, then the founding-50 price.

**Metrics to watch weekly:** leads by source (`[P-…]` WhatsApp codes), demos,
pilots started, branches live, MRR, branches per customer, add-on attach,
Moving Stores attach.

## 7. Cross-sell between Moving POS and Moving Stores

This section is the same in both repositories (`devyapos` and
`devya-commerce`), so the two teams sell one story.

**What exists:** the POS ↔ Stores link for restaurants (FOOD stores): menu,
prices, branch prices, modifier groups, branches, delivery zones and sold-out
flags flow from the POS; web orders flow into the POS (PILOT or KEYED mode)
and print in the kitchen; status flows back to the shopper; single sign-on
from the POS back office. Customers and loyalty balances do not sync; retail
stores have no POS link (`docs/specs/pos-integration.md`).

**What sells it:**

1. **One name.** The product is *Moving POS* (موفينج POS) and *Moving Stores*
   (موفينج ستورز). Retired names (Drinki POS, DevyaPOS) are gone from what
   customers read (Moving Stores gap S04; the POS site already uses Moving
   POS).
2. **Links both ways.** The Stores landing links to pos.movingsystems.tech;
   the POS site links to stores.movingsystems.tech and prices the store as an
   add-on.
3. **One offer.** POS customers get Stores Growth at the Starter price, three
   months free (§3). Stores restaurants that outgrow paper tickets are offered
   Moving POS Counter (EGP 199 per branch per month on the POS site).
4. **One onboarding.** The POS onboarding call ends with the store connected
   (pairing code, Path B); the store's FOOD wizard offers "Connect Moving POS"
   and, without one, explains what the POS adds.
5. **One loyalty (later).** Points earned online for every store, shared with
   the POS (Moving Stores gap S13, Moving POS gap P23).

**Who owns what:** the POS team owns the bundle price and the POS-side
onboarding; the Stores team owns the connection UX and the upsell surfaces;
both sites carry the same three-sentence description of the link.

## 8. The next 90 days

| Weeks | Do | Owner |
|---|---|---|
| 1 | Merge the three site PRs (P01–P03); set the lead forward and an alert (P06) | Maintainer, owner |
| 1–2 | Decide list prices after the founding 50 and the add-on prices (P07); fix competitor facts (P05) and the remaining claims (P04) | Owner, engineering |
| 1–4 | Open BD with Paymob / Kashier / Geidea on a referral or revenue share and SoftPOS (P13); sign two dealer resellers (P08) | Owner |
| 2–8 | Billing and plan enforcement (P10); menu import (P12) | Engineering (devya-pos) |
| 4–12 | Self-serve POS trial on the accounting trial's warm-pool pattern (P11); ETA e-receipt from the POS through the accounting hub (P14) | Engineering |
| 8–12 | One aggregator integration, starting with the largest in Egypt (P15) | Engineering, BD |
