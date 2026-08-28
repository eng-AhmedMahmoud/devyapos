import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { Container } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { PRODUCT_MEDIA_AVAILABLE, SHOTS } from "@/lib/screenshots";

/**
 * Product screenshots on the home page.
 *
 * The page previously showed no image of the product at all — the hero drew a
 * CSS mock and everything else was type. A visitor deciding whether a
 * restaurant system is worth a demo wants to see the thing, and "here it is
 * running" does more than another paragraph claiming it exists.
 *
 * Ordered as the day runs — register, kitchen, customer, then the back office —
 * so it reads as one system rather than four unrelated products. Captions come
 * from the same `gallery` block the features page uses; there is one set of
 * words for these screens, not two to keep in sync.
 */

/** Pairs by index with `gallery.items`. */
const ORDER = [
  SHOTS.posOrder,
  SHOTS.kds,
  SHOTS.shopMenu,
  SHOTS.adminDashboard,
  SHOTS.adminReports,
  SHOTS.adminMenu,
  SHOTS.adminInventory,
];

export default async function Showcase() {
  // Product media withdrawn pending neutral demo captures — see
  // PRODUCT_MEDIA_AVAILABLE in lib/screenshots.ts.
  if (!PRODUCT_MEDIA_AVAILABLE) return null;

  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="band-cream py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-2">
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {c.gallery.eyebrow}
            </span>
            <h2 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
              {c.gallery.title}
            </h2>
            <p className="max-w-2xl text-ink-dim">{c.gallery.sub}</p>
          </div>
        </Reveal>
        <div className="mt-9">
          <ScreenshotCarousel
            ariaLabel={c.gallery.title}
            items={ORDER.map((shot, i) => ({
              src: shot.src,
              alt: c.gallery.items[i].alt,
              caption: c.gallery.items[i].caption,
              // All seven here are landscape; the frame reads each one's real
              // aspect from the manifest, so nothing needs declaring.
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
