import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Check, Close, Minus } from "@/components/icons";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Category comparison.
 *
 * The competitor column is labelled by product class ("menu & loyalty tools"),
 * not by company name — the claim is about a class, and naming a vendor in a
 * marketing comparison invites a dispute we gain nothing from. The price row is
 * the anchor the pricing section is later read against.
 */
export default async function Compare() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="compare" className="band-cream py-20 sm:py-24">
      <Container>
        <SectionHead
          kicker={c.compare.eyebrow}
          title={c.compare.title}
          sub={c.compare.sub}
        />

        <Reveal delay={100}>
          <div className="card mt-12 overflow-x-auto p-0">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="px-5 py-4 text-start">
                    <span className="sr-only">{c.compare.title}</span>
                  </th>
                  <th className="border-b-2 border-brand bg-brand-soft px-5 py-4 text-center">
                    <span className="inline-flex justify-center">
                      <Logo />
                    </span>
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-ink-dim">
                    {c.compare.them}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 ? "bg-surface-2/70" : undefined}
                  >
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-start font-medium text-ink-2"
                    >
                      {row.label}
                    </th>
                    <td className="bg-brand-soft/40 px-5 py-3.5 text-center">
                      <Cell value={row.us} highlight />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={row.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">
            {c.compare.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

function Cell({
  value,
  highlight = false,
}: {
  value: boolean | "partial" | string;
  highlight?: boolean;
}) {
  if (value === true) {
    return (
      <Check
        width={20}
        height={20}
        className={`mx-auto ${highlight ? "text-brand" : "text-mint"}`}
      />
    );
  }
  if (value === false) {
    return <Close width={18} height={18} className="mx-auto text-line" />;
  }
  if (value === "partial") {
    return <Minus width={18} height={18} className="mx-auto text-gold" />;
  }
  return (
    <span
      className={`font-display text-sm ${
        highlight ? "text-brand" : "text-ink-dim"
      }`}
    >
      {value}
    </span>
  );
}
