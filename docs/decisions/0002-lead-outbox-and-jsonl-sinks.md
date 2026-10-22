# 0002. Keep unforwarded leads and consent receipts in append-only files on the data volume

- **Status:** Accepted
- **Date:** 2026-10-19 (the outbox, PR #11), amended 2026-10-22 (append-only
  sink shared with consent receipts, PR #50)

## Context

The site has no database. A lead is meant to be forwarded to a CRM at
`LEAD_FORWARD_URL`, but no CRM has been chosen
([#36](https://github.com/eng-AhmedMahmoud/devyapos/issues/36)). Until
2026-10-19 an unforwarded lead was written in full to an error-level log line:
personal data in logs, and gone at the next deploy, because
`docker compose up --build` recreates the container and its logs. Leads sent
before the last redeploy before that date could not be recovered; the lines
still in the running container's log were copied out before the outbox
shipped ([#35](https://github.com/eng-AhmedMahmoud/devyapos/issues/35)
tracks importing them and deleting that copy). The consent banner's receipts
(GDPR Art. 7(1) proof) lived only in the same logs. The first outbox (PR #11) also had a defect: one read error
made the next write replace the whole file (X-Ray ARC-F2).

## Decision

- Forward a lead when `LEAD_FORWARD_URL` is set: a 4xx is final, a 5xx, a
  timeout or a network error is retried once with the same id. The payload is
  versioned (`version: 1`, contract in the README).
- Otherwise append it to `/data/leads-outbox.jsonl` on the named volume
  `devyapos-leads`. Consent receipts go to `/data/consent-receipts.jsonl`. Both
  go through one sink, `lib/jsonl-sink.ts`:
  - append-only (`O_APPEND`, `datasync` before success), files 0600 in a 0700
    directory;
  - any error other than "does not exist yet" fails the write;
  - retention 365 days each (`LEAD_OUTBOX_RETENTION_DAYS`,
    `CONSENT_RECEIPT_RETENTION_DAYS`), pruned on the first write after a start
    and then at most daily, through an fsynced temp file and a rename;
  - size caps (32 MiB outbox, 64 MiB receipts) so a flood cannot fill a shared
    disk.
- **Be honest when nothing can store.** The lead route answers 503 and the
  form offers WhatsApp and email; it never answers 200 over a lead it lost.
- **Logs carry no personal data**: one line per unforwarded lead with its id,
  the reason and the pending count (`[lead] NOT FORWARDED` / `[lead] LOST`).
- `scripts/leads.sh status` (counts and ages only) and `pull <dir>` (a copy
  off the box) are the operator's tools. Both are read-only on the server.

Alternatives, as weighed when this was recorded: a database (another service
to run and back up on a shared box); logs (not durable, and personal data in
them); a hosted queue or KV store (another processor and account for the same
job).

## Consequences

- Until a CRM is chosen, the VPS is the system of record for leads. Someone
  has to look: nothing alerts on the error lines yet, and nothing copies the
  volume off the box on a schedule
  ([#37](https://github.com/eng-AhmedMahmoud/devyapos/issues/37)).
- Removing the volume (`docker volume rm`, a rebuilt host) loses the records.
  `leads.sh pull` is the only backup today, and its copies on the operator's
  machine need their own retention (`docs/compliance/processors.md`).
- Retention only runs when something is written; an idle file keeps old
  entries until the next write (`leads.sh status` shows the oldest).
- There is no drain that re-forwards the outbox once a CRM exists; the stable
  `id` is there so one can dedupe.
- The receipt holds no personal data (random id, time, policy version,
  choices, locale), so keeping it a year is cheap; the privacy policy still has
  to say so ([#39](https://github.com/eng-AhmedMahmoud/devyapos/issues/39)).
