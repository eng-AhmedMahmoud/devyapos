/**
 * The apps a help-centre screenshot may come from, and the devices it is shot
 * on. Every one is an app of the Moving POS platform (the bohub-pos repo),
 * shot by scripts/capture-docs.mjs from an instance seeded with the demo
 * tenant's fictional catalogue (`backend/prisma/seed-data-demo`) — never from
 * a client's deployment, and never with a real customer's data on screen.
 *
 * No origin is typed here: the capture script takes each surface's origin
 * from the environment (`CAPTURE_ORIGIN_<SURFACE>`), because the instance is
 * whatever the person capturing runs locally, and the site's sources name no
 * host outside tests/privacy.test.ts's allow-list.
 *
 * Imported by the site and, directly, by Node (scripts/capture-docs.mjs), so
 * the TypeScript stays erasable.
 */
export type ShotDevice = "desktop" | "phone";

/** Viewports: a laptop at 1×, a phone at 2× so the phone shot stays sharp. */
export const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  phone: {
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
} as const satisfies Record<ShotDevice, object>;

export const BOTH = ["desktop", "phone"] as const satisfies readonly ShotDevice[];
export const DESKTOP = ["desktop"] as const satisfies readonly ShotDevice[];
export const PHONE = ["phone"] as const satisfies readonly ShotDevice[];

export interface ShotSurface {
  /** The bohub-pos workspace package the screen is in. */
  app: "admin-app" | "pos-app" | "shop-app";
  /** "{origin}", "{locale}" and "{path}" are filled in per shot. */
  url: string;
  /**
   * localStorage entries set before the first paint: an app's language when
   * it keeps it there rather than in the URL ("{locale}" is filled in).
   */
  storage?: Readonly<Record<string, string>>;
  /**
   * Signs in to this app before shooting, as the account the capture script
   * is given in the environment. The script refuses any account outside the
   * demo tenant's email domain; no credential is ever in the repo.
   */
  auth?: { app: "admin" | "pos" };
}

export const SURFACES = {
  /* admin-app: the back office, signed in as the demo tenant's owner. */
  "pos-admin": {
    app: "admin-app",
    url: "{origin}{path}",
    storage: { "bohub-admin-lang": "{locale}" },
    auth: { app: "admin" },
  },
  /* pos-app: the register, the shift screen and the kitchen display, signed in as a demo cashier. */
  "pos-register": {
    app: "pos-app",
    url: "{origin}{path}",
    storage: { "bohub-pos-lang": "{locale}" },
    auth: { app: "pos" },
  },
  /* shop-app: the ordering site guests order from (public, no sign-in). */
  "pos-ordering": {
    app: "shop-app",
    url: "{origin}/{locale}{path}",
  },
} as const satisfies Record<string, ShotSurface>;

export type SurfaceName = keyof typeof SURFACES;

export interface ShotSpec {
  surface: SurfaceName;
  /** Path below the surface's root ("" for its home), e.g. "/orders". */
  path: string;
  devices: readonly ShotDevice[];
  /** Wait for this selector before shooting. */
  waitFor?: string;
  /** Click these (Playwright selectors), in order, first. */
  clicks?: readonly string[];
  /** Scroll this into view first. */
  scrollTo?: string;
  /** Extra milliseconds to wait before the shot (a chart that animates in). */
  delay?: number;
  /** Shoot only this element. */
  clip?: string;
  fullPage?: boolean;
  /** Shoot signed out even though the surface signs in (a login screen). */
  signedOut?: boolean;
  /**
   * Sign in as the branch manager instead of the surface's usual account, for
   * a screen the cashier's role cannot open (the table QR codes need
   * `tables.qr`).
   */
  asManager?: boolean;
}
