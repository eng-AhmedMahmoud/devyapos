#!/bin/sh
# Points this checkout's git hooks at the tracked .githooks/ directory, so the
# secret scan (.githooks/pre-commit) runs on every commit from the first
# `pnpm install` on — package.json's `prepare` script runs this file.
#
# It must never fail an install. The Docker build installs with no .git, no
# scripts/ (package.json's `prepare` skips a missing file) and no git binary;
# a tarball or a copy has no repository of its own. Every "not a checkout of
# this repo" case is therefore a quiet no-op, and the script exits 0 whatever
# happens.
#
# Only this repository's own config is written, and only when the directory is
# the top of its work tree: an unpacked copy inside some other repository must
# not re-point that repository's hooks. A core.hooksPath already set to
# something else (husky, a global hooks directory set locally) is left alone,
# with one line saying so.

command -v git >/dev/null 2>&1 || exit 0
[ -f .githooks/pre-commit ] || exit 0
top=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
[ "$top" = "$(pwd -P)" ] || exit 0

current=$(git config --local --get core.hooksPath 2>/dev/null)
case "$current" in
  .githooks) ;;
  "")
    if git config --local core.hooksPath .githooks 2>/dev/null; then
      echo "git hooks: core.hooksPath set to .githooks (secret scan on every commit)"
    fi
    ;;
  *)
    echo "git hooks: core.hooksPath is already '$current' in this checkout; left as it is. The secret scan is .githooks/pre-commit."
    ;;
esac
exit 0
