import type { Metadata } from "next";
import { Baloo_Bhaijaan_2, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/meta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${cairo.variable} ${baloo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored theme before first paint — see ThemeToggle. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
