# 0009. Plex Arabic's fallbacks are sized on Arabic

- **Status:** Accepted
- **Date:** 2026-11-05

## Context

Lighthouse on mobile measured CLS 0.135–0.161 on `/ar` (audit
[docs/seo/audit-2026-11-04.md](../seo/audit-2026-11-04.md) P4), above the
0.1 "good" line, and all of it was one shift: the hero re-wrapping when IBM
Plex Sans Arabic swapped in after a fast first paint. next/font gives the face
one fallback, local Arial at 101.17 %, sized from Latin letters. Arial's Arabic
needs about 117 % (weight 400) to 124 % (700) to set as wide as the face, so the
first paint set Arabic about 15 % narrower and the lines broke differently.
devya-commerce met the same shift and settled it in its decision 0012.

## Decision

- The layout turns next/font's fallback off (`adjustFontFallback: false`) and
  lists three families after the face, from `app/plex-arabic-fallbacks.css`:
  Arabic-only faces on local Arial (macOS, Windows) and Noto Naskh Arabic
  (Android), sized per weight class, then next/font's own Arial fallback,
  unchanged, for everything that is not Arabic.
- The sizes are measured, not guessed: `pnpm fonts:fallbacks`
  (`scripts/font-fallbacks.mjs`) sets this site's own Arabic copy
  (`content/ar.ts`, 11,589 words) in Chrome in the face and in each fallback,
  and writes the stylesheet. It runs by hand only (not on install, in CI or in
  the Dockerfile); rerun it when the Arabic copy changes a lot.
- Only `local()` sources: the site still requests no font from another host,
  and the CSP is unchanged. `tests/fonts.test.ts` and `tests/privacy.test.ts`
  hold the stylesheet to that and the layout's names to the stylesheet's.

## Consequences

- Lighthouse A/B on a local production build, mobile, 3 runs each (2026-11-05):
  `/ar` CLS 0.151 / 0.161 / 0.157 → 0.024 / 0.029 / 0.019, the hero shift gone,
  LCP 1.68–3.25 s → 1.39–1.71 s. `/ar/foodics-alternative` CLS
  0.030–0.037 → 0.053–0.067, still well under 0.1: a 0.035 shift on one
  `p.card-flat` now shows. That card is a follow-up, not a reason to keep the
  hero's 0.13.
- One generated file to keep in step with the copy. A stale file only costs
  some of the gain; it cannot break the page, because the face still wins once
  it loads.
- The sizes agree with devya-commerce's within 1.7 %, measured on each site's
  own copy.
