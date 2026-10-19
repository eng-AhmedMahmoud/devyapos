#!/usr/bin/env bash
# Ship main to the Devya VPS — the process this site has used since it left
# Vercel on 2026-09-25 (and moving-landing's scripts/deploy.sh copies): a
# `git archive` of the commit goes over SSH (the VPS has no GitHub
# credentials), the running release is kept as a backup, and Docker Compose
# rebuilds the container behind nginx. nginx and the certificate for
# pos.devya.dev are already installed on the host.
#
#   bash scripts/deploy.sh            # deploy origin/main
#   bash scripts/deploy.sh --rollback # put the newest backup back and rebuild it
#
# Env: DEPLOY_HOST (default root@72.61.81.59), DEPLOY_REF (default origin/main),
#      DEPLOY_LABEL (backup name suffix, default "release").
set -euo pipefail

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
REF="${DEPLOY_REF:-origin/main}"
LABEL="${DEPLOY_LABEL:-release}"
APP_DIR="/home/devya/projects/devya-devyapos"
BACKUP_PREFIX="/root/devyapos-pre-"
DOMAIN="pos.devya.dev"
PORT=3009
SSH=(ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=8 "$HOST")

MODE="deploy"
case "${1:-}" in
  --rollback) MODE="rollback" ;;
  "") ;;
  *) echo "usage: $0 [--rollback]" >&2; exit 2 ;;
esac

cd "$(git rev-parse --show-toplevel)"

if [ "$MODE" = "rollback" ]; then
  "${SSH[@]}" "bash -s" <<EOF
set -euo pipefail
latest=\$(ls -1dt ${BACKUP_PREFIX}* 2>/dev/null | head -1 || true)
[ -n "\$latest" ] || { echo "no backup to roll back to" >&2; exit 1; }
echo "rolling back to \$latest (\$(cat "\$latest/.deployed-commit" 2>/dev/null || echo unknown))"
rm -rf "${APP_DIR}.failed" && mv "$APP_DIR" "${APP_DIR}.failed"
cp -a "\$latest" "$APP_DIR"
cd "$APP_DIR" && docker compose -f docker-compose.prod.yml up -d --build
EOF
  exit 0
fi

git fetch origin --quiet
SHA=$(git rev-parse --short "$REF")
echo "→ deploying $REF ($SHA) to $HOST:$APP_DIR"

TARBALL=$(mktemp -t devyapos.XXXXXX).tar.gz
trap 'rm -f "$TARBALL"' EXIT
git archive --format=tar.gz -o "$TARBALL" "$REF"
scp -q "$TARBALL" "$HOST:/tmp/devyapos-$SHA.tar.gz"

"${SSH[@]}" "bash -s" <<EOF
set -euo pipefail
STAMP=\$(date -u +%Y%m%d%H%M)

# Keep the running release as a backup. Old backups are not pruned here —
# that is the operator's call. The lead outbox is a named volume, so it
# survives both the rebuild and a rollback.
if [ -d "$APP_DIR" ]; then
  cp -a "$APP_DIR" "${BACKUP_PREFIX}${LABEL}-\$STAMP"
  echo "backups: \$(ls -1d ${BACKUP_PREFIX}* | wc -l) under ${BACKUP_PREFIX}*"
fi

rm -rf "$APP_DIR.next" && mkdir -p "$APP_DIR.next"
tar -xzf "/tmp/devyapos-$SHA.tar.gz" -C "$APP_DIR.next"
rm -f "/tmp/devyapos-$SHA.tar.gz"
# Host-only settings (LEAD_FORWARD_URL, …) live beside the release, never in git.
[ -f "$APP_DIR/.env.production.local" ] && cp -p "$APP_DIR/.env.production.local" "$APP_DIR.next/"
echo "\$(date -u +%Y-%m-%dT%H:%M:%SZ) $SHA" > "$APP_DIR.next/.deployed-commit"
rm -rf "$APP_DIR" && mv "$APP_DIR.next" "$APP_DIR"

cd "$APP_DIR"
docker compose -f docker-compose.prod.yml up -d --build

echo "waiting for the container to report healthy…"
for i in \$(seq 1 30); do
  status=\$(docker inspect -f '{{.State.Health.Status}}' devya-devyapos 2>/dev/null || echo starting)
  [ "\$status" = healthy ] && break
  sleep 3
done
echo "health: \$status"
code=\$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/ar)
echo "GET 127.0.0.1:$PORT/ar → \$code"
[ "\$code" = 200 ] || { echo "release is not serving; roll back with: bash scripts/deploy.sh --rollback" >&2; exit 1; }

docker image prune -f >/dev/null
EOF

curl -fsS -o /dev/null -w "https://$DOMAIN/ar → %{http_code}\n" "https://$DOMAIN/ar"
echo "✓ $SHA is live"
