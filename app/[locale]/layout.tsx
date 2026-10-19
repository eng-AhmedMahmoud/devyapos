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
import { siteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import Attribution from "@/components/Attribution";
import CookieConsent from "@/components/CookieConsent";
import FloatingActions from "@/components/FloatingActions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { themeBootScript } from "@/components/ThemeToggle";
import "../globals.css";

/* Moving Stores' type (devya-commerce apps/admin/app/[locale]/layout.tsx):
   IBM Plex Sans Arabic and IBM Plex Sans for text, Reem Kufi for display in
   both scripts — a Kufic face, the family the mark's letter is cut from — and
   Plex Mono for indexes and labels. `globals.css` puts the right text face
   first on `html[lang]`. */
const plexArabic = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
});

const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  variable: "--font-reem-kufi",
  display: "swap",
});

/* `preload: false` on the Latin text face and the mono because next/font
   emits its preload hints per ROUTE, from the font calls in the module graph —
   not from which className is actually rendered. With it on, every Arabic
   page (the default locale, so most of the traffic) fetched both Latin files
   for a handful of Latin words. Without the hint the @font-face still resolves
   the moment a page uses it; `display: "swap"` covers the beat. */
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

  return (
    <html
      lang={locale}
      /* Light is the default for everyone, not the visitor's OS preference.
         The boot script below still lets a stored choice win, and the toggle
         overwrites this attribute at runtime. */
      data-theme="light"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${fontVars} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint — see ThemeToggle. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Site-wide structured data: who sells this and what it costs. The
            per-page nodes (BreadcrumbList, FAQPage) are built by
            `pageJsonLd(locale, path)` and mounted by the pages themselves —
            a layout cannot know which route it is wrapping. */}
        <JsonLd data={siteJsonLd(locale)} />
        <NextIntlClientProvider>
          <Header />
          {/* Focusable so "back to the top" can hand the keyboard to the
              page's start, not only scroll there. */}
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <FloatingActions />
          {/* Inside the intl provider: the banner is client-side and reads its
              copy through `useLocale()`. */}
          <CookieConsent />
        </NextIntlClientProvider>
        {/* Records the campaign the visit started on, before the visitor
            navigates away from the tagged landing page — but only once consent
            is granted, and it clears itself if consent is withdrawn.

            Nothing else measures anything here. Vercel Web Analytics and Speed
            Insights were removed on 21 September 2026: no third-party script is
            loaded on this site at all, which is why the consent banner now has
            only this one thing left to gate. */}
        <Attribution />
      </body>
    </html>
  );
}
