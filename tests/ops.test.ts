import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { brand } from "@/lib/brand";

/*
 * How the site is built, served and run in production: next.config's
 * headers and (absent) rewrites, the standalone Docker image and its
 * healthcheck, security.txt, the error boundaries and the server-error log
 * line. scripts/deploy.sh has its own file (tests/deploy.test.ts).
 */

const root = join(__dirname, "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

const navigation = vi.hoisted(() => ({ locale: "ar" }));
vi.mock("next/navigation", () => ({ useParams: () => ({ locale: navigation.locale }) }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("next.config", () => {
  async function config() {
    return (await import("@/next.config")).default;
  }

  it("has no /api rewrite, so an unknown /api path is a 404 and not a proxied 500", async () => {
    const c = await config();
    expect(c.rewrites).toBeUndefined();
    expect(read(".env.example")).not.toMatch(/API_URL/);
  });

  it("builds the standalone server the Docker image runs", async () => {
    expect((await config()).output).toBe("standalone");
  });

  it("still sends the security headers, with CSP and HSTS in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const c = await config();
    const [rule] = await c.headers!();
    expect(rule.source).toBe("/:path*");
    const keys = rule.headers.map((h) => h.key);
    for (const key of [
      "X-Content-Type-Options",
      "Referrer-Policy",
      "X-Frame-Options",
      "Permissions-Policy",
      "Content-Security-Policy",
      "Strict-Transport-Security",
    ]) {
      expect(keys).toContain(key);
    }
    expect(c.poweredByHeader).toBe(false);
  });
});

describe("Docker image", () => {
  const dockerfile = read("Dockerfile");
  const runner = dockerfile.slice(dockerfile.indexOf("AS runner"));

  it("pins every stage to one digest of node:24-alpine", () => {
    const froms = [...dockerfile.matchAll(/^FROM (\S+)/gm)].map((m) => m[1]);
    expect(froms).toHaveLength(3);
    expect(new Set(froms).size).toBe(1);
    expect(froms[0]).toMatch(/^node:24-alpine@sha256:[0-9a-f]{64}$/);
  });

  it("runs only the standalone output, as the unprivileged user", () => {
    const copies = [...runner.matchAll(/^COPY .*$/gm)].map((m) => m[0]);
    expect(copies).toEqual([
      "COPY --from=builder /app/.next/standalone ./",
      "COPY --from=builder /app/.next/static ./.next/static",
      "COPY --from=builder /app/public ./public",
    ]);
    expect(runner).toMatch(/^USER nextjs$/m);
    expect(runner).toMatch(/^CMD \["node", "server\.js"\]$/m);
    // The outbox volume's mount point: the app's alone.
    expect(runner).toMatch(/chown nextjs:nodejs \/data && chmod 700 \/data/);
    expect(runner).toMatch(/^ARG RELEASE=unknown\nENV RELEASE=\$RELEASE$/m);
  });

  it("keeps secrets and non-build files out of the build context", () => {
    const ignored = read(".dockerignore").split("\n");
    expect(ignored).toEqual(expect.arrayContaining([".env*", "!.env.example", ".git", "tests", "docs"]));
  });

  it("is health-checked on /api/health and told its release", () => {
    const compose = read("docker-compose.prod.yml");
    expect(compose).toMatch(/fetch\('http:\/\/127\.0\.0\.1:3000\/api\/health'\)\.then\(r=>process\.exit\(r\.ok\?0:1\)\)/);
    expect(compose).toMatch(/RELEASE: \$\{RELEASE:-unknown\}/);
    expect(compose).toMatch(/- devyapos-leads:\/data/);
  });
});

describe("security.txt", () => {
  const text = read("public/.well-known/security.txt");
  const fields = text
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const match = /^([A-Za-z-]+): (\S.*)$/.exec(line);
      expect(match, line).not.toBeNull();
      return [match![1], match![2]] as const;
    });
  const field = (name: string) => fields.filter(([key]) => key === name).map(([, value]) => value);

  it("is well-formed RFC 9116, pointing at the site's published contact", () => {
    expect(text.endsWith("\n")).toBe(true);
    expect(field("Contact")).toEqual([`mailto:${brand.email}`]);
    expect(field("Canonical")).toEqual([`${brand.url}/.well-known/security.txt`]);
    expect(field("Preferred-Languages")).toEqual(["ar, en"]);
    for (const [key] of fields) {
      expect(["Contact", "Expires", "Canonical", "Preferred-Languages", "Policy", "Encryption", "Acknowledgments", "Hiring"]).toContain(key);
    }
  });

  it("has not expired, and expires within a year", () => {
    const [expires] = field("Expires");
    expect(field("Expires")).toHaveLength(1);
    const at = Date.parse(expires);
    expect(expires).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/);
    expect(at, "security.txt has lapsed: set Expires a year out").toBeGreaterThan(Date.now());
    expect(at - Date.now()).toBeLessThanOrEqual(366 * 86_400_000);
  });

  it("is served as a static file, not routed through the locale proxy", () => {
    // Read from the source: importing proxy.ts pulls in next-intl's
    // middleware, which does not resolve outside Next.
    const source = /matcher: \[("(?:[^"\\]|\\.)*")\]/.exec(read("proxy.ts"));
    expect(source).not.toBeNull();
    const matcher = new RegExp(`^${JSON.parse(source![1])}$`);
    expect(matcher.test("/.well-known/security.txt")).toBe(false);
    expect(matcher.test("/api/health")).toBe(false);
    // …while pages still are.
    expect(matcher.test("/pricing")).toBe(true);
  });
});

describe("error boundaries", () => {
  const error = Object.assign(new Error("db password hunter2 at /srv/app"), { digest: "4049152345" });

  it("the locale boundary speaks the page's language and shows only the digest", async () => {
    const { default: LocaleError } = await import("@/app/[locale]/error");
    for (const [locale, title, home] of [
      ["ar", "حدث خطأ غير متوقع", 'href="/ar"'],
      ["en", "Something went wrong", 'href="/en"'],
    ] as const) {
      navigation.locale = locale;
      const html = renderToStaticMarkup(createElement(LocaleError, { error, retry: () => undefined }));
      expect(html).toContain(title);
      expect(html).toContain(home);
      expect(html).toContain("4049152345");
      expect(html).not.toMatch(/hunter2|\/srv\/app|at Object/);
    }
  });

  it("the global boundary renders its own bilingual document", async () => {
    const { default: GlobalError } = await import("@/app/global-error");
    const html = renderToStaticMarkup(createElement(GlobalError, { error, retry: () => undefined }));
    expect(html).toMatch(/^<html lang="ar" dir="rtl">/);
    expect(html).toContain("حدث خطأ غير متوقع");
    expect(html).toContain('lang="en" dir="ltr"');
    expect(html).toContain("Something went wrong");
    expect(html).toContain("4049152345");
    expect(html).not.toMatch(/hunter2|\/srv\/app/);
  });
});

describe("onRequestError", () => {
  it("logs one JSON line: where and what, never the query, message or headers", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { onRequestError } = await import("@/instrumentation");
    const thrown = Object.assign(new TypeError("could not reach +201001234567 for Mona"), { digest: "77" });
    await onRequestError(
      thrown,
      {
        path: "/api/lead?phone=%2B201001234567",
        method: "POST",
        headers: { cookie: "session=s3cr3t", authorization: "Bearer s3cr3t" },
      },
      { routerKind: "App Router", routePath: "/api/lead", routeType: "route", revalidateReason: undefined },
    );
    expect(log).toHaveBeenCalledTimes(1);
    const line = String(log.mock.calls[0][0]);
    expect(JSON.parse(line)).toEqual({
      level: "error",
      event: "request_error",
      method: "POST",
      path: "/api/lead",
      route: "/api/lead",
      routeType: "route",
      name: "TypeError",
      digest: "77",
    });
    expect(line).not.toMatch(/2010|Mona|s3cr3t|phone/);
  });
});
