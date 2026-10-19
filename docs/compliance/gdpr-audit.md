# GDPR + ePrivacy audit: Moving POS marketing site (devyapos)

- **Date:** 2026-10-19
- **Audited:** `origin/main` @ `123ff02f32fd50416a4b95eb6c1216f64f6d4375` (worktree `feat/gdpr-eprivacy`). While the audit ran, `origin/main` moved on to `8f207c3` (`feat(theme): the site opens light`). That commit changes only the default theme and its docs/tests and has no privacy impact.
- **Method:** read-only code review, plus read-only GETs of production (`https://pos.devya.dev`, `/ar`, `/en`, `/{ar,en}/{privacy,terms,refund}`, `/en/contact`, `/en/accounting-trial`, the JS chunks those pages load, `/robots.txt`, `/sitemap.xml`, `GET /api/lead`). Nothing was posted.
- **Evidence format:** `path:line` relative to the repo root, or "prod:" for a production observation.

---

## 1. Scope

| Surface | What | Deployed how |
|---|---|---|
| `https://pos.devya.dev/{ar,en}/*` | Public marketing site. Next.js 16 App Router + next-intl. Arabic is the default and RTL; English is under `/en`. 13 routes per locale. | **Docker container on the Devya VPS behind nginx.** prod: `Server: nginx/1.24.0 (Ubuntu)` on every response, and DNS `A pos.devya.dev → 72.61.81.59`. Image: `Dockerfile:1-35` (comment at `Dockerfile:1-4`: "Moved off Vercel 2026-09-25"). `docker-compose.prod.yml:1-23` binds `127.0.0.1:3009:3000`, and nginx reverse-proxies to it. The nginx config and the deploy steps are **not in the repo**. Commit `b6e2ba8` says only "same shape as the booking app". |
| `POST /api/lead` | Lead intake route handler (Node runtime) | Same container. prod: `GET /api/lead` returns `405 {"ok":false,"error":"method_not_allowed"}`. |
| `POST https://ops-api.devya.dev/api/trial/claim` | Accounting-trial sign-up. The browser posts there directly (`lib/trial.ts:184-216`). The receiving service lives in the separate `bohub-pos` monorepo (`ops-store`) and is **out of scope** except where this site sends data to it. | The URL is baked in at build time by `docker-compose.prod.yml:10`. prod: the host appears in the shipped JS bundle. |

**Stale deploy docs:** `README.md:40-41`, `docs/spec.md:21-23`, `.github/workflows/ci.yml:1-3` and the comments in `app/api/lead/route.ts:61-67,105,220,239-242` all still say Vercel and rely on "Vercel runtime logs". Production is not on Vercel.

Hosting region: the VPS provider and region are not stated in the repo. The policy says only "outside Egypt" (`content/en.ts:1824`). It is a developer to-do.

## 2. Personal-data inventory

| Data item | Data subjects | Collected where | Stored where | Purpose | Lawful basis | Retention today | Processors / recipients |
|---|---|---|---|---|---|---|---|
| Lead: name, restaurant name, mobile (E.164), branches, free-text message, locale | Prospects (restaurant owners/staff) | `components/ContactForm.tsx:136-145` → `app/api/lead/route.ts:171-250`, validated by `lib/leads.ts:147-200` | (a) `LEAD_FORWARD_URL` target, an unknown system (`route.ts:152-163`). (b) If that is unset or fails, the **full JSON payload goes to container stderr** (`route.ts:243`), i.e. Docker json-file logs on the VPS. `docker-compose.prod.yml` has no `environment`/`env_file`, so in production the container gets no `LEAD_FORWARD_URL` unless it is set out-of-band, and **every lead may currently live only in that log**. | Reply to the enquiry, demo, menu load | 6(1)(b) pre-contract steps + 6(1)(f) (stated in `content/en.ts:1808`) | None enforced. Docker logs persist until the container is removed, which a `compose up --build` deploy does, so leads are *lost* on redeploy. The policy promises deletion within 12 months (`content/en.ts:1815`). | VPS host; forward target (unknown); Devya staff |
| Lead attribution: utm_source/medium/campaign/term/content, first external referrer, landing path+query, landing time (minute) | Visitors who submit the form | `lib/analytics.ts:108-141` → sessionStorage → posted with the lead (`ContactForm.tsx:143`), sanitised `lib/leads.ts:214-234` | sessionStorage (tab), then the same sinks as the lead | Campaign measurement | 6(1)(a) consent (and ePrivacy 5(3) for the storage). **Consent is bypassed on the contact form, see G1.** | Tab lifetime in the browser; server side as for the lead | as above |
| Request context: User-Agent (300 chars), Referer (500), country | Form submitters | `route.ts:217-222` | Lead payload / log | Lead context | 6(1)(f), no balancing documented | as lead | as lead. `country` reads `x-vercel-ip-country`, which nginx never sets, so it is always `null` in production. |
| IP address | Every form submitter | `route.ts:106-110,176-177` | In-process `Map`, ≤10 min, ≤5,000 IPs (`route.ts:69-103`) | Rate limiting | 6(1)(f) | ≤10 min (in memory) | none |
| IP, UA, URL (incl. UTM query), time | Every visitor | nginx access log (not in repo) | VPS | Serving, security | 6(1)(f) | **Unknown** (developer) | VPS host |
| Masked phone (`+2010•••••32`), locale, branches, utm source/campaign | Form submitters | `route.ts:227-234` (`maskPhone` `lib/leads.ts:121-124`) | Container stdout log | Funnel debugging | 6(1)(f) | as Docker logs | VPS host |
| Trial sign-up: name, company, email, phone, country (EG/SA), locale | Prospects (EG + KSA businesses) | `components/TrialForm.tsx` → `lib/trial.ts:193-208` (browser → ops-api, `credentials: "omit"`) | bohub-pos ops-store (out of repo) | Provision trial, follow up | 6(1)(b) | Per policy: trial data deleted after grace period + 14 days for backups (`content/en.ts:1795`). Not verifiable here. | Devya ops VPS (region not stated; the policy says "outside Egypt and Saudi Arabia", `content/en.ts:1794`) |
| Trial result: setup URL + one-time setup token | Trial claimant | `lib/trial.ts:145-161`, shown at `TrialForm.tsx:342` | Not stored by this site | Hand-off | 6(1)(b) | Page lifetime | — |
| WhatsApp / e-mail / phone hand-off (prefilled form text) | Visitors who choose that route | `ContactForm.tsx:100-113,183-200`, `lib/brand.ts:89-100` | WhatsApp (Meta), Gmail inbox (`lib/brand.ts:36`) | Same enquiry | 6(1)(b)/(f) | Unknown (mailbox/WhatsApp history) | Meta (WhatsApp), Google (Gmail). Neither is named in the policy. |
| Theme choice, consent choice, `NEXT_LOCALE` | Every visitor | §4 | Browser | Function | ePrivacy exemption (see §4) | §4 | none |

No accounts, database, analytics, error monitoring or session replay exist on this site.

## 3. Lawful basis

- **Lead form:** pre-contract steps (6(1)(b)) is sound for name/phone/restaurant/message. The policy also cites legitimate interest (`content/en.ts:1808`) but documents **no balancing test**, and UA/referer/country collection rests on 6(1)(f) alone. The policy's "we do not rely on consent" is correct for the lead itself.
- **Attribution (UTM/referrer):** it relies on consent because the banner says so, and storing it on the device needs consent under ePrivacy 5(3). The gate works on the root layout but is **bypassed by `ContactForm.tsx:86-91`** (G1). So attribution data from visitors who refused, or never answered, can reach the server and the forward target/logs with no lawful basis.
- **Full-lead error log** (`route.ts:243`): using a log stream as the system of record is not a separate basis problem. It is a minimisation, retention and security problem (5(1)(c),(e),(f); Art. 32).
- **Trial:** 6(1)(b). Fine. Saudi sign-ups additionally fall under KSA PDPL transfer rules (legal, §13).

## 4. Cookies, storage and third-party requests

| Name / key | Type | 1st/3rd | Category | Set/fired before consent? | Lifetime | Evidence |
|---|---|---|---|---|---|---|
| `NEXT_LOCALE` (`=ar`/`=en`; `Path=/; SameSite=lax`; no `Secure`, no `HttpOnly`) | cookie | 1st | preferences (arguably exempt UI-language cookie) | **Yes.** Set by next-intl middleware on *every* HTML response, including the first. | Session (no Max-Age/Expires) | prod: `set-cookie: NEXT_LOCALE=ar; Path=/; SameSite=lax` on `/`, `/ar`, `/en`, `/en/contact`, `/ar/privacy`, … ; `proxy.ts:5-18`; `i18n/routing.ts:3-21` (`localeDetection: false` + `localePrefix: "always"`, so the cookie is **never read**) |
| `devyapos-theme` (`"light"`/`"dark"`) | localStorage | 1st | strictly necessary / user-requested preference | Written only on a toggle click. Read before consent by the inline boot script. | Persistent | `components/ThemeToggle.tsx:9,19-21,53`; `app/[locale]/layout.tsx:105` |
| `devyapos.consent.v1` (`"granted"`/`"denied"`) | localStorage | 1st | strictly necessary (consent record) | On banner click | Persistent, no expiry | `lib/consent.ts:23,47` |
| `devyapos.attribution.v1` (JSON `LeadAttribution`) | sessionStorage | 1st | marketing | **Intended no** (`components/Attribution.tsx:29-45`). **Actually yes** via `ContactForm.tsx:88-89` (G1). | Tab | `lib/analytics.ts:84,108-141` |
| Fonts IBM Plex Sans/Arabic/Mono, Reem Kufi | request `/_next/static/media/*.woff2` | 1st (self-hosted by `next/font/google` at build) | necessary | n/a. No Google request. | — | `app/[locale]/layout.tsx:2-61`; prod: no `fonts.googleapis.com`/`fonts.gstatic.com` in any page |
| JS/CSS chunks, images, product video | request `/_next/static/*`, `public/*` | 1st | necessary | n/a | — | prod: every `<script src>` is `/_next/static/...`; `components/IpadVideo.tsx:122-132` (`preload="none"`, self-hosted) |
| `POST /api/lead` | request | 1st | necessary (user action) | Only on submit | — | `ContactForm.tsx:136` |
| `POST https://ops-api.devya.dev/api/trial/claim` | request | other origin, same controller | necessary (user action) | Only on submit | — | `lib/trial.ts:193`; prod: host present in bundle |
| `wa.me`, `facebook.com`, `instagram.com`, `devya.dev`, `bohub-c4.vercel.app` | outbound links only | 3rd | — | No request until the visitor clicks | — | `lib/brand.ts:63-91`, `components/CaseStudy.tsx:14`; prod: href only, no embeds/iframes |
| Analytics / pixels / gtag / GTM / Meta Pixel / Sentry / replay / maps / reCAPTCHA | — | — | — | **None present** | — | prod: no such hosts or snippets in the HTML of all 10 pages or in the 13 JS chunks fetched (one chunk fetch timed out); `/_vercel/insights/script.js` returns 404; `lib/analytics.ts:1-18,66-75` (`track()` is a no-op) |

Future risk: `docs/social-launch-plan.md:738-742,909-910` plans a **Meta Pixel + Conversions API "in week 0"**. The current single yes/no consent has no marketing category to gate that, and CAPI sends server-side, which would also need a consent check on the server.

## 5. Consent mechanism (current implementation, in detail)

**Files:** `lib/consent.ts` (store), `components/useConsent.ts` (hook), `components/CookieConsent.tsx` (banner), `components/Attribution.tsx` (the only gated consumer), `lib/analytics.ts` (gated function + no-op `track`), mounted in `app/[locale]/layout.tsx:124,134`.

- **Storage:** `localStorage["devyapos.consent.v1"]`. The value is a **bare string**, `"granted"` or `"denied"`. A missing, unreadable or other value means `"unset"` (`lib/consent.ts:20-42`). There is no timestamp, no categories, no policy/text version and no expiry. The `.v1` in the key is the only versioning (`lib/consent.ts:22-23`).
- **API:**
  - `readConsent()`, `writeConsent("granted"|"denied")`, `resetConsent()` (`lib/consent.ts:32-63`).
  - Changes are broadcast with `window.dispatchEvent(new CustomEvent("devyapos:consent", {detail}))` (`lib/consent.ts:30,51,62`).
  - `useConsent()` = `useSyncExternalStore(subscribe, readConsent, () => "unset")`, listening to that event and to `storage` for cross-tab sync (`components/useConsent.ts:19-30`).
  - The server snapshot is `"unset"`, so the banner is in the prerendered HTML on every page and unmounts after hydration for visitors who have already answered (prod: banner text present in every page's HTML).
- **Categories:** one implicit category (non-essential = first-touch attribution). No analytics or marketing split and no "customise" layer.
- **Gating:**
  - Only `<Attribution />` is gated. It calls `captureFirstTouch()` when `granted` and `clearAttribution()` on any other state (`components/Attribution.tsx:29-45`).
  - No third-party script exists to gate. The Vercel Analytics/Speed Insights removal on 2026-09-21 is noted at `lib/analytics.ts:4-11`.
  - **Leak:** `components/ContactForm.tsx:86-91` calls `captureFirstTouch()` unconditionally on mount. `Attribution`'s effect re-runs only when the consent value changes, so after a client-side navigation to `/contact` the record is written and kept while consent is `unset` or `denied`. It is then posted with the lead (`ContactForm.tsx:143`). On a hard load the record is written and then usually cleared by `Attribution` in the same commit, which still means storage was written before consent. This contradicts the banner ("nothing is stored unless you accept", `content/en.ts:641`).
- **Banner UI** (`components/CookieConsent.tsx:53-95`):
  - Placement: `role="dialog"`, `aria-live="polite"`, `aria-label` = title. It is a non-modal bar fixed at the bottom (`fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5`) with an inner card `max-w-4xl rounded-2xl border bg-surface/95 backdrop-blur shadow-lg`.
  - Layout: a column on mobile and a row from `sm`. Title (`font-display`), a body sentence, then an inline underlined link to `/privacy`.
  - Buttons: two, in DOM order **Reject** (`btn btn-ghost`, an outlined/transparent button) then **Accept** (`btn btn-primary`, filled brand colour). They are the same size (`.btn` `min-height:3rem`, `app/globals.css:545-587`) and `flex-1` on mobile, so in RTL Reject sits at the inline start (right).
  - Reject is as easy as Accept: same layer, one click each. Visual prominence is **not** equal (outline vs filled), although the comment at `CookieConsent.tsx:15-18` claims it is.
  - No close/X button, and ignoring the banner leaves `unset` (treated as denied).
  - The banner publishes its height as the CSS var `--consent-h`, which the floating WhatsApp/back-to-top stack uses (`CookieConsent.tsx:30-47`, `app/globals.css:992-1019`).
- **i18n:** copy is in `content/ar.ts:643-649` and `content/en.ts:639-645`, key `consent: {title, body, policyLink, accept, reject}`, typed in `content/types.ts`. It is read client-side with `getContent(useLocale())` (`CookieConsent.tsx:25-26,51`). `messages/*.json` are not used for it. Direction comes from `<html dir>` (`app/[locale]/layout.tsx:99`).
- **Withdrawal:** **none.** `resetConsent()` says "Used by the policy page link" (`lib/consent.ts:54`) but has **no caller** anywhere. Once answered, the banner never returns. There is no footer "cookie settings" link (`components/Footer.tsx`; prod: no such control).
- **Consent record (Art. 7(1)):** client-only bare string; nothing server-side. Leads that carry attribution do not record which consent version or time authorised it.
- **Re-prompt:** only by changing the key. `lib/consent.ts:12-13` claims "`denied` keeps them unmounted for a year", but there is no expiry logic.
- **Pre-ticked boxes:** none. **Google Consent Mode:** not applicable (no Google tags).
- **Side note (non-privacy follow-up):** during hydration `useConsent()` returns `"unset"`, so `Attribution` calls `clearAttribution()` on every hard page load, even for consenting visitors, and then re-captures the current page. In practice "first touch" becomes "last hard load".

## 6. Privacy policy / cookie policy pages

| Page | ar | en | Indexed | Linked from |
|---|---|---|---|---|
| `/privacy` (`app/[locale]/privacy/page.tsx`, copy `content/{ar,en}.ts` `legal.privacy`) | ✓ prod 200 | ✓ prod 200 | yes | footer "Company" column (`content/en.ts:687`, `content/ar.ts:679`), consent banner (`CookieConsent.tsx:66-71`), contact form notice (`ContactForm.tsx:408-416`), trial form notice (`TrialForm.tsx:274-279`) |
| `/terms` | ✓ (draft) | ✓ (draft) | `noindex,nofollow` (`app/[locale]/terms/page.tsx:17-22`; prod `noindex`) | **not linked** (deliberate, `content/en.ts:675-686`) |
| `/refund` | ✓ | ✓ | `noindex` | footer |
| Cookie policy | ✗ | ✗ | — | prod: `/en/cookies` 404 |

The policy is dated 13 October 2026 in both languages. The Arabic and English bodies match except that the EN "Cookies and browser storage" section has a duplicated theme paragraph (`content/en.ts:1839-1840`; AR `content/ar.ts:1830-1832` has 3 paragraphs).

Art. 13/14 check (`content/en.ts:1763-1872`, AR `content/ar.ts:1755-1863`):

| Item | Status |
|---|---|
| Controller identity + contact | Partial. "Devya Solutions, in Cairo, Egypt", a **Gmail** address and a phone number (`content/en.ts:1777-1778`). No postal address or registration number (the `{cr}` placeholder is unused, `content/en.ts:1076`). |
| DPO / Art. 27 EU representative | Not mentioned. An Art. 27 representative is probably not required (no targeting of EU residents: EGP pricing, Egypt focus), but the policy should say so or legal should confirm. |
| Purposes + lawful bases | Present for the lead (`:1799-1810`). Attribution is described as consent-based in practice but not named as 6(1)(a). Trial basis not stated explicitly. |
| Legitimate interests | Named, not explained or balanced |
| Recipients / processors | **Missing.** "we do not pass it to anyone else" (`:1802`) is inaccurate: VPS host, the lead forward target, WhatsApp/Meta, Gmail/Google. The VPS host is described but not named (`:1823`). |
| International transfers + safeguards | Partial. "outside Egypt" / "outside Egypt and Saudi Arabia" with no country and no safeguard (Art. 46 / adequacy). |
| Retention | Present (12 months for enquiries, `:1815`) but **not implemented** (§8). "Campaign data is aggregated" (`:1816`): no such process exists. |
| Rights | Access, copy, rectification, erasure, restriction/stop, portability, objection: present (`:1859`). |
| Right to withdraw consent | **Missing as a right.** "ignore the banner" is described, but there is no way to withdraw (G3). |
| Complaint to a supervisory authority | Present (EU/UK DPA + Egypt PDPC, `:1861`) |
| Automated decision-making | Present ("none", `:1809`) |
| Source of data | Implicit (all from the data subject). OK. |
| Accuracy of claims | **Inaccurate in four places:** "sets no cookies of its own" (`:1838`; `NEXT_LOCALE` is set). "IP … not stored" (`:1786`; nginx access logs are not covered). "we record … your country" (`:1785`; always null on the VPS). Page meta description (`content/en.ts:69`, `content/ar.ts:73`) says the contact form is sent "from your own WhatsApp or email" and that there are "no cookies of our own". Both are stale since `/api/lead` exists. |
| Versioning | "There is no archive of old versions" (`:1867`) |

Cookie-policy accuracy: the storage paragraph lists theme, consent and attribution, but omits `NEXT_LOCALE` and gives no key names or lifetimes.

## 7. Data-subject rights

- There are no accounts on this site, so no self-serve UI or API.
- All requests are handled manually via e-mail/WhatsApp (`content/en.ts:1860`). There is no documented internal procedure.
- **Practical blocker:** if leads exist only in Docker logs (G2), access, erasure and rectification mean grepping and editing VPS log files by hand. Selective erasure from `json-file` logs is not practical.
- Trial accounts: rights are exercised against bohub-pos ops-store (out of scope). The policy promises deletion after the trial (`content/en.ts:1795`).

## 8. Retention

- No retention code in this repo: no jobs, TTLs or soft-delete (no database).
- Docker logs (full leads at error level and masked leads at info level): `docker-compose.prod.yml` sets no `logging:` options, so the default `json-file` driver has no rotation. Logs grow without bound and are deleted when the container is recreated.
- nginx access logs: unknown (VPS logrotate, not in repo).
- In-memory IP map: ≤10 min (`route.ts:69`).
- Browser: `devyapos.attribution.v1` lasts for the tab. `devyapos.consent.v1` and `devyapos-theme` never expire. `NEXT_LOCALE` lasts for the session.
- Promised but not implemented: delete enquiries within 12 months, aggregate campaign data (`content/en.ts:1815-1816`).

## 9. Processors and international transfers

| Vendor | Receives | Region | DPA/SCC in repo |
|---|---|---|---|
| VPS provider hosting 72.61.81.59 (not named in repo) | All traffic, IPs, leads, logs | Not stated ("outside Egypt") | No |
| `LEAD_FORWARD_URL` target (unknown; may be unset) | Full leads | Unknown | No |
| Devya ops-api (`ops-api.devya.dev`, bohub-pos) | Trial sign-ups | Not stated ("outside Egypt and Saudi Arabia") | Internal (same controller) |
| Meta (WhatsApp) | Enquiries sent via `wa.me` hand-off and floating button | Global | No |
| Google (Gmail `devya.solutions@gmail.com`, `lib/brand.ts:36`) | Mailto enquiries, rights requests | Global | No |
| Let's Encrypt | none (TLS cert only) | — | n/a |
| Vercel | **Nothing, if the old project is disconnected.** README still says "auto-deploys main" (`README.md:40`). If it is still connected, `*.vercel.app` deployments are a second live surface whose leads land in Vercel logs. | — | No (developer to verify) |

No fonts, CDN, analytics, maps or AI vendors.

## 10. Security and PII in logs

- **TLS:** `http://` → 301 to `https://` (prod). Let's Encrypt cert. TLS 1.2 was negotiated (prod).
- **Response headers (prod, every page):** **no `Strict-Transport-Security`, no `Content-Security-Policy`, no `X-Frame-Options`/`frame-ancestors`, no `Referrer-Policy`, no `X-Content-Type-Options`**. `X-Powered-By: Next.js` and `Server: nginx/1.24.0 (Ubuntu)` are exposed. `next.config.ts` has no `headers()` and no `poweredByHeader: false`.
- **Cookie flags:** `NEXT_LOCALE` has no `Secure` and no `HttpOnly`. Low impact, since it is not sensitive.
- **Auth/session:** none on this site. The trial claim uses `credentials: "omit"` (`lib/trial.ts:197`).
- **Rate limits:**
  - `/api/lead`: in-memory, 12 per 10 min per IP (`route.ts:69-103`). The IP comes from the **first** `X-Forwarded-For` hop (`route.ts:107-108`), which a client can spoof unless nginx overwrites the header (config not in repo). The limiter resets on every restart.
  - Honeypot `company` (`route.ts:200-203`).
  - Trial: limited by ops-store (out of scope).
- **Logger calls:**

| path:line | Emits | Assessment |
|---|---|---|
| `app/api/lead/route.ts:243` | `console.error("[lead] NOT FORWARDED …", JSON.stringify(payload))`: **full name, restaurant, full phone, message, attribution, UA, referer** | **High.** Full PII payload in logs, likely every lead in production (G2). |
| `app/api/lead/route.ts:227-234` | `console.log("[lead] received", {id, locale, branches, phone: maskPhone(…), source, campaign})` | Medium/Low: masked phone (first 6 + last 2 digits) plus campaign. Acceptable if log retention is bounded. |
| `app/api/lead/route.ts:134` | forward rejected `{id, status}` | OK |
| `app/api/lead/route.ts:155-158` | forward URL unset `{id}` | OK |
| `app/api/lead/route.ts:201` | honeypot `{id}` | OK |
| `lib/analytics.ts:72-74` | `console.debug` of event + props, dev only | OK (props are scalars without PII) |

- No `console.*` calls in `TrialForm.tsx` or `lib/trial.ts`. No Sentry.

## 11. Controller / processor split

- **Marketing site (this repo):** Devya Solutions is the controller. The policy states this (`content/en.ts:1775-1778`). This is correct and sufficient apart from the identity details (§6).
- **Product (Moving POS platform, bohub-pos):** the restaurant (merchant) is the controller of its diners' data and Devya is the processor. This repo publishes the only customer-facing statement of that split: `content/en.ts:1720-1722` (terms §7: "belong to you … we process them to run the service for you") and privacy `:1845-1848`. Missing:
  - An Art. 28(3) DPA: instructions, confidentiality, sub-processor list and notice, assistance with DSRs and breaches, deletion/return, audits.
  - A sub-processor list page.
  - Guidance or a template for the merchant's own privacy notice on its ordering site.
  - Also: the terms are an unreviewed draft, `noindex`, and not linked from anywhere.
- Devya acts as controller (product side) only for merchant accounts, billing and platform security. That is not documented here.

## 12. Gap register

| ID | Gap | Article | Severity | Proposed fix | Owner |
|---|---|---|---|---|---|
| G1 | `ContactForm` writes `devyapos.attribution.v1` and posts it with the lead regardless of consent | ePrivacy 5(3); GDPR 6(1), 7 | **High** | Delete `captureFirstTouch()` from `components/ContactForm.tsx:86-91`. Make `lib/analytics.ts` `captureFirstTouch`/`readAttribution` themselves return null unless marketing consent is granted (gate in the library, not in callers). Add a vitest covering "no consent → readAttribution() null". | code |
| G2 | Full lead PII logged at error level. With no `LEAD_FORWARD_URL` in `docker-compose.prod.yml`, the log is likely the only store, has no rotation, and is wiped on redeploy. | 5(1)(c)(e)(f), 32 | **High** | (1) Set `LEAD_FORWARD_URL`/`LEAD_FORWARD_TOKEN` via `env_file:` in `docker-compose.prod.yml`, pointing at a durable store with retention. (2) Replace `route.ts:243` with a masked line (`{id, maskPhone}`) plus a durable encrypted fallback (e.g. retry queue / append-only file on a mounted volume with a TTL), never the full payload in stdout. (3) Add `logging: {driver: json-file, options: {max-size: 10m, max-file: "5"}}`. (4) Purge existing VPS container logs that hold leads after recovering them. | code + developer |
| G3 | No way to withdraw or change consent; `resetConsent()` is dead code | 7(3) | Medium | Add a persistent "Cookie settings / إعدادات ملفات تعريف الارتباط" button in `components/Footer.tsx` that reopens the banner/preferences. Port `components/CookieSettingsLink.tsx` + `CONSENT_OPEN_EVENT` from `chore/gdpr-compliance`. Also link it from the privacy page. | code |
| G4 | No consent record: bare string, no timestamp or version; leads don't carry consent proof | 7(1) | Medium | Store JSON `{v, categories:{analytics,marketing}, ts, policyVersion}` under a new key (`…consent.v2`), shape as in `chore/gdpr-compliance` `lib/consent.ts:25-34,87-106`. Include `{consentVersion, consentAt}` in the lead `attribution` block (`lib/leads.ts:37-49`, `route.ts:216`). | code |
| G5 | No granular categories, so the planned Meta Pixel/CAPI cannot be gated correctly | 4(11), 7; ePrivacy 5(3) | Medium | Shared bilingual consent with necessary / analytics / marketing, deny-by-default, "Customise" layer (as in `chore/gdpr-compliance` `components/CookieConsent.tsx`). Attribution goes under marketing. Any future pixel mounts only under marketing, and CAPI only when the lead carries marketing consent. | code |
| G6 | `NEXT_LOCALE` cookie set on every response before consent, never read, and undocumented | ePrivacy 5(3); 13 | Medium | Set `localeCookie: false` in `i18n/routing.ts` (next-intl v4), since locale is always in the URL. Otherwise list it as strictly necessary in the cookie table. | code |
| G7 | No cookie policy, and the storage notice is inaccurate (no key names or lifetimes; omits `NEXT_LOCALE`) | 13; ePrivacy 5(3) | Medium | Add `/[locale]/cookies` with an inventory table (port `app/[locale]/cookies/page.tsx` + `legal.cookies` from `chore/gdpr-compliance`, updated to §4). Link it from the footer and the banner. | code |
| G8 | Privacy policy gaps/inaccuracies: no recipients/processors; transfers without country or safeguard; no LI balancing; no postal address; withdrawal right missing; "no cookies"/"IP not stored"/"country" claims inaccurate; stale meta descriptions | 12, 13 | Medium | Rewrite the `legal.privacy` sections in both `content/en.ts:1763-1872` and `content/ar.ts:1755-1863`: add "Who receives it" (VPS host by name, lead sink, Meta/WhatsApp, mail provider), "Transfers" (country + SCC/adequacy), a 6(1)(a) attribution line, a withdrawal right linking to the cookie settings, and a postal address. Fix `content/en.ts:69` / `content/ar.ts:73`. Drop or implement the `country` field (`route.ts:221`). | code + legal |
| G9 | Retention not implemented (12-month lead deletion, "aggregation", nginx/Docker log retention unknown) | 5(1)(e) | Medium | Retention in the lead sink (scheduled delete at 12 months). Docker log rotation (G2). Document the nginx `logrotate` period (e.g. 14 days) and add it to the policy. Remove the "aggregated" claim unless it is built. | developer + code |
| G10 | Missing security headers (HSTS, CSP, XFO/frame-ancestors, Referrer-Policy, nosniff); `X-Powered-By` exposed | 32 | Medium | `next.config.ts`: `poweredByHeader: false` + `headers()` for all routes (HSTS `max-age=31536000; includeSubDomains`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `frame-ancestors 'none'`, CSP with `connect-src 'self' https://ops-api.devya.dev`). Or set them in nginx, documented in the repo. Hide the nginx version (`server_tokens off`). | code + developer |
| G11 | No processor register / DPAs (VPS host, lead sink, Google Workspace/Gmail, WhatsApp Business) | 28, 30, 44-46 | Medium | Create `docs/compliance/processors.md` (vendor, data, region, DPA link/date). Sign or accept the vendors' DPAs. | developer + legal |
| G12 | Product controller/processor terms (Art. 28 DPA, sub-processor list) absent; terms draft unlinked | 28 | Medium | Publish a DPA + sub-processor page (content here, source of truth in bohub-pos). Have the terms reviewed, then re-link them in the footer. | legal + code |
| G13 | Rate-limit IP taken from the client-controlled first `X-Forwarded-For` hop; in-memory only | 32 | Low | Use `x-real-ip` set by nginx (or the rightmost hop) in `route.ts:106-110`. Commit the nginx snippet that sets it. | code + developer |
| G14 | Reject (outline) less prominent than Accept (filled) | 7(2), EDPB cookie-banner TF | Low | Same class for both buttons in the unified banner (e.g. both `btn-ghost` or both solid). Fix the comment at `CookieConsent.tsx:15-18`. | code |
| G15 | Consent never expires or re-prompts; the comment claims a year | 7 | Low | Re-prompt when `ts` is older than 12 months or `policyVersion` changes (needs G4). | code |
| G16 | Deploy docs say Vercel; the old Vercel project may still deploy `main` | 5(2), 30 | Low | Update `README.md:38-41,53`, `docs/spec.md:21-23`, `.github/workflows/ci.yml:1-3` and the route comments. Disconnect/delete the Vercel project or protect its deployments. Document the VPS deploy steps. | developer + code |
| G17 | Contact e-mail is a Gmail address (Google as processor; brand rule says `@devya.dev`) | 28, 13 | Low | Move `lib/brand.ts:36` to a `devya.dev` mailbox (e.g. `privacy@devya.dev` / `hello@devya.dev`) and update the policy text in both locales. | developer + code |
| G18 | Policy polish: EN duplicate paragraph (`content/en.ts:1839-1840`); no archive of versions (`:1867`) | 12 | Low | Remove the duplicate. Keep dated versions (e.g. `docs/legal/privacy-YYYY-MM-DD.md`) and link "previous versions". | code |

## 13. Needs the developer / legal

- **Developer**
  - Confirm whether `LEAD_FORWARD_URL` is set on the VPS container and where leads go today. Recover any leads from container logs, then purge them.
  - Name the VPS provider and region; accept its DPA. Do the same for Google (mail) and Meta (WhatsApp Business).
  - Commit or document the nginx config: security headers, `X-Real-IP`, `server_tokens off`, access-log retention. Commit or document the deploy steps.
  - Disconnect or delete the legacy Vercel project `devyapos`.
- **Legal**
  - Review the privacy text in both languages after the G8 rewrite. Decide the Art. 27 EU representative question (likely not needed; state why).
  - Write the legitimate-interest balancing note for the lead context data.
  - Review the terms + DPA + sub-processor list for the product (G12).
  - **KSA PDPL:** trial sign-ups from Saudi businesses are sent "outside Egypt and Saudi Arabia". Check the PDPL transfer rules and SDAIA registration needs.
  - **Egypt PDPL (Law 151/2020):** a licence or registration with the PDPC may be required for processing/transfers.
  - Confirm the controller's legal name, registered address and commercial registration number (the `{cr}` placeholder at `content/en.ts:1076`).

- **Leads before 2026-10-19 (checked on the VPS that day).** The running
  container had no `LEAD_FORWARD_URL`, so since the move to the VPS
  (2026-09-25) every lead went only to an error-level log line — and
  `docker compose up --build` deletes the old container's logs on every
  deploy. Leads sent before the last redeploy are not recoverable from the
  host. Before this PR's deploy, any `[lead] NOT FORWARDED` lines still in the
  running container's log were copied to a root-only file on the VPS (see the
  PR) so nothing more is lost; the developer should import them into the CRM
  and then delete that file.

## Appendix: unmerged privacy work

- **`origin/chore/gdpr-compliance` (524dfcc, 2026-09-13): NOT merged.** It is based on a pre-consent main and touches 15 files (+1190/−84). It conflicts with today's main: the same storage key `devyapos.consent.v1` with a JSON value; it still mounts Vercel Analytics; the contact form copy and brand are older. Still useful to port:
  - `lib/consent.ts`: categories `{analytics, marketing}`, `version` + `updatedAt` record, `acceptAll`/`rejectAll`, `CONSENT_OPEN_EVENT`. Re-key it to `.v2`.
  - `components/CookieConsent.tsx`: Accept all / Reject all / Customise, a preferences dialog with OFF-by-default toggles, Escape to close, focus management.
  - `components/CookieSettingsLink.tsx`: footer reopen button.
  - `app/[locale]/cookies/page.tsx` + `legal.cookies` copy in ar/en: categories, inventory, changing your choice.
  - Old privacy sections "Who we share it with" and "Where your data is processed (international transfers)", which main lacks.
  - `components/ConsentedAnalytics.tsx` is obsolete (no analytics now) but is the pattern for any future pixel.
  - Do **not** port its contact-form consent checkbox: the lead basis is 6(1)(b)/(f), and a tick-box would mis-signal consent.
- **`feat/social-links-and-privacy` (83f0cd8, 2026-09-20): merged** into main (social links + reachable privacy notice).
- `origin/fix/consent-lint`: merged.
- Other worktrees (`cursor`, `drinki`, `light-default`, `home-demo-first`) carry no privacy work.

## 14. Fix status

Two PRs, so that policy wording is published only after the developer's
legal review:

- **PR 1 — `feat/gdpr-eprivacy` (mechanics; this PR).**
- **PR 2 — `feat/gdpr-policy-texts`** (privacy policy rewrite, `/[locale]/cookies`). Held until the developer approves the texts.

| ID | Status |
| --- | --- |
| G1 | **Fixed (PR 1).** The campaign record is gated inside `lib/analytics.ts` (`captureFirstTouch` / `readAttribution` return null without the "marketing" category), so no caller can skip it; `tests/attribution.test.ts`. Headless: `/en/contact?utm_source=meta` writes nothing before consent, writes after Accept, is removed on withdrawal. |
| G2 | **Fixed (PR 1).** A lead that is not forwarded goes to an owner-only outbox file on the `devyapos-leads` volume (`lib/lead-outbox.ts`, 365-day retention); every log line carries only the lead id (`tests/privacy.test.ts` greps the route). If there is no durable place the route answers 503 and the form offers WhatsApp/email. Container log capped. **Developer:** leads posted before this deploy existed only in container logs, which each redeploy deletes — see §13; set `LEAD_FORWARD_URL` in `.env.production.local` on the VPS when a CRM is chosen. |
| G3 | **Fixed (PR 1).** "Cookie settings" in the footer opens the shared panel; withdrawal clears the campaign record and reloads. |
| G4 | **Fixed (PR 1).** Record `{v, id, at, policy, choices, action}` under `devyapos.consent.v2`; receipt `POST /api/consent` → one `{"event":"consent"}` log line, no personal data. |
| G5 | **Fixed (PR 1).** Categories (necessary + marketing — the only optional thing used), nothing pre-ticked. |
| G6 | **Fixed (PR 1).** `localeCookie: false`. |
| G7 | PR 2. |
| G8 | PR 2 — **draft for legal review**. |
| G9 | Outbox retention built (365 days). nginx logs: daily × 14 on the VPS (checked 2026-10-19). Retention at the forward target: developer. |
| G10 | **Fixed (PR 1).** CSP (same-origin + the trial claim origin), HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, `poweredByHeader: false`. |
| G11 | **Fixed (PR 1).** `docs/compliance/processors.md`; DPAs are the developer's. |
| G12 | Developer + legal (product DPA, sub-processor page). |
| G13 | **Fixed (PR 1).** Rate limiter keys on nginx's `X-Real-IP`, else the last `X-Forwarded-For` hop. |
| G14 | **Fixed (PR 1).** Reject / Customize / Accept share one class. |
| G15 | **Fixed (PR 1).** 180-day expiry and policy-version re-ask. |
| G16 | **Fixed (PR 1).** README "Deploy" describes the VPS; `scripts/deploy.sh` commits the process. Disconnecting the old Vercel project: developer. |
| G17 | Developer (mailbox). |
| G18 | PR 2. |

### Verification

Headless Chromium (Playwright 1.63) against the production build, fresh
context per run, `/ar`, `/en`, `/en/contact`: no third-party request, cookie
or storage before consent; banner shown with Reject and Accept the same size
and style; Reject stores a refusal (receipt POSTed) and the banner stays gone
after reload; Accept grants marketing only; "Cookie settings" → panel →
Reject all reloads with nothing optional left; Customize starts with nothing
ticked and saves exactly the chosen category. A test lead with
`LEAD_FORWARD_URL` unset landed in the outbox (mode 0600) and the log showed
only its id.
