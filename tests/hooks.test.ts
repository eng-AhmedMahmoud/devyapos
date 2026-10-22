import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

/*
 * package.json's `prepare` script, which `pnpm install` runs: it points the
 * checkout's git hooks at .githooks/ so the secret scan runs on every commit.
 *
 * It runs on every install, including the Docker build's (only package.json,
 * the lockfile and the workspace file, no .git, no git binary) and CI's, so
 * the one thing it must never do is fail. These tests run the exact command
 * from package.json the way pnpm does (`sh -c`), in scratch directories, with
 * git kept from wandering into any repository above them.
 */

const root = join(__dirname, "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { scripts: Record<string, string> };
const PREPARE = pkg.scripts.prepare;

function scratch(): string {
  return realpathSync(mkdtempSync(join(tmpdir(), "prepare-hook-")));
}

/** A directory laid out like the repo as far as the hook cares. */
function checkoutFiles(dir: string, { withScript = true } = {}): string {
  copyFileSync(join(root, "package.json"), join(dir, "package.json"));
  if (withScript) {
    mkdirSync(join(dir, "scripts"));
    copyFileSync(join(root, "scripts", "install-hooks.sh"), join(dir, "scripts", "install-hooks.sh"));
    mkdirSync(join(dir, ".githooks"));
    copyFileSync(join(root, ".githooks", "pre-commit"), join(dir, ".githooks", "pre-commit"));
  }
  return dir;
}

function gitEnv(ceiling: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    // Never read or write the machine's own git config, and never look for a
    // repository above the scratch directory.
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CEILING_DIRECTORIES: ceiling,
  };
}

function git(cwd: string, args: string[], env: NodeJS.ProcessEnv) {
  return spawnSync("git", args, { cwd, env, encoding: "utf8" });
}

function prepare(cwd: string, env: NodeJS.ProcessEnv) {
  const result = spawnSync("/bin/sh", ["-c", PREPARE], { cwd, env, encoding: "utf8" });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

function hooksPath(cwd: string, env: NodeJS.ProcessEnv): string | null {
  const result = git(cwd, ["config", "--local", "--get", "core.hooksPath"], env);
  return result.status === 0 ? result.stdout.trim() : null;
}

describe("the prepare hook (pnpm install)", () => {
  it("is wired to the script, which installs the tracked secret scan", () => {
    expect(PREPARE).toContain("scripts/install-hooks.sh");
    expect(existsSync(join(root, "scripts", "install-hooks.sh"))).toBe(true);
    expect(existsSync(join(root, ".githooks", "pre-commit"))).toBe(true);
  });

  it("exits 0 and does nothing where the Docker image installs (package.json only, no .git)", () => {
    const dir = checkoutFiles(scratch(), { withScript: false });
    const run = prepare(dir, gitEnv(dirname(dir)));
    expect(run).toEqual({ code: 0, out: "", err: "" });
    expect(existsSync(join(dir, ".git"))).toBe(false);
  });

  it("exits 0 and writes nothing in a copy of the repo without .git", () => {
    const dir = checkoutFiles(scratch());
    const run = prepare(dir, gitEnv(dirname(dir)));
    expect(run).toEqual({ code: 0, out: "", err: "" });
    expect(existsSync(join(dir, ".git"))).toBe(false);
  });

  it("exits 0 when git is not installed at all", () => {
    const dir = checkoutFiles(scratch());
    const env = gitEnv(dirname(dir));
    expect(git(dir, ["init", "-q"], env).status).toBe(0);
    // A PATH with a shell and nothing else, as on an image without git.
    const bin = join(scratch(), "bin");
    mkdirSync(bin);
    symlinkSync("/bin/sh", join(bin, "sh"));
    const run = prepare(dir, { ...env, PATH: bin });
    expect(run).toEqual({ code: 0, out: "", err: "" });
    expect(hooksPath(dir, env)).toBeNull();
  });

  it("points a fresh clone's hooks at .githooks, once", () => {
    const dir = checkoutFiles(scratch());
    const env = gitEnv(dirname(dir));
    expect(git(dir, ["init", "-q"], env).status).toBe(0);

    const first = prepare(dir, env);
    expect(first.code).toBe(0);
    expect(first.out).toContain("core.hooksPath set to .githooks");
    expect(hooksPath(dir, env)).toBe(".githooks");

    // Every later install is silent.
    expect(prepare(dir, env)).toEqual({ code: 0, out: "", err: "" });
    expect(hooksPath(dir, env)).toBe(".githooks");
  });

  it("leaves a hooks path someone chose alone", () => {
    const dir = checkoutFiles(scratch());
    const env = gitEnv(dirname(dir));
    expect(git(dir, ["init", "-q"], env).status).toBe(0);
    expect(git(dir, ["config", "--local", "core.hooksPath", ".husky"], env).status).toBe(0);

    const run = prepare(dir, env);
    expect(run.code).toBe(0);
    expect(run.out).toContain("already '.husky'");
    expect(hooksPath(dir, env)).toBe(".husky");
  });

  it("never re-points the hooks of a repository it was unpacked inside", () => {
    const outer = scratch();
    const env = gitEnv(dirname(outer));
    expect(git(outer, ["init", "-q"], env).status).toBe(0);
    const inner = join(outer, "vendor", "devyapos");
    mkdirSync(inner, { recursive: true });
    checkoutFiles(inner);

    expect(prepare(inner, env)).toEqual({ code: 0, out: "", err: "" });
    expect(hooksPath(outer, env)).toBeNull();
  });
});
