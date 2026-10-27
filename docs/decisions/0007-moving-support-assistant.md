# 0007. The Moving support assistant, through a same-origin rewrite

- **Status:** Accepted
- **Date:** 2026-10-27

## Context

Every Moving landing — movingsystems.tech, this site, Moving Stores, and the
Moving Accounting landing to come — gets one AI support chat: answers from
the help centre and each product's public pages, a hand-off to a person, no
access to any account. It is built once, in moving-landing
(`app/moving-support`, `support-widget/`): one backend, one embeddable widget.

This site promises no third-party host in the browser ([ADR 0004](0004-no-third-party-trackers.md)):
a same-origin CSP, `tests/privacy.test.ts`, no embed.

## Decision

- `/moving-support/:rest*` is rewritten to `https://movingsystems.tech/moving-support/:rest*`
  (`next.config.ts`; the origin is `brand.support` in `lib/brand.ts`, or
  `MOVING_SUPPORT_ORIGIN` for a staging build). The widget's loader, its
  panel and its API are this origin to the browser: the CSP stays
  `connect-src 'self'` (plus the trial claim), and the browser never contacts
  another host.
- The layout loads `/moving-support/v1/loader.js` with `data-launcher="none"`
  (`components/SupportChat.tsx`): the chat button is a third member of the
  floating stack, not a second corner widget. The hand-off is this site's
  contact page and WhatsApp with a `[P-chat]` code; the widget opens them and
  sends nothing for the visitor.
- Not a consent category: nothing loads or is sent until a visitor asks a
  question, and the conversation's session-storage key is strictly necessary
  for the chat they started.

## Consequences

- New processors, recorded in `docs/compliance/processors.md` and the privacy
  policy: Devya's own server for movingsystems.tech, and the AI model vendors
  behind it (Anthropic, Google, Groq). The visitor's IP reaches
  movingsystems.tech through the rewrite, used there only for rate limits.
- e2e stays hermetic: `e2e/fixtures.ts` stands in for the loader and answers
  the API with a 503, so no test reaches another site.
- If movingsystems.tech is down, the loader fails to load and the chat button
  stays hidden (it shows only once the loader marks `<html data-moving-support="ready">`);
  the rest of the page is unaffected.
