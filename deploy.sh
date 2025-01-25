# Stop and remove containers
docker stop container-nginx container-next-js-1 container-next-js-2 container-next-js-3
docker rm container-nginx container-next-js-1 container-next-js-2 container-next-js-3

# Remove images and network
docker rmi image-nginx image-next-js
docker network rm network-alexpassalis_com

# Remove old directory
sudo rm -r alexpassalis_com

# Setup SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_alexpassalis.com

# Clone and build
git clone git@github.com:AlexPassalis/alexpassalis_com.git
cd alexpassalis_com
docker build --target runner -t image-next-js ./front-end/next-js
docker compose up --build -d