import { createJsonlSink, type SinkEntry, type SinkResult } from "@/lib/jsonl-sink";

/**
 * The durable sink for a lead that could not be forwarded.
 *
 * It replaces the old last resort — the whole lead (name, phone, message) on
 * an error-level log line — which put personal data in logs and was not
 * durable either: on the VPS, `docker compose up --build` recreates the
 * container and its logs go with it. Now the lead goes to the append-only
 * `leads-outbox.jsonl` on the data volume (`LEAD_OUTBOX_DIR`, `/data` in
 * production — docker-compose.prod.yml), owner-only (0600), and the log line
 * carries the lead's id and nothing else. lib/jsonl-sink.ts says what the file
 * guarantees.
 *
 * Retention: entries older than `LEAD_OUTBOX_RETENTION_DAYS` (default 365 —
 * the twelve months the privacy policy promises) are dropped by the first
 * write after a start and then at most daily. `scripts/leads.sh status`
 * counts what is waiting and `scripts/leads.sh pull <dir>` copies it off the
 * box; neither prints or removes a lead on the server.
 */

const outbox = createJsonlSink({
  file: "leads-outbox.jsonl",
  retentionEnv: "LEAD_OUTBOX_RETENTION_DAYS",
  defaultRetentionDays: 365,
  // A lead is at most a few kilobytes: this is thousands of leads, and a
  // ceiling on what a flood of submissions can take of a shared disk.
  maxBytes: 32 * 1024 * 1024,
});

export function keepInOutbox(entry: SinkEntry & { id: string }): Promise<SinkResult> {
  return outbox.append(entry);
}

/** How many leads the outbox holds, for the log line; null when it cannot be read. */
export async function outboxPending(): Promise<number | null> {
  try {
    return (await outbox.status())?.entries ?? null;
  } catch {
    return null;
  }
}
