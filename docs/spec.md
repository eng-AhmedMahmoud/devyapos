> Copy of `docs/specs/devyapos-site.md` from the [bohub-pos monorepo](https://github.com/eng-AhmedMahmoud/bohub-pos), which is the canonical home. Update there first.

# Moving POS marketing site — reference spec

Source repo: `github.com/eng-AhmedMahmoud/devyapos` (local checkout
`~/Projects/devyapos`), extracted via `git subtree split` from this monorepo's
`saas-app/` on 2026-08-26 — see `docs/DEVYAPOS-MOVED.md`. It shares no code
with `bohub-pos` (no workspace deps, no `packages/` imports); the product it
markets (POS, KDS, shop, admin) still lives here, and its screenshots/demo
clip are captures of this codebase. All paths below are relative to the
`devyapos` repo root, not to `bohub-pos`.

Stack: Next.js 16.2.12 (App Router), React 19.2, next-intl 4.13, Tailwind CSS
4. No database, no auth, no backend beyond a single `/api` rewrite for a
future lead-form POST (`next.config.ts`). Fully static marketing content.

## 1. Purpose

Public marketing site for **Moving POS** (named DevyaPOS until 2026-10-18 and Drinki POS until 2026-10-19; visible name only, identifiers keep `devyapos`), the productised, sellable version of
the BóHub POS platform — "Devya's restaurant operating system for the
Egyptian market." Live at **https://pos.movingsystems.tech** (Devya VPS
behind nginx, `scripts/deploy.sh`; DNS-only `A → 72.61.81.59` on Cloudflare's
`movingsystems.tech` zone). The address until 2026-10-22, `pos.devya.dev`,
answers with a 301 to the same path and query there (`deploy/nginx.conf`).

- **Arabic default, everyone**: `i18n/routing.ts` sets
  `defaultLocale: "ar"` and `localeDetection: false` — bare `/` always
  resolves to `/ar` regardless of the visitor's `Accept-Language`. This is a
  deliberate override of next-intl's default negotiation (see §5).
- **Light default, everyone**: `app/[locale]/layout.tsx` hardcodes
  `data-theme="light"` on `<html>` rather than reading `prefers-color-scheme`.
  A boot script (`components/ThemeToggle.tsx` → `themeBootScript`) inlined in
  `<head>` applies any stored `localStorage` choice before first paint so
  there's no flash; the toggle itself lives in the header.
- The product lives on a subdomain of the Moving family's domain
  (`pos.movingsystems.tech`), beside the umbrella site (`movingsystems.tech`)
  — see `lib/brand.ts` header comment.
- The whole site is proven against one real reference deployment: BóHub, a
  25-branch Egyptian bubble-tea chain (`brand.flagship` in `lib/brand.ts`,
  linked from `/about`). All screenshots, the promo clip, and the concrete
  numbers quoted in copy (25 branches, 249 items, 430 sizes/variants) are
  real captures/figures from that deployment, not mockups.

## 2. Page inventory

All routes live under `app/[locale]/`, locale always prefixed
(`localePrefix: "always"` in `i18n/routing.ts`), locales `["ar", "en"]`.

### `/` — home (`app/[locale]/page.tsx`)

A single-argument page: hero → the rest of the site's depth was deliberately
moved to dedicated routes (see the file's own doc comment — it used to be a
14-section page). Section order:

1. **Hero** (`components/home/Hero.tsx`) — asymmetric split: copy column +
   `OrderFlowCard`, a pure-CSS mock of one order crossing 4 stages (from
   `bridge.chips`), not a screenshot, "so it never goes stale."
2. **Marquee** (`components/home/Marquee.tsx`) — scrolling espresso-band
   capability ribbon, replacing a "trusted by" logo wall the product can't
   honestly fill yet. Two duplicate tracks, second `aria-hidden`.
3. **Ledger** (`components/home/Ledger.tsx`) — before/after "problem → the
   line that cancels it" rows, one eye movement each (struck-through
   "today" column, checked "with Moving POS" column).
4. **Promo video section** (`components/home/Promo.tsx`, `id="promo"`) — the
   four-second register recording in an oversized `IpadVideo` tablet mockup,
   on an espresso band. Target of the hero's "See it running" CTA
   (`#promo`), which used to open a C4 architecture diagram (removed, see
   `lib/brand.ts` comment).
5. **Features bento** (`components/home/Features.tsx` → `FeatureGrid`) — the
   home subset of the feature catalog, with a "see all" link to `/features`.
6. **Showcase carousel** (`components/home/Showcase.tsx` →
   `ScreenshotCarousel`) — 7 real product screenshots in device frames,
   ordered "as the day runs": register → kitchen → customer → back office.
   Each screenshot is also a button that opens a **quick look**
   (`components/QuickLook.tsx`): a native `<dialog>` (`showModal`, so the page
   is inert behind it and Escape closes it) over a blurred backdrop, the same
   iPad frame at full size, ‹ › and the arrow keys to step (physical keys, so
   in Arabic ← is next), and the carousel moves to the last screen viewed and
   takes the focus back on close. `/features` passes the same labels.
7. **Brand promise** (`components/home/BrandPromise.tsx`) — "a fitted
   experience, not a licence to software," placed deliberately *after* the
   showcase so the claim reframes what was just seen, not before.
8. **Testimonials** (`components/home/Testimonials.tsx`) — renders `null`
   when `testimonials.items` is empty (currently empty in both locales by
   design — no invented quotes; see §2 content notes).
9. **Contact** (`components/home/HomeContact.tsx`, `id="reach"`) — WhatsApp,
   the business line and the inbox as three rows (values as isolated LTR
   runs), beside `ReachDrawing`: a bubble, a phone and an envelope on dashed
   lines into the brand tile. No form; `/contact` has it.
10. **CTA** (`components/CtaBand.tsx`) — closing espresso card, WhatsApp +
   contact-page CTAs, direct `mailto:`/`tel:` links.

Site-wide, `components/FloatingActions.tsx` puts a WhatsApp button and a
back-to-the-top arrow (shown once the first screen is scrolled away; it moves
focus to `<main id="main">`) at the inline end of every page. While the
consent banner is up, the banner publishes its height as `--consent-h` and
the stack rides above it.

### `/features` (`app/[locale]/features/page.tsx`)

`PageHero` → 4 feature groups from `content.featuresPage.groups` (Daily
Operations, Direct Sales Channel, Profitability & Control, Payments &
Integration), alternating `bg-bg`/`band-cream`, each rendered via
`FeatureGrid` → the same 7-shot `ScreenshotCarousel` gallery used on
home (`components/ScreenshotCarousel.tsx`) → **`PaymentProviders`**
(`components/PaymentProviders.tsx`, the payment-providers strip) → `CtaBand`.
The FAQ deliberately does **not** appear here — see FAQ placement note below.

### `/pricing` (`app/[locale]/pricing/page.tsx`)

`PageHero` → `Pricing` (`components/Pricing.tsx`, `compact` mode — no
duplicate section head, just the monthly/yearly toggle + 3-tier plan grid) →
**`MarketAnchor`** (`components/MarketAnchor.tsx`, the market-anchor
competitor table) → `Faq` → `CtaBand`.

### `/compare` (`app/[locale]/compare/page.tsx`)

No `PageHero` (the page comment explains: `Compare` opens with its own
eyebrow/title/sub, a second heading would repeat it). `Compare`
(`components/home/Compare.tsx`, category comparison table) → `RoiCalculator`
(`components/home/RoiCalculator.tsx`, the ROI/commission calculator) →
`CtaBand`. This page carries the whole cost argument — it exists because a
visitor arriving from a "vs Foodics" search previously never reached either
section on a 14-section home page.

### `/how-it-works` (`app/[locale]/how-it-works/page.tsx`)

`PageHero` (borrows `bridge.eyebrow/title/sub` rather than adding a parallel
string) → `Flow` (`components/home/Flow.tsx`, 4-stage pipeline rail) →
`Tour` (`components/home/Tour.tsx`, tabbed product tour: POS / KDS / Shop /
Admin, each a real `IpadFrame` screenshot except `shop`'s CSS `Mock`
fallback) → `Steps` (`components/home/Steps.tsx`, 3-step adoption/onboarding
cost) → `CtaBand`.

### `/about` (`app/[locale]/about/page.tsx`)

`PageHero` → long-form story (single column prose, link to the BóHub
flagship) → engineering principles as cards (6 principles: money in
piastres, Arabic as a first-class language, real-time not a luxury, etc.) →
espresso "numbers today" stat band → 3-item timeline → `Pricing compact`
restated (a warm reader shouldn't have to navigate away for price) → "built
by Devya Solutions" espresso section with phone/email → closing CTA card →
`CtaBand`.

### `/contact` (`app/[locale]/contact/page.tsx`)

`PageHero` → 2-column: `ContactForm` (`components/ContactForm.tsx`) + a
channel list (WhatsApp / phone / email / 15-min live demo, each an `<a>` to
`whatsappLink()`/`telLink`/`mailtoLink()`) → `Faq`. No `CtaBand` — the page
already ends on the same ask.

### FAQ placement

`Faq` (`components/Faq.tsx`, `<details>`/`<summary>` accordion, 2-column on
desktop) renders on exactly **two** routes: `/pricing` and `/contact`. It
used to also render on `/features`; the removal comment in
`app/[locale]/features/page.tsx` states the reasoning directly: "objections
belong next to the price, and two copies of the same answers only split the
search signal."

### Not-found (`app/[locale]/not-found.tsx`)

Locale-aware 404 using `hero-wash` styling, links to `/` and `/pricing`.

### Metadata plumbing

`app/robots.ts` (allow all, points at `/sitemap.xml`) and `app/sitemap.ts`
(7 paths × 2 locales, each with `alternates.languages` hreflang) both derive
every URL from `brand.url` (`lib/brand.ts`) and `routing.locales`
(`i18n/routing.ts`) — no hardcoded domain strings outside `lib/brand.ts`.
Per-page `<title>`/`<meta description>` come from `lib/meta.ts`'s
`buildMetadata(locale, key, path)`, which reads `content.meta[key]` and
builds canonical + hreflang `alternates` from the same two sources.

## 3. Content architecture

### Typed content trees, not next-intl messages

`content/ar.ts` and `content/en.ts` (889 and 885 lines) are hand-written,
fully mirrored TypeScript objects, both typed as `SiteContent`
(`content/types.ts`). `content/index.ts` exports `getContent(locale)`,
falling back to `ar` for unknown locales.

The rationale, stated in `content/types.ts`'s header comment: next-intl still
owns locale *routing* (`i18n/routing.ts`, `i18n/request.ts`,
`i18n/navigation.ts`) and a tiny `messages/{ar,en}.json` (only an `a11y`
namespace: menu open/close, skip-link, language-switch label, theme toggle
labels) — but landing-page copy is deeply structured (feature grids,
comparison-matrix rows, pricing plans with feature arrays, ROI-calculator
tooltip sets), and reading that back through next-intl's `t.raw("...")` loses
every type guarantee. `SiteContent` is one large interface (nav, hero,
marquee, pain/ledger, bridge, features, tour, steps, compare, roi, caseStudy,
testimonials, pricing incl. `marketAnchor`, faq, cta, notFound, footer,
about, contact, gallery, promo, payments, promise, featuresPage) that forces
`ar.ts` and `en.ts` to stay provably identical in shape — a missing key in
one locale is a TypeScript error, not a silent runtime fallback.

Two fields are deliberately **not** translated content: `gallery.items[i]`
carries only `{alt, caption}` — the screenshot `src` paths live in the
consuming page/component (`app/[locale]/features/page.tsx`'s `GALLERY`
array, `components/home/Showcase.tsx`'s `ORDER` array), keyed by array index
against `SHOTS` from `lib/screenshots.ts`. Same pattern for `promo` (copy in
content, `src`/`poster` from `PROMO_CLIP` in `lib/screenshots.ts`).

Some concrete figures baked into the Arabic tree (`content/ar.ts`), to
illustrate the level of specificity: hero stats "25 branches, 679
items/sizes, <1s POS→kitchen"; pricing plans Growth (199 EGP/branch/mo,
featured), Scale (499 EGP/branch/mo), Enterprise (custom); market-anchor
rows dated "as of August 2026" citing Foodics Starter/Basic/Advanced
(1,506 / 2,582 / 3,442 EGP) against Moving POS Growth (199 EGP); payments
providers `[Paymob(live), Fawry, Kashier, Geidea, OPay, PayTabs]` with only
Paymob marked `live: true`. `testimonials.items` is an empty array in both
locales on purpose — the comment in `content/ar.ts` says to leave it empty
"until real signed testimonials exist," and `components/home/Testimonials.tsx`
returns `null` when empty rather than rendering placeholder quotes (inventing
quotes attributed to named people is flagged as the one claim a competitor
could legitimately attack).

### `lib/brand.ts` — single source of truth for brand facts

```ts
export const brand = {
  name: { ar: "موفينج POS", en: "Moving POS" },
  wordmark: { ar: ["موفينج", "POS"], en: ["Moving", "POS"] },
  domain: "pos.movingsystems.tech",
  url: "https://pos.movingsystems.tech",
  email: "devya.solutions@gmail.com",
  whatsapp: "201055930032",           // E.164, no plus
  phoneDisplay: "+20 105 593 0032",
  parent: { name: "Devya Solutions", url: "https://devya.dev" },
  flagship: { name: { ar: "بوهَب", en: "BóHub" }, url: "https://bohubegy.com" },
} as const;
```

Everything that needs the domain, brand name, WhatsApp/phone/email, or the
parent-company link reads from here — `lib/meta.ts` (canonical URLs,
hreflang, OG/Twitter card), `app/sitemap.ts`, `app/robots.ts`,
`components/Footer.tsx`, `components/CtaBand.tsx`, `components/Logo.tsx`,
`app/[locale]/about/page.tsx`, `app/[locale]/contact/page.tsx`. Helper
functions colocated: `whatsappLink(message)` (wa.me deep link, URL-encoded,
locale-aware message text passed in by the caller), `telLink` (constant
`tel:` href), `mailtoLink(subject?)`.

The file's own comment records a naming decision worth preserving: the
company is **Devya Solutions**, the domain is **devya.dev**, never
`devya.solutions` — and Moving POS is deliberately *not* a sister brand with
its own `.dev` registration, it's a product living on a `pos.` subdomain.
Since 2026-10-19 it is a member of the **Moving** family (Moving Stores in
devya-commerce, the umbrella site at moving.devya.dev), which writes its name
in Arabic on Arabic pages — موفينج POS, as موفينج ستورز — so `name` differs
per locale and `brandName(locale)` is what titles, JSON-LD and the footer
read. `wordmark` is the lockup's split: the family name bold, the product
regular at 70%. A
trailing comment also documents fields that were *removed* (`social`,
`signupUrl`, `loginUrl`, `demoUrl`) because they had no live consumer once
the hero's "see it running" CTA moved to the on-page `#promo` recording — the
old demo URL pointed at a C4 architecture diagram
(`https://bohub-c4.vercel.app`, still live if ever needed elsewhere).

### `lib/screenshots.ts` — screenshot manifest

Defines `SHOTS: Record<string, Shot>` where each `Shot` carries the **real
captured pixel dimensions and aspect ratio**, not a forced constant. The
file's header comment explains why this matters: an earlier pass forced
every capture to 4:3 with `sips -c`, which *crops and pads* rather than
scales — it sliced the sidebar off the admin console and added black bars.
Captures now range from a 16:9-ish 1480×811 (`WIDE`) to an older 1376×1032
4:3 set (`FOUR3`) to one portrait 1032×1376 (`shellSettings`). Every consumer
(`components/IpadFrame.tsx`, `components/ScreenshotCarousel.tsx`) reads the
ratio from this manifest via `ASPECT_BY_SRC`/`DIMS_BY_SRC` lookups keyed by
`src`, rather than hardcoding one, so a future capture at a new size can't
silently reintroduce the cropping bug.

`PROMO_CLIP` (video) is kept in the same file for the identical reason: the
tablet frame sizes its glass from an aspect number, and a wrong aspect
letterboxes the clip the same way the hardcoded 4:3 used to letterbox stills.
Shot at 1450×840.

`-v2` filename suffix (`admin-dashboard-v2.webp`, `pos-order-v2.webp`, etc. —
7 of the 13 files under `public/screenshots/`) is explained as deliberate,
not accidental: a previous deploy shipped different bytes at the *same*
path, and Next serves optimized images from an immutable-cached URL keyed on
the source path — a returning visitor would keep the old, cropped copy
indefinitely. Renaming the file is the only reliable cache-bust; there is no
comment suggesting a cache-busting query param was considered and rejected,
just that the rename is what shipped.

## 4. Design system

Since 2026-10-19 the look is **Moving Stores'** — the palette, type and mark of
its landing (devya-commerce `apps/admin/features/landing/landing.css`,
`apps/admin/app/tokens.css`, decision 0004), the same values the
moving.devya.dev umbrella site carries: bone paper, warm ink, one saffron
accent used as a fill and never as text on paper, square corners, hairline
rules, a construction grid, and a square-Kufic "م" for a mark. (Until then it
was the BóHub house palette: maroon, caramel, espresso, boba pearls.) Change a
colour in devya-commerce first, then here.

### Token-driven palette, light + dark

Every color is a CSS custom property defined **twice** — `:root[data-theme="light"]`
and `:root[data-theme="dark"]` in `app/globals.css` — plus a third
`@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ... } }`
block that mirrors the dark set for a page without the attribute (none ships
without it). Because the theme *default* is light (`data-theme="light"`
hardcoded in `app/[locale]/layout.tsx`, as the umbrella site boots), dark
mode is the one visitors opt into, and the toggle remembers it.

The token *names* predate the palette and were kept so the rebrand was a
change of values, not of every component: `--bg/--surface/--surface-2/
--surface-3/--line/--line-strong` (paper, card, deep paper; hairlines),
`--ink/--ink-2/--ink-dim` (warm ink, muted), `--brand/--brand-hover/
--brand-soft/--on-brand` (the primary: ink on paper, bone on night),
`--saffron/--on-saffron` (the accent fill), `--caramel` (the amber *text*
accent: `#8a5600` on paper, saffron on night), `--gold` (saffron),
`--pink` (a warm stone, a fifth icon-tile hue), `--mint/--ok/--danger`,
`--espresso/--espresso-2/--espresso-line/--on-espresso/--on-espresso-dim`
(the dark band: Moving's ink band in light, a deeper night in dark),
`--grid-line`, and `--mark-tile/--mark-glyph/--mark-accent` (the mark, which
flips with the theme). Tailwind's `--radius-lg/xl/2xl` are pinned to 2px in
the `@theme inline` block, so `rounded-xl` panels are square like the
reference; `rounded-full` (dots, toggles, FABs) and `rounded-3xl` (the phone
mock) keep their curves. `tests/tokens.test.ts` recomputes the WCAG contrast
of every text pair from `globals.css` in both themes.

Custom `@custom-variant dark` (`app/globals.css`) makes `dark:` follow the
explicit `data-theme` choice first, OS preference only as fallback — same
precedence as the token blocks. Used almost nowhere except `ThemeToggle`'s
own sun/moon SVG swap (both icons always render; CSS hides the wrong one, so
it's correct even pre-hydration).

### Dark bands

`.band-espresso` is the recurring **dark interruption** between paper
(`bg-bg`) and deep-paper (`.band-cream` = `var(--surface-2)`) sections —
used for Marquee, Promo, BrandPromise, the ROI-calculator result panel, the
About "numbers" and "built by" sections, the CtaBand card and the footer.
Inside it, the tokens that would vanish against ink are **re-pointed** the
way Moving Stores' bands re-point theirs — `--ink-dim` → the band's dim,
`--caramel` → saffron, `--line` → the band's rule, the mark to a bone tile —
so components need no band-specific classes. Often paired with
`.pearl-grid-dark` (a faint 2rem construction grid). The reasoning stated in
`components/home/Promo.tsx`'s comment: three paper sections in a row would
read as "more of the same" — the dark interruption is deliberate rhythm.

### Saffron cells, labels, indexes

`.pearl` (class name kept from the boba pearl it replaced) is now a 0.625rem
saffron square — a cell of the grid the mark is drawn on — in every
`.kicker` eyebrow, list item, `PearlRule` divider and carousel caption.
`.kicker` is Moving Stores' eyebrow: small mono caps with 0.1em tracking in
English, Plex Arabic without caps or tracking in Arabic, muted. `.t-index`
sets Latin digits in Plex Mono as one LTR run: the hero's "00" and the
numbered header nav ("01 Features"). The hero's accent line is `.text-band`:
a saffron marker band behind ink type on paper, saffron type on night.
Buttons are square (2px), 1.5px-bordered, and change colour on hover (ink →
saffron) rather than lifting; cards are ruled, square boxes whose hover
raises the ground and darkens the hairline. The header is solid paper with a
hairline, no glass.

### Type

Moving Stores' type, wired in `app/[locale]/layout.tsx` + `app/globals.css`:
**IBM Plex Sans Arabic** (Arabic text, `--font-plex-arabic`) and **IBM Plex
Sans** (Latin text, `--font-plex-sans`), each first on its own locale with
the other behind it, so "POS" inside Arabic copy stays in the family;
**Reem Kufi** (display, both scripts, `--font-reem-kufi`); **IBM Plex Mono**
(indexes and English labels, `--font-plex-mono`). `.font-display` is Reem
Kufi 700 at `-0.015em` / `1.04` in Latin and no tracking / `1.32` in Arabic
(tracking breaks the joins; the descenders need the line).

**`preload: false`** on the Latin text face and the mono — deliberate, not an
oversight. next/font emits preload hints per *route* from the module graph,
not from which className actually renders, so with preload on, every Arabic
page (default locale, most of the traffic) fetched Latin files for a handful
of Latin words. `display: "swap"` covers the one-beat-later cost.

### Mark, icons and OG cards

The mark is Moving Stores' (`components/Logo.tsx` `MARK`): on an 8 × 8 grid
of 8-unit cells, a square-Kufic "م" whose counter is a lit saffron window,
coloured from `--mark-*` so it flips with the theme and the band. The lockup
is Moving Stores': Reem Kufi at 0.68 of the mark, gap 0.4, the family name
bold and "POS" regular at 70%, Arabic name on Arabic pages. `app/icon.svg`
follows `prefers-color-scheme` the way Moving Stores' favicon does. The baked
rasters — `app/apple-icon.png`, `public/brand/devyapos-icon-{192,512}.png`
and the OG cards `public/og/og-{ar,en}.png` — are rendered from HTML by
`node scripts/render-brand-assets.mjs` (system Chrome, headless). Not
`next/og`: satori rejects the GSUB tables of Reem Kufi / Plex Sans Arabic
and fails the build. Re-run the script after changing the hero copy, the
product name or the mark, and commit the PNGs; `lib/meta.ts` `ogImageUrl()`
points every page's Open Graph and Twitter card at them.

### Device mockups: `IpadShell` / `IpadFrame` / `IpadVideo`

`components/IpadShell.tsx` is the extracted, shared chrome (body gradient,
camera dot, screen well, glass sheen) — pulled out once the promo video
needed the same bezel as the screenshots, "duplicating the bezel maths would
have meant two mockups drifting apart the first time a radius changed."
Geometry is entirely `clamp(rem, %, rem)` against the component's own width
(`--ipad-bezel`, `--ipad-radius`), so it scales proportionally from a 320px
phone to the desktop cap with zero breakpoints. RTL-safe by construction:
the camera dot is centered with `justify-center` inside a symmetric
`inset-x-0` strip, not a `start`/`left` offset.

- `components/IpadFrame.tsx` wraps a static screenshot (`next/image`,
  `object-contain` not `cover` — a non-4:3 capture letterboxes rather than
  losing a sidebar/totals column). Reads real dimensions from
  `DIMS_BY_SRC`/`ASPECT_BY_SRC` in `lib/screenshots.ts`, falling back to a
  4:3 constant only as a last resort.
- `components/IpadVideo.tsx` (client component) wraps the promo `<video>` —
  see §5 for its loading strategy.

### Reveal / scroll animations and reduced-motion behavior

Two distinct animation primitives, both designed around a no-JS-first
render and both fully neutered under `prefers-reduced-motion: reduce`:

- **`components/Reveal.tsx`** — one-shot entrance. `immediate` mode (used
  for every above-the-fold element: Hero, PageHero) fires a plain CSS
  keyframe (`.reveal-now` / `@keyframes reveal-rise`) that's already present
  in server HTML, so the hero paints without waiting on hydration. Default
  mode renders visible-by-default (`.reveal-armed` only gets added by a
  `useEffect`, so crawlers/no-JS visitors see the finished page), then an
  `IntersectionObserver` swaps `.reveal-armed` → `.reveal-in` on approach —
  a direct DOM class write, not React state, "it is a one-shot visual
  effect, and routing it through state would re-render the subtree for it."
  Under reduced motion, `.reveal-armed { opacity: 1; transform: none; }`
  neutralizes the hidden state entirely (`app/globals.css`).
- **`components/ScrollLift.tsx`** — continuous scroll-linked easing (used on
  the promo video and Tour's selected screenshot) via a single CSS custom
  property `--p` (0→1) written from a `requestAnimationFrame`-throttled
  scroll handler; the transform/opacity read from `--p` in CSS, so the
  browser only ever composites, no React re-render per frame. Renders at
  rest (`--p: 1`) until JS arms it, so no-JS visitors see the finished
  state. `prefers-reduced-motion` short-circuits the effect entirely (never
  attaches the scroll listener).

A third, more elaborate reveal choreography exists specifically for the
Ledger rows (`.ledger-problem`/`.ledger-fix`/`.ledger-arrow` in
`app/globals.css`): the "problem" settles first, then the "fix" arrives from
the reading edge (logical `translate` — flips automatically in RTL via
`[dir="rtl"] .reveal-armed .ledger-fix { --fix-from: -28px; }`) 150ms later,
then the connecting arrow scales in at 290ms — so the before/after relation
is carried by motion sequencing, not just the static arrow glyph. Every one
of these transitions is separately zeroed under `prefers-reduced-motion`.

**Scroll-linked touches** (the last block of `app/globals.css`): CSS view
timelines, only inside `@supports (animation-timeline: view())` and
`@media screen and (prefers-reduced-motion: no-preference)`, decorative and
never hiding content — elsewhere the page is the still version. Feature tiles
turn in (`.sl-pop`), pricing ticks fill row by row (`.sl-tick`), the
`PearlRule` dividers are laid down from the reading edge, a glint crosses each
`IpadShell`'s glass as the device passes (a named `--device` timeline, on the
inline axis inside the carousel track, so it follows a swipe), and the contact
drawing's dashes run while a square rides each line (`.reach-ride`: a
square-capped zero-length dash moved by `stroke-dashoffset` on a
`pathLength=100` path; CSS `offset-path` on SVG did not map to viewBox units).

**The mark in motion** (block after the scroll-linked touches in
`app/globals.css`), all built from the exported `MARK` paths and colours in
`components/Logo.tsx`, never a copy:

- `components/MarkDraw.tsx` overhangs the hero card's end corner and draws
  itself in from server-HTML keyframes: the tile settles, the letter's edge
  is traced (`stroke-dashoffset`, once) then filled, the window lands, then
  now and again the window flickers off and on like a shop sign. Each
  element's resting style is its final state, so reduced motion is the plain
  mark. Never mirrored in RTL; only its corner follows the reading direction.
- `components/BrandShapes.tsx` scatters faint letters, letter outlines (drawn
  like Moving Stores' Kufic trail frames) and receipts behind Features, the
  proof band (`CaseStudy`) and the `CtaBand` card: a slow transform-only
  float, plus view-timeline parallax. Placement, tilt and drift mirror in RTL
  (`--dir`); the artwork does not.
- `components/StepDivider.tsx` gives the top of `CaseStudy`, `Showcase` and
  `HomeContact` a square-Kufic step, absolutely positioned above the section
  so it adds no height; mirrored in RTL, and it rises as it scrolls in.
- `components/MotionScope.tsx` pauses `.motion-loop` children off screen via
  an IntersectionObserver (`data-inview`); without JS the loops just run.

## 5. Notable engineering decisions

- **`localeDetection: false`, Arabic for everyone at `/`**
  (`i18n/routing.ts`). next-intl's default `Accept-Language` negotiation was
  sending every `en-US` browser — "including most of the team's" — to `/en`,
  making the configured default locale invisible in practice for an
  Egyptian-restaurant product whose front door should be the Arabic page.
  Because `localePrefix: "always"`, every internal link already carries its
  locale, so a visitor who explicitly switches to English via the header
  toggle stays on `/en` as they navigate — only the *bare, unprefixed* `/`
  request is affected by turning off negotiation.

- **Promo video loading strategy** (`components/IpadVideo.tsx`): `preload`
  stays `"none"` and playback is driven entirely by an `IntersectionObserver`
  (`threshold: 0.2`, `rootMargin: "300px 0px"` — starts fetching just before
  the element enters view) calling a `start()` helper that force-raises
  `preload` to `"auto"`, conditionally calls `.load()`, then `.play()`
  (rejection swallowed — a blocked autoplay just leaves the poster up,
  treated as a fine resting state, not an error). The file's comment
  explains *why* this is manual rather than relying on the `autoplay`
  attribute: left alone the element fired `loadstart` → `stalled` and sat at
  `readyState 0` forever, because "the browser never retries a stalled media
  fetch on its own." A **bounded single retry** on `stalled`/`error` events
  re-triggers `.load()` + `.play()` once (`retried` flag prevents an
  unbounded hammer on a flaky connection). Visibility also pauses playback
  (leaving the viewport calls `el.pause()`) so a 4-second loop doesn't run
  forever off-screen — "a battery tax on mobile." Under
  `prefers-reduced-motion: reduce`, autoplay never starts at all; the poster
  frame plus a real `<button>` play control (drawn SVG triangle, nudged with
  a logical `ps-[2px]` so RTL doesn't mirror it wrong) is shown instead, and
  nothing is fetched until pressed.

- **Carousel scroll-snap + `scrollIntoView` RTL correctness**
  (`components/ScreenshotCarousel.tsx`): built on native CSS scroll-snap
  (`snap-x snap-mandatory`) rather than a transform-based slider, explicitly
  so the browser owns physics (touch swipe, trackpad flick, keyboard,
  scrollbar drag) "without being re-implemented," and so the carousel still
  functions with zero JS (slides are plain scrollable HTML; JS only adds
  auto-advance + dot indicators). Two places this pays off in RTL:
  - `goTo(i)` uses `slide.scrollIntoView({ inline: "center", block:
    "nearest" })` instead of arithmetic on `offsetLeft`, because
    `offsetLeft` is relative to the nearest *positioned ancestor* (not the
    scroll container) and additionally "breaks in RTL, where the track's
    scroll origin sits on the right." `scrollIntoView` with `inline:
    "center"` is snap-aware and direction-agnostic by construction.
  - The scroll-position→active-dot sync does the equivalent correction:
    it compares `getBoundingClientRect()` centers (viewport-space, direction
    -agnostic) rather than `offsetLeft` deltas.
  - Arrow-key navigation explicitly reads `getComputedStyle(el).direction`
    and flips the +1/-1 step so the *physically*-right arrow key always
    advances forward, matching what the flipped RTL track visually does.
  - Auto-play stops permanently on first interaction (pointer, wheel, or
    arrow key) — "a carousel that yanks itself forward while the visitor is
    reading a caption is worse than no carousel" — and
    `prefers-reduced-motion` disables auto-advance outright.

- Smaller decisions worth carrying forward: the ROI calculator's commission
  rate is a fixed 3-button choice (15/20/25%), not an open slider — an
  earlier 5–35% slider let a visitor land on an unrealistic 5% and watch the
  tool report a *loss*, which the code comment in
  `components/home/RoiCalculator.tsx` calls "a wrong answer that argues
  against the product," worse than no tool. The ROI model also switched from
  total monthly orders to **per-branch** orders × branch count, because
  costing scaled per-branch while the input didn't, which punished exactly
  the multi-branch chains the tool was meant to persuade.

## 6. Rebuild notes for a second product's site

To fork this scaffold for a different product (same house design system,
different brand/content/screenshots), the swap set is:

1. **`lib/brand.ts`** — rewrite `name`, `wordmark`, `domain`, `url`, `email`,
   `whatsapp`, `phoneDisplay`, `parent`, `flagship` (or drop `flagship` if
   the new product has no single reference deployment worth naming).
   Everything downstream (canonical URLs, sitemap, robots, footer, CTA
   bands, About page) re-derives automatically — there should be no need to
   touch a domain/email/phone string anywhere else in the codebase. Grep for
   any literal that *isn't* reading from `brand` before shipping.
2. **`content/ar.ts` + `content/en.ts`** — rewrite both trees in lockstep;
   `content/types.ts`'s `SiteContent` interface is the parity contract, and
   a missing key in one locale is a compile error, so there's no risk of
   silently shipping a locale with stale copy. Write Arabic first if the new
   product is also Egypt/MENA-facing (the codebase's own convention, stated
   in `content/ar.ts`'s header). Watch specifically for content baked with
   real operational figures (branch counts, item counts, pricing figures,
   commission-rate ranges) — those need the new product's real numbers, not
   placeholder copy, per the same "no invented claims" discipline the
   testimonials section follows.
3. **`lib/screenshots.ts` + `public/screenshots/` + `public/video/`** —
   replace the manifest entries with the new product's real capture
   dimensions (do **not** force a uniform aspect ratio — capture, measure,
   declare the true `width`/`height` per shot, per the file's own
   post-mortem on the `sips -c` cropping bug). Re-shoot the promo clip at
   whatever viewport is natural and record its real `aspect`. If a
   screenshot's *bytes* ever change at an existing path, rename the file
   (keep the `-vN` convention) rather than overwriting in place — Next's
   image optimizer caches by source path, and a returning visitor would
   otherwise keep serving the stale cached version indefinitely.
4. **`components/MarketAnchor.tsx` / `pricing.marketAnchor` content block**
   — this is a *dated, sourced* competitor-pricing table, not evergreen
   copy. For a new product, either populate it with that product's own
   verified competitor prices (dated, hedged, per-unit-normalized the same
   way — "someone else's price list is not ours to promise; it moves") or
   remove the section entirely rather than leaving stale/generic figures.
   Same caution applies to `components/home/Compare.tsx`'s category table
   (`compare.rows`) — it deliberately names competitor *product classes*,
   not vendor names, to avoid a disputable claim; keep that framing.
5. **The promo video** (`public/video/pos-demo.mp4` +
   `pos-demo-poster.webp`, wired through `PROMO_CLIP` in
   `lib/screenshots.ts` and consumed by `components/home/Promo.tsx` /
   `components/IpadVideo.tsx`) — needs a fresh capture of the new product
   actually being operated end-to-end (order → payment → receipt, or
   whatever the new product's core loop is); the loading strategy
   (`IpadVideo.tsx`) and the tablet chrome (`IpadShell.tsx`) are both
   product-agnostic and need no changes.
6. **Design tokens stay** — the palette in `app/globals.css`, the pearl
   motif, the espresso-band rhythm, and the two font pairs are the *house*
   system inherited from the BóHub brand site, not this product's own
   identity. Reuse them as-is unless the new product needs distinct
   branding; if it does, the token indirection (`@theme inline` mapping
   `--color-*` → the raw `--*` custom properties, defined once per theme)
   means a rebrand is a token-value edit, not a component rewrite.
7. **`app/robots.ts` / `app/sitemap.ts` / `lib/meta.ts`** — no edits needed
   if step 1 is done correctly; all three already derive purely from
   `brand.url` and `routing.locales`.
