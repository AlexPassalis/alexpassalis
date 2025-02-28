FROM node:20-alpine AS base
# Install curl for the healthcheck and build tools
RUN apk add --no-cache \
    curl \
    gcompat \
    python3 \
    make \
    g++ \
    openssl \
    ca-certificates \
    gnupg \
    && ln -sf /usr/bin/python3 /usr/bin/python



FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.15.4 && pnpm i --frozen-lockfile



FROM deps AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV CHOKIDAR_USEPOLLING=true

CMD ["pnpm", "run", "dev"]



FROM deps AS test
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

CMD ["pnpm", "run", "test"]



FROM deps AS build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN pnpm run build



FROM deps AS start
WORKDIR /app

RUN addgroup --system --gid 1001 grouphono
RUN adduser --system --uid 1001 userhono

COPY --from=build --chown=userhono:grouphono /app/build/ ./
COPY --from=build --chown=userhono:grouphono /app/src/lib/postgres/migrations ./src/lib/postgres/migrations

USER userhono
ENV NODE_ENV=production

CMD ["pnpm", "run", "start"]
