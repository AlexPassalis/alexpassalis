FROM redis:7.0-alpine3.17
WORKDIR /usr/local/etc/redis
COPY ./redis.conf .
CMD ["sh", "-c", "REDIS_PASSWORD=$(cat /run/secrets/REDIS_PASSWORD) && exec redis-server /usr/local/etc/redis/redis.conf --requirepass \"$REDIS_PASSWORD\""]
