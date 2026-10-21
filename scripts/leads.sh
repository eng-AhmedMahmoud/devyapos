#!/usr/bin/env bash
# Operator tool for the two records this site keeps on its own server, both
# JSON-lines files on the container's data volume (lib/jsonl-sink.ts):
# leads-outbox.jsonl (leads that were not forwarded) and consent-receipts.jsonl
# (the consent proof). The volume survives deploys; the container's logs do not.
#
#   bash scripts/leads.sh status               # how many, how old — no personal data
#   bash scripts/leads.sh pull <dest-dir>      # off-box copy into <dest-dir>/devyapos-<UTC stamp>/
#
# Both read only: nothing on the server is changed or deleted, so a pull can be
# repeated and is never a drain. Leads leave the outbox only by retention
# (LEAD_OUTBOX_RETENTION_DAYS). A pulled lead is personal data: the copy is
# owner-only (0700 directory, 0600 files), keep it on an encrypted disk and
# delete it once handled.
#
# Options:
#   --local <dir>   read <dir> on this machine instead of the container over
#                   SSH (a copy of the volume, or the volume's path on the host)
#
# Env: DEPLOY_HOST (default root@72.61.81.59, as scripts/deploy.sh),
#      LEADS_CONTAINER (default devya-devyapos), LEADS_DATA_DIR (default /data).
set -euo pipefail

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
CONTAINER="${LEADS_CONTAINER:-devya-devyapos}"
DATA_DIR="${LEADS_DATA_DIR:-/data}"
FILES=(leads-outbox.jsonl consent-receipts.jsonl)
SSH=(ssh -o BatchMode=yes -o ServerAliveInterval=15 -o ServerAliveCountMax=8 "$HOST")

usage() {
  sed -n '2,/^set -euo/{/^set -euo/d;s/^# \{0,1\}//;p;}' "$0" >&2
  exit "${1:-2}"
}
die() {
  echo "leads.sh: $*" >&2
  exit 2
}

# Counts and timestamps only. It parses each line to find `receivedAt` and
# prints nothing else from it, so the output never carries a lead.
read -r -d '' STATUS_JS <<'JS' || true
const fs = require("node:fs");
const path = require("node:path");
const [dir, ...names] = process.argv.slice(2);
const now = Date.now();
const ago = (ms) => {
  const hours = Math.max(0, Math.floor((now - ms) / 3_600_000));
  return hours >= 48 ? `${Math.floor(hours / 24)}d ago` : `${hours}h ago`;
};
let failed = false;
for (const name of names) {
  const label = name.startsWith("leads") ? "pending leads" : "receipts";
  const file = path.join(dir, name);
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`${name}: absent, 0 ${label}`);
    } else {
      console.log(`${name}: UNREADABLE (${err.code})`);
      failed = true;
    }
    continue;
  }
  let entries = 0;
  let undated = 0;
  let oldest = null;
  let newest = null;
  for (const line of text.split("\n")) {
    if (!line) continue;
    entries += 1;
    let at = NaN;
    try {
      const value = JSON.parse(line);
      at = Date.parse(value && typeof value === "object" ? String(value.receivedAt) : "");
    } catch {}
    if (!Number.isFinite(at)) {
      undated += 1;
      continue;
    }
    if (oldest === null || at < oldest) oldest = at;
    if (newest === null || at > newest) newest = at;
  }
  const stat = fs.statSync(file);
  const parts = [`${entries} ${label}`];
  if (undated) parts.push(`${undated} unreadable or undated`);
  if (oldest !== null) parts.push(`oldest ${new Date(oldest).toISOString()} (${ago(oldest)})`);
  if (newest !== null) parts.push(`newest ${new Date(newest).toISOString()} (${ago(newest)})`);
  parts.push(`${stat.size} bytes`, `mode ${(stat.mode & 0o777).toString(8)}`);
  console.log(`${name}: ${parts.join(", ")}`);
}
process.exit(failed ? 1 : 0);
JS

remote() {
  # One string for the remote shell, every word quoted.
  "${SSH[@]}" "$(printf '%q ' "$@")"
}

status() {
  [ ${#ARGS[@]} -eq 0 ] || die "status takes no arguments"
  if [ -n "$LOCAL" ]; then
    node - "$LOCAL" "${FILES[@]}" <<<"$STATUS_JS"
  else
    echo "→ $HOST, container $CONTAINER, $DATA_DIR" >&2
    remote docker exec -i "$CONTAINER" node - "$DATA_DIR" "${FILES[@]}" <<<"$STATUS_JS"
  fi
}

# Writes one file to stdout. Exit 3 means it does not exist (yet).
fetch() {
  if [ -n "$LOCAL" ]; then
    [ -e "$LOCAL/$1" ] || return 3
    cat "$LOCAL/$1"
  else
    remote docker exec "$CONTAINER" sh -c 'test -e "$1" || exit 3; exec cat -- "$1"' sh "$DATA_DIR/$1" </dev/null
  fi
}

pull() {
  [ ${#ARGS[@]} -eq 1 ] || die "usage: pull <dest-dir>"
  local dest="${ARGS[0]}" probe out stamp file rc failed=0
  case "$dest" in -*) dest="./$dest" ;; esac
  # A pulled lead must never end up in a commit.
  probe="$dest"
  while [ ! -d "$probe" ]; do probe=$(dirname "$probe"); done
  if git -C "$probe" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    die "refusing to copy personal data into a git work tree ($probe); pick a directory outside any repository"
  fi

  umask 077
  mkdir -p "$dest"
  chmod 700 "$dest"
  stamp=$(date -u +%Y%m%dT%H%M%SZ)
  out="$dest/devyapos-$stamp"
  mkdir -m 700 "$out"
  [ -n "$LOCAL" ] || echo "→ $HOST, container $CONTAINER, $DATA_DIR" >&2

  for file in "${FILES[@]}"; do
    # Copy to a part file first, so a broken transfer never looks like a copy.
    rc=0
    fetch "$file" >"$out/.$file.part" || rc=$?
    case "$rc" in
      0)
        mv "$out/.$file.part" "$out/$file"
        chmod 600 "$out/$file"
        echo "$file: $(grep -c . "$out/$file" || true) lines, $(wc -c <"$out/$file" | tr -d ' ') bytes → $out/$file"
        ;;
      3)
        rm -f "$out/.$file.part"
        echo "$file: absent on the server, nothing to copy"
        ;;
      *)
        rm -f "$out/.$file.part"
        echo "$file: copy FAILED (exit $rc)" >&2
        failed=1
        ;;
    esac
  done
  [ "$failed" -eq 0 ] || exit 1
  echo "Personal data: keep $out on an encrypted disk and delete it once handled. Nothing was removed from the server."
}

CMD="${1:-}"
[ $# -eq 0 ] || shift
LOCAL=""
ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --local)
      [ $# -ge 2 ] || die "--local needs a directory"
      LOCAL="$2"
      shift 2
      ;;
    --local=*) LOCAL="${1#--local=}"; shift ;;
    -h | --help) usage 0 ;;
    -*) die "unknown option: $1" ;;
    *) ARGS+=("$1"); shift ;;
  esac
done
if [ -n "$LOCAL" ] && [ ! -d "$LOCAL" ]; then die "--local: not a directory: $LOCAL"; fi
# Paths reach cp/chmod/mkdir as arguments; one that starts with "-" would be read as an option.
case "$LOCAL" in -*) LOCAL="./$LOCAL" ;; esac

case "$CMD" in
  status) status ;;
  pull) pull ;;
  -h | --help | help) usage 0 ;;
  "") usage 2 ;;
  *) echo "leads.sh: unknown command: $CMD" >&2; usage 2 ;;
esac
