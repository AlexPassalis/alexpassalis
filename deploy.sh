# Stop and remove containers
docker stop container-dozzle container-postgres container-fastify-1 container-fastify-2 container-fastify-3 container-next_js-1 container-next_js-2 container-next_js-3 container-nginx container-prometheus container-grafana
docker rm container-dozzle container-postgres container-fastify-1 container-fastify-2 container-fastify-3 container-next_js-1 container-next_js-2 container-next_js-3 container-nginx container-prometheus container-grafana

# Remove images and network
docker rmi image-amir20/dozzle image-postgres image-fastify image-next_js image-nginx prom/prometheus grafana/grafana
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
docker build -t image-fastify -f ./apps/fastify.Dockerfile ./apps
docker build -t image-next_js -f ./apps/next_js.Dockerfile ./apps
docker build -t image-nginx -f ./apps/web-server/Dockerfile ./apps/web-server
docker compose -f docker-compose.yml up --build -d
