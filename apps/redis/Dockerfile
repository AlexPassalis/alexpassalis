FROM redis:7.0-alpine3.17
WORKDIR /usr/local/etc/redis
COPY ./redis.conf .
CMD ["sh", "-c", "envsubst < redis.conf > redis.conf.sub && mv redis.conf.sub redis.conf && redis-server redis.conf"]
