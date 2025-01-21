# Base image
FROM nginx:1.27-alpine AS base





# Development stage
FROM base AS development

COPY ./nginx-development.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs

CMD ["nginx", "-g", "daemon off;"]





# Production stage
FROM base AS production

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs

CMD ["nginx", "-g", "daemon off;"]