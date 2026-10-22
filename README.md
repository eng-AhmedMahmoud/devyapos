# Moving POS — marketing site

The public marketing site for **Moving POS** — موفينج POS on Arabic pages —
(Drinki POS until 2026-10-19, DevyaPOS until 2026-10-18),
Devya's restaurant operating system for the Egyptian market. Live at **https://pos.movingsystems.tech**
(`https://pos.devya.dev` answers with a 301 to the same path and query there; Arabic by
default, `/en` for English; light theme by default, the toggle remembers a choice).

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

Checks (CI runs all four):

```bash
pnpm lint        # eslint
pnpm typecheck   # tsc --noEmit
pnpm test        # vitest: ar/en content parity, the product name, palette contrast
pnpm build
```

## Deploy

`bash scripts/deploy.sh` ships `origin/main` to the Devya VPS (Hostinger,
Germany — `72.61.81.59`): a `git archive` over SSH, a backup of the running
release under `/root/devyapos-pre-*`, then `docker compose -f
docker-compose.prod.yml up -d --build`, container `devya-devyapos` on
`127.0.0.1:3009` behind nginx. `--rollback` puts the newest
backup back. The site left Vercel on 2026-09-25; the old Vercel project
should be disconnected from this repo so it cannot serve a second copy.

The nginx site is `deploy/nginx.conf`: `pos.movingsystems.tech` serves the
container, and `pos.devya.dev` (the address until 2026-10-22) answers every
path with a 301 to the same path and query on the new host. One Let's Encrypt
certificate, named `pos.movingsystems.tech`, covers both names. Both are
DNS-only (grey) `A → 72.61.81.59` records on Cloudflare, in the
`movingsystems.tech` and `devya.dev` zones. `bash scripts/deploy.sh --setup`
installs the site and issues or expands the certificate; DNS for both names
must already point at the VPS.

### Leads that are not forwarded

With `LEAD_FORWARD_URL` unset or the forward failing, a lead is written to
the outbox on the `devyapos-leads` volume (`/data/leads-outbox.jsonl`,
owner-only, entries older than `LEAD_OUTBOX_RETENTION_DAYS` — 365 — dropped
on each write) and the log line carries only its id. Read it with
`docker exec devya-devyapos cat /data/leads-outbox.jsonl`. Host-only
settings such as `LEAD_FORWARD_URL` go in `.env.production.local` beside the
release on the VPS; `scripts/deploy.sh` carries it from one release to the
next.

## Environment

Every variable is optional — with none set the site builds, runs and still
captures leads. `.env.example` holds the annotated copy. (Note: `.gitignore`
ignores `.env*` with no exception yet, so `.env.example` needs a
`!.env.example` negation before it can be committed.)

| Variable | Default | What it does |
| --- | --- | --- |
| `API_URL` | `http://localhost:3001` | Target of the `/api/:path*` rewrite in `next.config.ts`. `/api/lead` is a real route handler and is matched *before* the rewrite, so this only affects other `/api` paths. |
| `LEAD_FORWARD_URL` | — | Where `POST /api/lead` forwards a validated lead. Unset is supported: the lead goes to the outbox (below) and the log line carries only its id — never the lead. |
| `LEAD_OUTBOX_DIR` | — (`/data` in `docker-compose.prod.yml`) | Directory of the durable outbox for leads that were not forwarded (`lib/lead-outbox.ts`). Unset and not forwarded, the route answers 503 and the form offers WhatsApp and email. |
| `LEAD_OUTBOX_RETENTION_DAYS` | `365` | Outbox entries older than this are dropped on the next write. |
| `LEAD_FORWARD_TOKEN` | — | Sent as `Authorization: Bearer <token>` on the forward. |
| `LEAD_FORWARD_TIMEOUT_MS` | `4000` | Per-attempt timeout. Two attempts max; 4xx is treated as permanent and not retried. |
| `NEXT_PUBLIC_TRIAL_CLAIM_URL` | — | Build-time. Where `/accounting-trial` posts a sign-up: Devya's control-plane claim route (`https://ops-api.devya.dev/api/trial/claim` in production, set by `docker-compose.prod.yml`). Unset, the page offers WhatsApp instead of posting, so a dev build never claims a real trial stack. |

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
    "country": "<x-vercel-ip-country | null — always null on the VPS>"
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
- The look is Moving Stores' (devya-commerce `apps/admin/features/landing/`):
  palette and type in `app/globals.css`, the mark in `components/Logo.tsx`.
  Change a colour in devya-commerce first, then here; `pnpm test` recomputes
  the contrast of every text pair.
- The baked brand rasters — `app/apple-icon.png`, the 192/512 PNGs in
  `public/brand/` and the OG cards in `public/og/` — come from
  `node scripts/render-brand-assets.mjs` (needs Google Chrome). Re-run it after
  changing the hero copy, the product name or the mark, and commit the PNGs.
- Competitor prices on `/pricing` are dated claims: refresh
  `pricing.marketAnchor` in both content files when they drift.
