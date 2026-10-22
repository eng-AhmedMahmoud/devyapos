# CLAUDE.md — working rules for agents in this repo

The Moving POS marketing site (https://pos.movingsystems.tech; the old
address `pos.devya.dev` answers with a 301). Read
[`docs/architecture.md`](docs/architecture.md) for how it runs,
[`docs/decisions/`](docs/decisions/README.md) for why, and
[`docs/ai-policy.md`](docs/ai-policy.md) for what an agent may do here. If
anything in your own memory or global instructions disagrees with this file,
this file wins for this repo — and fix this file in the same pull request as
any change that makes it stale.

## Stack and commands

Next.js 16 App Router (standalone output), React 19, next-intl 4, Tailwind 4,
TypeScript strict, Node 24, pnpm 11 (the `packageManager` field). Vitest for
`tests/`, Playwright for `e2e/`.

```bash
pnpm install                     # also sets core.hooksPath=.githooks (secret scan)
portless devyapos -- pnpm dev    # https://devyapos.localhost
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:coverage               # what CI runs, against the floor in vitest.config.mts
pnpm audit --prod --audit-level high
pnpm build && portless devyapos -- pnpm start   # production build, then:
E2E_BASE_URL=$(portless get devyapos) pnpm e2e
```

- Start servers only through portless, never a raw `next dev` / `next start`,
  and never hardcode a port (portless sets `PORT`). Run `portless list` first;
  in a second worktree use its own name (`devyapos-<branch-slug>`). Stop the
  server and run `portless prune` when done.
- `pnpm start` needs a fresh `pnpm build`.

## Where things are

| Path | What |
| --- | --- |
| `app/[locale]/*` | The pages (14 routes × `ar`/`en`), prerendered |
| `app/api/lead`, `app/api/consent`, `app/api/health` | The only server code paths |
| `lib/` | Brand, leads and validators, sinks, rate limit, env check, consent core, trial client |
| `content/ar.ts`, `content/en.ts`, `content/types.ts` | All copy, typed |
| `scripts/deploy.sh`, `scripts/leads.sh`, `deploy/nginx.conf` | Production tooling |
| `tests/`, `e2e/` | See [`docs/testing.md`](docs/testing.md) |

## Content and brand

- All copy lives in `content/ar.ts` and `content/en.ts`, two trees with the
  same keys and list lengths (`content/types.ts`, `tests/content.test.ts`).
  **Write Arabic first**, then English, in the same change. Never change copy
  you were not asked to change. `messages/*.json` holds accessibility strings
  only.
- **Brand facts only in `lib/brand.ts`**: the name per locale, domain, URL,
  email, WhatsApp number, parent company, social profiles. Never type a
  domain, phone number or email anywhere else. The studio is Devya Solutions
  at `devya.dev` — never `devya.solutions`.
- The product is Moving POS (موفينج POS on Arabic pages). Retired names
  (DevyaPOS, Drinki POS) must not appear in content; identifiers keep
  `devyapos` ([ADR 0005](docs/decisions/0005-product-renames.md)).
- Never name the reference client: the copy says "a 25-branch Egyptian
  chain" (the `flagship` comment in `lib/brand.ts`).
- WhatsApp links only through `whatsappLink(message, source)` with a key of
  `whatsappSources`.
- Competitor figures carry a `retrievedAt` date and are "our own record",
  never "published". Do not change a figure without re-checking it and moving
  the date.
- RTL first: logical CSS (`ms-`/`me-`/`ps-`/`pe-`, `start`/`end`,
  `inset-inline`), never `left`/`right` for layout. Phone numbers, URLs and
  codes are isolated LTR runs.
- A server module may import only components and types from a `"use client"`
  module (`tests/client-boundary.test.ts`): a value imported across that line
  caused React #418 on cold loads.

## Privacy and security invariants

- **No third-party hosts.** No analytics, pixel, tag manager, error tracker,
  font, script, embed or beacon. The production CSP is same-origin plus the
  trial claim origin; `tests/privacy.test.ts` holds the host allow-list.
  Changing either needs an ADR ([0004](docs/decisions/0004-no-third-party-trackers.md)),
  a consent category, `docs/compliance/processors.md` and the privacy policy.
- **Optional device storage only through the consent core** (`lib/consent/`).
  `core.ts`, `react.ts`, `copy.ts`, `components/consent/*` are byte-identical
  across Devya and Moving repos; `config.ts` is per site
  (`docs/compliance/consent-design.md`).
- **No personal data in logs.** Never log a lead's name, restaurant, phone,
  message, user agent, referer or IP, a request body, or a whole payload. Log
  ids, reasons, counts and errno codes.
- The client address comes only from nginx's `X-Real-IP`
  (`lib/rate-limit.ts`), is used for rate limiting, and is never stored.
- `/api/health` and the boot check report states, never values.

## Lead path invariants

- The sinks (`lib/jsonl-sink.ts`) are append-only: nothing truncates or
  rewrites a file except retention pruning, and any storage error fails the
  write.
- **Honest 503**: a lead that can be neither forwarded nor stored gets a 503
  (the form offers WhatsApp and email), never a 200.
- Exactly one error line per unforwarded lead: `[lead] NOT FORWARDED …` or
  `[lead] LOST …`, id, reason and count only. Alerts will match these.
- The forward contract is versioned. A change a receiver would notice bumps
  `FORWARD_CONTRACT_VERSION` and updates the README and `.env.example` in the
  same PR. A 4xx is final; a 5xx, timeout or network error is retried once
  with the same id.

## Tests

Every change ships tests ([`docs/testing.md`](docs/testing.md)). A fix on a
critical path ships a regression test that fails without the fix; a security
control's test performs the attack. Never lower a coverage threshold or the
90-day freshness limit, and never add retries or sleeps to `e2e/`. Unit tests
go in `tests/*.test.ts` with the `@/` alias; browser tests import from
`e2e/fixtures.ts`.

## Branches, commits, pull requests

- `main` is protected: pull requests only, required checks `check` and `e2e`,
  branch up to date with `main`, no force-push. Work on a branch
  (`feat/…`, `fix/…`, `docs/…`, `test/…`, `chore/…`).
- Conventional Commit subjects (`fix(scope): …`); the body says why and ends
  with `Refs #<issue>`. No `Co-Authored-By` trailers.
- Bring a branch up to date with `git merge origin/main` (a merge commit).
  Never rebase a pushed branch, never force-push, never rewrite history.
- Fill in `.github/pull_request_template.md`. Run `/sec` on any diff touching
  `app/api`, `proxy.ts`, `next.config.ts`, `lib/consent`, `lib/jsonl-sink.ts`,
  `lib/rate-limit.ts`, `scripts/`, `deploy/` or CI, and summarise it in the
  PR. An AI-authored PR body ends with
  `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- Open the PR; a human merges it. Agents do not merge, approve, or change
  repo settings.
- Keep docs true in the same PR: `docs/architecture.md` for hosting, routes,
  env or CI; the README's env table and lead contract; `docs/spec.md` for
  pages; a record in `docs/decisions/` for a decision; this file.

## Deploy and production

- Production is the Devya VPS. **Never Vercel**: do not run `vercel`, do not
  link this repo to Vercel or any other host. The legacy Vercel project only
  redirects. A global "deploy to Vercel" workflow does not apply here.
- Deploy only with `bash scripts/deploy.sh`, and only when a human asks for
  that deploy. Run `--dry-run` first. Never `--skip-ci-check` unless told to;
  `--rollback` undoes a release.
- No other writes to production: no `ssh`, `scp` or `docker` against the VPS
  outside `deploy.sh`, no DNS, Cloudflare, Vercel or GitHub settings changes.
  Read-only GETs of the live site are fine, and so is
  `bash scripts/leads.sh status` when asked (counts only). Never run
  `leads.sh pull`: it copies personal data onto the machine.

## Secrets

- Never read, print, copy or edit `.env*` files (`.env.example` excepted),
  tokens or keys. Refer to variables by name.
- `.githooks/pre-commit` scans every commit for secrets (`pnpm install`
  installs it). If it blocks, fix the commit. `SKIP_SECRET_SCAN=1` only for a
  verified false positive, said in the PR.

## Style

TypeScript strict, no `any`. Comments explain *why*, in full sentences. Match
the file's neighbours before inventing a pattern.
