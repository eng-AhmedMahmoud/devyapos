import type { SVGProps } from "react";

/**
 * Inline stroke icons. Marketing pages ship no icon library — every glyph is a
 * 24px stroke path so the whole set costs a couple of kilobytes and inherits
 * `currentColor` from the tile it sits in.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={22}
      height={22}
      {...props}
    >
      {children}
    </svg>
  );
}

const Register = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M7 13h4M7 16.5h2" />
    <circle cx="16.5" cy="15" r="1.6" />
  </Base>
);

const Kds = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="4" width="19" height="13" rx="2" />
    <path d="M8 21h8M12 17v4M6.5 8.5h6M6.5 12h4" />
  </Base>
);

const Cart = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.3a2 2 0 0 0 2-1.5L20 8H6" />
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </Base>
);

const Stock = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
    <path d="M3 12.5 12 17l9-4.5M3 17 12 21.5 21 17" />
  </Base>
);

const Branches = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3v5M6 21v-5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v5" />
    <circle cx="12" cy="3.6" r="1.6" />
    <rect x="4" y="18" width="4" height="4" rx="1" />
    <rect x="16" y="18" width="4" height="4" rx="1" />
  </Base>
);

const Loyalty = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
    <path d="M16 5h2.5a2.5 2.5 0 0 1-2.5 4M8 5H5.5A2.5 2.5 0 0 0 8 9M12 11v4M9 20h6l-.6-2.4a1 1 0 0 0-1-.8h-2.8a1 1 0 0 0-1 .8L9 20Z" />
  </Base>
);

const Pay = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="M2.5 10h19M6 15h4" />
  </Base>
);

const Chart = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-4M12.5 16V8M17 16v-6" />
  </Base>
);

const Lang = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 9.5h17.6M3.2 14.5h17.6M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </Base>
);

const Qr = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM20.5 14v3M14 20.5h7" />
  </Base>
);

const Coins = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="12" cy="6.5" rx="7.5" ry="3" />
    <path d="M4.5 6.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5" />
    <path d="M4.5 11.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5" />
  </Base>
);

const Link = (p: IconProps) => (
  <Base {...p}>
    <path d="M10 13.5a4 4 0 0 0 5.7.3l2.6-2.6a4 4 0 0 0-5.7-5.7l-1.4 1.4" />
    <path d="M14 10.5a4 4 0 0 0-5.7-.3l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.4-1.4" />
  </Base>
);

const Printer = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 9V3h10v6" />
    <rect x="3.5" y="9" width="17" height="7" rx="2" />
    <path d="M7 14h10v7H7z" />
  </Base>
);

const Warn = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 21 19.5H3L12 3.5Z" />
    <path d="M12 9.5v4.5M12 17.2h.01" />
  </Base>
);

const Bolt = (p: IconProps) => (
  <Base {...p}>
    <path d="M13.5 2.5 5 13.5h6l-.5 8 8.5-11h-6l.5-8Z" />
  </Base>
);

const Shield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Base>
);

const Bell = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5Z" />
    <path d="M10.2 19a2 2 0 0 0 3.6 0" />
  </Base>
);

const Users = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3.2 2.5-5.5 5.5-5.5s5.5 2.3 5.5 5.5" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17 14.8c2.2.6 3.5 2.5 3.5 5.2" />
  </Base>
);

const Clock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.3l3.2 2" />
  </Base>
);

const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Base>
);

const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Base>
);

const Minus = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 12h12" />
  </Base>
);

const Arrow = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
  </Base>
);

const Chevron = (p: IconProps) => (
  <Base {...p}>
    <path d="m7 10 5 5 5-5" />
  </Base>
);

const Menu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
);

const Whatsapp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={22} height={22} {...p}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.8 9.8 0 0 0 4.68 1.2h.01c5.43 0 9.83-4.4 9.83-9.84C21.88 6.4 17.47 2 12.04 2Zm0 17.96h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.18.83.85-3.1-.2-.32a8.13 8.13 0 0 1-1.25-4.34c0-4.51 3.68-8.18 8.2-8.18a8.18 8.18 0 0 1 8.18 8.19c0 4.51-3.67 8.18-8.13 8.24Zm4.5-6.13c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.55.13-.17.24-.64.79-.78.95-.14.17-.29.19-.53.07-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.24.25-.41.09-.16.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.02s.86 2.34.98 2.5c.12.17 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
  </svg>
);

export const icons = {
  register: Register,
  kds: Kds,
  cart: Cart,
  stock: Stock,
  branches: Branches,
  loyalty: Loyalty,
  pay: Pay,
  chart: Chart,
  lang: Lang,
  qr: Qr,
  coins: Coins,
  link: Link,
  printer: Printer,
  warn: Warn,
  bolt: Bolt,
  shield: Shield,
  bell: Bell,
  users: Users,
  clock: Clock,
} as const;

export type IconName = keyof typeof icons;

/** Renders an icon by content-tree key, falling back to the bolt glyph. */
export function Icon({ name, ...props }: { name: string } & IconProps) {
  const Cmp = icons[name as IconName] ?? Bolt;
  return <Cmp {...props} />;
}

export { Check, Close, Minus, Arrow, Chevron, Menu, Whatsapp, Bolt };
