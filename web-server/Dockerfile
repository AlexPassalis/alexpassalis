FROM nginx:1.27-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./certs /etc/nginx/certs

EXPOSE 443
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
