import type { Instrumentation } from "next";

/**
 * Server start-up and server-error hooks (Next's instrumentation file).
 *
 * There is no error tracker on this site yet (tests/privacy.test.ts refuses
 * one until it is chosen and listed as a processor), so the container's logs
 * are where errors go. Both hooks write one JSON line each, so `docker logs
 * devya-devyapos | grep '"event":"request_error"'` finds every server error
 * and the line's digest matches the reference the error page shows.
 */

/** Checks the runtime config once, before the first request (lib/env.ts). */
export async function register(): Promise<void> {
  // The check uses node:fs. `next build` also loads this file to prerender;
  // a build machine's environment says nothing about production's.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { checkConfigAtBoot } = await import("./lib/env");
  await checkConfigAtBoot();
}

/**
 * One line per server error: where (path without its query string, method,
 * route) and what (error name and Next's digest). Never the message, the
 * query, the body or the headers: on the lead route any of them can carry a
 * visitor's name or phone number. Next still prints the stack to stderr
 * itself; this line is the part that can be searched and alerted on.
 */
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String((error as { digest: unknown }).digest)
      : null;
  console.error(
    JSON.stringify({
      level: "error",
      event: "request_error",
      method: request.method,
      path: request.path.split("?")[0].slice(0, 300),
      route: context.routePath,
      routeType: context.routeType,
      name: error instanceof Error ? error.name : typeof error,
      digest,
    }),
  );
};
