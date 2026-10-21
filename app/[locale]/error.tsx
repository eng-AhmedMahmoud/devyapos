"use client";

import { useParams } from "next/navigation";

/*
 * What a visitor sees when a page under /ar or /en throws: the site's header
 * and footer stay (the locale layout wraps this boundary), the page area says
 * so and offers a retry and the way home.
 *
 * The copy lives here rather than in content/: an error boundary should
 * depend on as little as possible, and importing the content module into a
 * client component would ship both locales' full copy to every browser. It
 * never shows the error's message or stack, only Next's digest, which is the
 * same id the server's `request_error` log line carries (instrumentation.ts).
 */
const COPY = {
  ar: {
    title: "حدث خطأ غير متوقع",
    body: "تعذّر عرض هذه الصفحة الآن. حاول مرة أخرى، أو عد إلى الرئيسية.",
    retry: "حاول مرة أخرى",
    home: "العودة إلى الرئيسية",
    reference: "رقم المرجع",
  },
  en: {
    title: "Something went wrong",
    body: "This page couldn't be shown just now. Try again, or head back home.",
    retry: "Try again",
    home: "Back to home",
    reference: "Reference",
  },
} as const;

export default function LocaleError({ error, retry }: { error: unknown; retry: () => void }) {
  const { locale } = useParams<{ locale: string }>();
  const lang = locale === "en" ? "en" : "ar";
  const c = COPY[lang];
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest: unknown }).digest)
      : null;

  return (
    <section className="hero-wash flex min-h-[70vh] items-center py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 text-center sm:px-8">
        <h1 className="font-display text-2xl text-ink">{c.title}</h1>
        <p className="mt-3 max-w-md text-ink-dim">{c.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn btn-primary">
            {c.retry}
          </button>
          <a href={`/${lang}`} className="btn btn-ghost bg-surface">
            {c.home}
          </a>
        </div>
        {digest ? (
          <p className="mt-6 text-sm text-ink-dim">
            {c.reference}: <code dir="ltr">{digest}</code>
          </p>
        ) : null}
      </div>
    </section>
  );
}
