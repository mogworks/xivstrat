FROM node:lts-slim AS base
RUN npm install -g pnpm

# ---
FROM base AS prepare
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo telemetry disable
RUN turbo prune main --docker

# ---
FROM base AS build
WORKDIR /app
COPY --from=prepare /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=prepare /app/out/full/ .
RUN pnpm turbo telemetry disable
RUN pnpm turbo run build

# ---
FROM node:lts-alpine AS runtime
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=build /app .
ENV HOST=0.0.0.0
ENV PORT=11452
ENV NODE_ENV=production
EXPOSE 11452
CMD ["node", "apps/main/dist/server/entry.mjs"]
