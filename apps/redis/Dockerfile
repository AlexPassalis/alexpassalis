FROM redis:7.0-alpine3.17
RUN apk add --no-cache gettext
WORKDIR /usr/local/etc/redis
COPY ./redis.conf .
CMD ["sh", "-c", "export REDIS_PASSWORD=$(cat /run/secrets/REDIS_PASSWORD) && envsubst < redis.conf > redis.conf.sub && mv redis.conf.sub redis.conf && redis-server redis.conf"]
