# 0006. `main` is protected, and a deploy ships only what CI passed

- **Status:** Accepted
- **Date:** 2026-10-22 (ruleset `25595323`; deploy gate in PR #53)

## Context

The X-Ray of 2026-10-22 found scope-level changes pushed straight to `main`
with no pull request (the Egypt-first rebuild, the price cut, the analytics
removal, the hosting move, the accounting product), AI-authored pull requests
of two thousand lines merged a minute after opening with no review, no
required checks, and a deploy script that shipped whatever `origin/main` held
whether or not CI had passed. One person holds every role.

## Decision

- **A ruleset on `main`** ("main: pull request + green CI", no bypass
  actors): every change lands through a pull request; the GitHub Actions jobs
  `check` and `e2e` are required and the branch must be up to date with `main`
  before merging; force-push and deletion are blocked. Required approvals stay
  at **0** so a solo maintainer can still merge; raise them to 1 once there is
  a second reviewer ([#46](https://github.com/eng-AhmedMahmoud/devyapos/issues/46)).
- **`scripts/deploy.sh` gates on CI**: it ships a commit only when GitHub
  Actions' newest `check` run on it concluded `success` (only app 15368 counts,
  the same integration the ruleset requires). `--skip-ci-check` is the
  emergency hatch: it says so, and the release record carries `ci=skipped`.
  `--dry-run` checks and prints the plan. After the swap it smoke-tests the
  container and pushes a `release-<UTC>-<sha>` tag; `--rollback` pushes a
  `rollback-…` tag.
- Dependabot alerts and security updates, secret scanning and push
  protection are on; `.githooks/pre-commit` scans commits locally, and
  `pnpm install` installs it ([`docs/testing.md`](../testing.md),
  [`CLAUDE.md`](../../CLAUDE.md)).
- Every pull request uses the template's review checklist
  (`.github/pull_request_template.md`), and AI-authored ones follow
  [`docs/ai-policy.md`](../ai-policy.md).

## Consequences

- Nothing reaches `main` without passing CI, and nothing reaches production
  without a passing `check` on its exact commit. The release tags are the
  record of what was live when.
- Branches are brought up to date with a merge commit (`git merge
  origin/main`); history on `main` is never rewritten.
- The deploy gate reads `check` only. `e2e` is enforced at merge time, so a
  commit on `main` has passed both, but a `--skip-ci-check` deploy skips both.
- With 0 approvals the pull request is a record and a CI gate, not a second
  pair of eyes; the template's checklist and the `/sec` pass in the PR body
  stand in for review until #46 is solved.
- Deploying still needs root SSH to the VPS from the operator's machine
  ([#38](https://github.com/eng-AhmedMahmoud/devyapos/issues/38)).
