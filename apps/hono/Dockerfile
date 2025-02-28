FROM node:20-alpine AS base
# Install curl for the healthcheck and build tools for native module compilation
RUN apk add --no-cache \
    curl \
    python3 \
    make \
    g++ \
    openssl \
    && ln -sf /usr/bin/python3 /usr/bin/python



FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
RUN pnpm i --frozen-lockfile



FROM deps AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV CHOKIDAR_USEPOLLING=true

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



FROM base AS start
WORKDIR /app

RUN addgroup --system --gid 1001 grouphono
RUN adduser --system --uid 1001 userhono

COPY --from=build --chown=userhono:grouphono /app/build/ ./
COPY --from=build --chown=userhono:grouphono /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build --chown=userhono:grouphono /app/node_modules ./node_modules
COPY --from=build --chown=userhono:grouphono /app/src/lib/postgres/migrations ./src/lib/postgres/migrations

USER userhono

CMD ["pnpm", "run", "start"]
