/**
 * The site's icons, drawn for it on a 24-unit grid with square caps and
 * mitred joins — the square-Kufic geometry of the mark rather than a generic
 * rounded set. Decorative: every one is aria-hidden; the text beside it
 * carries the meaning.
 */
const PATHS = {
  store: "M3 9.5 4.5 4h15L21 9.5M3 9.5h18M3 9.5V20h18V9.5M9.5 20v-6h5v6",
  register:
    "M4 11h16v9H4zM7 11V4h10v7M9.5 7h5M7.5 14.5h2M11 14.5h2M14.5 14.5h2M7.5 17h9",
  loyalty: "M4 8h16v12H4zM12 8v12M4 12h16M12 8 9 4H7v4M12 8l3-4h2v4",
  chart: "M4 4v16h16M8 16v-4M12 16V8M16 16v-6",
  report: "M6 3h9l3 3v15H6zM15 3v3h3M9 11h6M9 14.5h6M9 18h3",
  tag: "M3 3h8l10 10-8 8L3 11zM7.5 7.5h1v1h-1z",
  box: "M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9",
  branches: "M3 21V10l5-3 5 3v11M13 21V6l4-3 4 3v15M3 21h18M6 13h4M6 16.5h4M15.5 9h3M15.5 12.5h3",
  assistant: "M4 5h16v11h-7l-5 4v-4H4zM9 10.5h.01M12 10.5h.01M15 10.5h.01",
  kitchen: "M3 5h18v11H3zM8 20h8M12 16v4M6 8.5h5M6 11.5h7M15 8.5h3v4h-3z",
  truck: "M2 6h12v10H2zM14 9.5h4l3 3.5V16h-7M4 18.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M16 18.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0",
  card: "M3 6h18v12H3zM3 10h18M6.5 14.5h4",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  receipt: "M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21zM8.5 8h7M8.5 11.5h7M8.5 15h4",
  palette: "M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM15 15h4v4h-4z",
  users: "M3 20v-3l3-3h6l3 3v3M5.5 7.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M15 4.3a3.5 3.5 0 0 1 0 6.4M18 14l3 3v3",
  utensils: "M6 3v7a2 2 0 0 0 4 0V3M8 3v18M16 21V3c-2 1.5-3 4-3 8h3",
  cup: "M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2.5M12 3v2.5",
  bag: "M4 8h16l-1 13H5zM8.5 8V6a3.5 3.5 0 0 1 7 0v2",
  shirt: "M8 3 3 6l2 4 2.5-1V21h9V9l2.5 1 2-4-5-3a4 4 0 0 1-8 0",
  sparkle: "M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5",
  link: "M10 14 14 10M8.5 11.5 6 14a3 3 0 0 0 4 4l2.5-2.5M15.5 12.5 18 10a3 3 0 0 0-4-4l-2.5 2.5",
  layers: "M12 3 3 8l9 5 9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5",
  /* A route: three waypoints on a stepped path — the help centre's role journeys. */
  route: "M4 20v-6h6v-6h6V4h4M16.5 1 20 4l-3.5 3M2 18h4v4H2z",
  whatsapp:
    "M4 20l1.2-3.6A8 8 0 1 1 8 19zM9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.8-2-1-1 1c-1.2-.5-2.2-1.5-2.7-2.7l1-1-1-2z",
  mail: "M3 5h18v14H3zM3 5l9 7 9-7",
  book: "M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z",
  search: "M4 10.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0M15.5 15.5 21 21",
  info: "M3 3h18v18H3zM12 10.5V17M12 7v.01",
  tip: "M9 18h6M10 21h4M8.5 14.5C7 13.3 6 11.6 6 9.5a6 6 0 0 1 12 0c0 2.1-1 3.8-2.5 5V16h-7z",
  warning: "M12 3 2 21h20zM12 10v5M12 18v.01",
  check: "M4 12.5 9.5 18 20 6.5",
  chevron: "M9 5l7 7-7 7",
  image: "M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M15.5 8.5h.01",
  arrow: "M4 12h16M14 6l6 6-6 6",
  plus: "M12 4v16M4 12h16",
  menu: "M3 7h18M3 12h18M3 17h18",
  close: "M5 5l14 14M19 5 5 19",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  size = 24,
  className = "",
  strokeWidth = 1.75,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`shrink-0 ${className}`}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
