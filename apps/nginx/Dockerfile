FROM nginx:1.27-alpine AS base



FROM base AS dev
COPY ./certs /etc/nginx/certs
COPY ./nginx-development.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]



FROM base AS start
COPY ./certs /etc/nginx/certs
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
