import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/meta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "../globals.css";

/* Type pairing mirrors the category leader: IBM Plex Sans Arabic carries the
   Arabic UI (and has a complete Latin set, so mixed strings stay on one
   metric), Poppins handles numerals, the wordmark and Latin display text. */
const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const latin = Poppins({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${arabic.variable} ${latin.variable} h-full antialiased`}
    >
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
