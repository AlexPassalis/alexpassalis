FROM node:20-alpine AS base
# Install curl for the healthcheck
RUN apk add --no-cache curl


FROM base AS deps
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm i --frozen-lockfile



FROM deps AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

CMD ["pnpm", "run", "dev"]



FROM deps as build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["tsc"]



FROM build AS start
WORKDIR /app

RUN addgroup --system --gid 1001 nodehono
RUN adduser --system --uid 1001 hono

COPY --from=build --chown=hono:nodehono /app/build ./build

USER hono
ENV NODE_ENV=production

CMD ["node", "./build/src/server.js"]
