#!/usr/bin/env bash
# Ship main to the Devya VPS — the process this site has used since it left
# Vercel on 2026-09-25 (and moving-landing's scripts/deploy.sh copies): a
# `git archive` of the commit goes over SSH (the VPS has no GitHub
# credentials), the running release is kept as a backup, and Docker Compose
# rebuilds the container behind nginx. nginx and the certificate for
# pos.devya.dev are already installed on the host.
#
#   bash scripts/deploy.sh                 # deploy origin/main, once its CI is green
#   bash scripts/deploy.sh --dry-run       # check CI and print the plan; change nothing
#   bash scripts/deploy.sh --skip-ci-check # emergencies only: ship without CI's verdict
#   bash scripts/deploy.sh --rollback      # put the newest backup back and rebuild it
#
# A deploy, in order:
#   1. Refuses unless GitHub's `check` run (.github/workflows/ci.yml) on the
#      commit concluded success. --skip-ci-check ships anyway, says so, and
#      the release record carries "ci=skipped".
#   2. Keeps the running release as a backup, without the host's
#      .env.production.local (that file lives beside the live release only),
#      and builds the new one with `--pull` and RELEASE=<commit>.
#   3. Smoke-tests it on the host: /ar and /en answer 200, /api/health
#      answers 200 with this commit and `config: "ok"`, and POST /api/lead
#      with malformed JSON answers 400 (the route is alive; no lead is made).
#   4. Prunes backups to the newest DEPLOY_KEEP_BACKUPS, writes
#      .deployed-commit on the host and pushes an annotated tag
#      release-<UTC yyyymmddHHMM>-<short sha> (a rollback pushes
#      rollback-…), so GitHub shows what is live and since when.
#
# Env: DEPLOY_HOST (default root@72.61.81.59), DEPLOY_REF (default origin/main),
#      DEPLOY_LABEL (backup name suffix, default "release"),
#      DEPLOY_KEEP_BACKUPS (backups kept, default 5; 0 keeps all).
#      tests/deploy.test.ts also points DEPLOY_APP_DIR, DEPLOY_BACKUP_PREFIX,
#      DEPLOY_UPLOAD_DIR and DEPLOY_REPO at a scratch directory and fakes.
set -euo pipefail

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
REF="${DEPLOY_REF:-origin/main}"
LABEL="${DEPLOY_LABEL:-release}"
KEEP="${DEPLOY_KEEP_BACKUPS:-5}"
REPO="${DEPLOY_REPO:-eng-AhmedMahmoud/devyapos}"
APP_DIR="${DEPLOY_APP_DIR:-/home/devya/projects/devya-devyapos}"
BACKUP_PREFIX="${DEPLOY_BACKUP_PREFIX:-/root/devyapos-pre-}"
UPLOAD_DIR="${DEPLOY_UPLOAD_DIR:-/tmp}"
DOMAIN="pos.devya.dev"
PORT=3009
CONTAINER="devya-devyapos"
CI_CHECK="check"
SSH=(ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=8 "$HOST")

usage() { echo "usage: $0 [--dry-run] [--skip-ci-check | --rollback]"; }

MODE="deploy"
DRY_RUN=0
SKIP_CI=0
for arg in "$@"; do
  case "$arg" in
    --rollback) MODE="rollback" ;;
    --dry-run) DRY_RUN=1 ;;
    --skip-ci-check) SKIP_CI=1 ;;
    -h | --help) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done

die() { echo "✗ $*" >&2; exit 2; }
[ "$MODE" = deploy ] || [ "$SKIP_CI" = 0 ] || die "--skip-ci-check applies to a deploy, not to --rollback"
# These end up inside the remote script and in rm -rf, so they are checked
# for shape rather than trusted.
[[ "$KEEP" =~ ^[0-9]+$ ]] || die "DEPLOY_KEEP_BACKUPS must be a whole number (0 keeps every backup)"
[[ "$LABEL" =~ ^[A-Za-z0-9._-]+$ ]] || die "DEPLOY_LABEL may hold only letters, digits, '.', '_' and '-'"
[[ "$APP_DIR" =~ ^/[A-Za-z0-9._/-]+/devya-devyapos$ ]] || die "DEPLOY_APP_DIR must be an absolute path ending in /devya-devyapos"
[[ "$BACKUP_PREFIX" =~ ^/[A-Za-z0-9._/-]+/devyapos-pre-$ ]] || die "DEPLOY_BACKUP_PREFIX must be an absolute path ending in /devyapos-pre-"
[[ "$UPLOAD_DIR" =~ ^/[A-Za-z0-9._/-]*$ ]] || die "DEPLOY_UPLOAD_DIR must be an absolute path"

# ------------------------------------------------------------------ CI gate

# Reads GitHub's check-runs JSON on stdin and prints one word for the newest
# run named $CI_CHECK: success, pending:<status>, failed:<conclusion>,
# missing or unreadable. Node, because it is already a requirement here and
# jq is not.
ci_verdict() {
  node -e '
    let text = "";
    process.stdin.on("data", (chunk) => (text += chunk)).on("end", () => {
      let runs;
      try { runs = JSON.parse(text).check_runs; } catch { runs = undefined; }
      if (!Array.isArray(runs)) return console.log("unreadable");
      const named = runs.filter((run) => run && run.name === process.argv[1]);
      if (named.length === 0) return console.log("missing");
      const newest = named.reduce((a, b) => (b.id > a.id ? b : a));
      if (newest.status !== "completed") return console.log("pending:" + newest.status);
      console.log(newest.conclusion === "success" ? "success" : "failed:" + newest.conclusion);
    });
  ' "$CI_CHECK"
}

# ci_gate <sha>: succeeds only when CI's `check` run on <sha> concluded
# success. main is protected by the same check, but a ruleset bypass, a red
# re-run or a not-yet-finished run would otherwise ship unnoticed — as the
# 2026-09-25 cutover did.
ci_gate() {
  local sha=$1 json verdict
  if ! command -v gh >/dev/null 2>&1; then
    echo "✗ gh (GitHub CLI) is not installed, so CI cannot be checked. Install it and run gh auth login, or ship anyway with --skip-ci-check." >&2
    return 1
  fi
  if ! json=$(gh api "repos/$REPO/commits/$sha/check-runs?check_name=$CI_CHECK&filter=latest&per_page=100"); then
    echo "✗ could not read CI for $sha from GitHub (is gh logged in?)." >&2
    return 1
  fi
  verdict=$(printf '%s' "$json" | ci_verdict)
  case "$verdict" in
    success)
      echo "✓ CI: '$CI_CHECK' passed on $sha"
      return 0
      ;;
    missing) echo "✗ CI: no '$CI_CHECK' run on $sha. Is it pushed, and has CI started?" >&2 ;;
    pending:*) echo "✗ CI: '$CI_CHECK' on $sha is still ${verdict#pending:}. Wait for it to finish." >&2 ;;
    failed:*) echo "✗ CI: '$CI_CHECK' on $sha concluded ${verdict#failed:}. Fix it, or ship anyway with --skip-ci-check." >&2 ;;
    *) echo "✗ CI: GitHub's answer for $sha could not be read." >&2 ;;
  esac
  return 1
}

# --------------------------------------------------- run on the host (sent)
# These functions are defined here so `bash -n` checks them, and sent ahead
# of each remote script with `declare -f`. They read PORT, CONTAINER, BODY,
# BACKUP_PREFIX and KEEP, which each remote script sets first.

# http <method> <path> [json]: prints the status code; the body lands in $BODY.
http() {
  local method=$1 path=$2 data=${3-}
  if [ -n "$data" ]; then
    curl -s -o "$BODY" -w '%{http_code}' --max-time 10 -X "$method" \
      -H 'content-type: application/json' --data "$data" "http://127.0.0.1:$PORT$path" || true
  else
    curl -s -o "$BODY" -w '%{http_code}' --max-time 10 -X "$method" "http://127.0.0.1:$PORT$path" || true
  fi
}

wait_healthy() {
  local status=starting i
  echo "waiting for the container to report healthy…"
  for i in $(seq 1 40); do
    status=$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo starting)
    case "$status" in healthy | unhealthy) break ;; esac
    sleep 3
  done
  echo "health: $status"
  [ "$status" = healthy ]
}

smoke_pages() {
  local path code ok=0
  for path in /ar /en; do
    code=$(http GET "$path")
    echo "GET $path → $code"
    [ "$code" = 200 ] || ok=1
  done
  return $ok
}

# smoke <release>: the pages, the health route (this release, config ok) and
# the lead route's refusal of a malformed body.
smoke() {
  local release=$1 code ok=0
  smoke_pages || ok=1
  code=$(http GET /api/health)
  echo "GET /api/health → $code $(head -c 400 "$BODY")"
  if [ "$code" != 200 ]; then
    ok=1
  else
    if ! grep -q "\"release\":\"$release\"" "$BODY"; then
      echo "✗ /api/health reports another release than $release" >&2
      ok=1
    fi
    if ! grep -q '"config":"ok"' "$BODY"; then
      echo "✗ the server reports its config as degraded. Its boot check said:" >&2
      docker logs "$CONTAINER" 2>&1 | grep '"event":"config_problem"' | tail -n 20 >&2 || true
      ok=1
    fi
    if ! grep -q '"forward":"configured"' "$BODY"; then
      echo "⚠ LEAD_FORWARD_URL is not set in .env.production.local: leads reach no one until the outbox is read."
    fi
  fi
  code=$(http POST /api/lead '{')
  echo "POST /api/lead (malformed JSON) → $code"
  [ "$code" = 400 ] || ok=1
  return $ok
}

# Counts, never reads, what waits in the lead outbox.
outbox_report() {
  local n
  n=$(docker exec "$CONTAINER" sh -c 'cat /data/leads-outbox.jsonl 2>/dev/null | wc -l' 2>/dev/null | tr -d ' ' || true)
  case "$n" in
    0) ;;
    '') echo "⚠ could not count the lead outbox" ;;
    *) echo "⚠ $n lead(s) wait in the outbox (/data/leads-outbox.jsonl): forward them, then clear it." ;;
  esac
}

# Strips the host's settings file from every backup (deploys before
# 2026-10-22 copied it into each one) and keeps the newest $KEEP (0: all).
prune_backups() {
  local n=0 b
  for b in $(ls -1dt "$BACKUP_PREFIX"* 2>/dev/null); do
    rm -f "$b/.env.production.local"
    n=$((n + 1))
    if [ "$KEEP" -gt 0 ] && [ "$n" -gt "$KEEP" ]; then
      rm -rf "$b"
      echo "pruned $b"
    fi
  done
  echo "backups: $(ls -1d "$BACKUP_PREFIX"* 2>/dev/null | wc -l | tr -d ' ') under ${BACKUP_PREFIX}*"
}

REMOTE_LIB="$(declare -f http wait_healthy smoke_pages smoke outbox_report prune_backups)"
REMOTE_VARS="PORT=$PORT CONTAINER=$CONTAINER KEEP=$KEEP BACKUP_PREFIX='$BACKUP_PREFIX'
BODY=\$(mktemp); trap 'rm -f \"\$BODY\"' EXIT"

# ------------------------------------------------------------ release record

# record_release <kind> <sha> <note>: an annotated tag
# <kind>-<UTC yyyymmddHHMM>-<short sha> on the commit, pushed to GitHub.
# Tags are outside the branch ruleset, so this needs no pull request. The
# release is already live by now, so a failure here warns and says how to
# record it by hand instead of failing the deploy.
record_release() {
  local kind=$1 sha=$2 note=$3 tag
  tag="$kind-$(date -u +%Y%m%d%H%M)-$(git rev-parse --short=7 "$sha")"
  if git tag -a "$tag" -m "$kind of $sha to $DOMAIN" -m "$note" "$sha" &&
    git push --quiet origin "refs/tags/$tag"; then
    echo "✓ recorded as tag $tag"
  else
    echo "⚠ the $kind is live but not recorded. Record it with: git tag -a $tag -m '$kind of $sha to $DOMAIN' $sha && git push origin refs/tags/$tag" >&2
  fi
}

cd "$(git rev-parse --show-toplevel)"

TMP_FILES=()
cleanup() { [ ${#TMP_FILES[@]} -eq 0 ] || rm -f "${TMP_FILES[@]}"; }
trap cleanup EXIT

if [ "$MODE" = "rollback" ]; then
  if [ "$DRY_RUN" = 1 ]; then
    echo "→ would roll $HOST:$APP_DIR back to the newest backup under ${BACKUP_PREFIX}*"
    exit 0
  fi
  LOG=$(mktemp -t devyapos-rollback.XXXXXX)
  TMP_FILES+=("$LOG")
  "${SSH[@]}" "bash -s" <<EOF | tee "$LOG"
set -euo pipefail
$REMOTE_VARS
$REMOTE_LIB
latest=\$(ls -1dt ${BACKUP_PREFIX}* 2>/dev/null | head -1 || true)
[ -n "\$latest" ] || { echo "no backup to roll back to" >&2; exit 1; }
release=\$(awk '{print \$2}' "\$latest/.deployed-commit" 2>/dev/null || true)
case "\$release" in '' | *[!0-9a-f]*) release=unknown ;; esac
echo "rolling back to \$latest (\$release)"
rm -rf "${APP_DIR}.failed" && mv "$APP_DIR" "${APP_DIR}.failed"
cp -a "\$latest" "$APP_DIR"
# The host's settings come from the release being replaced, never from a
# backup: backups no longer carry them.
if [ -f "${APP_DIR}.failed/.env.production.local" ]; then
  mv "${APP_DIR}.failed/.env.production.local" "$APP_DIR/.env.production.local"
fi
cd "$APP_DIR"
export RELEASE="\$release"
docker compose -f docker-compose.prod.yml build --pull
docker compose -f docker-compose.prod.yml up -d
wait_healthy || { echo "the rolled-back release is not healthy" >&2; exit 1; }
# Pages only: the release rolled back to may predate /api/health.
smoke_pages || { echo "the rolled-back release is not serving" >&2; exit 1; }
echo "rolled back to release \$release"
EOF
  release=$(sed -n 's/^rolled back to release //p' "$LOG" | tail -n 1)
  git fetch origin --quiet || true
  if full=$(git rev-parse --verify --quiet "${release:-unknown}^{commit}"); then
    record_release rollback "$full" "Rolled back by scripts/deploy.sh --rollback."
  else
    echo "⚠ rolled back to release '${release:-unknown}', which is not a commit here; no tag recorded." >&2
  fi
  exit 0
fi

git fetch origin --quiet
FULL_SHA=$(git rev-parse --verify "$REF^{commit}")
SHA=$(git rev-parse --short "$FULL_SHA")

if [ "$SKIP_CI" = 1 ]; then
  CI_STATE="skipped"
  echo "⚠ --skip-ci-check: shipping $SHA WITHOUT a green CI check. The release record says so." >&2
else
  ci_gate "$FULL_SHA" || exit 1
  CI_STATE="passed"
fi

if [ "$DRY_RUN" = 1 ]; then
  echo "→ would deploy $REF ($SHA) to $HOST:$APP_DIR"
  echo "  RELEASE=$FULL_SHA ci=$CI_STATE; backups kept: $KEEP (0 = all) under ${BACKUP_PREFIX}*"
  echo "  then tag release-$(date -u +%Y%m%d%H%M)-$(git rev-parse --short=7 "$FULL_SHA")"
  exit 0
fi

echo "→ deploying $REF ($SHA) to $HOST:$APP_DIR"
TARBALL=$(mktemp -t devyapos.XXXXXX)
TMP_FILES+=("$TARBALL")
git archive --format=tar.gz -o "$TARBALL" "$FULL_SHA"
scp -q "$TARBALL" "$HOST:$UPLOAD_DIR/devyapos-$SHA.tar.gz"

"${SSH[@]}" "bash -s" <<EOF
set -euo pipefail
$REMOTE_VARS
$REMOTE_LIB
STAMP=\$(date -u +%Y%m%d%H%M%S)

# Keep the running release as a backup, minus the host's settings file: it
# holds the lead forward token and lives beside the live release only.
# Touched, so "newest" means most recently backed up. The lead outbox is a
# named volume, so it survives both the rebuild and a rollback.
if [ -d "$APP_DIR" ]; then
  backup="${BACKUP_PREFIX}${LABEL}-\$STAMP"
  n=1
  while [ -e "\$backup" ]; do backup="${BACKUP_PREFIX}${LABEL}-\$STAMP-\$n"; n=\$((n + 1)); done
  cp -a "$APP_DIR" "\$backup"
  rm -f "\$backup/.env.production.local"
  touch "\$backup"
fi

rm -rf "$APP_DIR.next" && mkdir -p "$APP_DIR.next"
tar -xzf "$UPLOAD_DIR/devyapos-$SHA.tar.gz" -C "$APP_DIR.next"
rm -f "$UPLOAD_DIR/devyapos-$SHA.tar.gz"
# Host-only settings (LEAD_FORWARD_URL, …) live beside the release, never in git.
[ -f "$APP_DIR/.env.production.local" ] && cp -p "$APP_DIR/.env.production.local" "$APP_DIR.next/"
echo "\$(date -u +%Y-%m-%dT%H:%M:%SZ) $FULL_SHA ci=$CI_STATE" > "$APP_DIR.next/.deployed-commit"
rm -rf "$APP_DIR" && mv "$APP_DIR.next" "$APP_DIR"

cd "$APP_DIR"
# --pull: the base image's OS patches arrive with the next deploy, not when
# the host's cache happens to be cleared. RELEASE is baked into the image.
export RELEASE="$FULL_SHA"
rollback_hint="roll back with: bash scripts/deploy.sh --rollback"
docker compose -f docker-compose.prod.yml build --pull ||
  { echo "the build failed and the old container still serves; put its files back too: \$rollback_hint" >&2; exit 1; }
docker compose -f docker-compose.prod.yml up -d

wait_healthy || { echo "the container is not healthy; \$rollback_hint" >&2; exit 1; }
smoke "$FULL_SHA" || { echo "the release failed its smoke test; \$rollback_hint" >&2; exit 1; }

prune_backups
outbox_report
docker image prune -f >/dev/null
EOF

curl -fsS -o /dev/null -w "https://$DOMAIN/ar → %{http_code}\n" "https://$DOMAIN/ar"
curl -fsS -o /dev/null -w "https://$DOMAIN/api/health → %{http_code}\n" "https://$DOMAIN/api/health"
if [ "$CI_STATE" = skipped ]; then
  record_release release "$FULL_SHA" "CI check: SKIPPED (--skip-ci-check)."
else
  record_release release "$FULL_SHA" "CI check '$CI_CHECK': passed."
fi
echo "✓ $SHA is live"
