# docs/business — market, business models and gaps

Business research for **Moving POS** (this site, pos.movingsystems.tech; the
product lives in the private `eng-AhmedMahmoud/devya-pos`), a Moving Systems
product. Moving Systems is a subsidiary of Devya Solutions. Written
2026-10-22 as one review across Moving POS and Moving Stores
(`eng-AhmedMahmoud/devya-commerce`, `docs/business/`).

| File | What it answers |
|---|---|
| [`market-research.md`](market-research.md) | Who competes (Foodics, Square, Toast, Lightspeed, Loyverse, Odoo, Rewaa, Marn, Qoyod, Daftra, the Egyptian payment companies), their prices, payments, hardware, e-invoicing, financing and partner programmes; Egypt, KSA and UAE context; every in-house competitor figure re-checked. Every figure is sourced and dated. |
| [`feature-map.md`](feature-map.md) | What the product and this site ship against each proven model, with file paths, and the site claims the product does not back. |
| [`gap-analysis.md`](gap-analysis.md) | The prioritised gap list (revenue impact vs effort), one GitHub issue per gap in the repo that has to change, and which gaps are built in this round. |
| [`go-to-market.md`](go-to-market.md) | ICPs, pricing recommendation, revenue lines, channels (partners, payment companies, Moving Stores), onboarding and activation, cross-sell with Moving Stores, the next 90 days. |

## Keeping it true

- This repository is public. Never name the reference client or quote a
  client contract here (`lib/brand.ts`, the `flagship` comment).
- A competitor figure is only as good as its retrieval date; the site's own
  figures follow `CLAUDE.md` (a `retrievedAt` on the block, re-checked before
  it moves).
- When a gap ships, mark it in `gap-analysis.md` in the same pull request and
  close its issue.
- Prices and partner terms in `go-to-market.md` are recommendations until the
  owner decides them.
