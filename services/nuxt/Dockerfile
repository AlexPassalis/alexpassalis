FROM node:22-alpine AS base
# Install curl for the healthcheck
RUN apk add --no-cache curl



FROM base AS deps
WORKDIR /app/deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.13.1 --activate && pnpm i --frozen-lockfile



FROM deps AS dev
WORKDIR /app
COPY . . 
COPY --from=deps /app/deps/node_modules ./node_modules
RUN rm -rf /app/deps

ENV WATCHPACK_POLLING=true
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE ${PORT}

CMD ["pnpm", "run", "dev"]
