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
 * Centred section header: orange eyebrow pill, H2, optional lede.
 * `tone="dark"` swaps the palette for the two dark bands.
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
  tone = "light",
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  tone?: "light" | "dark";
  align?: "center" | "start";
}) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start text-start"
      }`}
    >
      {eyebrow ? (
        <span className={`eyebrow ${dark ? "eyebrow-dark" : ""}`}>{eyebrow}</span>
      ) : null}
      <h2
        className={`max-w-3xl text-3xl leading-tight font-bold text-balance sm:text-4xl ${
          dark ? "text-dark-ink" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub ? (
        <p
          className={`max-w-2xl text-base leading-relaxed text-pretty sm:text-lg ${
            dark ? "text-dark-ink-dim" : "text-ink-dim"
          }`}
        >
          {sub}
        </p>
      ) : null}
    </Reveal>
  );
}
