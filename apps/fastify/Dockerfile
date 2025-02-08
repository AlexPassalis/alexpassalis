FROM node:20-alpine AS base



FROM base AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi



FROM deps AS dev
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev"]



FROM deps AS build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi



FROM build AS start
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /app/build ./build

USER nextjs
ENV NODE_ENV=production

CMD ["node", "build/src/server.js"]
