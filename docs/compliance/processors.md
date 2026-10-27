# Processors and recipients — pos.movingsystems.tech

Who receives personal data from this site, as of 2026-10-27. The privacy
policy's "who we share with" section must match this table; a new vendor is
added here first. DPA = the vendor's data-processing terms (GDPR Art. 28),
SCC = standard contractual clauses for a transfer outside the EEA (Art. 46).
Open actions are GitHub issues in the milestone
[Compliance & lead hygiene](https://github.com/eng-AhmedMahmoud/devyapos/milestone/1).

| Vendor | Role | What it receives | Where | Safeguard | Status |
| --- | --- | --- | --- | --- | --- |
| Hostinger (VPS `72.61.81.59`) | Processor — hosting | Every request (IP, user agent, URL) in nginx logs, kept 14 days (`/etc/logrotate.d/nginx`, daily × 14); leads that were not forwarded in `leads-outbox.jsonl` on the data volume (365 days); consent receipts in `consent-receipts.jsonl` (365 days, no personal data: random id, time, policy version, choices, locale) | Germany (RIPE: `HOSTINGER-HOSTING`, DE) | Hostinger DPA | Developer to confirm the DPA is accepted on the account ([#41](https://github.com/eng-AhmedMahmoud/devyapos/issues/41)) |
| Lead forward target (`LEAD_FORWARD_URL`) | Processor or Devya's own system | The lead: name, restaurant, phone, branches, message, locale, campaign record (with consent), user agent, referer | Unset in production (2026-10-22): every lead goes to the outbox | — | Developer: choose the CRM, then add it here ([#36](https://github.com/eng-AhmedMahmoud/devyapos/issues/36)) |
| Copies made with `scripts/leads.sh pull` | Devya's own (the operator's machine) | Both files above, as they are on the volume | The operator's laptop, in the directory given to `pull` (0700/0600) | Disk encryption on that machine | Record where copies are kept and when they are deleted; a scheduled encrypted off-box copy replaces them ([#37](https://github.com/eng-AhmedMahmoud/devyapos/issues/37)) |
| Devya control plane (`ops-api.devya.dev`, bohub-pos `ops-store`) | Devya's own system | Accounting-trial sign-ups posted from `/accounting-trial` | Devya VPS | — | Covered by the bohub-pos audit |
| Moving support assistant (`movingsystems.tech`, moving-landing `app/moving-support`) | Devya's own system | What a visitor types into the support chat, the earlier turns of that conversation, the page locale; the visitor's IP reaches it through this site's `/moving-support/*` rewrite and is held in memory only, for rate limits (a day at most). No transcript is stored | Devya VPS (Germany) | — | Since 2026-10-27 ([ADR 0007](../decisions/0007-moving-support-assistant.md)) |
| Anthropic, Google (Gemini API), Groq | Processors — AI models behind the support assistant, tried in that order | The question, the conversation's last turns and passages from the public pages, sent from `movingsystems.tech`'s server, never from the browser | US | Each vendor's API terms and DPA | Developer to confirm the API accounts' data terms (retention, no training) |
| Meta / WhatsApp | Separate controller (WhatsApp Business App) or processor (Business Platform) | Whatever a visitor sends on the WhatsApp line they choose to open, including the placement code (`[P-…]`) the prefilled message ends with | Global (Meta Platforms Ireland for EU users) | WhatsApp Business terms | Legal to confirm which product the line uses ([#41](https://github.com/eng-AhmedMahmoud/devyapos/issues/41)) |
| Gmail (contact address in the policy) | Processor — email | Emails a visitor chooses to send | Global | Consumer Gmail has no DPA | Developer: move contact to a brand-domain mailbox with a business plan ([#45](https://github.com/eng-AhmedMahmoud/devyapos/issues/45)) |
| Cloudflare | DNS only (not proxied), for `movingsystems.tech` and `devya.dev` | DNS lookups, not visitor HTTP traffic | Global | — | Proxying either record would make it a processor: update this table first |
| Let's Encrypt | Certificate authority | Devya's address only | US | — | No visitor data |
| Vercel | **Not a processor for the live site** | Nothing from the site. The legacy project `devyapos` is kept only to answer `devyapos.vercel.app` with a 308 to the site (its per-deployment URLs are behind Vercel's login); a visitor who opens that old address still sends Vercel the request itself before being redirected | Global | — | Since 2026-10-22 (X-Ray T9, #24). Deploying anything there again makes it a processor: update this table first |

Nothing else loads in a visitor's browser: no analytics, no pixel, no
third-party font, script or embed (`tests/privacy.test.ts`, and a same-origin
Content-Security-Policy in production; [ADR 0004](../decisions/0004-no-third-party-trackers.md)).
