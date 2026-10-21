import { createJsonlSink, type SinkResult } from "@/lib/jsonl-sink";

/**
 * Where consent receipts are kept: `consent-receipts.jsonl` on the data
 * volume, beside the lead outbox (lib/jsonl-sink.ts). A receipt is the proof
 * GDPR Art. 7(1) asks for, so it must outlive a deploy; the container's logs
 * do not (X-Ray SEC-F4).
 *
 * Retention: `CONSENT_RECEIPT_RETENTION_DAYS`, default 365. The privacy policy
 * names no period for consent proof, so this follows the twelve months it
 * gives enquiries. A consent record expires after 180 days
 * (lib/consent/config.ts `maxAgeDays`), so a receipt outlives the consent it
 * proves by about six months.
 */

/** Exactly what the receipt log line has always carried — no IP, user agent, path or visitor id. */
export interface ConsentReceipt {
  event: "consent";
  site: string;
  id: string;
  at: string;
  receivedAt: string;
  policy: string;
  action: string;
  choices: Record<string, boolean>;
  locale: "ar" | "en" | null;
}

const receipts = createJsonlSink({
  file: "consent-receipts.jsonl",
  retentionEnv: "CONSENT_RECEIPT_RETENTION_DAYS",
  defaultRetentionDays: 365,
  // A receipt is about 250 bytes: this is a quarter of a million of them, and
  // a ceiling on what a flood of beacons can take of a shared disk.
  maxBytes: 64 * 1024 * 1024,
});

export function keepConsentReceipt(receipt: ConsentReceipt): Promise<SinkResult> {
  return receipts.append(receipt);
}
