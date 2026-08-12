import { getLocale } from "next-intl/server";
import { getContent } from "@/content";

/**
 * Espresso capability ribbon.
 *
 * It replaces the usual "trusted by" logo wall, which this product cannot
 * honestly fill yet. Scrolling the capability list instead states the scope of
 * the platform at a glance and gives the page its first dark interruption.
 *
 * Two identical tracks, the second `aria-hidden` so the list is announced once.
 * The strip is forced to LTR flow (see globals.css) so the tracks always sit in
 * the direction of travel; each phrase carries `dir="auto"` so Arabic shapes
 * correctly inside its own item.
 */
export default async function Marquee() {
  const locale = await getLocale();
  const c = getContent(locale);

  const items = c.marquee.map((item) => (
    <span
      key={item}
      dir="auto"
      className="flex shrink-0 items-center gap-4 px-5 py-4 text-sm font-semibold whitespace-nowrap text-on-espresso"
    >
      <span className="pearl" aria-hidden="true" />
      {item}
    </span>
  ));

  return (
    <section className="band-espresso pearl-grid-dark border-y border-espresso-line">
      <div className="marquee" dir="ltr" aria-label={c.features.title}>
        <div className="marquee-track">{items}</div>
        <div className="marquee-track" aria-hidden="true">
          {items}
        </div>
      </div>
    </section>
  );
}
