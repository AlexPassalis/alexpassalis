FROM node:20-alpine AS base
# Install curl for the healthcheck and build tools for native module compilation
RUN apk add --no-cache \
    curl \
    python3 \
    make \
    g++ \
    openssl-dev \
    && ln -sf /usr/bin/python3 /usr/bin/python



FROM base AS deps
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate && pnpm i --frozen-lockfile



FROM deps AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

CMD ["pnpm", "run", "dev"]



FROM deps as test
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

CMD ["pnpm", "run", "test"]



FROM deps as build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm run build



FROM build AS start
WORKDIR /app

RUN addgroup --system --gid 1001 nodehono
RUN adduser --system --uid 1001 hono

COPY --from=build --chown=hono:nodehono /app/build ./build

USER hono
ENV NODE_ENV=production
CMD ["node", "./build/src/server.js"]
