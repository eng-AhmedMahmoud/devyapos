# 0008. Leads forward to the ops console's intake, and the form asks for an email

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

[0002](0002-lead-outbox-and-jsonl-sinks.md) left the forward target open: no
CRM had been chosen ([#36](https://github.com/eng-AhmedMahmoud/devyapos/issues/36)),
so every lead sat in the outbox until somebody read it, and nobody was told a
lead had arrived ([#65](https://github.com/eng-AhmedMahmoud/devyapos/issues/65)).
Devya then built a lead intake into its own control plane (bohub-pos
`ops-store`, `POST https://ops-api.devya.dev/api/leads/intake`, spec
`docs/specs/lead-follow-up.md`): it records every enquiry from the Moving
landing sites in the ops console, emails a first reply straight away, and
follows up around day 2 and day 5. Every reply goes by email, and the form
asked for none.

## Decision

- The forward target is that intake. `LEAD_FORWARD_URL` points at it on the
  VPS, and `LEAD_FORWARD_TOKEN` is this site's own entry in ops-store's
  `LEAD_INTAKE_TOKENS` (`devyapos=<token>`), so it can be revoked without
  touching another site.
- The forward contract moves to version 2, the intake's own: `email`,
  `product: "pos"`, `channel: "form"`, `company` in place of `restaurant`,
  `country: null`, and `site` is this site's domain (`brand.domain`), which
  ends the 2026-10-22 log entry that kept `pos.devya.dev` as the tag. The
  retry rules, the outbox fallback and the honest 503 are unchanged.
- The contact form asks for an email, and it is required. The phone stays
  required: the sales follow-up is still a call or a WhatsApp message.
- The route reads the intake's answer. Only `firstReply: "queued"` lets the
  form tell the visitor that a reply is on its way to their address; anything
  else gets the plain thank-you, so the page never promises an email that is
  not being sent.

## Consequences

- A lead has a home that alerts and follows up, but only once both values are
  set on the VPS; until then the outbox is still the system of record.
- One more required field on the only form on the site. The cost is a little
  friction; the gain is an answer within seconds instead of the next business
  day.
- The site now causes emails to be sent to the address a visitor types. The
  collection notice and the privacy policy say so, and each email carries an
  unsubscribe link (sent by ops-store, not by this site). The provider that
  delivers them belongs in `docs/compliance/processors.md` once ops-store
  names it.
- Outbox entries written before this change are version 1; the intake still
  accepts that shape if they are ever re-sent, and records them without
  emailing.
