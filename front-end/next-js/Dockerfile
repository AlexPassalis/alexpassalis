# Base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found. Please ensure dependencies are locked." && exit 1; \
  fi










# Development stage
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . ./

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

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
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Add non-root user for security
RUN adduser --system --uid 1001 nextjs

# Copy the built application from the production stage
COPY --from=production /app/public ./public
COPY --from=production /app/.next/standalone ./
COPY --from=production /app/.next/static ./.next/static

# Set ownership for the non-root user
USER nextjs

CMD ["node", "server.js"]