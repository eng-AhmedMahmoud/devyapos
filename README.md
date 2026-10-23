# Moving POS — marketing site

The public marketing site for **Moving POS** — موفينج POS on Arabic pages —
(Drinki POS until 2026-10-19, DevyaPOS until 2026-10-18),
Devya's restaurant operating system for the Egyptian market, plus a
self-serve trial of Moving POS Accounting for Egypt and Saudi Arabia. Live at
**https://pos.movingsystems.tech**
(`https://pos.devya.dev` answers with a 301 to the same path and query there; Arabic by
default, `/en` for English; light theme by default, the toggle remembers a choice).

Next.js 16 App Router + next-intl (RTL-first) + Tailwind 4, run as one Docker
container on the Devya VPS. The pages are prerendered marketing content; the
server side is small but real: `POST /api/lead` (the contact form),
`POST /api/consent` (consent receipts) and `GET /api/health`, writing to two
append-only files on a data volume. There is no database and no visitor
account. Every screenshot and the four-second register recording in `public/`
are captures of the real product running.

| Read this | For |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | One page: request path, the two POST routes and their sinks, the data volume, deploy and rollback, CI gates, what lives in other repos |
| [`docs/spec.md`](docs/spec.md) | Every page, the content model, the design system, engineering decisions in the UI |
| [`docs/decisions/`](docs/decisions/README.md) | Why it is built this way: hosting, lead storage, the trial post, no trackers, the renames, the protected `main` |
| [`docs/testing.md`](docs/testing.md) | What is tested, how, and what deliberately is not |
| [`CLAUDE.md`](CLAUDE.md) · [`docs/ai-policy.md`](docs/ai-policy.md) | Working rules for coding agents, and what AI may and may not do here |
| [`docs/compliance/`](docs/compliance/gdpr-audit.md) | GDPR/ePrivacy audit, processors, the shared consent design |

## Provenance

This repo was extracted (with history, via `git subtree split`) from the
[`bohub-pos`](https://github.com/eng-AhmedMahmoud/bohub-pos) monorepo on
2026-08-26, where it lived as `saas-app/`. The **product** this site markets —
backend, POS, kitchen display, shop, admin, and the control plane the
accounting trial signs up with — still lives in that monorepo; this repo is
only the marketing site. Product screenshots and the demo clip are produced
from that codebase, so refreshing them means re-capturing there (see
`lib/screenshots.ts` for why filenames are versioned).

## Develop

```bash
pnpm install                    # also points git at .githooks/ (the secret scan)
portless devyapos -- pnpm dev   # → https://devyapos.localhost
```

`pnpm install` runs the `prepare` script, which sets `core.hooksPath` to
`.githooks` in this checkout so `.githooks/pre-commit` scans every commit for
secrets. It does nothing outside a git checkout (the Docker build, a tarball),
and leaves a `core.hooksPath` you set to something else alone. Hooks then run
from whatever branch is checked out, so read a contributor's changes to
`.githooks/` before checking their branch out.

Checks (CI's required `check` job runs all of these, plus `pnpm audit --prod
--audit-level high`; the required `e2e` job runs the browser journeys):

```bash
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest (tests/): routes, sinks, validators, headers, deploy script, content parity…
pnpm test:coverage    # the same, measured against the coverage floor in vitest.config.mts (what CI runs)
pnpm build
pnpm e2e              # Playwright (e2e/) against a production build — see docs/testing.md
```

[`docs/testing.md`](docs/testing.md) says what each suite covers and how to
run the browser journeys locally through portless.

## Deploy

`bash scripts/deploy.sh` ships `origin/main` to the Devya VPS (Hostinger,
Germany — `72.61.81.59`), and only once GitHub's `check` run on that commit
has passed; it refuses a red, running or missing check. `--dry-run` checks CI
and prints the plan without touching the host. `--skip-ci-check` is for
emergencies only: the release record says `ci=skipped`.

A deploy sends a `git archive` of the commit over SSH (the VPS has no GitHub
credentials), keeps the running release as a backup under
`/root/devyapos-pre-*`, and runs `docker compose -f docker-compose.prod.yml
build --pull` + `up -d` with `RELEASE=<sha>`: container `devya-devyapos` on
`127.0.0.1:3009` behind nginx. It then smoke-tests `/ar`, `/en`, `/api/health`
(must report the commit just shipped, with `config: "ok"`) and the lead
route's refusal of a malformed body, and pushes an annotated tag
`release-<UTC yyyymmddHHMM>-<sha>`; `git tag -l 'release-*' 'rollback-*'`
shows what went live and when. `bash scripts/deploy.sh --rollback` restores
the newest backup, keeping the live `.env.production.local`, and pushes a
`rollback-…` tag. Backups never hold `.env.production.local`; the newest
`DEPLOY_KEEP_BACKUPS` (default 5, `0` = all) are kept.

The site left Vercel on 2026-09-25 ([ADR 0001](docs/decisions/0001-vps-over-vercel.md)).
The legacy Vercel project `devyapos` is kept only as a redirect:
`devyapos.vercel.app` answers with a 308 to the site, and its per-deployment
URLs are behind Vercel's login. Nothing deploys there; never run `vercel` in
this repo.

The nginx site is `deploy/nginx.conf`: `pos.movingsystems.tech` serves the
container, and `pos.devya.dev` (the address until 2026-10-22) answers every
path with a 301 to the same path and query on the new host. One Let's Encrypt
certificate, named `pos.movingsystems.tech`, covers both names. Both are
DNS-only (grey) `A → 72.61.81.59` records on Cloudflare, in the
`movingsystems.tech` and `devya.dev` zones. `bash scripts/deploy.sh --setup`
installs the site and issues or expands the certificate; DNS for both names
must already point at the VPS.

### Health and logs

`GET /api/health` answers `{status, release, config, lead: {forward,
outbox}}`, states only. At boot the server checks its lead settings
(`lib/env.ts`) and logs one `{"event":"config_problem",…}` line per problem;
server errors log one `{"event":"request_error",…}` line each, whose `digest`
matches the reference the error page shows. To find them:
`docker logs devya-devyapos 2>&1 | grep -E '"event":"(config_problem|request_error)"'`.
Container logs are capped (10 MB × 3) and are deleted whenever a deploy
recreates the container, so they are never where a record is kept.

### Leads that are not forwarded

With `LEAD_FORWARD_URL` unset or the forward failing, a lead is appended to
`/data/leads-outbox.jsonl` on the `devyapos-leads` volume. The file is
owner-only and append-only (`lib/jsonl-sink.ts`), and entries older than
`LEAD_OUTBOX_RETENTION_DAYS` (365) are dropped on the first write after a
start and then at most daily. Each such lead logs one error line,
`[lead] NOT FORWARDED — kept in the outbox id=… reason=… pending=N`. If it
cannot be stored, the line is `[lead] LOST — … outbox=<errno>` and the visitor
gets a 503 with WhatsApp and email. Consent receipts go to
`/data/consent-receipts.jsonl` beside it (`CONSENT_RECEIPT_RETENTION_DAYS`,
365). `bash scripts/leads.sh status` shows counts and ages without personal
data. `bash scripts/leads.sh pull <dir>` copies both files off the box into
`<dir>/devyapos-<stamp>/` (0700/0600). It changes nothing on the server, and it
refuses a directory inside a git repository.

Host-only settings such as `LEAD_FORWARD_URL` go in `.env.production.local`
beside the release on the VPS; `scripts/deploy.sh` carries it from one release
to the next. No CRM is chosen yet, so today every lead goes to the outbox
([#36](https://github.com/eng-AhmedMahmoud/devyapos/issues/36)).

## Environment

Every variable is optional — with none set the site builds, runs and still
captures leads (in production, through the outbox). `.env.example` holds the
annotated copy; `.gitignore` ignores `.env*` and negates that one file. The
server checks the lead settings at boot (`lib/env.ts`) and reports a problem
on `/api/health` as `config: "degraded"`.

| Variable | Default | What it does |
| --- | --- | --- |
| `LEAD_FORWARD_URL` | — | Where `POST /api/lead` forwards a validated lead. Must be `https://`. Unset is supported: the lead goes to the outbox (above) and the log line carries only its id — never the lead. |
| `LEAD_FORWARD_TOKEN` | — | Sent as `Authorization: Bearer <token>` on the forward. |
| `LEAD_FORWARD_TIMEOUT_MS` | `4000` | Per-attempt timeout. A 5xx, a timeout or a network error is retried once; a 4xx is permanent and not retried. |
| `LEAD_OUTBOX_DIR` | — (`/data` in `docker-compose.prod.yml`) | Directory of the two append-only files: `leads-outbox.jsonl` (leads that were not forwarded) and `consent-receipts.jsonl`. Unset, an unforwarded lead answers 503 (the form offers WhatsApp and email) and a consent receipt survives only in the log. |
| `LEAD_OUTBOX_RETENTION_DAYS` | `365` | Outbox entries older than this are dropped (the privacy policy's twelve months). |
| `CONSENT_RECEIPT_RETENTION_DAYS` | `365` | Consent receipts older than this are dropped. The policy names no period; a year outlives the 180-day consent. |
| `NEXT_PUBLIC_TRIAL_CLAIM_URL` | — | Build-time. Where `/accounting-trial` posts a sign-up: Devya's control-plane claim route (`https://ops-api.devya.dev/api/trial/claim` in production, set by `docker-compose.prod.yml`). Its origin is the one host the CSP's `connect-src` allows besides this site. Unset, the page offers WhatsApp instead of posting, so a dev build never claims a real trial stack. |
| `RELEASE` | `unknown` | Build-time, set by `scripts/deploy.sh` to the commit being shipped. `/api/health` reports it. |

### Lead forward contract

This shape is defined by this site, not by an existing API — build the
receiving endpoint against it. `POST application/json`:

```jsonc
{
  "type": "lead",
  "version": 1,
  "id": "<uuid v4, stable across the retry — dedupe on this>",
  "site": "pos.devya.dev",   // a fixed sender tag; kept when the site moved to pos.movingsystems.tech
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
    "country": "<string | null — client-supplied on the VPS: nginx sets no geo header>"
  }
}
```

- A 2xx is accepted. Any 4xx is a permanent rejection and is not retried. A
  5xx, a timeout or a network error is retried once with the same `id`, then
  the lead goes to the outbox.
- `version` changes when the shape does.
- **Every string field is raw user input.** It is validated for shape and
  length, never escaped. A receiver must neutralise spreadsheet formulas
  (a leading `=`, `+`, `-`, `@`) before writing to a sheet, escape HTML before
  rendering, and use parameters for SQL.
- `attribution` is first-touch data read back out of `sessionStorage`. It is
  an empty object unless the visitor accepted marketing storage, and a hostile
  client can post any campaign it likes: it is reporting data, never a trust
  signal.

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
  `public/brand/` and the per-page OG cards in `public/og/` — come from
  `node scripts/render-brand-assets.mjs` (needs Google Chrome). Re-run it after
  changing a page title, the hero copy, the product name or the mark, and
  commit the PNGs.
- Competitor prices on `/pricing` and `/foodics-alternative` are dated claims:
  `retrievedAt` in both content files, which a test keeps under 90 days old
  (CI fails from 2026-12-03 until the figures are re-checked,
  [#51](https://github.com/eng-AhmedMahmoud/devyapos/issues/51)).
- Every WhatsApp button names its placement: `whatsappLink(message, source)`
  appends `[P-<source>]`; the legend is `whatsappSources` in `lib/brand.ts`.
