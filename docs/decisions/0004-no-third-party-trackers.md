# 0004. No third-party trackers; WhatsApp placement codes instead

- **Status:** Accepted
- **Date:** 2026-09-21 (`4b696d5`, analytics removed at the owner's
  instruction), amended 2026-10-22 (placement codes, PR #49)

## Context

The site ran Vercel Web Analytics and Speed Insights until 2026-09-21. The
social launch plan (`docs/social-launch-plan.md`, 2026-09-19) proposed a Meta
Pixel and Conversions API for retargeting. Every such script is a processor,
a cookie or storage question under ePrivacy Art. 5(3), and a line in the
privacy policy. The funnel the business actually measures is WhatsApp
conversations, and with no tracker nothing told the founder which button
started a chat.

## Decision

- No analytics, pixel, tag manager, session replay, error tracker,
  third-party font, script, embed or beacon. `@vercel/analytics` and
  `@vercel/speed-insights` were uninstalled, not just unmounted. `track()` in
  `lib/analytics.ts` stays as a no-op so its call sites keep marking the
  moments worth measuring.
- The production CSP is same-origin (plus the trial claim origin,
  [0003](0003-trial-posts-direct-to-ops-api.md)), so a third-party request is
  refused by the browser; `tests/privacy.test.ts` refuses one in the source.
- The one optional thing stored is the first-touch campaign record
  (sessionStorage), behind the shared consent banner's "marketing" category
  (`docs/compliance/consent-design.md`), and sent only with a lead the visitor
  chooses to submit.
- Every WhatsApp button ends its prefilled message with a placement code on
  its own line, `[P-<source>]` (`whatsappSources` in `lib/brand.ts`). It names
  the button and nothing else: no UTM, nothing stored, nothing about the
  visitor, and the visitor sees it before sending.

## Consequences

- No page-view, conversion or Core Web Vitals numbers. Campaigns are judged by
  WhatsApp conversations by code and by leads in the outbox or CRM.
- Paid campaigns cannot retarget site visitors; the launch plan's §5.2(2),
  §7.1 and §7.4 were rewritten to engagement audiences and the codes, and
  supersede its older pixel advice.
- Adding any tracker reverses this decision: a new ADR, a consent category
  that gates it, a row in `docs/compliance/processors.md`, the privacy policy,
  the CSP and `tests/privacy.test.ts`, in one pull request.
- An error tracker or uptime monitor is a processor too; choosing one
  ([#37](https://github.com/eng-AhmedMahmoud/devyapos/issues/37)) goes through
  the same steps.
- Whether a visible `[P-…]` line suits prospects, and whether twelve codes is
  the right granularity, is the founder's call (PR #49).
