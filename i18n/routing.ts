import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  /**
   * Arabic is the default for everyone, not just for Arabic browsers.
   *
   * next-intl negotiates `Accept-Language` by default, which sent every
   * en-US browser — including most of the team's — to /en and made the
   * "default locale" setting invisible in practice. This is an Egyptian
   * restaurant product; the Arabic page is the front door, and English is the
   * deliberate switch rather than the other way round.
   *
   * Only bare `/` is affected. `localePrefix: "always"` means every link
   * already carries its locale, so a visitor who switches to English stays on
   * /en as they navigate.
   */
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
