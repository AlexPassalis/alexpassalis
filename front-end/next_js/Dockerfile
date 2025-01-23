# Base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi










# Development stage
FROM base AS development
WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true

COPY --from=deps /app/node_modules ./node_modules

# Use development server
CMD ["npm", "run", "dev"]










# Production stage
FROM base AS production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . ./

# Build the Next.js application
RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi










# Runner stage for production
FROM base AS runner
WORKDIR /app

# Set environment for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

# Add non-root user for security
RUN adduser --system --uid 1001 nextjs

# Copy the built application from the production stage
COPY --from=production /app/public ./public
COPY --from=production /app/.next/standalone ./
COPY --from=production /app/.next/static ./.next/static

# Set ownership for the non-root user
USER nextjs

CMD ["node", "server.js"]