# DevyaPOS — marketing site

The public marketing site for **DevyaPOS**, Devya's restaurant operating
system for the Egyptian market. Live at **https://pos.devya.dev** (Arabic by
default, `/en` for English; dark theme by default).

Next.js App Router + next-intl (RTL-first) + Tailwind. Fully static content —
no backend, no database; every screenshot and the four-second register
recording in `public/` are captures of the real product running.

## Provenance

This repo was extracted (with history, via `git subtree split`) from the
[`bohub-pos`](https://github.com/eng-AhmedMahmoud/bohub-pos) monorepo on
2026-08-26, where it lived as `saas-app/`. The **product** this site markets —
backend, POS, kitchen display, shop, admin — still lives in that monorepo;
this repo is only the marketing site. Product screenshots and the demo clip
are produced from that codebase, so refreshing them means re-capturing there
(see `lib/screenshots.ts` for why filenames are versioned).

## Develop

```bash
pnpm install
portless devyapos -- pnpm dev   # → https://devyapos.localhost
```

## Deploy

Vercel project `devyapos`, auto-deploys `main`. Domain `pos.devya.dev` is an
`A → 76.76.21.21` record on Hostinger's devya.dev zone.

## Editing pointers

- All copy lives in `content/ar.ts` / `content/en.ts` (identical key trees —
  the type in `content/types.ts` enforces parity). Arabic is written first.
- Brand facts (name, domain, WhatsApp, parent company) live in `lib/brand.ts`
  and everything derives from them — including canonical URLs, the sitemap and
  robots.txt.
- Competitor prices on `/pricing` are dated claims: refresh
  `pricing.marketAnchor` in both content files when they drift.
