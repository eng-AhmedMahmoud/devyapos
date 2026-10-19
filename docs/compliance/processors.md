# Processors and recipients — pos.devya.dev

Who receives personal data from this site, as of 2026-10-19. The privacy
policy's "who we share with" section must match this table; a new vendor is
added here first. DPA = the vendor's data-processing terms (GDPR Art. 28),
SCC = standard contractual clauses for a transfer outside the EEA (Art. 46).

| Vendor | Role | What it receives | Where | Safeguard | Status |
| --- | --- | --- | --- | --- | --- |
| Hostinger (VPS `72.61.81.59`) | Processor — hosting | Every request (IP, user agent, URL) in nginx logs, kept 14 days (`/etc/logrotate.d/nginx`, daily × 14); leads in the outbox volume (365 days) | Germany (RIPE: `HOSTINGER-HOSTING`, DE) | Hostinger DPA | Developer to confirm the DPA is accepted on the account |
| Lead forward target (`LEAD_FORWARD_URL`) | Processor or Devya's own system | The lead: name, restaurant, phone, branches, message, locale, campaign record (with consent), user agent, referer | Unset in production on 2026-10-19 | — | Developer: choose the CRM, then add it here |
| Devya control plane (`ops-api.devya.dev`, bohub-pos `ops-store`) | Devya's own system | Accounting-trial sign-ups posted from `/accounting-trial` | Devya VPS | — | Covered by the bohub-pos audit |
| Meta / WhatsApp | Separate controller (WhatsApp Business App) or processor (Business Platform) | Whatever a visitor sends on the WhatsApp line they choose to open | Global (Meta Platforms Ireland for EU users) | WhatsApp Business terms | Legal to confirm which product the line uses |
| Gmail (contact address in the policy) | Processor — email | Emails a visitor chooses to send | Global | Consumer Gmail has no DPA | Developer: move contact to a devya.dev mailbox with a business plan |
| Cloudflare | DNS only (not proxied) | DNS lookups, not visitor HTTP traffic | Global | — | Proxying the record would make it a processor: update this table first |
| Let's Encrypt | Certificate authority | Devya's address only | US | — | No visitor data |

Nothing else loads in a visitor's browser: no analytics, no pixel, no
third-party font, script or embed (`tests/privacy.test.ts`, and a same-origin
Content-Security-Policy in production).
