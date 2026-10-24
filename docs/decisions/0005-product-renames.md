# 0005. The product is Moving POS; renames change the visible name only

- **Status:** Accepted. The Arabic name موفينج POS is **unconfirmed** by the
  owner; whether Moving POS is final is not recorded.
- **Date:** 2026-10-19 (`4bb2366`, PR #6)
- **Recorded:** 2026-10-22, from the commits and PRs below.

## Context

The product has had four names in ten weeks, each the owner's call:

| From | Name | Commit / PR |
| --- | --- | --- |
| 2026-08-12 | Sufra (in bohub-pos `saas-app/`) | `26ad4fe` |
| 2026-08-25 | DevyaPOS | `c7e4bca` |
| 2026-10-18 | Drinki POS | `dbb9d66`, PR #3 (merged 2026-10-19) |
| 2026-10-19 | **Moving POS** — موفينج POS on Arabic pages | `4bb2366`, PR #6 |

The last rename made the product a member of the Moving family (Moving
Stores, the umbrella site `movingsystems.tech`), took that family's look and
mark, and on 2026-10-22 its domain: `pos.movingsystems.tech`, with
`pos.devya.dev` answering with a 301 (PR #15). Moving Systems is a subsidiary
of Devya Solutions (PR #44).

## Decision

- **A rename is the visible name only** — the owner's call, recorded in
  `dbb9d66`. Identifiers keep `devyapos`: the repo, the container and compose
  service, storage keys (`devyapos.consent.v2`, `devyapos-theme`), file and
  image paths and the Instagram handle; likewise the lead payload's `site` tag
  kept `pos.devya.dev` through the domain move. Changing a storage key would
  drop every visitor's stored consent; changing the tag would break receivers
  keyed on it.
- **One place holds the name**: `brand.name` per locale and `brand.wordmark`
  in `lib/brand.ts`; `brandName(locale)` feeds titles, Open Graph, JSON-LD and
  the footer. Arabic pages write the family name in Arabic (موفينج POS), as
  Moving Stores writes موفينج ستورز; "POS" stays Latin.
- `tests/content.test.ts` checks every page title carries the name in its own
  language and that no retired name (DevyaPOS, Devya POS, Drinki, درينكي) is
  printed anywhere in the content.

## Consequences

- Each rename resets search snippets, social profiles and ad creative, and
  the baked OG cards and icons have to be re-rendered
  (`scripts/render-brand-assets.mjs`).
- `docs/social-launch-plan.md` (2026-09-19) was written as DevyaPOS; its names and
  links were updated on 2026-10-25. Handles must still be claimed before any launch spend.
- The Arabic name needs the owner's confirmation; if it changes, it changes in
  `lib/brand.ts` and the two content trees only.
- A fifth rename gets a new ADR that supersedes this one, naming who decided
  and what is fixed (name, domain, handles).
