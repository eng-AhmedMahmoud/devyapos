import { currentConfig, releaseId } from "@/lib/env";

/**
 * GET /api/health: is the server up, which commit is it, and can the lead
 * path deliver.
 *
 * Read by the container healthcheck (docker-compose.prod.yml, which needs
 * only a 200) and by scripts/deploy.sh, which also requires `release` to be
 * the commit it just shipped and `config` to be "ok". The answer is 200
 * whenever the process can answer at all: a degraded config is reported, not
 * turned into a restart loop, because the site itself still serves.
 *
 * It is public, so it says what state things are in and never what they are
 * set to: no URLs, tokens, paths, counts or anything about a visitor.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = await currentConfig();
  return Response.json(
    {
      status: "ok",
      release: releaseId(),
      config: config.ok ? "ok" : "degraded",
      lead: { forward: config.forward, outbox: config.outbox },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
