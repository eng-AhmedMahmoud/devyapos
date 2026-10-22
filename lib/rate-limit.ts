/**
 * In-memory fixed-window rate limiter for the two routes that write to the
 * data volume (`/api/lead`, `/api/consent`).
 *
 * Production is one container running one `next start` process on the Devya
 * VPS, so this memory is the whole picture: the ceiling is exact, and it
 * resets on every restart and deploy. That is the right trade for a marketing
 * site — it stops a script hammering an endpoint from one address without
 * adding Redis, a bill and a dependency. Each sink's size cap
 * (lib/jsonl-sink.ts) is the backstop against many addresses.
 */

import { isIP } from "node:net";

export interface RateLimiter {
  check(ip: string): { allowed: boolean; retryAfter: number };
}

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  /** Hard cap on tracked addresses, so a distributed flood cannot grow the heap. */
  maxTracked: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(ip) {
      const now = Date.now();
      const recent = (hits.get(ip) ?? []).filter((t) => now - t < options.windowMs);

      if (recent.length >= options.max) {
        hits.set(ip, recent);
        const retryAfter = Math.ceil((options.windowMs - (now - recent[0])) / 1000);
        return { allowed: false, retryAfter };
      }

      recent.push(now);
      // Map preserves insertion order, so re-setting moves this address to the
      // back and the first key is always the least recently seen — a poor
      // man's LRU.
      hits.delete(ip);
      hits.set(ip, recent);
      while (hits.size > options.maxTracked) {
        const oldest = hits.keys().next().value;
        if (oldest === undefined) break;
        hits.delete(oldest);
      }
      return { allowed: true, retryAfter: 0 };
    },
  };
}

/**
 * Client IP, used only for rate limiting and never logged or stored.
 *
 * `X-Real-IP` first: nginx on the VPS sets it from the connection, so a
 * client cannot choose it. The first `X-Forwarded-For` hop is whatever the
 * client sent, which let a script rotate it to dodge the limiter.
 *
 * That trust rests on deploy/nginx.conf setting the header and on the
 * container being reachable only through nginx (tests/nginx-conf.test.ts pins
 * both). As a backstop for a proxy that one day passes a client's header
 * through, anything that is not an IP address shares one "unknown" bucket, so
 * free-form values cannot mint a fresh bucket per request.
 */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return isIP(real) ? real : "unknown";
  const forwarded = req.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (forwarded) return isIP(forwarded) ? forwarded : "unknown";
  return "unknown";
}
