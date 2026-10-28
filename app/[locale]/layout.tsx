import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Reem_Kufi,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getContent } from "@/content";
import { siteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import Attribution from "@/components/Attribution";
import ConsentManager from "@/components/consent/ConsentManager";
import Cursor from "@/components/Cursor";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SupportChat from "@/components/SupportChat";
import JsonLd from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import { themeBootScript } from "@/lib/theme";
import "../globals.css";

/* Moving Stores' type (devya-commerce apps/admin/app/[locale]/layout.tsx):
   IBM Plex Sans Arabic and IBM Plex Sans for text, Reem Kufi for display in
   both scripts — a Kufic face, the family the mark's letter is cut from — and
   Plex Mono for indexes and labels. `globals.css` puts the right text face
   first on `html[lang]`. */
/* Only the hero face is preloaded. next/font emits its preload hints per
   ROUTE, from the font calls in the module graph — not from which className
   is actually rendered — so every face left on preload is fetched at the
   highest priority by every page in both locales. That was six files (about
   190 KB: four Plex Arabic weights and two Reem Kufi subsets) racing the CSS
   for a mobile first paint. Reem Kufi sets every hero h1, the likely LCP
   element, so its two subsets keep the hint. Everything else is `preload:
   false`: the @font-face still resolves the moment a page uses it, and
   `display: "swap"` covers the beat. */
const plexArabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  variable: "--font-reem-kufi",
  display: "swap",
});

/* The Latin text face and the mono were the first to lose the hint: with it
   on, every Arabic page (the default locale, so most of the traffic) fetched
   both Latin files for a handful of Latin words. */
const plexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* Only /ar and /en exist. Any other first segment (/nope.php, /wp-admin) is
   an unmatched URL, so Next answers it with app/global-not-found.tsx, a
   complete 404 document, instead of rendering this layout and throwing. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "home", "");
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  /* All four variables on both locales: Arabic copy carries Latin words
     ("POS", "ESC/POS"), and an English page can still hold an Arabic string,
     so each page keeps the other script's text face behind its own. */
  const fontVars = `${plexArabic.variable} ${plexSans.variable} ${reemKufi.variable} ${plexMono.variable}`;
  // Client components below get only the strings they render, never the
  // content module itself (content/index.ts is server-only).
  const c = getContent(locale);

  return (
    <html
      lang={locale}
      /* Light is the default for everyone, not the visitor's OS preference.
         The boot script below still lets a stored choice win, and the toggle
         overwrites this attribute at runtime. */
      data-theme="light"
      dir={locale === "ar" ? "rtl" : "ltr"}
      /* Smooth scrolling is for anchors on the page. This tells Next to jump,
         not glide, to the top of the next page, under its page transition. */
      data-scroll-behavior="smooth"
      className={`${fontVars} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint — see lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Site-wide structured data: who runs the site, and the site. The
            per-page nodes (SoftwareApplication where prices are shown,
            BreadcrumbList, FAQPage) are built by `pageJsonLd(locale, path)`
            and mounted by the pages themselves — a layout cannot know which
            route it is wrapping. */}
        <JsonLd data={siteJsonLd(locale)} />
        <NextIntlClientProvider>
          <Header nav={c.nav} />
          {/* Focusable so "back to the top" can hand the keyboard to the
              page's start, not only scroll there. */}
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <FloatingActions copy={c.floating} waTemplate={c.contact.waTemplate} />
          {/* The shared consent banner and panel
              (docs/compliance/consent-design.md); copy from content/. */}
          <ConsentManager copy={c.consent} />
        </NextIntlClientProvider>
        {/* Records the campaign the visit started on, before the visitor
            navigates away from the tagged landing page — but only with the
            "marketing" consent category, and it clears itself if that is
            refused or withdrawn.

            Nothing else measures anything here. Vercel Web Analytics and Speed
            Insights were removed on 21 September 2026: no third-party script is
            loaded on this site at all, which is why the consent banner now has
            only this one thing left to gate. */}
        <Attribution />
        <Cursor />
        <SupportChat locale={locale} waTemplate={c.contact.waTemplate} />
      </body>
    </html>
  );
}
