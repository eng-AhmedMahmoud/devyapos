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

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return new Response(null, { status: 400 });
  }
  const choices = (body.choices ?? {}) as Record<string, unknown>;
  if (
    !(
      typeof body.id === "string" &&
      /^[0-9a-z-]{8,64}$/i.test(body.id) &&
      typeof body.at === "string" &&
      !Number.isNaN(Date.parse(body.at)) &&
      typeof body.policy === "string" &&
      body.policy.length <= 32 &&
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
