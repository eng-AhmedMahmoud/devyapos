Closes #<!-- issue --> <!-- or: Refs # -->

## What

<!-- The change, in a few bullets. -->

## Why

<!-- The problem, the finding or the decision behind it. A new decision about hosting, data, what the browser loads, deploys or names gets a record in docs/decisions/. -->

## Evidence

<!-- Before → after: test output, a request and its answer, a screenshot of both locales. A fix names the test that fails without it. -->

## Checklist

- [ ] **Tests** added or updated ([`docs/testing.md`](../docs/testing.md)); a fix on a critical path has a regression test that fails without it
- [ ] `pnpm lint` · `pnpm typecheck` · `pnpm test:coverage` · `pnpm build` · `pnpm audit --prod --audit-level high` pass locally (results below)
- [ ] **UI**: checked in Arabic (RTL) and English, at phone and desktop widths, on a production build; `pnpm e2e` passes
- [ ] **Content**: `content/ar.ts` and `content/en.ts` changed together, Arabic first; brand facts only from `lib/brand.ts`; no retired product name
- [ ] **Security review**: if the diff touches `app/api`, `proxy.ts`, `next.config.ts`, `lib/consent`, `lib/jsonl-sink.ts`, `lib/rate-limit.ts`, `scripts/`, `deploy/` or CI, `/sec` was run and is summarised below
- [ ] **Privacy**: no new third-party host or script, no personal data in logs, any optional device storage behind consent
- [ ] **Docs** still true: README (env table, lead contract), [`docs/architecture.md`](../docs/architecture.md) (hosting, routes, env, CI), `docs/spec.md` (pages), [`docs/decisions/`](../docs/decisions/README.md), `CLAUDE.md`
- [ ] **No secrets**: no `.env*` file or value, no token or key in the diff

## Checks

```
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm audit --prod --audit-level high
```

## Security review

<!-- What was checked and what was found (or "not needed: docs only"). -->

## Deploy notes

- [ ] Nothing special: `bash scripts/deploy.sh` after merge (`--dry-run` first)
- [ ] Needs `--setup` (nginx site or certificate changed)
- [ ] Needs a host setting in `.env.production.local` (name it, never the value)
- [ ] Changes the data on `/data` or the lead contract (say how receivers and old entries are handled)
- Rollback: <!-- `bash scripts/deploy.sh --rollback`, or what else -->

## Not done / needs a human

<!-- Anything left, and who has to do it. -->

<!-- Provenance (docs/ai-policy.md): an AI-authored pull request ends its description, outside this comment, with the line
🤖 Generated with [Claude Code](https://claude.com/claude-code)
A change made without an agent leaves it out. -->

