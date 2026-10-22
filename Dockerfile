# Production image for the Moving POS marketing site (pos.movingsystems.tech), run on
# the Devya VPS behind nginx. Moved off Vercel 2026-09-25. Near-static; the
# one server hop is the lead form (app/api/lead). The one value it carries is
# the accounting trial's claim URL, baked at build (see the builder stage).
#
# The base image is pinned by digest, so a build is reproducible and an OS
# patch arrives as a Dependabot pull request (.github/dependabot.yml, docker
# ecosystem) that has to pass CI, rather than whenever the host's cache
# happens to be cleared. Keep the three FROM lines on the same digest.
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS deps
WORKDIR /app
# pnpm, as the lockfile says; pinned major so a corepack default bump cannot
# re-resolve the lockfile under a different pnpm.
RUN corepack enable && corepack prepare pnpm@11 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# The accounting trial's claim route — a NEXT_PUBLIC_ value, so it must exist
# when `next build` runs (docker-compose.prod.yml passes it). Empty builds a
# page that offers WhatsApp instead of posting anywhere.
ARG NEXT_PUBLIC_TRIAL_CLAIM_URL=
ENV NEXT_PUBLIC_TRIAL_CLAIM_URL=$NEXT_PUBLIC_TRIAL_CLAIM_URL
RUN npx next build

# Only what the server needs at run time: Next's standalone output (server.js
# plus the node_modules files it traces, with content/ and messages/ compiled
# into the server bundle), the static assets and public/. No source, no
# devDependencies, no package manager.
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# /data is the lead outbox volume (docker-compose.prod.yml): a new named
# volume copies this directory's owner and mode, so the app can write and no
# one else can read.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 \
    && mkdir -p /data && chown nextjs:nodejs /data && chmod 700 /data
# The app's files belong to root, so the server cannot rewrite its own code.
# Its one writable directory is .next/cache, where /_next/image keeps the
# resized images.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
RUN mkdir -p .next/cache && chown nextjs:nodejs .next/cache
# The commit this image was built from (scripts/deploy.sh passes it through
# docker-compose.prod.yml), read by GET /api/health. A build without it says
# "unknown".
ARG RELEASE=unknown
ENV RELEASE=$RELEASE
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
