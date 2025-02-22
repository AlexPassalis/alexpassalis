# Stop and remove containers    
docker stop container-grafana container-prometheus container-nginx container-next_js-2 container-next_js-1 container-fastify-2 container-fastify-1 container-postgres container-dozzle
docker rm container-grafana container-prometheus container-nginx container-next_js-2 container-next_js-1 container-fastify-2 container-fastify-1 container-postgres container-dozzle

# Remove images and network
docker rmi grafana/grafana prom/prometheus image-nginx image-next_js image-fastify image-postgres amir20/dozzle
docker network rm network-alexpassalis_com

# Remove old directory
sudo rm -r alexpassalis_com

# Setup SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_alexpassalis.com

# Clone and build
git clone git@github.com:AlexPassalis/alexpassalis_com.git
cd alexpassalis_com
docker build -t image-postgres -f ./apps/postgres/Dockerfile ./apps/postgres
docker build -t image-fastify -f ./apps/fastify/Dockerfile ./apps/fastify
docker build -t image-next_js -f ./apps/next_js/Dockerfile ./apps/next_js
docker build -t image-nginx -f ./apps/nginx/Dockerfile ./apps/nginx
docker compose --build -d
