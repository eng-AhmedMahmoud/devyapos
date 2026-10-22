# Moving POS — gap analysis: proven business models vs what ships

**Date:** 2026-10-22. **Inputs:** [`market-research.md`](market-research.md)
(competitors, prices, market, with sources) and [`feature-map.md`](feature-map.md)
(what the product and this site ship, with file paths). **Companion:**
[`go-to-market.md`](go-to-market.md).

Moving POS has two codebases. This repository is the marketing site
(pos.movingsystems.tech); the product (POS, KDS, admin, shop, accounting, the
ops console) lives in the private
[`eng-AhmedMahmoud/devya-pos`](https://github.com/eng-AhmedMahmoud/devya-pos)
repo, and the umbrella site in `eng-AhmedMahmoud/moving-landing`. Each gap is
one GitHub issue **in the repo whose code has to change**.

Scores, as in the Moving Stores review:

- **Revenue impact (1–5).** 5 = opens or unblocks a revenue line. 3 = lifts
  conversion, retention or trust measurably. 1 = parity or polish.
- **Effort.** S ≈ a day, M ≈ up to a week, L ≈ several weeks, XL ≈ a
  programme. "BD" = starts with a negotiation; "Owner" = a decision only the
  business can make.

## The short answer

The product is far ahead of how it is sold, and the business has no machinery
to collect revenue:

- **Sold wrong.** The site publishes the Growth / Scale / Enterprise ladder the
  product retired on 2026-09-19. The product sells **Counter (EGP 199)**,
  **Dining room (EGP 499)** and **Group (quoted)**; the dine-in pack that
  justifies the 2.5× step, gift cards, the AI assistant, HR, multi-brand,
  customer display, ZATCA and the Moving Stores link are not marketed at all.
- **Claimed wrong.** Loyalty tiers and referrals, campaigns, "delivery
  integrations", 58mm/USB printing with a drawer kick, a peak-hours report and
  ordering at the table are advertised but not built.
- **No revenue machinery.** No billing, subscriptions or plan enforcement in
  the product, no self-serve POS signup, no payment margin, and leads land in
  a file with no alert.

The market says the money in POS is in payments (Toast 82% of revenue,
Lightspeed 66%), that EGP 199 is about 7% of Foodics Basic in Egypt (so the
price has room), that ETA e-receipts are the compliance wedge in Egypt and
ZATCA wave 25 (1 Feb 2027) in KSA, and that partner channels and POS-data
financing are proven distribution and revenue lines.

## Prioritised gap list

Status: **This round** = being implemented in a PR in this review (the PR
sets **Built** and links itself; this repo's PRs wait for a human merge);
**Ticketed** = issue open; **Owner** = needs a business decision.

### Marketing site — this repository

| ID | Gap | Model | Impact | Effort | Priority | Status | Issue |
|---|---|---|---|---|---|---|---|
| P01 | The pricing page sells the retired Growth / Scale / Enterprise ladder; the product's Counter / Dining room / Group packages and its add-ons are not on sale | SaaS tiers, per-branch pricing, add-ons | 4 | S | P0 | This round | [#60](https://github.com/eng-AhmedMahmoud/devyapos/issues/60) |
| P02 | Moving Stores is not on the POS site: no link, no add-on price, no bundle | POS ↔ store cross-sell | 3 | S | P0 | This round | [#61](https://github.com/eng-AhmedMahmoud/devyapos/issues/61) |
| P03 | No partner, reseller or referral programme, and no way to apply | Reseller / partner / referral | 4 | S–M | P0 | This round | [#62](https://github.com/eng-AhmedMahmoud/devyapos/issues/62) |
| P04 | Claims the product does not back: loyalty tiers and referrals, campaigns, delivery integrations, 58mm/USB/drawer kick, peak hours, ordering at the table, "payment providers on request", instalments, a self-serve POS trial, self-serve cancel and export | Trust (refunds, churn, comparative-advertising risk) | 3 | S | P1 | Ticketed (pricing claims fixed with P01) | [#63](https://github.com/eng-AhmedMahmoud/devyapos/issues/63) |
| P05 | Competitor facts out of date: Foodics Egypt prices **are** public (foodics.com/foodics-pricing-egypt), the `/compare` column denies Foodics a POS, inventory, zones and KDS, `docs/spec.md` figures are stale; the ETA page and the accounting page contradict each other | Trust / legal | 3 | S | P1 | Ticketed | [#64](https://github.com/eng-AhmedMahmoud/devyapos/issues/64) |
| P06 | Leads have no home: no CRM forward configured, no new-lead alert, no backup of the outbox | Funnel | 4 | S–M (owner + ops) | P0 | Owner + Ticketed | [#65](https://github.com/eng-AhmedMahmoud/devyapos/issues/65) |
| P07 | Price level: EGP 199 per branch is about 7% of Foodics Basic and under local cashier software; no list-price plan after the founding 50 | SaaS tiers | 4 | S (owner) | P1 | Owner | [#66](https://github.com/eng-AhmedMahmoud/devyapos/issues/66) |
| P08 | Hardware: the site promises devices the product does not drive and offers no certified list, bundle or financing | Hardware bundles | 2 | S + BD | P2 | Ticketed | [#67](https://github.com/eng-AhmedMahmoud/devyapos/issues/67) |
| P09 | KSA: ZATCA Phase 2 is built in the POS but not marketed; no KSA page | Compliance as a feature (KSA) | 3 | S (after in-Kingdom hosting) | P2 | Ticketed | [#68](https://github.com/eng-AhmedMahmoud/devyapos/issues/68) |

### Product — `eng-AhmedMahmoud/devya-pos`

| ID | Gap | Model | Impact | Effort | Priority | Status | Issue |
|---|---|---|---|---|---|---|---|
| P10 | No billing, subscriptions or plan enforcement: tier presets "enforce nothing", invoices are manual | SaaS tiers (collection) | 5 | L | P0 | Ticketed | [devya-pos#312](https://github.com/eng-AhmedMahmoud/devya-pos/issues/312) |
| P11 | No self-serve POS signup or trial (the accounting trial pool shows the way) | Onboarding / activation | 5 | L | P0 | Ticketed | [devya-pos#313](https://github.com/eng-AhmedMahmoud/devya-pos/issues/313) |
| P12 | No menu import (CSV, Foodics export): onboarding needs an engineer to seed JSON | Onboarding / switching | 4 | M | P1 | Ticketed | [devya-pos#314](https://github.com/eng-AhmedMahmoud/devya-pos/issues/314) |
| P13 | No integrated payments (SoftPOS, terminal integration) and no PSP revenue share | Payments margin | 5 | XL + BD | P1 (start BD) | Ticketed | [devya-pos#315](https://github.com/eng-AhmedMahmoud/devya-pos/issues/315) |
| P14 | No ETA e-receipt from the POS: till sales reach accounting only as daily totals | Compliance (Egypt mandate) | 5 | L–XL | P1 | Ticketed | [devya-pos#316](https://github.com/eng-AhmedMahmoud/devya-pos/issues/316) |
| P15 | No delivery-aggregator integrations (Talabat, Elmenus, Keeta, Mrsool, Breadfast): orders are re-keyed | Online ordering / omnichannel | 4 | L | P1 | Ticketed | [devya-pos#317](https://github.com/eng-AhmedMahmoud/devya-pos/issues/317) |
| P16 | Loyalty has no tiers, referrals or guest notifications (WhatsApp); CRM campaigns are simulated | Loyalty / marketing | 3 | M | P2 | Ticketed | [devya-pos#318](https://github.com/eng-AhmedMahmoud/devya-pos/issues/318) |
| P17 | QR at the table is pay-only: guests cannot order | Dine-in ordering | 3 | M | P2 | Ticketed | [devya-pos#319](https://github.com/eng-AhmedMahmoud/devya-pos/issues/319) |
| P18 | No peak-hours report; owner digest and variance alerts are planned flags | Analytics | 2 | S | P2 | Ticketed | [devya-pos#320](https://github.com/eng-AhmedMahmoud/devya-pos/issues/320) |
| P19 | Printing is 80mm over LAN only: no 58mm, no USB from the browser shells, no cash-drawer kick | Hardware | 2 | M | P2 | Ticketed | [devya-pos#321](https://github.com/eng-AhmedMahmoud/devya-pos/issues/321) |
| P20 | 25 planned flags with no code sit inside sellable tier presets | SaaS tiers (honest packaging) | 2 | S | P2 | Ticketed | [devya-pos#322](https://github.com/eng-AhmedMahmoud/devya-pos/issues/322) |
| P21 | No financing or BNPL partnership built on POS data | Merchant financing | 3 | BD + M | P3 | Ticketed | [devya-pos#323](https://github.com/eng-AhmedMahmoud/devya-pos/issues/323) |
| P22 | No partner attribution or commission ledger in the ops console | Reseller / partner | 3 | M | P2 | Ticketed | [devya-pos#324](https://github.com/eng-AhmedMahmoud/devya-pos/issues/324) |
| P23 | Customers and loyalty do not sync with Moving Stores; the link covers restaurants only | Omnichannel / cross-sell | 3 | L (two repos) | P2 | Ticketed | [devya-pos#325](https://github.com/eng-AhmedMahmoud/devya-pos/issues/325) |

### Umbrella site — `eng-AhmedMahmoud/moving-landing`

| ID | Gap | Model | Impact | Effort | Priority | Status | Issue |
|---|---|---|---|---|---|---|---|
| P24 | movingsystems.tech claims loyalty tiers and referrals, and an assistant for Moving Stores that is off in production | Trust | 2 | S | P1 | Ticketed | [moving-landing#15](https://github.com/eng-AhmedMahmoud/moving-landing/issues/15) |

## Impact vs effort

```
impact
  5 |                              P10 P11  P14     P13(BD)
  4 | P01 P07(owner) P06(owner)    P03 P12  P15
  3 | P02 P04 P05 P09               P16 P17 P22 P21  P23
  2 | P18 P20 P24  P08              P19
    +---------------------------------------------------------
       S                            M        L       XL     effort
```

## Why these three go first

- **P01 — sell what the product sells.** The cheapest revenue fix there is: the
  owner priced the three packages on 2026-09-19 and the dine-in pack is what
  the 2.5× step charges for; a buyer cannot buy what the site does not show.
  The new grid also drops the pricing-page claims the product does not back.
- **P02 — the Moving Stores add-on.** POS-first vendors sell online as the
  add-on (Foodics gates online ordering behind higher bundles; Shopify POS
  grew offline revenue 27%). Moving Stores is live, linked to the POS for
  restaurants, and priced; the POS site never mentions it.
- **P03 — a channel.** Foodics runs referral, reseller and cashback
  programmes; Odoo pays partners up to 20%; Toast up to $1,500 per referral.
  Accountants (for the accounting add-on and ETA), hardware dealers and
  agencies already sell to restaurant owners. A page with terms and a way to
  apply costs a day and opens the channel.

P10, P11, P13 and P14 are bigger, but they are product work in the private
repo, which this review tickets rather than builds (that repo's policy: an
agent opens a PR and the developer merges and deploys).

## Gap details

### P01 — The packages the product sells (this round)

- **Today:** `content/*.ts` `pricing.plans` publishes Growth 199 / Scale 499
  / Enterprise custom with feature lists that differ from the product
  (inventory and permissions at 499 on the site, at 199 in the product; API at
  499 on the site, Group only in the product) and include unbuilt features
  (tiers, campaigns).
- **Product truth:** `devya-pos:ops-app/lib/plans.ts` — Counter 199 (POS, KDS,
  menu, reports, ordering site, delivery zones, loyalty points, promotions,
  inventory, permissions, multi-branch), Dining room 499 (Counter + tables,
  coursing, split bill, QR pay at the table, waiter flow, gift cards), Group
  quoted (+ supply, HR, accounting, API, device management). Add-ons are
  quoted per tenant.
- **Plan:** the grid shows those three packages with only shipped features,
  and an add-ons block (Moving Stores, accounting, AI assistant, customer
  display, handheld apps, Loyalty Garden app, CRM) priced or "quoted".

### P02 — Moving Stores on the POS site (this round)

- **Plan:** the Moving Stores address joins `lib/brand.ts`; the pricing page's
  add-ons list it with what the link does (menu, prices and branches from the
  POS, web orders in the kitchen, one sign-in) and the bundle offer from
  `go-to-market.md` §7; the footer links it.

### P03 — Partners and referrals (this round)

- **Plan:** a `/partners` page: who it is for (accountants, hardware dealers,
  agencies, restaurant consultants), the two models (referral and reseller)
  with proposed terms, a restaurant-refers-restaurant offer, and the way to
  apply (WhatsApp with its own placement code, and the contact form). Terms are
  the owner's to confirm in review; nothing is automated yet (P22 tracks the
  product side).

### P04 — Claims the product does not back

Every line, with the evidence, is in `feature-map.md` ("Unbacked site
claims"). Either the product builds it (P15–P19 track those) or the site stops
saying it. The pricing-page lines go with P01.

### P05 — Competitor facts

`market-research.md` §1 checks every in-house competitor figure against the
sources: Foodics' Egypt prices are published (cite the URL with a retrieved
date and revisit the "never published" rule of 2026-10-22), the `/compare`
"enterprise platforms" column is inaccurate for the named example, and
`docs/spec.md` still carries stale figures. Related: #51 (the 90-day freshness
date).

### P06 — Leads

`LEAD_FORWARD_URL` is unset in production, so every lead is a line in a JSONL
file on the VPS: no CRM, no alert, no backup (X-Ray SEC-F2). Owner: choose a
CRM (or a sheet) and set the forward; add an alert on the
`[lead] NOT FORWARDED` log line; back up `/data`.

### P07 — Price level

Owner decision. `go-to-market.md` §3 has the recommendation: hold 199 / 499 for
the founding 50, then list prices of 299 / 699, and charge for add-ons.

### P08 — Hardware

Publish a certified list (ETA-approved devices that the product drives), and
offer bundles and financing through a dealer partner rather than selling metal
(Toast and Lightspeed sell hardware at a loss; Foodics and Rewaa subsidise it).

### P09 — KSA

ZATCA Phase 2 is built in the POS (`devya-pos:backend/src/zatca/`); production
waits on in-Kingdom hosting. When it is live, a KSA page sells it against
wave 25 (1 Feb 2027).

### P10 – P23 — Product

See each issue in `eng-AhmedMahmoud/devya-pos`; the evidence is in
`feature-map.md` under the matching dimension.

### P24 — Umbrella claims

movingsystems.tech says "four tiers" and "bring-a-friend referrals" for Moving
Loyalty and lists an assistant for Moving Stores. Both are owner to-dos from
the 2026-10-22 SEO review as well.

## Issue map

| Gap | Repo | Issue |
|---|---|---|
| P01 | `devyapos` | [#60](https://github.com/eng-AhmedMahmoud/devyapos/issues/60) |
| P02 | `devyapos` | [#61](https://github.com/eng-AhmedMahmoud/devyapos/issues/61) |
| P03 | `devyapos` | [#62](https://github.com/eng-AhmedMahmoud/devyapos/issues/62) |
| P04 | `devyapos` | [#63](https://github.com/eng-AhmedMahmoud/devyapos/issues/63) |
| P05 | `devyapos` | [#64](https://github.com/eng-AhmedMahmoud/devyapos/issues/64) |
| P06 | `devyapos` | [#65](https://github.com/eng-AhmedMahmoud/devyapos/issues/65) |
| P07 | `devyapos` | [#66](https://github.com/eng-AhmedMahmoud/devyapos/issues/66) |
| P08 | `devyapos` | [#67](https://github.com/eng-AhmedMahmoud/devyapos/issues/67) |
| P09 | `devyapos` | [#68](https://github.com/eng-AhmedMahmoud/devyapos/issues/68) |
| P10 | `devya-pos` | [devya-pos#312](https://github.com/eng-AhmedMahmoud/devya-pos/issues/312) |
| P11 | `devya-pos` | [devya-pos#313](https://github.com/eng-AhmedMahmoud/devya-pos/issues/313) |
| P12 | `devya-pos` | [devya-pos#314](https://github.com/eng-AhmedMahmoud/devya-pos/issues/314) |
| P13 | `devya-pos` | [devya-pos#315](https://github.com/eng-AhmedMahmoud/devya-pos/issues/315) |
| P14 | `devya-pos` | [devya-pos#316](https://github.com/eng-AhmedMahmoud/devya-pos/issues/316) |
| P15 | `devya-pos` | [devya-pos#317](https://github.com/eng-AhmedMahmoud/devya-pos/issues/317) |
| P16 | `devya-pos` | [devya-pos#318](https://github.com/eng-AhmedMahmoud/devya-pos/issues/318) |
| P17 | `devya-pos` | [devya-pos#319](https://github.com/eng-AhmedMahmoud/devya-pos/issues/319) |
| P18 | `devya-pos` | [devya-pos#320](https://github.com/eng-AhmedMahmoud/devya-pos/issues/320) |
| P19 | `devya-pos` | [devya-pos#321](https://github.com/eng-AhmedMahmoud/devya-pos/issues/321) |
| P20 | `devya-pos` | [devya-pos#322](https://github.com/eng-AhmedMahmoud/devya-pos/issues/322) |
| P21 | `devya-pos` | [devya-pos#323](https://github.com/eng-AhmedMahmoud/devya-pos/issues/323) |
| P22 | `devya-pos` | [devya-pos#324](https://github.com/eng-AhmedMahmoud/devya-pos/issues/324) |
| P23 | `devya-pos` | [devya-pos#325](https://github.com/eng-AhmedMahmoud/devya-pos/issues/325) |
| P24 | `moving-landing` | [moving-landing#15](https://github.com/eng-AhmedMahmoud/moving-landing/issues/15) |

Moving Stores' gaps (S01–S24) are `eng-AhmedMahmoud/devya-commerce` #76–#99.
