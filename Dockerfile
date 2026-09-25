# Production image for the DevyaPOS marketing site (pos.devya.dev), run on
# the Devya VPS behind nginx. Moved off Vercel 2026-09-25. Near-static; the
# one server hop is the lead form (app/api/lead). It reads no env today —
# Vercel had none set — so the image carries none.
FROM node:24-alpine AS deps
WORKDIR /app
# pnpm, as the lockfile says; pinned major so a corepack default bump cannot
# re-resolve the lockfile under a different pnpm.
RUN corepack enable && corepack prepare pnpm@11 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app ./
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
