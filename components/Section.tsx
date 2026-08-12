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
 * Section header. The label is a boba pearl followed by small caps — the house
 * motif doing the job a coloured chip would do elsewhere.
 *
 * `align` defaults to `start` because this site sets its sections left/right
 * aligned rather than stacking everything down the centre line.
 */
export function SectionHead({
  kicker,
  title,
  sub,
  tone = "page",
  align = "start",
  className = "",
}: {
  kicker?: string;
  title: string;
  sub?: string;
  tone?: "page" | "espresso";
  align?: "center" | "start";
  className?: string;
}) {
  const espresso = tone === "espresso";
  return (
    <Reveal
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
      <h2
        className={`font-display max-w-3xl text-3xl text-balance sm:text-[2.6rem] ${
          espresso ? "text-on-espresso" : "text-ink"
        }`}
      >
        {title}
      </h2>
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
