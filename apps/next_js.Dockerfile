FROM node:20-alpine AS base



FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app/ts_rest
COPY ./ts_rest/package.json ./ts_rest/package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi

WORKDIR /app/next_js
COPY ./next_js/package.json ./next_js/package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi



FROM deps AS dev
WORKDIR /app/ts_rest
COPY ./ts_rest ./
COPY --from=deps /app/ts_rest/node_modules ./node_modules

WORKDIR /app/next_js
COPY ./next_js ./
COPY --from=deps /app/next_js/node_modules ./node_modules

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]



FROM deps AS build
WORKDIR /app/ts_rest
COPY ./ts_rest ./
COPY --from=deps /app/ts_rest/node_modules ./node_modules

WORKDIR /app/next_js
COPY ./next_js ./
COPY --from=deps /app/next_js/node_modules ./node_modules

ENV NODE_ENV=production

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi



FROM build AS start
WORKDIR /app/next_js

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/next_js/.next/standalone ./

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
