import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

/*
 * scripts/leads.sh, the operator's view of the outbox and the consent
 * receipts. It is never run against production here: a fake `ssh` and `docker`
 * on PATH run the remote command locally and record which host and container
 * it was aimed at.
 */

const root = join(__dirname, "..");
const SCRIPT = join(root, "scripts", "leads.sh");

const OUTBOX = [
  JSON.stringify({ type: "lead", id: "a", receivedAt: "2026-10-01T10:00:00.000Z", lead: { name: "Sara Mostafa", phone: "+201012345678" } }),
  "torn line",
  JSON.stringify({ type: "lead", id: "b", receivedAt: "2026-10-20T10:00:00.000Z", lead: { name: "Omar Khaled", phone: "+201198765432" } }),
].join("\n") + "\n";
const PII = ["Sara", "Omar", "1012345678", "1198765432"];

let data: string;
let bin: string;
let log: string;

function fake(name: string, body: string) {
  const path = join(bin, name);
  writeFileSync(path, `#!/usr/bin/env bash\n${body}\n`);
  chmodSync(path, 0o755);
}

function run(args: string[], env: Record<string, string> = {}) {
  const result = spawnSync("bash", [SCRIPT, ...args], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_LOG: log, LEADS_DATA_DIR: data, ...env },
  });
  return { code: result.status, out: result.stdout, err: result.stderr, calls: existsSync(log) ? readFileSync(log, "utf8") : "" };
}

beforeEach(() => {
  const base = mkdtempSync(join(tmpdir(), "leads-sh-"));
  data = join(base, "data");
  bin = join(base, "bin");
  log = join(base, "calls.log");
  mkdirSync(data);
  mkdirSync(bin);
  writeFileSync(join(data, "leads-outbox.jsonl"), OUTBOX, { mode: 0o600 });
  // ssh: skip options, record the host, run the remote command here.
  fake(
    "ssh",
    'while [ $# -gt 0 ]; do case "$1" in -o) shift 2 ;; -*) shift ;; *) break ;; esac; done\n' +
      'echo "host=$1" >>"$FAKE_LOG"; shift; exec bash -c "$*"',
  );
  // docker exec [-i] <container> <cmd…>: record the container, run the command.
  fake(
    "docker",
    '[ "$1" = exec ] || exit 99; shift; [ "$1" = -i ] && shift\n' +
      'echo "container=$1" >>"$FAKE_LOG"; shift; exec "$@"',
  );
});

describe("scripts/leads.sh", () => {
  it("status counts leads and ages over SSH, and prints no lead", () => {
    const { code, out, calls } = run(["status"]);
    expect(code).toBe(0);
    expect(calls).toContain("host=root@72.61.81.59");
    expect(calls).toContain("container=devya-devyapos");
    expect(out).toMatch(/leads-outbox\.jsonl: 3 pending leads, 1 unreadable or undated, oldest 2026-10-01T10:00:00\.000Z/);
    expect(out).toMatch(/newest 2026-10-20T10:00:00\.000Z/);
    expect(out).toMatch(/consent-receipts\.jsonl: absent, 0 receipts/);
    for (const value of PII) expect(out).not.toContain(value);
  });

  it("honours DEPLOY_HOST and LEADS_CONTAINER", () => {
    const { code, calls } = run(["status"], { DEPLOY_HOST: "ops@staging.test", LEADS_CONTAINER: "devyapos-staging" });
    expect(code).toBe(0);
    expect(calls).toContain("host=ops@staging.test");
    expect(calls).toContain("container=devyapos-staging");
  });

  it.skipIf(process.getuid?.() === 0)("fails status when a file cannot be read", () => {
    chmodSync(join(data, "leads-outbox.jsonl"), 0o000);
    try {
      const { code, out } = run(["status", "--local", data]);
      expect(code).toBe(1);
      expect(out).toMatch(/UNREADABLE \(EACCES\)/);
    } finally {
      chmodSync(join(data, "leads-outbox.jsonl"), 0o600);
    }
  });

  it("pull copies both files off the box, owner-only, and leaves the server as it was", () => {
    writeFileSync(join(data, "consent-receipts.jsonl"), '{"event":"consent","id":"r1"}\n', { mode: 0o600 });
    const dest = join(mkdtempSync(join(tmpdir(), "leads-dest-")), "backups");
    const { code, out, calls } = run(["pull", dest]);
    expect(code).toBe(0);
    expect(calls).toContain("host=root@72.61.81.59");
    const [snapshot] = readdirSync(dest);
    expect(snapshot).toMatch(/^devyapos-\d{8}T\d{6}Z$/);
    const dir = join(dest, snapshot);
    expect(statSync(dest).mode & 0o777).toBe(0o700);
    expect(statSync(dir).mode & 0o777).toBe(0o700);
    for (const name of ["leads-outbox.jsonl", "consent-receipts.jsonl"]) {
      expect(statSync(join(dir, name)).mode & 0o777).toBe(0o600);
      expect(readFileSync(join(dir, name), "utf8")).toBe(readFileSync(join(data, name), "utf8"));
    }
    expect(readdirSync(dir).some((n) => n.endsWith(".part"))).toBe(false);
    expect(readFileSync(join(data, "leads-outbox.jsonl"), "utf8")).toBe(OUTBOX);
    for (const value of PII) expect(out).not.toContain(value);
  });

  it("pull reports a file the server does not have yet, and copies the rest", () => {
    const dest = mkdtempSync(join(tmpdir(), "leads-dest-"));
    const { code, out } = run(["pull", dest]);
    expect(code).toBe(0);
    expect(out).toMatch(/consent-receipts\.jsonl: absent on the server/);
    const [snapshot] = readdirSync(dest);
    expect(readdirSync(join(dest, snapshot))).toEqual(["leads-outbox.jsonl"]);
  });

  it("pull fails, and keeps no partial copy, when the connection fails", () => {
    fake("ssh", "exit 255");
    const dest = mkdtempSync(join(tmpdir(), "leads-dest-"));
    const { code, err } = run(["pull", dest]);
    expect(code).toBe(1);
    expect(err).toMatch(/copy FAILED \(exit 255\)/);
    const [snapshot] = readdirSync(dest);
    expect(readdirSync(join(dest, snapshot))).toEqual([]);
  });

  it("--local reads a directory on this machine and never calls ssh", () => {
    fake("ssh", 'echo "ssh called" >>"$FAKE_LOG"; exit 1');
    const { code, out, calls } = run(["status", "--local", data]);
    expect(code).toBe(0);
    expect(out).toMatch(/3 pending leads/);
    expect(calls).toBe("");
  });

  it("refuses to pull personal data into a git work tree", () => {
    const dest = join(root, "tmp-leads-pull-test");
    const { code, err } = run(["pull", dest, "--local", data]);
    expect(code).toBe(2);
    expect(err).toMatch(/git work tree/);
    expect(existsSync(dest)).toBe(false);
  });

  it.each([
    [[], /Operator tool/],
    [["drain"], /unknown command: drain/],
    [["pull"], /usage: pull <dest-dir>/],
    [["status", "extra"], /status takes no arguments/],
    [["status", "--force"], /unknown option: --force/],
    [["status", "--local"], /--local needs a directory/],
    [["status", "--local", "/nonexistent/dir"], /not a directory/],
  ])("rejects bad usage %j with exit 2", (args, message) => {
    const { code, err, calls } = run(args as string[]);
    expect(code).toBe(2);
    expect(err).toMatch(message);
    expect(calls).toBe("");
  });

  it("prints help with exit 0", () => {
    const { code, err } = run(["--help"]);
    expect(code).toBe(0);
    expect(err).toMatch(/pull <dest-dir>/);
  });
});
