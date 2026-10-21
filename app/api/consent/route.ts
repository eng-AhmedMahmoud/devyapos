import { keepConsentReceipt, type ConsentReceipt } from "@/lib/consent-receipts";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

/**
 * Consent receipts (GDPR Art. 7(1): be able to show that consent was given).
 *
 * The shared consent design (docs/compliance/consent-design.md) posts one
 * receipt per choice with `sendBeacon`. The site has no database: the receipt
 * is appended to `consent-receipts.jsonl` on the data volume
 * (lib/consent-receipts.ts), which survives deploys. The `{"event":"consent", …}`
 * log line is still written, as a breadcrumb only — every deploy recreates the
 * container and deletes its logs. The receipt holds no personal data: `id` is
 * random per answer and the record carries no IP, user agent, path or visitor
 * identifier.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = new Set(["accept_all", "reject_all", "save"]);
const CATEGORIES = ["preferences", "analytics", "marketing"] as const;
/**
 * The exact shapes the consent core sends: `at` from `toISOString()`, the
 * policy a short version token. Anything looser would let a sender keep free
 * text in a file that is kept for a year — `Date.parse` alone accepts a date
 * followed by any text in parentheses.
 */
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const POLICY_VERSION = /^[0-9a-z._-]{1,32}$/i;

/**
 * A visitor sends one receipt per choice — a handful at most. The limit keeps
 * one address from filling the receipt file's size cap (lib/jsonl-sink.ts) and
 * crowding out everyone else's proof.
 */
const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20, maxTracked: 5_000 });

export async function POST(req: Request) {
  const limit = limiter.check(clientIp(req));
  if (!limit.allowed) {
    return new Response(null, { status: 429, headers: { "retry-after": String(limit.retryAfter) } });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (raw.length > 2_000) return new Response(null, { status: 413 });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  // `null`, a number, a string or an array is valid JSON but not a receipt.
  // `null` used to reach `body.choices` and throw, answering 500.
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return new Response(null, { status: 400 });
  }
  const body = parsed as Record<string, unknown>;
  const choices = (body.choices ?? {}) as Record<string, unknown>;
  if (
    !(
      typeof body.id === "string" &&
      /^[0-9a-z-]{8,64}$/i.test(body.id) &&
      typeof body.at === "string" &&
      ISO_INSTANT.test(body.at) &&
      !Number.isNaN(Date.parse(body.at)) &&
      typeof body.policy === "string" &&
      POLICY_VERSION.test(body.policy) &&
      typeof body.action === "string" &&
      ACTIONS.has(body.action) &&
      CATEGORIES.every((k) => typeof choices[k] === "boolean")
    )
  ) {
    return new Response(null, { status: 400 });
  }

  const receipt: ConsentReceipt = {
    event: "consent",
    site: "pos.devya.dev",
    id: body.id,
    at: body.at,
    receivedAt: new Date().toISOString(),
    policy: body.policy,
    action: body.action,
    choices: Object.fromEntries(CATEGORIES.map((k) => [k, choices[k] as boolean])),
    locale: body.locale === "ar" || body.locale === "en" ? body.locale : null,
  };

  console.info(JSON.stringify(receipt));

  const stored = await keepConsentReceipt(receipt);
  if (!stored.ok) {
    // The breadcrumb above is now the only trace of this choice, and the next
    // deploy deletes it. Loud, so the gap is seen and fixed.
    console.error(`[consent] receipt NOT STORED id=${receipt.id} error=${stored.error}`);
    // The beacon never reads the answer; the status is for the logs and probes.
    return new Response(null, { status: stored.error === "not_configured" ? 204 : 503 });
  }
  return new Response(null, { status: 204 });
}

export function GET() {
  return new Response(null, { status: 405 });
}
