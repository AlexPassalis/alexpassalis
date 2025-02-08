FROM redis:7.0-alpine AS base



FROM base as dev
COPY redis-development.conf /usr/local/etc/redis/redis.conf
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]



# FROM base as start
