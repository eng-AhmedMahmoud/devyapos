import Reveal from "./Reveal";

/** Page-width container — every section shares the same gutter and max width. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Section header. The label is a saffron cell followed by small mono caps —
 * Moving Stores' eyebrow, doing the job a coloured chip would do elsewhere.
 *
 * `align` defaults to `start` because this site sets its sections left/right
 * aligned rather than stacking everything down the centre line.
 *
 * `as="h1"` is for a section that opens its page with no PageHero above it
 * (/compare): the page still needs exactly one h1. Pass `immediate` with it —
 * a heading at the top of the page should paint with the server HTML, not
 * wait for hydration to fade it in.
 */
export function SectionHead({
  kicker,
  title,
  sub,
  tone = "page",
  align = "start",
  as: Heading = "h2",
  immediate = false,
  className = "",
}: {
  kicker?: string;
  title: string;
  sub?: string;
  tone?: "page" | "espresso";
  align?: "center" | "start";
  as?: "h1" | "h2";
  immediate?: boolean;
  className?: string;
}) {
  const espresso = tone === "espresso";
  return (
    <Reveal
      immediate={immediate}
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      } ${className}`}
    >
      {kicker ? (
        <span className="kicker">
          <span className="pearl" aria-hidden="true" />
          {kicker}
        </span>
      ) : null}
      <Heading
        className={`font-display max-w-3xl text-3xl text-balance sm:text-[2.6rem] ${
          espresso ? "text-on-espresso" : "text-ink"
        }`}
      >
        {title}
      </Heading>
      {sub ? (
        <p
          className={`max-w-2xl text-base leading-relaxed text-pretty sm:text-lg ${
            espresso ? "text-on-espresso-dim" : "text-ink-dim"
          }`}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
