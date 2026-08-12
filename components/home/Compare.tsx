import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Check, Close, Minus } from "@/components/icons";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

/**
 * Category comparison.
 *
 * The competitor column is labelled by category ("menu & loyalty tools"), not
 * by company name — the claim being made is about a product class, and naming
 * a specific vendor in a marketing comparison invites a dispute we gain nothing
 * from. The price row is the anchor: our number is read against theirs.
 */
export default async function Compare() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="compare" className="bg-surface py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow={c.compare.eyebrow}
          title={c.compare.title}
          sub={c.compare.sub}
        />

        <Reveal delay={100}>
          <div className="mt-12 overflow-x-auto">
            <table className="card w-full min-w-[34rem] border-separate border-spacing-0 overflow-hidden text-sm">
              <thead>
                <tr>
                  <th className="bg-surface-2 px-5 py-4 text-start font-semibold text-ink-dim">
                    <span className="sr-only">{c.compare.title}</span>
                  </th>
                  <th className="border-b-2 border-brand bg-brand-50 px-5 py-4 text-center">
                    <span className="inline-flex justify-center">
                      <Logo />
                    </span>
                  </th>
                  <th className="bg-surface-2 px-5 py-4 text-center font-semibold text-ink-dim">
                    {c.compare.them}
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.compare.rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-surface-2/60" : ""}>
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-start font-medium text-ink-2"
                    >
                      {row.label}
                    </th>
                    <td className="bg-brand-50/40 px-5 py-3.5 text-center">
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
          <p className="mt-5 text-center text-xs leading-relaxed text-ink-dim">
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
        className={`mx-auto ${highlight ? "text-brand" : "text-emerald"}`}
      />
    );
  }
  if (value === false) {
    return <Close width={18} height={18} className="mx-auto text-line" />;
  }
  if (value === "partial") {
    return <Minus width={18} height={18} className="mx-auto text-amber" />;
  }
  return (
    <span
      className={`font-display text-sm font-bold ${
        highlight ? "text-brand" : "text-ink-dim"
      }`}
    >
      {value}
    </span>
  );
}
