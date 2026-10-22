# 0003. The accounting trial posts from the browser straight to ops-api

- **Status:** Accepted
- **Date:** 2026-10-13 (`fe49584`, merged as `92a27da`)
- **Recorded:** 2026-10-22, from `lib/trial.ts` and the commit.

## Context

`/accounting-trial` signs a business up for a self-serve trial of Moving POS
Accounting (Egypt or Saudi Arabia). The trial stack is provisioned by Devya's
control plane — bohub-pos `ops-store`, served at `ops-api.devya.dev` — whose
`POST /api/trial/claim` decides whether a sign-up is valid and limits sign-ups
per client address. This site has its own server, so the post could go either
straight there or through a route here.

## Decision

The browser posts the sign-up as JSON straight to `NEXT_PUBLIC_TRIAL_CLAIM_URL`
(production `https://ops-api.devya.dev/api/trial/claim`, baked in at build by
`docker-compose.prod.yml`), with `credentials: "omit"` and a 20-second abort.
The claim route allows this site's origin by CORS (`TRIAL_ALLOWED_ORIGINS` in
bohub-pos). A proxy here was rejected because it would make every visitor the
same address to the store's per-address limit, or require the store to trust
an address header this site sets.

`lib/trial.ts` validates in the browser only to show inline hints; its phone
and email rules are a copy of the store's (`ops-store/src/trial/validate.ts`),
and the store decides. The answer is checked before anything is shown as a
success: the setup link must sit under the stack's own `https://` URL and the
token must have the documented shape. A build without the URL renders
"sign-ups are paused" with WhatsApp instead of a form that posts.

## Consequences

- The trial's personal data (name, company, email, phone, country) never
  touches this site's server or disk; it is governed by bohub-pos.
- The CSP's `connect-src` allows exactly one extra origin, derived from the
  same build value (`next.config.ts`; `tests/headers.test.ts`).
- The URL is a build-time value: changing it means a rebuild, and a laptop
  build without it cannot claim a real trial stack.
- Two repos share one contract with no shared test fixture. A change to the
  store's rules or answers has to be copied here by hand (`tests/trial.test.ts`
  pins this side).
- When the site's domain changes, ops-store must allow the new origin first;
  PR #15's rollout lists that step for `pos.movingsystems.tech`.
- The browser suite covers only the paused state; the success path is covered
  at unit level.
