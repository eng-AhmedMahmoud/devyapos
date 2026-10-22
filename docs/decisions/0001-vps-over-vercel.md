# 0001. Host on the Devya VPS, not Vercel

- **Status:** Accepted
- **Date:** 2026-09-25 (`b6e2ba8`)
- **Recorded:** 2026-10-22, backfilled from `b6e2ba8`, the `Dockerfile`, the
  README and the GDPR audit. The commit itself gives one reason, "same shape
  as the booking app"; the rest of the context below is what the repo shows,
  not a recovered rationale.

## Context

Until 2026-09-25 the site was the Vercel project `devyapos`, which built and
deployed every push to `main` (`pos.devya.dev` was an `A → 76.76.21.21`
record). By then the site had a real server side: the contact form's
`POST /api/lead` (since 2026-09-04, `d7eeff1`). On Vercel's serverless
functions a lead that could not be forwarded had nowhere durable to go but the
runtime log, and a rate limiter held in memory was per instance. Devya already
ran its other web apps as Docker containers behind nginx on its own VPS
(Hostinger, Germany, `72.61.81.59`).

## Decision

Run the site as one Docker container on the Devya VPS, behind the host's
nginx, published on `127.0.0.1:3009` only, the same shape as the other apps
on the box. Ship it with `scripts/deploy.sh` (a `git archive` over SSH and
`docker compose up`), not with a platform's git integration.

## Consequences

- **One long-lived process.** In-memory state is exact and simple: the rate
  limiter's ceiling is real and resets on restart (`lib/rate-limit.ts`). It
  would be wrong again on more than one instance.
- **A disk that survives deploys** made the lead outbox and consent receipts
  possible ([0002](0002-lead-outbox-and-jsonl-sinks.md)). Container logs do
  not survive a deploy, so they are never a store.
- **We own the edge.** nginx, TLS (Let's Encrypt), HTTP→HTTPS and the
  `X-Real-IP` header the limiter trusts are ours; the site file is
  `deploy/nginx.conf` (since 2026-10-22), the certificates and logrotate live
  on the host. There is no CDN; nginx serves Next's output directly.
- **No preview deployments.** Pull requests are checked by CI
  ([0006](0006-protected-main-and-ci-gated-deploys.md)) and, for UI, a local
  production build through portless.
- **A shared host.** Other Devya services run on the same box, and the deploy
  uses `root` over SSH today
  ([#38](https://github.com/eng-AhmedMahmoud/devyapos/issues/38)). Sinks have
  size caps so this site cannot fill the disk.
- **The legacy Vercel project** was not removed after the move. Its last
  build (`b6e2ba8`, 2026-09-25) stayed live at `devyapos.vercel.app` as a
  second public copy, old name and no CSP, with a lead route that logged leads
  in full (X-Ray SEC-F3). Since 2026-10-22 `devyapos.vercel.app` answers
  with a 308 to the site and the per-deployment URLs are behind Vercel's
  login (X-Ray T9, #24).
  Vercel is no longer a processor for the live site
  (`docs/compliance/processors.md`). Nothing deploys there; agents must not
  run `vercel` in this repo.
- The VPS has no GitHub credentials, so the deploy streams an archive from the
  operator's machine; the operator's machine needs SSH access and `gh`.
