import type { Metadata } from "next";
import { getContent } from "@/content";
import { MARK } from "@/components/Logo";
import { brand } from "@/lib/brand";

/**
 * The 404 for every URL that matches no page: /ar/nope, /en/nope, /nope
 * (after the proxy's 308 to /ar/nope), /wp-login.php.
 *
 * Why this and not a [...rest] catch-all calling notFound() into
 * app/[locale]/not-found.tsx: in Next 16 a notFound() thrown by a dynamic page
 * outside a Suspense boundary is answered with an empty `__next_error__`
 * shell — no lang, no body, and the layout's home-page canonical in the head —
 * and the branded page only appears once the client has rendered it. Next
 * prerenders this file instead and serves it as a complete document with the
 * 404 status and a `noindex` it adds itself (`experimental.globalNotFound` in
 * next.config.ts; `dynamicParams = false` in the locale layout routes unknown
 * first segments here too).
 *
 * Next serves it without any layout, so it renders its own document and,
 * like app/global-error.tsx, carries nothing it does not need: no fonts and no
 * globals.css, system colours so it reads in light and dark. The URL's locale
 * is unknown to a static page, so it says the same thing in Arabic first (the
 * default locale) and English second, each with its own lang and dir, and
 * links to both home pages and both pricing pages.
 */
const ar = getContent("ar");
const en = getContent("en");

export const metadata: Metadata = {
  title: `${ar.notFound.title} · ${en.notFound.title} | ${brand.name.en}`,
  description: en.notFound.body,
};

/* The baked light-theme mark, as the PNG icons carry it. */
const LIGHT = { tile: "#1a1612", glyph: "#f2ede3", window: "#e8a11a" };

const pricing = (c: typeof en) =>
  c.nav.links.find((l) => l.href === "/pricing")?.label ?? "";

export default function GlobalNotFound() {
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
        <main style={{ maxWidth: 460 }}>
          <svg
            viewBox={MARK.viewBox}
            width="56"
            height="56"
            role="img"
            aria-label={brand.name.ar}
            style={{ display: "block", margin: "0 auto 12px" }}
          >
            <rect width="64" height="64" rx={MARK.radius} fill={LIGHT.tile} />
            <path d={MARK.glyph} fill={LIGHT.glyph} fillRule="evenodd" />
            <rect
              x={MARK.counter.x}
              y={MARK.counter.y}
              width={MARK.counter.size}
              height={MARK.counter.size}
              fill={LIGHT.window}
            />
          </svg>
          <p style={{ margin: "0 0 20px", fontSize: 40, fontWeight: 700 }}>404</p>
          {(
            [
              ["ar", "rtl", ar, 1],
              ["en", "ltr", en, 2],
            ] as const
          ).map(([lang, dir, c, level]) => {
            const Heading = level === 1 ? "h1" : "h2";
            return (
              <section key={lang} lang={lang} dir={dir} style={{ marginTop: level === 1 ? 0 : 28 }}>
                <Heading style={{ fontSize: level === 1 ? 22 : 18, margin: "0 0 8px" }}>
                  {c.notFound.title}
                </Heading>
                <p style={{ margin: 0 }}>{c.notFound.body}</p>
                <p style={{ margin: "12px 0 0", display: "flex", gap: 20, justifyContent: "center" }}>
                  <a href={`/${lang}`}>{`${c.notFound.cta} — ${brand.name[lang]}`}</a>
                  <a href={`/${lang}/pricing`}>{pricing(c)}</a>
                </p>
              </section>
            );
          })}
        </main>
      </body>
    </html>
  );
}
