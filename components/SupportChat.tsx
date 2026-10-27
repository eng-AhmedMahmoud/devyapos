import { brand, whatsappLink } from "@/lib/brand";

/**
 * The Moving support assistant: the widget every Moving landing embeds
 * (moving-landing docs/support-agent.md), served from this origin through the
 * `/moving-support/*` rewrite (next.config.ts). `data-launcher="none"`: the
 * chat button sits in the floating stack (components/FloatingActions.tsx), so
 * the widget draws no button of its own. The hand-off channels are this
 * site's own — the contact page and WhatsApp with a `[P-chat]` code. Only the
 * small loader loads with the page; nothing is sent until a visitor asks.
 */
export default function SupportChat({ locale, waTemplate }: { locale: string; waTemplate: string }) {
  return (
    <script
      src={`${brand.support.path}/v1/loader.js`}
      defer
      data-site="pos"
      data-locale={locale}
      data-launcher="none"
      data-whatsapp={whatsappLink(waTemplate, "chat")}
      data-contact={`/${locale}/contact`}
      data-privacy={`/${locale}/privacy`}
    />
  );
}
