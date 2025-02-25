FROM redis:7.0-alpine3.17
WORKDIR /usr/local/etc/redis
COPY ./redis.conf .
CMD ["sh", "-c", "sed -i \"s/^# requirepass .*/requirepass $(cat /run/secrets/REDIS_PASSWORD)/\" /usr/local/etc/redis/redis.conf && exec redis-server /usr/local/etc/redis/redis.conf"]
