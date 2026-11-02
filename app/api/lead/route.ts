import {
  coarseTimestamp,
  sanitizeAttribution,
  validateLead,
  type LeadAttribution,
  type LeadSubmission,
  type NormalisedLead,
} from "@/lib/leads";
import { brand } from "@/lib/brand";
import { keepInOutbox, outboxPending } from "@/lib/lead-outbox";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * Lead intake for the contact form.
 *
 * Production is the Docker container `devya-devyapos` on the Devya VPS. A
 * lead is forwarded to `LEAD_FORWARD_URL` when one is set — in production,
 * the lead intake of Devya's ops console, which answers the enquiry by email
 * straight away and follows it up — otherwise, or when
 * the forward fails, it goes to the outbox file on the data volume
 * (lib/lead-outbox.ts), which survives deploys. Container logs do not survive
 * a deploy, so they are never where a lead is kept: every unforwarded lead
 * gets one error-level line with its id, the reason and the outbox count, and
 * nothing that identifies the person. `scripts/leads.sh` reads the outbox
 * from outside.
 *
 * Note on routing: there is no `/api` rewrite any more (#53 removed the one to
 * the platform API, which had nothing behind it). `/api/lead`, `/api/consent`
 * and `/api/health` are this app's own routes and any other `/api/*` path is a
 * 404.
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
 * tell the shapes apart. 2 added the email, `product` and `channel`, renamed
 * `restaurant` to `company`, and moved `site` to this site's own domain.
 */
const FORWARD_CONTRACT_VERSION = 2;

/**
 * The lead as the receiver reads it. Version 2 is the intake contract of
 * Devya's ops console (bohub-pos `docs/specs/lead-follow-up.md` §2, served by
 * `ops-store` at `POST /api/leads/intake`), which every Moving landing site
 * sends, so the field names are the shared ones rather than this form's.
 */
interface ForwardLead {
  name: string;
  /** Lowercased. Where the receiver sends the first reply. */
  email: string;
  /** E.164; always an Egyptian mobile from this form. */
  phone: string;
  /**
   * The restaurant's name — `restaurant` in version 1 and in the browser's
   * post, where `company` is the honeypot. The two never meet: this is built
   * from the validated lead, never from the body.
   */
  company: string;
  branches: number | null;
  message: string | null;
  locale: string;
  /**
   * The business's country, ISO 3166-1 alpha-2. Always null: the form does
   * not ask, and an Egyptian mobile says where the person is, not where the
   * restaurant is.
   */
  country: null;
}

/**
 * The payload forwarded to `LEAD_FORWARD_URL`, documented in `.env.example`
 * and the README.
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
  /** This site's domain (`brand.domain`). */
  site: string;
  /** Which product the enquiry is about. This site sells one. */
  product: "pos";
  /** How it was sent: the contact form. The Moving support chat sends `"chat"`. */
  channel: "form";
  receivedAt: string;
  lead: ForwardLead;
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
 * - `ok`: a 2xx; the receiver has it. `emailed` is whether it says the first
 *   reply is on its way.
 * - `permanent`: a 4xx. The receiver judged this payload and said no; the
 *   retry would send the same payload, so it is not retried.
 * - `transient`: a 5xx, a timeout or a network error. Worth one more try.
 */
type Attempt =
  | { outcome: "ok"; emailed: boolean }
  | { outcome: "permanent"; status: number }
  | { outcome: "transient" };

/** Why a lead was not forwarded, for the log line. */
type NotForwarded =
  | { reason: "not_configured" }
  | { reason: "rejected"; status: number }
  | { reason: "failed" };

/**
 * Whether the receiver's answer says the first reply email is queued:
 * `{ ok: true, id, duplicate, firstReply: "queued" | "not_sent", sequence }`.
 * Anything else — an empty 202, a proxy's HTML, a receiver that predates the
 * email, a body cut off by the timeout — counts as not emailed, so the form
 * never tells a visitor to look for an email nobody is sending.
 */
async function firstReplyQueued(res: Response): Promise<boolean> {
  try {
    const answer: unknown = await res.json();
    return (
      typeof answer === "object" &&
      answer !== null &&
      (answer as { firstReply?: unknown }).firstReply === "queued"
    );
  } catch {
    return false;
  }
}

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
    // Read inside the timeout: a receiver that sends its headers and then
    // stalls on the body cannot hold the visitor's request open. A 2xx is
    // delivered whatever the body turns out to be, so it is never retried.
    if (res.ok) return { outcome: "ok", emailed: await firstReplyQueued(res) };
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
 * README says so). Unconfigured is a supported state — a laptop or a test run
 * has no receiver — and the lead falls back to the outbox below.
 */
async function forward(
  payload: ForwardPayload,
): Promise<{ forwarded: true; emailed: boolean } | { forwarded: false; missed: NotForwarded }> {
  const url = process.env.LEAD_FORWARD_URL;
  if (!url) return { forwarded: false, missed: { reason: "not_configured" } };
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const result = await postOnce(url, payload);
    if (result.outcome === "ok") return { forwarded: true, emailed: result.emailed };
    if (result.outcome === "permanent") {
      return { forwarded: false, missed: { reason: "rejected", status: result.status } };
    }
  }
  return { forwarded: false, missed: { reason: "failed" } };
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
    return json({ ok: true, id, delivered: [], emailed: false }, 200);
  }

  const result = validateLead(body);
  if (!result.ok) {
    return json({ ok: false, error: "validation_failed", fields: result.errors }, 400);
  }

  const lead: NormalisedLead = result.lead;
  const payload: ForwardPayload = {
    type: "lead",
    version: FORWARD_CONTRACT_VERSION,
    id,
    site: brand.domain,
    product: "pos",
    channel: "form",
    receivedAt: coarseTimestamp(),
    lead: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.restaurant,
      branches: lead.branches,
      message: lead.message,
      locale: lead.locale,
      country: null,
    },
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

  // Info-level breadcrumb for funnel debugging. No name, email, phone or
  // message — logs are not a lead database; the id ties the line to the lead.
  console.log("[lead] received", {
    id,
    locale: payload.lead.locale,
    branches: payload.lead.branches,
    source: payload.attribution.source ?? "direct",
    campaign: payload.attribution.campaign ?? null,
  });

  // `emailed` tells the form which thank-you to show: "a reply is on its way
  // to <address>" only when the receiver says it queued one.
  const sent = await forward(payload);
  if (sent.forwarded) {
    return json({ ok: true, id, delivered: ["forward"], emailed: sent.emailed }, 200);
  }
  const { missed } = sent;

  // Not forwarded: the outbox on the data volume is the durable sink
  // (lib/lead-outbox.ts). Exactly one error-level line per unforwarded lead,
  // so a log alert can count them — and never the lead itself (no name,
  // email, phone or message), only its id, the reason and how many are waiting.
  const kept = await keepInOutbox(payload);
  if (kept.ok) {
    const pending = await outboxPending();
    console.error(`[lead] NOT FORWARDED — kept in the outbox ${logFields({ id, ...missed, pending })}`);
    return json({ ok: true, id, delivered: ["outbox"], emailed: false }, 200);
  }

  // Nowhere durable to put it. Say so, rather than tell the visitor it was
  // received: the form offers WhatsApp and email on an error.
  console.error(`[lead] LOST — not forwarded and not stored ${logFields({ id, ...missed, outbox: kept.error })}`);
  return json({ ok: false, error: "unavailable" }, 503);
}

/** Anything but POST: an explicit JSON 405 rather than the framework default. */
export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405);
}
