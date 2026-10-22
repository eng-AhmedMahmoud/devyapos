# Testing

What this repo tests, how, and what it deliberately does not. The rule of
thumb: **test effort follows business risk.** The paths that bring in leads,
keep personal data, or decide what a browser may load get unit tests,
route-handler tests and a browser journey. Cosmetic UI gets lint, the type
check, the browser suite's "no console or page error" guard and a look by a
person.

## The rules

1. **Every change ships its tests in the same pull request.** A new route,
   sink, setting, script flag or content rule comes with tests; CI's coverage
   floor refuses a change that lowers coverage of `app/api/**`, `lib/**` or
   `proxy.ts`.
2. **Every `fix(…)` on a critical path ships a regression test** that fails on
   the parent commit and passes with the fix. Say so in the PR body.
3. **A security or privacy control's test performs the attack** (a spoofed
   address, a third-party host, a lead field in a log line, a malformed body)
   and asserts it is refused.
4. **Never weaken a check to get a change through**: no lowering a coverage
   threshold, raising the 90-day freshness limit, adding to an allow-list
   without a reason in the PR, or adding a retry to the browser suite.

Critical paths: the lead route and its validators, the two sinks on the data
volume, consent (core, banner journeys, receipts), the trial form's validation
and claim answer, the security headers and CSP, the locale proxy, the
boot-time config check and health route, and the deploy and leads scripts.

## The layers

| Layer | Where | Run | What it proves |
| --- | --- | --- | --- |
| Unit and route-handler tests | `tests/*.test.ts` (vitest, node environment) | `pnpm test` · CI `check` runs `pnpm test:coverage` | Route handlers called directly with `Request` objects, `fetch` stubbed, sinks in `mkdtemp` directories. No network, no real lead. |
| Source-contract tests | `tests/privacy.test.ts`, `tests/client-boundary.test.ts`, `tests/content.test.ts`, `tests/tokens.test.ts`, `tests/docs.test.ts` | same | Invariants read off the source: no third-party host or tracker, no lead field in a log line, no value imported across a `"use client"` boundary, ar/en parity, contrast, docs that match the system. |
| Script tests | `tests/deploy.test.ts`, `tests/leads-script.test.ts`, `tests/hooks.test.ts` | same | The real bash scripts run against scratch repos and directories, with fake `gh`, `ssh`, `scp`, `docker` and `curl` on `PATH`. Nothing reaches GitHub or the VPS. |
| Browser journeys | `e2e/*.spec.ts` (Playwright, Chromium) | `pnpm e2e` · CI `e2e` | A production build (CSP, HSTS, minified React). Every test fails on any `console.error` or uncaught page error, and every `POST /api/lead` is refused unless the test intercepts it (`e2e/fixtures.ts`). |

### Which test guards what

| Path | Tests |
| --- | --- |
| Lead intake (`app/api/lead`, `lib/leads.ts`, `lib/rate-limit.ts`) | `lead-route` (contract v1, retry rule, 415, 400, an oversized body, honeypot, rate limit and `X-Real-IP`, the single PII-free log line, 503 when nothing can store), `leads` (digit folding, phone shapes, every validator bound), `e2e/contact.spec.ts` (the form's exact JSON, cold loads) |
| Sinks (`lib/jsonl-sink.ts`, `lib/lead-outbox.ts`, `lib/consent-receipts.ts`) | `jsonl-sink` (injected fs faults), `lead-outbox`, `consent-receipt` |
| Consent (`lib/consent/*`, `app/api/consent`, `components/Attribution.tsx`) | `consent` (the shared core), `consent-route`, `attribution`, `e2e/consent.spec.ts` (nothing stored before an answer; reject and accept survive a reload) |
| Accounting trial (`lib/trial.ts`) | `trial` (EG/SA phones, every claim-answer branch, `credentials: "omit"`, the 20 s abort), `e2e/trial.spec.ts` (the paused state) |
| Headers, CSP, routing | `headers` (production CSP and HSTS through Next's own matching), `proxy` (`/` → `/ar`, no locale cookie, matcher), `ops` (no `/api` rewrite, standalone image, security.txt), `e2e/smoke.spec.ts` |
| Boot check and health | `env`, `ops` |
| Deploy and operator tools | `deploy` (CI gate, smoke, backups, tags, rollback), `leads-script`, `hooks` (the `prepare` hook) |
| Content and brand | `content` (ar/en parity, the product name, retired names, competitor figures' dates), `whatsapp` (placement codes), `tokens` (contrast, brand), `parent`, `theme`, `client-boundary` |
| Docs | `docs` (no stale hosting claims, every relative link resolves, ADR index complete) |
| Cosmetic | `cursor` (a source contract for the custom cursor) |

## Coverage: a ratchet

`pnpm test:coverage` measures `app/api/**`, `lib/**` and `proxy.ts` with v8.
Components are left out on purpose: the browser journeys cover them, and
counting them would only dilute the number. The floor is
`coverage.thresholds` in `vitest.config.mts`, each value the last measurement
rounded down. CI's `check` job fails below it and puts the table in the job
summary. When coverage rises, raise the floor in the same PR; never lower it.

## The freshness test (a date in the future that turns CI red)

`tests/content.test.ts` → "competitor figures" requires every `retrievedAt`
(the Foodics rows on `/pricing` and `/foodics-alternative`, both locales) to
be a real date no more than **90 days** old. The figures were recorded on
2026-09-04, so **from 2026-12-03 every pull request fails** until someone
re-checks the figures with Foodics and updates `retrievedAt` (and any changed
number) in both blocks of `content/ar.ts` and `content/en.ts`
([#51](https://github.com/eng-AhmedMahmoud/devyapos/issues/51)). This is by
design: an undated or stale competitor price is a claim the site cannot back.
Do not raise the limit to get a change through.

## How to run

```bash
pnpm test                                   # everything in tests/
pnpm vitest run tests/lead-route.test.ts    # one file
pnpm test:coverage                          # what CI runs; writes coverage/
```

The browser journeys need a production build and Playwright's Chromium
(once: `npx playwright install chromium`). Locally, serve the build through
portless and point the suite at it:

```bash
pnpm build
portless devyapos -- pnpm start                      # in one terminal
E2E_BASE_URL=$(portless get devyapos) pnpm e2e       # in another
```

Without `E2E_BASE_URL` (CI), Playwright starts `pnpm start` itself on
`E2E_PORT` (default 3100), passing `PORT` through the environment; no script
hardcodes a port. `E2E_CHROME_PATH` runs an installed Chrome instead of
Playwright's. The suite has no retries and no sleeps: a retry that passes
would hide exactly the intermittent hydration error it exists to catch.

## What CI and the deploy enforce

- `check` (required on `main`): frozen install, `pnpm audit --prod
  --audit-level high`, lint, `tsc --noEmit`, the vitest suite against the
  coverage floor, `pnpm build`.
- `e2e` (required on `main`): a production build and the browser journeys.
- `scripts/deploy.sh` ships only a commit whose `check` run passed, then
  smoke-tests the live container (`/ar`, `/en`, `/api/health` reporting the
  shipped commit with `config: "ok"`, and `POST /api/lead` refusing a malformed
  body) before tagging the release.

## Deliberately not tested (yet)

- **Visual layout and motion.** No screenshot diffing. A UI change gets a
  look at both locales, at phone and desktop widths, before merge.
- **Accessibility automation** (axe). Not wired up.
- **The trial's success path in a browser.** It needs a build with
  `NEXT_PUBLIC_TRIAL_CLAIM_URL`; the claim answer is covered at unit level.
- **The real control-plane contract.** `lib/trial.ts` copies ops-store's rules;
  there is no fixture shared with bohub-pos, so a change there is caught by a
  person, not a test.
- **A lead reaching the outbox through the browser.** The browser suite
  intercepts the POST; the route tests cover the outbox.
- **The Docker image.** No CI job builds it; `tests/ops.test.ts` reads the
  Dockerfile and compose file, and the first real build is on the host at
  deploy time.
- **nginx.** `deploy/nginx.conf` is checked by `nginx -t` when
  `deploy.sh --setup` installs it, not in CI.
- **Production.** Nothing in CI touches it; the deploy's smoke test is the
  post-deploy check.
- **Copy quality.** Tests hold the content's shape and its claims rules, not
  its wording.

## Writing a test

- Put it in `tests/<area>.test.ts`; import app code through the `@/` alias.
- Call route handlers directly with `Request` objects. Stub `fetch`; put any
  sink in a `mkdtemp` directory through `LEAD_OUTBOX_DIR`; restore env vars
  after.
- Browser tests import `test` and `expect` from `e2e/fixtures.ts`, not from
  `@playwright/test`, so the two guards apply. Wait on the page's state, never
  on time.
- Show that the test can fail: run it against the code without your change.
