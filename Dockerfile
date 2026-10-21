# Production image for the Moving POS marketing site (pos.devya.dev), run on
# the Devya VPS behind nginx. Moved off Vercel 2026-09-25. Near-static; the
# one server hop is the lead form (app/api/lead). The one value it carries is
# the accounting trial's claim URL, baked at build (see the builder stage).
FROM node:25-alpine AS deps
WORKDIR /app
# pnpm, as the lockfile says; pinned major so a corepack default bump cannot
# re-resolve the lockfile under a different pnpm.
RUN corepack enable && corepack prepare pnpm@11 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:25-alpine AS builder
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

FROM node:25-alpine AS runner
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
COPY --from=builder --chown=nextjs:nodejs /app ./
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
