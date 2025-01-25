# Base image
FROM postgres:17.2-alpine AS base

# Install locales in the base stage
RUN apk add --no-cache \
    musl-locales \
    musl-locales-lang \
    tzdata

# Set default locale (e.g., en_US.UTF-8)
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# Development stage
FROM base AS development

# Copy the initialization SQL script
COPY ./init.sql /docker-entrypoint-initdb.d/

# Command to start PostgreSQL
CMD ["postgres"]

# Production stage
FROM base AS production

# Command to start PostgreSQL
CMD ["postgres"]