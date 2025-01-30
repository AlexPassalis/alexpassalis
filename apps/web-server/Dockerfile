# Base image
FROM nginx:1.27-alpine AS base



FROM base AS dev

COPY ./certs /etc/nginx/certs

CMD ["nginx", "-g", "daemon off;"]



FROM base AS start

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs

CMD ["nginx", "-g", "daemon off;"]
