import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/*
 * scripts/deploy.sh, run for real against fakes: a scratch git repo with a
 * local bare "origin", and `gh`, `ssh`, `scp`, `docker` and `curl` on PATH
 * that record what they were asked and answer like GitHub and the host
 * would. The fake ssh runs the remote script locally, so the backup, prune,
 * env-file, smoke and tag steps all run as written, against directories in
 * the scratch root. Nothing here reaches the network or the VPS.
 */

const SCRIPT = join(__dirname, "..", "scripts", "deploy.sh");

const FAKES: Record<string, string> = {
  gh: `#!/bin/sh
echo "gh $*" >> "$FAKE_LOG"
if [ -n "\${FAKE_GH_EXIT-}" ]; then echo "gh: HTTP 401: Bad credentials" >&2; exit "$FAKE_GH_EXIT"; fi
cat "$FAKE_GH_JSON"
`,
  ssh: `#!/bin/sh
echo "ssh $*" >> "$FAKE_LOG"
while [ $# -gt 0 ]; do
  case "$1" in -o) shift 2 ;; -*) shift ;; *) break ;; esac
done
shift
exec bash -c "$*"
`,
  scp: `#!/bin/sh
echo "scp $*" >> "$FAKE_LOG"
while [ $# -gt 0 ]; do case "$1" in -*) shift ;; *) break ;; esac; done
cp "$1" "\${2#*:}"
`,
  docker: `#!/bin/sh
echo "docker $* RELEASE=\${RELEASE-}" >> "$FAKE_LOG"
case "$1" in
  compose) case " $* " in *" build "*) printf '%s' "\${RELEASE-}" > "$FAKE_STATE/release" ;; esac ;;
  inspect) echo "\${FAKE_DOCKER_HEALTH:-healthy}" ;;
  logs) echo '{"level":"error","event":"config_problem","variable":"LEAD_OUTBOX_DIR","problem":"not_writable"}' ;;
  exec) echo "\${FAKE_OUTBOX_LINES:-0}" ;;
esac
exit 0
`,
  curl: `#!/bin/sh
out=/dev/null; fmt=""; method=GET; url=""; fail=0
while [ $# -gt 0 ]; do
  case "$1" in
    -o) out=$2; shift 2 ;;
    -w) fmt=$2; shift 2 ;;
    -X) method=$2; shift 2 ;;
    -H|--data|--max-time) shift 2 ;;
    http*) url=$1; shift ;;
    -*f*) fail=1; shift ;;
    *) shift ;;
  esac
done
echo "curl $method $url" >> "$FAKE_LOG"
path="/\${url#*://*/}"
case "$method $path" in
  "GET /ar"|"GET /en") code=200; body="<html></html>" ;;
  "GET /api/health")
    code=200
    release=\${FAKE_HEALTH_RELEASE:-$(cat "$FAKE_STATE/release" 2>/dev/null)}
    body="{\\"status\\":\\"ok\\",\\"release\\":\\"$release\\",\\"config\\":\\"\${FAKE_CONFIG:-ok}\\",\\"lead\\":{\\"forward\\":\\"configured\\",\\"outbox\\":\\"writable\\"}}" ;;
  "POST /api/lead") code=\${FAKE_LEAD_CODE:-400}; body='{"ok":false,"error":"invalid_json"}' ;;
  *) code=404; body="" ;;
esac
printf '%s' "$body" > "$out"
[ -z "$fmt" ] || printf "$(printf '%s' "$fmt" | sed "s/%{http_code}/$code/")"
[ "$fail" = 1 ] && [ "$code" -ge 400 ] && exit 22
exit 0
`,
};

const GITHUB_ACTIONS = { id: 15368, slug: "github-actions" };

/** A check-runs answer from GitHub with these runs (from GitHub Actions unless said). */
function checkRuns(
  ...runs: { id: number; status: string; conclusion: string | null; name?: string; app?: { id: number; slug: string } }[]
) {
  return JSON.stringify({
    total_count: runs.length,
    check_runs: runs.map((r) => ({ name: "check", app: GITHUB_ACTIONS, ...r })),
  });
}

let root: string;
let repo: string;
let origin: string;
let appDir: string;
let backupPrefix: string;
let fakeLog: string;
let ghJson: string;
let firstSha: string;
let secondSha: string;

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnv() }).trim();
}

function gitEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    GIT_AUTHOR_NAME: "Deploy Test",
    GIT_AUTHOR_EMAIL: "deploy-test@example.invalid",
    GIT_COMMITTER_NAME: "Deploy Test",
    GIT_COMMITTER_EMAIL: "deploy-test@example.invalid",
  };
}

interface Run {
  status: number;
  stdout: string;
  stderr: string;
  log: string;
}

/** Runs scripts/deploy.sh in the scratch repo with the fakes first on PATH. */
function deploy(args: string[], env: Record<string, string> = {}): Run {
  writeFileSync(fakeLog, "");
  const clean = Object.fromEntries(
    Object.entries(gitEnv()).filter(([key]) => !key.startsWith("DEPLOY_") && !key.startsWith("FAKE_")),
  );
  const result = spawnSync("bash", [SCRIPT, ...args], {
    cwd: repo,
    encoding: "utf8",
    env: {
      ...clean,
      NODE_ENV: "test",
      PATH: `${join(root, "bin")}:${process.env.PATH}`,
      DEPLOY_HOST: "deploy@host.invalid",
      DEPLOY_REPO: "example/devyapos",
      DEPLOY_APP_DIR: appDir,
      DEPLOY_BACKUP_PREFIX: backupPrefix,
      DEPLOY_UPLOAD_DIR: join(root, "upload"),
      FAKE_LOG: fakeLog,
      FAKE_STATE: join(root, "state"),
      FAKE_GH_JSON: ghJson,
      ...env,
    },
  });
  return {
    status: result.status ?? -1,
    stdout: result.stdout,
    stderr: result.stderr,
    log: readFileSync(fakeLog, "utf8"),
  };
}

function backups(): string[] {
  const dir = join(root, "backups");
  return readdirSync(dir).filter((name) => name.startsWith("devyapos-pre-"));
}

function remoteTags(): string[] {
  const out = git(origin, "tag", "--list");
  return out ? out.split("\n") : [];
}

beforeAll(() => {
  // realpath: macOS's tmpdir is a symlink, and the script checks path shapes.
  root = realpathSync(mkdtempSync(join(tmpdir(), "deploy-test-")));
  for (const dir of ["bin", "state", "upload", "backups", "hooks", "srv"]) mkdirSync(join(root, dir));
  for (const [name, body] of Object.entries(FAKES)) {
    writeFileSync(join(root, "bin", name), body);
    chmodSync(join(root, "bin", name), 0o755);
  }
  fakeLog = join(root, "fake.log");
  ghJson = join(root, "check-runs.json");
  appDir = join(root, "srv", "devya-devyapos");
  backupPrefix = join(root, "backups", "devyapos-pre-");

  origin = join(root, "origin.git");
  repo = join(root, "repo");
  execFileSync("git", ["init", "--quiet", "--bare", origin]);
  execFileSync("git", ["init", "--quiet", "-b", "main", repo]);
  // Isolated from this machine's global hooks and signing settings.
  git(repo, "config", "core.hooksPath", join(root, "hooks"));
  git(repo, "config", "commit.gpgSign", "false");
  git(repo, "config", "tag.gpgSign", "false");
  git(repo, "config", "tag.forceSignAnnotated", "false");
  writeFileSync(join(repo, "docker-compose.prod.yml"), "services: {}\n");
  writeFileSync(join(repo, "README.md"), "first\n");
  git(repo, "add", ".");
  git(repo, "commit", "--quiet", "-m", "first");
  firstSha = git(repo, "rev-parse", "HEAD");
  writeFileSync(join(repo, "README.md"), "second\n");
  git(repo, "commit", "--quiet", "-am", "second");
  secondSha = git(repo, "rev-parse", "HEAD");
  git(repo, "remote", "add", "origin", origin);
  git(repo, "push", "--quiet", "origin", "main");
  // The scratch repo, not this one, is what the script will act on.
  expect(realpathSync(git(repo, "rev-parse", "--show-toplevel"))).toBe(repo);

  // The release that is live before the test deploys: the first commit, with
  // the host's settings file beside it.
  mkdirSync(appDir);
  writeFileSync(join(appDir, "README.md"), "first\n");
  writeFileSync(join(appDir, ".deployed-commit"), `2026-10-01T00:00:00Z ${firstSha}\n`);
  writeFileSync(join(appDir, ".env.production.local"), "LEAD_FORWARD_TOKEN=test-only\n");
  // Six older backups, made the old way: each with its own copy of the file.
  for (let i = 1; i <= 6; i++) {
    const dir = `${backupPrefix}old-${i}`;
    mkdirSync(dir);
    writeFileSync(join(dir, ".env.production.local"), "LEAD_FORWARD_TOKEN=test-only\n");
    writeFileSync(join(dir, ".deployed-commit"), `2026-09-0${i}T00:00:00Z ${firstSha}\n`);
    const at = new Date(`2026-09-0${i}T00:00:00Z`);
    utimesSync(dir, at, at);
  }
}, 30_000);

afterAll(() => {
  if (root) rmSync(root, { recursive: true, force: true });
});

// Each case starts several processes; CI machines can be slow at that.
const SLOW = { timeout: 30_000 };

describe("deploy.sh arguments", SLOW, () => {
  it("prints usage on --help and refuses an unknown flag", () => {
    const help = deploy(["--help"]);
    expect(help.status).toBe(0);
    expect(help.stdout).toMatch(/usage: .*--dry-run.*--skip-ci-check.*--rollback/);
    const bad = deploy(["--yolo"]);
    expect(bad.status).toBe(2);
    expect(bad.log).toBe("");
  });

  it("refuses --skip-ci-check with --rollback, and malformed settings", () => {
    expect(deploy(["--rollback", "--skip-ci-check"]).status).toBe(2);
    expect(deploy(["--dry-run"], { DEPLOY_KEEP_BACKUPS: "five" }).status).toBe(2);
    expect(deploy(["--dry-run"], { DEPLOY_LABEL: "x; rm -rf /" }).status).toBe(2);
    expect(deploy(["--dry-run"], { DEPLOY_BACKUP_PREFIX: "/" }).status).toBe(2);
    expect(deploy(["--dry-run"], { DEPLOY_APP_DIR: "/" }).status).toBe(2);
  });
});

describe("deploy.sh CI gate", SLOW, () => {
  it("passes when the newest `check` run on the commit succeeded, and touches nothing on --dry-run", () => {
    writeFileSync(
      ghJson,
      checkRuns(
        { id: 1, status: "completed", conclusion: "failure" },
        { id: 2, status: "completed", conclusion: "success" },
        { id: 3, status: "completed", conclusion: "failure", name: "other" },
      ),
    );
    const run = deploy(["--dry-run"]);
    expect(run.status, run.stderr).toBe(0);
    expect(run.stdout).toContain(`✓ CI: 'check' passed on ${secondSha}`);
    expect(run.stdout).toMatch(new RegExp(`then tag release-\\d{12}-${secondSha.slice(0, 7)}`));
    expect(run.log).toContain(
      `gh api repos/example/devyapos/commits/${secondSha}/check-runs?check_name=check&filter=latest`,
    );
    expect(run.log).not.toMatch(/^(ssh|scp|docker|curl) /m);
  });

  it.each([
    ["a failed run", checkRuns({ id: 5, status: "completed", conclusion: "failure" }), /concluded failure/],
    ["a newer failed re-run", checkRuns({ id: 5, status: "completed", conclusion: "success" }, { id: 6, status: "completed", conclusion: "cancelled" }), /concluded cancelled/],
    ["a run still in progress", checkRuns({ id: 7, status: "in_progress", conclusion: null }), /still in_progress/],
    ["no check run at all", checkRuns(), /no 'check' run/],
    [
      "a passing `check` from another app",
      checkRuns(
        { id: 5, status: "completed", conclusion: "failure" },
        { id: 8, status: "completed", conclusion: "success", app: { id: 999, slug: "some-ci" } },
      ),
      /concluded failure/,
    ],
    ["an unreadable answer", "<html>rate limited</html>", /could not be read/],
  ])("refuses %s", (_label, answer, message) => {
    writeFileSync(ghJson, answer);
    const run = deploy([]);
    expect(run.status).toBe(1);
    expect(run.stderr).toMatch(message);
    expect(run.log).not.toMatch(/^(ssh|scp|docker) /m);
  });

  it("refuses when GitHub cannot be asked", () => {
    const run = deploy([], { FAKE_GH_EXIT: "1" });
    expect(run.status).toBe(1);
    expect(run.stderr).toMatch(/could not read CI/);
    expect(run.log).not.toMatch(/^(ssh|scp|docker) /m);
  });

  it("--skip-ci-check does not ask GitHub, and says so", () => {
    writeFileSync(ghJson, checkRuns({ id: 5, status: "completed", conclusion: "failure" }));
    const run = deploy(["--dry-run", "--skip-ci-check"]);
    expect(run.status).toBe(0);
    expect(run.stderr).toMatch(/WITHOUT a green CI check/);
    expect(run.stdout).toContain("ci=skipped");
    expect(run.log).not.toMatch(/^gh /m);
  });
});

describe("deploy.sh release", SLOW, () => {
  it("ships, smoke-tests, prunes backups, keeps the env file out of them and tags the release", () => {
    writeFileSync(ghJson, checkRuns({ id: 9, status: "completed", conclusion: "success" }));
    const run = deploy([], { DEPLOY_KEEP_BACKUPS: "3", FAKE_OUTBOX_LINES: "2" });
    expect(run.status, run.stderr + run.stdout).toBe(0);

    // Built with --pull, with this commit as RELEASE.
    expect(run.log).toContain(`docker compose -f docker-compose.prod.yml build --pull RELEASE=${secondSha}`);
    expect(run.log).toContain("docker compose -f docker-compose.prod.yml up -d");
    // Smoke-tested: both locales, health, and the lead route's 400.
    for (const probe of ["GET /ar", "GET /en", "GET /api/health", "POST /api/lead"]) {
      expect(run.log).toContain(`curl ${probe.split(" ")[0]} http://127.0.0.1:3009${probe.split(" ")[1]}`);
    }
    expect(run.stdout).toContain("POST /api/lead (malformed JSON) → 400");
    expect(run.stdout).toMatch(/2 lead\(s\) wait in the outbox/);

    // The new release is live, with the host's settings beside it.
    expect(readFileSync(join(appDir, "README.md"), "utf8")).toBe("second\n");
    expect(readFileSync(join(appDir, ".env.production.local"), "utf8")).toContain("LEAD_FORWARD_TOKEN");
    expect(readFileSync(join(appDir, ".deployed-commit"), "utf8")).toMatch(
      new RegExp(`^\\S+Z ${secondSha} ci=passed\\n$`),
    );

    // Three backups, the newest being the release just replaced; none holds
    // the settings file.
    const kept = backups();
    expect(kept).toHaveLength(3);
    expect(kept.some((name) => name.startsWith("devyapos-pre-release-"))).toBe(true);
    for (const name of kept) {
      expect(existsSync(join(root, "backups", name, ".env.production.local")), name).toBe(false);
    }

    // Recorded: an annotated tag on the commit, pushed.
    const tag = remoteTags().find((t) => t.startsWith("release-"));
    expect(tag).toMatch(new RegExp(`^release-\\d{12}-${secondSha.slice(0, 7)}$`));
    expect(git(origin, "cat-file", "-t", tag!)).toBe("tag");
    expect(git(origin, "rev-parse", `${tag}^{commit}`)).toBe(secondSha);
    expect(git(origin, "tag", "-l", "--format=%(contents)", tag!)).toContain("passed");
  });

  it("fails, and does not tag, when health reports another release", () => {
    const before = remoteTags().length;
    const run = deploy(["--skip-ci-check"], { FAKE_HEALTH_RELEASE: "0000000" });
    expect(run.status).toBe(1);
    expect(run.stderr).toMatch(/reports another release/);
    expect(run.stderr).toMatch(/--rollback/);
    expect(remoteTags()).toHaveLength(before);
    // Backups are pruned only after a good release, but the one this failed
    // deploy made still leaves the settings file out.
    for (const name of backups().filter((n) => n.startsWith("devyapos-pre-release-"))) {
      expect(existsSync(join(root, "backups", name, ".env.production.local")), name).toBe(false);
    }
  });

  it("fails on a degraded config and shows the boot check's lines", () => {
    const run = deploy(["--skip-ci-check"], { FAKE_CONFIG: "degraded" });
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('"event":"config_problem"');
  });

  it("fails when the lead route does not refuse a malformed body", () => {
    const run = deploy(["--skip-ci-check"], { FAKE_LEAD_CODE: "500" });
    expect(run.status).toBe(1);
    expect(run.stdout).toContain("POST /api/lead (malformed JSON) → 500");
  });

  it("rolls back to the newest backup, keeps the live env file, and records it", () => {
    // Make the release being replaced the newest backup, and the live one
    // something else: a successful deploy of the second commit.
    writeFileSync(ghJson, checkRuns({ id: 9, status: "completed", conclusion: "success" }));
    expect(deploy([]).status).toBe(0);
    writeFileSync(join(appDir, ".env.production.local"), "LEAD_FORWARD_TOKEN=current\n");

    const run = deploy(["--rollback"]);
    expect(run.status, run.stderr + run.stdout).toBe(0);
    // The newest backup is the second commit's release (the one replaced by
    // the deploy just above), so that is what comes back.
    expect(readFileSync(join(appDir, ".deployed-commit"), "utf8")).toContain(secondSha);
    expect(readFileSync(join(appDir, ".env.production.local"), "utf8")).toBe("LEAD_FORWARD_TOKEN=current\n");
    expect(existsSync(`${appDir}.failed/.env.production.local`)).toBe(false);
    expect(run.log).toContain(`build --pull RELEASE=${secondSha}`);
    const tag = remoteTags().find((t) => t.startsWith("rollback-"));
    expect(tag).toMatch(new RegExp(`^rollback-\\d{12}-${secondSha.slice(0, 7)}$`));
    expect(existsSync(`${appDir}.env-rollback`)).toBe(false);
  });

  it("finds the env file again when a rollback is re-run after stopping halfway", () => {
    // A rollback that died after parking the file and moving the release
    // aside: the live directory has no settings file, .failed has none either.
    rmSync(join(appDir, ".env.production.local"));
    writeFileSync(`${appDir}.env-rollback`, "LEAD_FORWARD_TOKEN=parked\n");

    const run = deploy(["--rollback"]);
    expect(run.status, run.stderr + run.stdout).toBe(0);
    expect(readFileSync(join(appDir, ".env.production.local"), "utf8")).toBe("LEAD_FORWARD_TOKEN=parked\n");
    expect(existsSync(`${appDir}.env-rollback`)).toBe(false);

    // The same goes for a deploy run after such a rollback.
    rmSync(join(appDir, ".env.production.local"));
    writeFileSync(`${appDir}.env-rollback`, "LEAD_FORWARD_TOKEN=parked-again\n");
    expect(deploy(["--skip-ci-check"]).status).toBe(0);
    expect(readFileSync(join(appDir, ".env.production.local"), "utf8")).toBe("LEAD_FORWARD_TOKEN=parked-again\n");
    expect(existsSync(`${appDir}.env-rollback`)).toBe(false);
  });
});
