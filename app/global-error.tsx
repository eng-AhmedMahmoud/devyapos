"use client";

/*
 * The last-resort page, shown when the root layout itself fails, so it
 * renders its own document with nothing from the app: no fonts, no
 * globals.css, no content module, no locale (the [locale] segment is what
 * failed). It says the same thing in Arabic first and English second, uses
 * the system's colours so it reads in light and dark, and never shows the
 * error's message or stack, only Next's digest, which matches the server's
 * `request_error` log line (instrumentation.ts).
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest: unknown }).digest)
      : null;

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
          colorScheme: "light dark",
          background: "Canvas",
          color: "CanvasText",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <title>حدث خطأ · Something went wrong</title>
        <main style={{ maxWidth: 440 }}>
          <section lang="ar" dir="rtl">
            <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>حدث خطأ غير متوقع</h1>
            <p style={{ margin: 0 }}>تعذّر عرض الموقع الآن. حاول مرة أخرى بعد قليل.</p>
          </section>
          <section lang="en" dir="ltr" style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 18, margin: "0 0 8px" }}>Something went wrong</h2>
            <p style={{ margin: 0 }}>The site couldn&apos;t be shown just now. Please try again shortly.</p>
          </section>
          <button
            type="button"
            onClick={() => retry()}
            style={{ marginTop: 24, padding: "10px 20px", font: "inherit", cursor: "pointer" }}
          >
            حاول مرة أخرى · Try again
          </button>
          {digest ? (
            <p style={{ marginTop: 20, fontSize: 13, opacity: 0.75 }}>
              <code dir="ltr">{digest}</code>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
