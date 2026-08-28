import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Container } from "@/components/Section";
import IpadVideo from "@/components/IpadVideo";
import Reveal from "@/components/Reveal";
import ScrollLift from "@/components/ScrollLift";
import { PROMO_CLIP, PROMO_CLIP_AVAILABLE } from "@/lib/screenshots";

/**
 * The four-second register recording, on one deliberately oversized tablet.
 *
 * Sits on an espresso band directly after the Ledger. Ledger, Features and the
 * CTA are all `bg-bg`, so dropping this section in on the page background would
 * have made it the fourth cream slab in a row and it would read as more of the
 * same. The dark interruption is the point — this is the one thing on the page
 * that moves, and it should be obvious that it does.
 *
 * The device runs wider than the carousel's 56rem cap. That cap exists because
 * a still screenshot stretched too wide stops reading as a device and starts
 * reading as a browser window; a clip that is visibly *being operated* does not
 * have that problem, and the extra width is what buys the attention.
 */
export default async function Promo() {
  // The stills are back from the demo tenant but the clip is not
  // re-recorded yet — see PROMO_CLIP_AVAILABLE in lib/screenshots.ts.
  if (!PROMO_CLIP_AVAILABLE) return null;

  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section
      /* The hero's "See it running" CTA lands here. */
      id="promo"
      className="band-espresso pearl-grid-dark border-y border-espresso-line py-20 sm:py-24"
    >
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {c.promo.eyebrow}
            </span>
            <h2 className="font-display mt-2 text-2xl text-on-espresso sm:text-3xl md:text-4xl">
              {c.promo.title}
            </h2>
            <p className="max-w-2xl text-on-espresso-dim">{c.promo.sub}</p>
          </div>
        </Reveal>

        <ScrollLift className="mt-10 sm:mt-12">
          <div className="relative">
            {/* Warm bloom behind the glass, so the device looks lit rather than
                pasted onto the band. Purely decorative and non-interactive. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[70%] w-[86%] -translate-y-1/2 blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, color-mix(in srgb, var(--gold) 26%, transparent), transparent 70%)",
              }}
            />
            <IpadVideo
              src={PROMO_CLIP.src}
              poster={PROMO_CLIP.poster}
              aspect={PROMO_CLIP.aspect}
              label={c.promo.alt}
              playLabel={c.promo.play}
              maxWidth="68rem"
            />
          </div>
        </ScrollLift>

        <Reveal>
          <ol className="mx-auto mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-on-espresso-dim">
            {c.promo.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                {/* Separator belongs to the item that follows it, so it never
                    trails the last step on a line that happens to wrap. */}
                {i > 0 && (
                  <span aria-hidden="true" className="text-on-espresso-dim/50">
                    ·
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <span className="pearl" aria-hidden="true" />
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
