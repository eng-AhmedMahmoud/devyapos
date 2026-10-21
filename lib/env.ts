import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The server's runtime configuration, checked once at boot and on demand by
 * the health route.
 *
 * Every setting the lead and consent paths read is optional and falls back
 * quietly: a mistyped LEAD_FORWARD_URL sends every lead to the outbox, a
 * non-numeric timeout or retention becomes the default, and a data directory
 * nobody can write to is discovered only when a real lead arrives and is
 * refused. This module surfaces
 * those cases at boot instead, as one structured log line per problem
 * (instrumentation.ts), and as `config: "degraded"` on GET /api/health, which
 * scripts/deploy.sh refuses to call a healthy release.
 *
 * It never throws and never stops the server: the lead path already degrades
 * on its own, and a site that is up without a CRM forward is better than one
 * that is down. It never logs or returns a value either, only the variable's
 * name and what is wrong with it, because some of these hold tokens or
 * private URLs.
 *
 * NEXT_PUBLIC_TRIAL_CLAIM_URL is not checked here: it is baked in by
 * `next build` and next.config.ts already parses it for the CSP.
 */

export type ConfigProblemCode =
  | "not_a_url"
  | "not_https"
  | "not_a_number"
  | "not_positive"
  | "not_writable"
  | "no_lead_sink";

export interface ConfigProblem {
  /** The variable's name, never its value. */
  variable: string;
  problem: ConfigProblemCode;
}

export interface ConfigReport {
  ok: boolean;
  problems: ConfigProblem[];
  /** LEAD_FORWARD_URL: an https URL, set but unusable, or not set. */
  forward: "configured" | "invalid" | "unset";
  /** LEAD_OUTBOX_DIR: a probe file could be written there, could not, or it is not set. */
  outbox: "writable" | "unwritable" | "unset";
}

type Env = Readonly<Record<string, string | undefined>>;

/** Numbers the server reads, each silently replaced by a default when unusable. */
const POSITIVE_NUMBERS = [
  "LEAD_FORWARD_TIMEOUT_MS",
  "LEAD_OUTBOX_RETENTION_DAYS",
  "CONSENT_RECEIPT_RETENTION_DAYS",
] as const;

/** Set means non-empty: the app treats `""` exactly like a missing variable. */
function setValue(env: Env, name: string): string | undefined {
  const value = env[name];
  return value === undefined || value === "" ? undefined : value;
}

function checkForward(env: Env, problems: ConfigProblem[]): ConfigReport["forward"] {
  const raw = setValue(env, "LEAD_FORWARD_URL");
  if (raw === undefined) return "unset";
  let url: URL;
  try {
    // The same parser fetch() uses, so "parses here" means "fetch can post".
    url = new URL(raw);
  } catch {
    problems.push({ variable: "LEAD_FORWARD_URL", problem: "not_a_url" });
    return "invalid";
  }
  // Leads are personal data: they leave this server encrypted or not at all.
  if (url.protocol !== "https:") {
    problems.push({ variable: "LEAD_FORWARD_URL", problem: "not_https" });
    return "invalid";
  }
  return "configured";
}

/**
 * A number must round-trip: `String(Number(x)) === x.trim()`. That refuses
 * "4000ms", "1e3", "0x10" and "Infinity", each of which the app would read as
 * something other than what was meant, or silently replace with its default.
 */
function checkPositiveNumber(env: Env, name: string, problems: ConfigProblem[]): void {
  const raw = setValue(env, name);
  if (raw === undefined) return;
  const n = Number(raw);
  if (!Number.isFinite(n) || String(n) !== raw.trim()) {
    problems.push({ variable: name, problem: "not_a_number" });
  } else if (n <= 0) {
    problems.push({ variable: name, problem: "not_positive" });
  }
}

/**
 * Writes and removes a probe file the way lib/jsonl-sink.ts writes the lead
 * outbox and the consent receipts (directory created owner-only if missing,
 * file owner-only), so a read-only or wrongly owned volume shows up now
 * rather than on the first lead.
 */
async function checkOutbox(env: Env, problems: ConfigProblem[]): Promise<ConfigReport["outbox"]> {
  const dir = setValue(env, "LEAD_OUTBOX_DIR");
  if (dir === undefined) return "unset";
  const probe = join(dir, `.probe-${process.pid}-${randomUUID()}`);
  try {
    await mkdir(dir, { recursive: true, mode: 0o700 });
    await writeFile(probe, "", { mode: 0o600, flag: "wx" });
    await rm(probe, { force: true });
    return "writable";
  } catch {
    await rm(probe, { force: true }).catch(() => undefined);
    problems.push({ variable: "LEAD_OUTBOX_DIR", problem: "not_writable" });
    return "unwritable";
  }
}

/** Checks `env` (the process environment by default) and reports what is wrong. */
export async function checkConfig(env: Env = process.env): Promise<ConfigReport> {
  const problems: ConfigProblem[] = [];
  const forward = checkForward(env, problems);
  for (const name of POSITIVE_NUMBERS) checkPositiveNumber(env, name, problems);
  const outbox = await checkOutbox(env, problems);
  // In production a lead with nowhere durable to go is answered 503 and lost
  // (app/api/lead/route.ts). Development runs without either on purpose.
  if (env.NODE_ENV === "production" && forward !== "configured" && outbox !== "writable") {
    problems.push({ variable: "LEAD_FORWARD_URL|LEAD_OUTBOX_DIR", problem: "no_lead_sink" });
  }
  return { ok: problems.length === 0, problems, forward, outbox };
}

/** How long the health route reuses a report: the probe writes to disk. */
const REPORT_TTL_MS = 30_000;
let cached: { at: number; report: Promise<ConfigReport> } | undefined;

/**
 * The process environment's report, at most REPORT_TTL_MS old. GET
 * /api/health is public, so a flood of probes must not become a flood of
 * disk writes; concurrent callers share one check.
 */
export function currentConfig(now: number = Date.now()): Promise<ConfigReport> {
  if (!cached || now - cached.at >= REPORT_TTL_MS) {
    cached = { at: now, report: checkConfig() };
  }
  return cached.report;
}

/**
 * One JSON line per problem at error level (what `docker logs … | grep
 * config_problem` and scripts/deploy.sh look for), or one info line when
 * all is well.
 */
export function logConfigReport(report: ConfigReport): void {
  for (const { variable, problem } of report.problems) {
    console.error(JSON.stringify({ level: "error", event: "config_problem", variable, problem }));
  }
  if (report.ok) {
    console.info(
      JSON.stringify({
        level: "info",
        event: "config_ok",
        forward: report.forward,
        outbox: report.outbox,
      }),
    );
  }
}

/** Run from instrumentation.ts `register()`. Logs, and never throws. */
export async function checkConfigAtBoot(): Promise<void> {
  try {
    logConfigReport(await currentConfig());
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "config_check_failed",
        name: error instanceof Error ? error.name : typeof error,
      }),
    );
  }
}

/**
 * The commit this server was built from: RELEASE, baked into the image by
 * the Dockerfile from the build arg scripts/deploy.sh passes. Only a git SHA
 * (7 to 40 hex digits) is echoed back; anything else reads "unknown".
 */
export function releaseId(env: Env = process.env): string {
  const release = env.RELEASE?.trim().toLowerCase();
  return release && /^[0-9a-f]{7,40}$/.test(release) ? release : "unknown";
}
