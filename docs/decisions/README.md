# Decisions

Why the site is built the way it is. Each record is short and dated: the
**context** that forced a choice, the **decision**, and its
**consequences** — including the costs. A record is never edited to say
something else later: a new decision gets a new record that supersedes the
old one, and the old one's status says so.

| # | Decision | Date | Status |
| --- | --- | --- | --- |
| [0001](0001-vps-over-vercel.md) | Host on the Devya VPS, not Vercel | 2026-09-25 | Accepted |
| [0002](0002-lead-outbox-and-jsonl-sinks.md) | Keep unforwarded leads and consent receipts in append-only files on the data volume | 2026-10-19, amended 2026-10-22 | Accepted |
| [0003](0003-trial-posts-direct-to-ops-api.md) | The accounting trial posts from the browser straight to ops-api | 2026-10-13 | Accepted |
| [0004](0004-no-third-party-trackers.md) | No third-party trackers; WhatsApp placement codes instead | 2026-09-21, amended 2026-10-22 | Accepted |
| [0005](0005-product-renames.md) | The product is Moving POS; renames change the visible name only | 2026-10-19 | Accepted (Arabic name unconfirmed) |
| [0006](0006-protected-main-and-ci-gated-deploys.md) | `main` is protected, and a deploy ships only what CI passed | 2026-10-22 | Accepted |
| [0007](0007-moving-support-assistant.md) | The Moving support assistant, through a same-origin rewrite | 2026-10-27 | Accepted |

0001–0005 were backfilled on 2026-10-22 from commits, pull requests and code
comments; each says where its context came from.

## Smaller decisions (log)

Product and engineering calls that did not need a full record. One line
each, newest first; the link is where the reasoning lives.

| Date | Decision | Where |
| --- | --- | --- |
| 2026-10-22 | The site moves to `pos.movingsystems.tech`; `pos.devya.dev` answers with a 301; the lead payload's `site` tag stays `pos.devya.dev` | PR #15, `deploy/nginx.conf` |
| 2026-10-22 | Every page names Moving Systems as a subsidiary of Devya Solutions, in copy shared across Moving properties | PR #44, `tests/parent.test.ts` |
| 2026-10-22 | Competitor figures are "our own dated record", never "published", and expire after 90 days | PR #49, `tests/content.test.ts` |
| 2026-10-22 | The rate limiter stays in memory: one container, one process, so its ceiling is exact and resets on restart; no Redis | PR #50, `lib/rate-limit.ts`, [0001](0001-vps-over-vercel.md) |
| 2026-10-19 | One shared consent design across Devya and Moving sites; consent expires after 180 days | PR #11, `docs/compliance/consent-design.md` |
| 2026-10-13 | Sell Moving POS Accounting in Egypt and Saudi Arabia through a self-serve trial, priced in EGP or SAR | `fe49584`, [0003](0003-trial-posts-direct-to-ops-api.md) |
| 2026-09-04 | Egypt-first rebuild: VAT/ETA, Foodics-alternative and hardware pages, real lead capture | `d7eeff1` |
| 2026-08-29 | POS prices: Growth 199, Scale 499 EGP per branch per month; Enterprise quoted | `e4ae38e` |
| 2026-08-28 | The reference client's name and link are withdrawn at their request; never reintroduce without written permission | `602eb1a`, `lib/brand.ts` |
| 2026-08-26 | The site leaves the bohub-pos monorepo for its own repo | README "Provenance" |
| 2026-08-24 | Arabic is the front door: `/` goes to `/ar` whatever the browser asks for (no locale cookie either, since 2026-10-19) | `be99f47`, `i18n/routing.ts`, `tests/proxy.test.ts` |

## Adding a decision

1. Copy the shape of an existing record into
   `docs/decisions/NNNN-short-slug.md`, the next number in sequence.
2. Fill in **Status** (Proposed, Accepted, or Superseded by NNNN), **Date** (the
   day it took effect, with the commit or PR), **Context**, **Decision** and
   **Consequences**. Keep it to a page; say what it costs.
3. Add a row to the table above. If it replaces a record, set the old one's
   status to "Superseded by NNNN" and link back — that is the only edit an old
   record gets.
4. Land it in the same pull request as the change it explains. A smaller call
   gets a line in the log instead.

Write one when a change alters hosting, where data goes, what a browser may
load, how code reaches production, a public name or domain, or anything a
newcomer would otherwise reverse without knowing why. `tests/docs.test.ts`
checks every record is listed here and has the four sections.
