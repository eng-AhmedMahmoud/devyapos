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

## Environment

Every variable is optional — with none set the site builds, runs and still
captures leads. `.env.example` holds the annotated copy. (Note: `.gitignore`
ignores `.env*` with no exception yet, so `.env.example` needs a
`!.env.example` negation before it can be committed.)

| Variable | Default | What it does |
| --- | --- | --- |
| `API_URL` | `http://localhost:3001` | Target of the `/api/:path*` rewrite in `next.config.ts`. `/api/lead` is a real route handler and is matched *before* the rewrite, so this only affects other `/api` paths. |
| `LEAD_FORWARD_URL` | — | Where `POST /api/lead` forwards a validated lead. Unset is supported: the handler logs a warning and the lead survives only in the Vercel runtime logs, on an error-level `[lead] NOT FORWARDED` line. |
| `LEAD_FORWARD_TOKEN` | — | Sent as `Authorization: Bearer <token>` on the forward. |
| `LEAD_FORWARD_TIMEOUT_MS` | `4000` | Per-attempt timeout. Two attempts max; 4xx is treated as permanent and not retried. |

### Lead forward contract

This shape is defined by this site, not by an existing API — build the
receiving endpoint against it. `POST application/json`:

```jsonc
{
  "type": "lead",
  "id": "<uuid v4, stable across the retry — dedupe on this>",
  "site": "pos.devya.dev",
  "receivedAt": "<ISO 8601, rounded down to the minute>",
  "lead": {
    "name": "<2..80 chars>",
    "restaurant": "<2..120 chars>",
    "phone": "<E.164, always +201[0125]XXXXXXXX>",
    "branches": 3,            // integer 1..500, or null
    "message": "<=1200 chars, or null",
    "locale": "ar"            // "ar" | "en"
  },
  "attribution": {            // all keys optional, all browser-supplied
    "source": "meta", "medium": "cpc", "campaign": "eg-launch",
    "term": null, "content": null,
    "referrer": "<first-touch external referrer>",
    "landingPath": "<path+query of the first page in the session>",
    "landingAt": "<ISO 8601, minute precision>"
  },
  "context": {
    "userAgent": "<string | null>",
    "referer": "<request referer | null>",
    "country": "<x-vercel-ip-country | null>"
  }
}
```

`attribution` is first-touch data read back out of `sessionStorage`, so a
hostile client can post any campaign it likes: it is reporting data, never a
trust signal. Any 2xx is treated as accepted.

## Editing pointers

- All copy lives in `content/ar.ts` / `content/en.ts` (identical key trees —
  the type in `content/types.ts` enforces parity). Arabic is written first.
- Brand facts (name, domain, WhatsApp, parent company) live in `lib/brand.ts`
  and everything derives from them — including canonical URLs, the sitemap and
  robots.txt.
- Competitor prices on `/pricing` are dated claims: refresh
  `pricing.marketAnchor` in both content files when they drift.
