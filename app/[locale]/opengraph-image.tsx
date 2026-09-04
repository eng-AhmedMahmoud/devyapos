import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { brand } from "@/lib/brand";

export const alt = "DevyaPOS — the restaurant OS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Without this the image route stays dynamic — `[locale]` is not resolved from
 * the layout's params — and every crawler that unfurls a link pays for a cold
 * render plus three Google Fonts round trips. Two locales, two PNGs, built
 * once.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* Palette lifted from `app/globals.css` (the dark theme, which is what the
   site boots into) so a shared link looks like the page it opens. */
const C = {
  bg: "#150a09",
  espresso: "#2f1410",
  ink: "#fdf3ea",
  dim: "#b3907d",
  gold: "#dda45c",
  caramel: "#dd8a4c",
  brand: "#c9605f",
  pearlLo: "#4a311f",
};

/**
 * A UA old enough that the Google Fonts CSS API answers with static `.ttf`
 * faces. The modern answer is `.woff2`, which satori (the renderer behind
 * `next/og`) cannot parse, and a variable font it cannot instance.
 */
const TTF_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

/** Both locales build in the same process; fetch each face once. */
const faces = new Map<string, Promise<ArrayBuffer>>();

function googleFont(family: string, weight: number) {
  const key = `${family}:${weight}`;
  const cached = faces.get(key);
  if (cached) return cached;
  const pending = fetchGoogleFont(family, weight);
  faces.set(key, pending);
  return pending;
}

async function fetchGoogleFont(family: string, weight: number) {
  const api = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}`;
  const css = await fetch(api, { headers: { "User-Agent": TTF_UA } }).then(
    (r) => r.text(),
  );
  const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error(`No static face for ${family} ${weight}`);
  const file = await fetch(url);
  if (!file.ok) throw new Error(`${family} ${weight}: HTTP ${file.status}`);
  return file.arrayBuffer();
}

/* The site's two type pairs, as `globals.css` swaps them on html[lang]:
   Cairo + Baloo Bhaijaan 2 carry Arabic, Schibsted Grotesk + Fraunces are
   Latin-only. Registered under neutral names so the layout below never
   branches on locale. */
const PAIRS = {
  ar: { body: "Cairo", display: "Baloo Bhaijaan 2" },
  en: { body: "Schibsted Grotesk", display: "Fraunces" },
} as const;

async function loadFonts(locale: "ar" | "en") {
  const { body, display } = PAIRS[locale];
  const [regular, bold, displayBold] = await Promise.all([
    googleFont(body, 400),
    googleFont(body, 700),
    googleFont(display, 700),
  ]);
  return [
    { name: "Body", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Body", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Display", data: displayBold, weight: 700 as const, style: "normal" as const },
  ];
}

/**
 * Satori shapes Arabic glyphs correctly — the joining forms are right — but it
 * lays every run out left to right and ignores `direction: rtl`, so a plain
 * Arabic string comes out with its words in reverse order. Splitting the line
 * into one flex item per word and reversing the flex axis puts the words back
 * where they belong without touching the glyphs.
 */
function Line({
  text,
  rtl,
  style,
}: {
  text: string;
  rtl: boolean;
  style: React.CSSProperties;
}) {
  const fontSize = Number(style.fontSize ?? 24);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: rtl ? "row-reverse" : "row",
        flexWrap: "wrap",
        alignItems: "baseline",
        /* Satori measures an Arabic word from its unshaped glyph advances
           but draws it shaped, so the slack after a word varies with its last
           letter. The floor keeps the tightest pairs — the small chips — from
           running into each other. */
        gap: Math.max(11, Math.round(fontSize * 0.3)),
        ...style,
      }}
    >
      {text
        .trim()
        .split(/\s+/)
        .map((word, i) => (
          <span key={i} style={{ display: "flex" }}>
            {word}
          </span>
        ))}
    </div>
  );
}

/**
 * Locale-neutral fallback, used only if the font fetch fails at build time.
 * Better a Latin-only brand card than an Arabic one rendered as tofu.
 */
function Fallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 18,
        padding: 76,
        backgroundColor: C.bg,
        color: C.ink,
        backgroundImage: `linear-gradient(160deg, ${C.espresso} 0%, ${C.bg} 60%)`,
      }}
    >
      <div style={{ display: "flex", fontSize: 82, fontWeight: 700 }}>
        {brand.wordmark}
      </div>
      <div style={{ display: "flex", fontSize: 34, color: C.gold }}>
        The restaurant OS — register, kitchen, online, stock
      </div>
      <div style={{ display: "flex", fontSize: 26, color: C.dim }}>
        {brand.domain}
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale !== "en";
  const c = getContent(locale);
  const row = isAr ? "row-reverse" : "row";
  const end = isAr ? "flex-end" : "flex-start";

  let fonts;
  try {
    fonts = await loadFonts(isAr ? "ar" : "en");
  } catch {
    /* No Arabic face means tofu, not a slightly-off headline — bail out to a
       card that carries no Arabic at all. */
    return new ImageResponse(<Fallback />, { ...size });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 76px 64px",
          backgroundColor: C.bg,
          color: C.ink,
          fontFamily: "Body",
          backgroundImage: `radial-gradient(1100px 620px at ${
            isAr ? "88%" : "12%"
          } -10%, rgba(221,138,76,0.30), rgba(21,10,9,0) 62%), linear-gradient(160deg, ${
            C.espresso
          } 0%, ${C.bg} 55%)`,
        }}
      >
        {/* The caramel/gold rule the site puts above its espresso bands. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: 10,
            backgroundImage: `linear-gradient(${
              isAr ? "270deg" : "90deg"
            }, ${C.brand}, ${C.caramel}, ${C.gold})`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: row,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: row,
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* The boba pearl from the brand's section headers. */}
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: 34,
                backgroundImage: `linear-gradient(140deg, ${C.gold}, ${C.pearlLo})`,
              }}
            />
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
              {brand.wordmark}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: C.dim }}>
            {brand.domain}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: end,
            width: "100%",
          }}
        >
          <Line
            /* The badge opens with a "✦" the Arabic faces do not carry. */
            text={c.hero.badge.replace(/^[^\p{L}\p{N}]+/u, "")}
            rtl={isAr}
            style={{ fontSize: 24, fontWeight: 700, color: C.gold, marginBottom: 16 }}
          />
          <Line
            text={c.hero.line1}
            rtl={isAr}
            style={{
              fontSize: 70,
              fontWeight: 700,
              fontFamily: "Display",
              lineHeight: 1.18,
              color: C.ink,
            }}
          />
          <Line
            text={c.hero.line2}
            rtl={isAr}
            style={{
              fontSize: 70,
              fontWeight: 700,
              fontFamily: "Display",
              lineHeight: 1.18,
              color: C.gold,
            }}
          />
        </div>

        <div
          style={{ display: "flex", flexDirection: row, gap: 12, width: "100%" }}
        >
          {c.bridge.chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                border: "1px solid rgba(253,243,234,0.16)",
                backgroundColor: "rgba(253,243,234,0.06)",
              }}
            >
              <Line text={chip} rtl={isAr} style={{ fontSize: 22 }} />
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
