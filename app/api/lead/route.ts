import {
  coarseTimestamp,
  maskPhone,
  sanitizeAttribution,
  validateLead,
  type LeadAttribution,
  type LeadSubmission,
  type NormalisedLead,
} from "@/lib/leads";

/**
 * Lead intake for the contact form.
 *
 * Note on routing: `next.config.ts` rewrites `/api/:path*` to the platform API.
 * That rewrite is returned as a plain array, which Next treats as `afterFiles`
 * — filesystem routes are matched first, so this handler wins `/api/lead` and
 * every other `/api/*` path still proxies through. Do not move this rewrite to
 * `beforeFiles` without re-checking that.
 *
 * The route never renders anything and reads request headers, so it must not be
 * statically analysed into a cached response.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** JSON body the browser posts to this route. */
type RequestBody = LeadSubmission;

/**
 * The payload forwarded to `LEAD_FORWARD_URL`.
 *
 * This contract is defined here, by us — it is not a known endpoint's schema.
 * Whatever consumes it (the platform API, a webhook, a Sheet) must accept this
 * shape; it is documented in `.env.example` and the README so the receiving end
 * can be built against it.
 */
interface ForwardPayload {
  /** Constant discriminator, so one webhook can serve several senders. */
  type: "lead";
  /** Server-generated UUID. Stable across the retry, so the receiver can dedupe. */
  id: string;
  /** Where it came from — this site, this locale. */
  site: string;
  receivedAt: string;
  lead: NormalisedLead;
  attribution: LeadAttribution;
  context: {
    /** Coarse client hints. No IP, no fingerprint. */
    userAgent: string | null;
    /** Request referer, distinct from the first-touch `attribution.referrer`. */
    referer: string | null;
    country: string | null;
  };
}

/* -------------------------------------------------------------- rate limit */

/**
 * In-memory fixed-window limiter.
 *
 * LIMITATION, on purpose: this lives in one serverless instance's memory. Vercel
 * runs several instances and recycles them, so the real ceiling is
 * `MAX_PER_WINDOW × live instances`, and it resets on every cold start. That is
 * the right trade for a marketing form — it stops a script hammering one
 * endpoint from a single IP without adding Redis, a bill, and a dependency to a
 * site whose whole point is that it has no infrastructure. Move to Vercel KV or
 * the platform API's own limiter if lead spam ever becomes a real problem.
 */
const WINDOW_MS = 10 * 60 * 1000;
/**
 * Generous on purpose. A slot is consumed before the body is parsed, so a
 * rejected submission costs one too — and someone mistyping their phone number
 * three times must not be locked out of the only form on the site. Twelve is
 * above any honest retry count and far below what a script is after.
 */
const MAX_PER_WINDOW = 12;
/** Hard cap on tracked IPs so a distributed flood cannot grow the heap. */
const MAX_TRACKED_IPS = 5_000;

const hits = new Map<string, number[]>();

function rateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  // Map preserves insertion order, so re-setting moves this IP to the back and
  // the first key is always the least recently seen — a poor man's LRU.
  hits.delete(ip);
  hits.set(ip, recent);
  while (hits.size > MAX_TRACKED_IPS) {
    const oldest = hits.keys().next().value;
    if (oldest === undefined) break;
    hits.delete(oldest);
  }
  return { allowed: true, retryAfter: 0 };
}

/** Client IP as Vercel's proxy reports it. Used only for rate limiting. */
function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/* ----------------------------------------------------------------- forward */

const FORWARD_TIMEOUT_MS = Number(process.env.LEAD_FORWARD_TIMEOUT_MS) || 4000;

async function postOnce(url: string, payload: ForwardPayload): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    const token = process.env.LEAD_FORWARD_TOKEN;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    if (res.ok) return true;
    // 4xx means the payload is wrong; retrying sends the same wrong payload.
    if (res.status < 500) {
      console.error("[lead] forward rejected", { id: payload.id, status: res.status });
      return false;
    }
    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Forward the lead to whatever durable store is configured.
 *
 * One retry, because the common failure here is a cold container on the other
 * end rather than a broken request. Unconfigured is a supported state: the site
 * still ships without a CRM, and the lead falls back to the log sink below.
 */
async function forward(payload: ForwardPayload): Promise<boolean> {
  const url = process.env.LEAD_FORWARD_URL;
  if (!url) {
    console.warn(
      "[lead] LEAD_FORWARD_URL is not set — lead captured to logs only",
      { id: payload.id },
    );
    return false;
  }
  if (await postOnce(url, payload)) return true;
  return postOnce(url, payload);
}

/* ------------------------------------------------------------------ route */

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const ip = clientIp(req);
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return json(
      { ok: false, error: "rate_limited", retryAfter: limit.retryAfter },
      429,
      { "retry-after": String(limit.retryAfter) },
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const id = crypto.randomUUID();

  // Honeypot: a hidden field only an autofilling bot would touch. Answer 200 so
  // the bot records a success and does not come back to probe the real path.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    console.warn("[lead] honeypot triggered", { id });
    return json({ ok: true, id, delivered: [] }, 200);
  }

  const result = validateLead(body);
  if (!result.ok) {
    return json({ ok: false, error: "validation_failed", fields: result.errors }, 400);
  }

  const payload: ForwardPayload = {
    type: "lead",
    id,
    site: "pos.devya.dev",
    receivedAt: coarseTimestamp(),
    lead: result.lead,
    attribution: sanitizeAttribution(body.attribution),
    context: {
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      referer: req.headers.get("referer")?.slice(0, 500) ?? null,
      // Vercel's geo header. Absent locally, which is fine.
      country: req.headers.get("x-vercel-ip-country") ?? null,
    },
  };

  // Info-level breadcrumb for funnel debugging. Masked phone, no message body:
  // these lines end up in a log drain that is not a lead database.
  console.log("[lead] received", {
    id,
    locale: payload.lead.locale,
    branches: payload.lead.branches,
    phone: maskPhone(payload.lead.phone),
    source: payload.attribution.source ?? "direct",
    campaign: payload.attribution.campaign ?? null,
  });

  const delivered = await forward(payload);

  if (!delivered) {
    // Last-resort durable sink. Vercel retains runtime logs, so a lead written
    // here is recoverable by hand — losing it entirely would be worse than
    // having the full number in an error-level line. Info-level logging of the
    // full number stays forbidden; this is the deliberate exception.
    console.error("[lead] NOT FORWARDED — recover from this line", JSON.stringify(payload));
  }

  // The visitor is told "received" as soon as the lead is durable somewhere,
  // and the log sink always is. Their side of the transaction is done; ours
  // being misconfigured is not their problem to retry.
  return json({ ok: true, id, delivered: delivered ? ["forward"] : ["log"] }, 200);
}

/** Anything but POST. Explicit, so a stray GET does not 405 through the rewrite. */
export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
