import type { Metadata } from "next";
import {
  Baloo_Bhaijaan_2,
  Cairo,
  Fraunces,
  Schibsted_Grotesk,
} from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { siteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import Attribution from "@/components/Attribution";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { themeBootScript } from "@/components/ThemeToggle";
import "../globals.css";

/* House type, inherited from the BóHub brand site: Cairo for body copy and
   Baloo Bhaijaan 2 for display. Both cover Arabic and Latin, so a mixed string
   ("إشعارات Push") stays on one metric and headlines get a real rounded
   display cut in either script rather than bolded body text. */
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const baloo = Baloo_Bhaijaan_2({
  variable: "--font-display",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/* Latin-only pair, used on the English side of the site: Fraunces for display
   and Schibsted Grotesk for body — the same combination as the Oz Puzzle site.
   Cairo and Baloo are competent in Latin but they are Arabic faces first, and
   English set in them reads a little generic; Fraunces gives the headlines an
   actual voice.

   These CANNOT replace the Arabic pair — neither family ships Arabic glyphs, so
   applying them site-wide would silently drop every Arabic headline back to a
   system fallback. `globals.css` swaps between the two pairs on `html[lang]`,
   and all four variables are attached below so the swap is a variable lookup
   rather than a conditional font load. */
/* `preload: false` because next/font emits its preload hints per ROUTE, from
   the font calls in the module graph — not from which className is actually
   rendered. With it on, every Arabic page (the default locale, so most of the
   traffic) fetched both Latin files to style nothing. Without the hint the
   @font-face still resolves the moment English matches it; the only cost is
   that English requests them a beat later, which `display: "swap"` covers. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
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

  /* Arabic pages never attach the Latin pair — there is nothing for it to set,
     and it would be two font files fetched to style nothing. English keeps the
     Arabic pair attached as a fallback, because English pages still carry
     Arabic strings (the brand name, the odd product term). */
  const fontVars =
    locale === "ar"
      ? `${cairo.variable} ${baloo.variable}`
      : `${schibsted.variable} ${fraunces.variable} ${cairo.variable} ${baloo.variable}`;

  return (
    <html
      lang={locale}
      /* Dark is the brand's default, not the visitor's OS preference. The boot
         script below still lets a stored choice win, and the toggle overwrites
         this attribute at runtime. */
      data-theme="dark"
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
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {/* Records the campaign the visit started on, before the visitor
            navigates away from the tagged landing page. */}
        <Attribution />
        {/* Both ship nothing in dev and only report from the deployed site. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
