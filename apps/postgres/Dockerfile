FROM postgres:17-alpine AS base
# Install locales in the base stage
RUN apk add --no-cache \
    musl-locales \
    musl-locales-lang \
    tzdata
# Set default locale (e.g., en_US.UTF-8)
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8



FROM base AS dev
CMD ["postgres"]



FROM base AS start
CMD ["postgres"]