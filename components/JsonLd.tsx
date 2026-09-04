import type { JsonLdNode } from "@/lib/jsonld";

/**
 * Renders schema.org structured data as `application/ld+json`.
 *
 * One or many nodes: a single node is emitted on its own, several are wrapped
 * in a `@graph` so the page carries one script tag rather than a stack of
 * them, and `@id` references between the nodes resolve inside it.
 *
 * `<` is escaped because a `</script>` sequence inside any content string —
 * an FAQ answer, a feature title — would otherwise close the tag early and
 * spill the rest of the JSON into the document as markup.
 */
export default function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const nodes = Array.isArray(data) ? data : [data];
  if (nodes.length === 0) return null;

  const payload =
    nodes.length === 1
      ? { "@context": "https://schema.org", ...nodes[0] }
      : { "@context": "https://schema.org", "@graph": nodes };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
