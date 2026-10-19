/**
 * Consent receipts (GDPR Art. 7(1): be able to show that consent was given).
 *
 * The shared consent design (docs/compliance/consent-design.md) posts one
 * receipt per choice with `sendBeacon`. The site has no database, so the
 * receipt is one structured log line — `{"event":"consent", …}` — kept with the
 * container's logs. It holds no personal data: `id` is random per answer and
 * the record carries no IP, user agent, path or visitor identifier.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIONS = new Set(["accept_all", "reject_all", "save"]);
const CATEGORIES = ["preferences", "analytics", "marketing"] as const;

export async function POST(req: Request) {
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
  const valid =
    typeof body.id === "string" &&
    /^[0-9a-z-]{8,64}$/i.test(body.id) &&
    typeof body.at === "string" &&
    !Number.isNaN(Date.parse(body.at)) &&
    typeof body.policy === "string" &&
    body.policy.length <= 32 &&
    typeof body.action === "string" &&
    ACTIONS.has(body.action) &&
    CATEGORIES.every((k) => typeof choices[k] === "boolean");
  if (!valid) return new Response(null, { status: 400 });

  console.info(
    JSON.stringify({
      event: "consent",
      site: "pos.devya.dev",
      id: body.id,
      at: body.at,
      receivedAt: new Date().toISOString(),
      policy: body.policy,
      action: body.action,
      choices: Object.fromEntries(CATEGORIES.map((k) => [k, choices[k]])),
      locale: body.locale === "ar" || body.locale === "en" ? body.locale : null,
    }),
  );
  return new Response(null, { status: 204 });
}

export function GET() {
  return new Response(null, { status: 405 });
}
