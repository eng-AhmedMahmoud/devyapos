import {
  coarseTimestamp,
  sanitizeAttribution,
  validateLead,
  type LeadAttribution,
  type LeadSubmission,
  type NormalisedLead,
} from "@/lib/leads";
import { keepInOutbox, outboxPending } from "@/lib/lead-outbox";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * Lead intake for the contact form.
 *
 * Production is the Docker container `devya-devyapos` on the Devya VPS. A
 * lead is forwarded to `LEAD_FORWARD_URL` when one is set; otherwise, or when
 * the forward fails, it goes to the outbox file on the data volume
 * (lib/lead-outbox.ts), which survives deploys. Container logs do not survive
 * a deploy, so they are never where a lead is kept: every unforwarded lead
 * gets one error-level line with its id, the reason and the outbox count, and
 * nothing that identifies the person. `scripts/leads.sh` reads the outbox
 * from outside.
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
 * Version of the forward contract below. Bump it on any change a receiver
 * would notice — a renamed, removed or retyped field — so the receiver can
 * tell the shapes apart.
 */
const FORWARD_CONTRACT_VERSION = 1;

/**
 * The payload forwarded to `LEAD_FORWARD_URL`.
 *
 * This contract is defined here, by us — it is not a known endpoint's schema.
 * Whatever consumes it (the platform API, a webhook, a Sheet) must accept this
 * shape; it is documented in `.env.example` and the README so the receiving end
 * can be built against it.
 *
 * Every string field is raw user input as far as a receiver is concerned —
 * validated for shape and length here, never escaped for HTML, SQL, a sheet
 * formula or a shell — and must be treated that way.
 */
interface ForwardPayload {
  /** Constant discriminator, so one webhook can serve several senders. */
  type: "lead";
  /** Contract version, `FORWARD_CONTRACT_VERSION`. */
  version: typeof FORWARD_CONTRACT_VERSION;
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
 * Per-address limit (lib/rate-limit.ts). Generous on purpose: a slot is
 * consumed before the body is parsed, so a rejected submission costs one too —
 * and someone mistyping their phone number three times must not be locked out
 * of the only form on the site. Twelve in ten minutes is above any honest
 * retry count and far below what a script is after.
 */
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 12, maxTracked: 5_000 });

/* ----------------------------------------------------------------- forward */

const FORWARD_TIMEOUT_MS = Number(process.env.LEAD_FORWARD_TIMEOUT_MS) || 4000;

/**
 * - `ok`: a 2xx; the receiver has it.
 * - `permanent`: a 4xx. The receiver judged this payload and said no; the
 *   retry would send the same payload, so it is not retried.
 * - `transient`: a 5xx, a timeout or a network error. Worth one more try.
 */
type Attempt = { outcome: "ok" } | { outcome: "permanent"; status: number } | { outcome: "transient" };

/** Why a lead was not forwarded, for the log line. */
type NotForwarded =
  | { reason: "not_configured" }
  | { reason: "rejected"; status: number }
  | { reason: "failed" };

async function postOnce(url: string, payload: ForwardPayload): Promise<Attempt> {
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
    if (res.ok) return { outcome: "ok" };
    if (res.status < 500) return { outcome: "permanent", status: res.status };
    return { outcome: "transient" };
  } catch {
    return { outcome: "transient" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Forward the lead to whatever durable store is configured.
 *
 * One retry, for a transient failure only, because the common one is a cold
 * receiver rather than a broken request; a 4xx is final (the contract in the
 * README says so). Unconfigured is a supported state — the site ships without
 * a CRM — and the lead falls back to the outbox below. Null means forwarded.
 */
async function forward(payload: ForwardPayload): Promise<NotForwarded | null> {
  const url = process.env.LEAD_FORWARD_URL;
  if (!url) return { reason: "not_configured" };
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await postOnce(url, payload);
    if (result.outcome === "ok") return null;
    if (result.outcome === "permanent") return { reason: "rejected", status: result.status };
  }
  return { reason: "failed" };
}

/* ------------------------------------------------------------------ route */

/**
 * `key=value` on one line. Node prints an object argument across several
 * lines once it passes 80 characters, and a log alert matches lines. Values
 * here are ids, codes and counts — never lead data.
 */
function logFields(fields: Record<string, string | number | null>): string {
  return Object.entries(fields)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const ip = clientIp(req);
  const limit = limiter.check(ip);
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
    version: FORWARD_CONTRACT_VERSION,
    id,
    site: "pos.devya.dev",
    receivedAt: coarseTimestamp(),
    lead: result.lead,
    attribution: sanitizeAttribution(body.attribution),
    context: {
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      referer: req.headers.get("referer")?.slice(0, 500) ?? null,
      // A leftover of the Vercel days: nginx on the VPS sets no geo header,
      // so this is null unless the client sends one itself — raw input, like
      // every other string here.
      country: req.headers.get("x-vercel-ip-country") ?? null,
    },
  };

  // Info-level breadcrumb for funnel debugging. No name, phone or message —
  // logs are not a lead database; the id ties the line to the lead.
  console.log("[lead] received", {
    id,
    locale: payload.lead.locale,
    branches: payload.lead.branches,
    source: payload.attribution.source ?? "direct",
    campaign: payload.attribution.campaign ?? null,
  });

  const missed = await forward(payload);
  if (!missed) {
    return json({ ok: true, id, delivered: ["forward"] }, 200);
  }

  // Not forwarded: the outbox on the data volume is the durable sink
  // (lib/lead-outbox.ts). Exactly one error-level line per unforwarded lead,
  // so a log alert can count them — and never the lead itself (no name,
  // phone or message), only its id, the reason and how many are waiting.
  const kept = await keepInOutbox(payload);
  if (kept.ok) {
    const pending = await outboxPending();
    console.error(`[lead] NOT FORWARDED — kept in the outbox ${logFields({ id, ...missed, pending })}`);
    return json({ ok: true, id, delivered: ["outbox"] }, 200);
  }

  // Nowhere durable to put it. Say so, rather than tell the visitor it was
  // received: the form offers WhatsApp and email on an error.
  console.error(`[lead] LOST — not forwarded and not stored ${logFields({ id, ...missed, outbox: kept.error })}`);
  return json({ ok: false, error: "unavailable" }, 503);
}

/** Anything but POST. Explicit, so a stray GET does not 405 through the rewrite. */
export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
