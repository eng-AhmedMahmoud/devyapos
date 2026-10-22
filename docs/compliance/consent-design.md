# Consent design — shared by every Devya and Moving site

One bilingual (Arabic-first, English) consent banner and preferences panel, the
same behaviour, markup and copy on: movingsystems.tech (moving-landing),
pos.movingsystems.tech (devyapos), www.devya.dev (devya-solutions), commerce.devya.dev
and the Moving Stores storefronts (devya-commerce), and the Moving POS front
ends (bohub-pos). Each site maps the `--consent-*` tokens onto its own palette;
nothing else differs except the vendor lines, which must name what that site
really loads.

The code is copied, not packaged — the sites live in separate repos with no
shared registry. **The files below are kept byte-identical across repos**
(except `config.ts`, which is per site). Change one, change all, and say so in
each PR:

| File | Role |
| --- | --- |
| `lib/consent/core.ts` | Framework-free store: record shape, expiry, policy version, receipts, withdrawal clean-up |
| `lib/consent/react.ts` | `useConsent`, `useConsentAllows`, `<ConsentGate>` |
| `lib/consent/copy.ts` | `ConsentCopy` type + the canonical ar/en strings |
| `components/consent/ConsentManager.tsx` | Banner + `<dialog>` panel + `CookieSettingsButton` |
| `components/consent/consent.css` | The design; tokens only |
| `lib/consent/config.ts` | **Per site**: storage key, policy version, categories in use, clean-up lists, receipt URL |
| `tests/consent.test.ts` | The core's behaviour, on a fake browser (vitest, node environment) |

(Monorepos put the same files under their own shared UI package or per app,
and say where in their `docs/compliance/gdpr-audit.md`.)

## The rules it enforces

- **Nothing optional before opt-in** (ePrivacy Art. 5(3)). Every analytics or
  marketing script, pixel, embed, third-party request and device write sits
  behind `<ConsentGate category=…>` or `useConsentAllows(…)`. The server render
  and the hydrating render are `pending`: no tracker, no banner. A site with a
  Google tag uses *basic* Consent Mode — the tag is not loaded at all until
  consent, rather than loaded with `denied` defaults.
- **Reject is as easy as accept.** "Reject all", "Customize" and "Accept all"
  are one CSS class: same size, same weight, on the first layer. Nothing is
  pre-ticked. The banner does not block the page.
- **Nothing to ask, no banner.** A site whose `config.categories` is empty
  (it loads nothing optional) shows no banner; "Cookie settings" still opens
  the panel, which says so and lists what the site keeps on the device, with
  one Close button. Adding a category makes the banner appear by itself.
- **Granular.** Categories: strictly necessary (always on, not a switch),
  preferences, analytics, marketing. A site lists only the categories it
  really uses (`config.categories`); each lists its vendors.
- **Withdrawal as easy as consent** (Art. 7(3)). "Cookie settings" in every
  footer and on the cookie policy page opens the same panel. Turning a
  category off deletes the cookies and storage keys listed in
  `config.cleanup[category]` and reloads, because a script that already ran
  cannot be unloaded.
- **Re-asked when it should be.** A record older than `maxAgeDays` (180 —
  CNIL's six months) or answered against an older `policyVersion` counts as no
  answer. Old consent keys (`legacyKeys`) are deleted, never inherited.
- **Recorded** (Art. 7(1)). The device keeps
  `{ v: 2, id, at, policy, choices, action }` under `config.storageKey`
  (localStorage — never sent with requests). Each choice also sends a receipt
  to `config.receiptUrl` (`POST`, `sendBeacon`) with the same fields plus the
  page language: no IP, no user agent, no visitor identifier — `id` is random
  per answer. Marketing sites write it as one structured log line
  (`{"event":"consent", …}`); apps with a database store it in a
  `ConsentRecord` row (with the signed-in user's id where there is one).
  A site whose logs do not outlive a deploy must also keep the receipt
  somewhere that does: devyapos appends it to `consent-receipts.jsonl` on its
  data volume for 365 days (`lib/consent-receipts.ts`), and the log line is a
  breadcrumb only.
- **Accessible and bilingual.** The panel is a native modal `<dialog>` (focus
  trap, Esc, inert page). Labels, switches with `role="switch"`, 44 px
  targets, logical CSS properties so RTL needs no override, Arabic copy first.

## Test hooks

`data-consent` attributes are the contract the headless check drives:
`banner`, `reject`, `customize`, `accept`, `panel`, `toggle-<category>`,
`save`, `panel-reject`, `panel-accept`, `panel-close`, `open` (the footer link). Keep them.

## Copy

The canonical strings are in `lib/consent/copy.ts`. Sites keep them in their
own i18n system when they have one, word for word, and may only change the
`vendors` lines (`necessary.vendors` included).

## Canonical copy

moving-landing (`~/Projects/moving-landing`) holds the reference copy of the
shared files; the other repos copy from it. The headless ar/en check that
every PR runs before merge is described in each repo's
`docs/compliance/gdpr-audit.md` (§ Verification). In devyapos it is
automated: `e2e/consent.spec.ts` drives the `data-consent` hooks above in
both locales on every pull request, in CI's required `e2e` job, against a
production build.
