# Stop and remove containers
docker stop container-postgres container-fastify-1 container-next_js-1 container-next_js-2 container-next_js-3 container-nginx
docker rm container-postgres container-fastify-1 container-next_js-1 container-next_js-2 container-next_js-3 container-nginx

# Remove images and network
docker rmi image-postgres image-fastify image-next_js image-nginx 
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
