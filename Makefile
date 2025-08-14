# Generate migration files # python manage.py makemigrations
# Migrate # python manage.py migrate #
# Create superuser # python manage.py createsuperuser

install:
	pip install -r services/django/requirements-dev.txt 

git-crypt:
	git-crypt status -e

docker-dev:
	docker build -t image-tracker-postgres -f ./services/postgres/Dockerfile ./services/postgres
	docker build --target dev -t image-tracker-django -f ./services/django/Dockerfile ./services/django
	docker build --target dev -t image-tracker-nuxt -f ./services/nuxt/Dockerfile ./services/nuxt
	# docker network create -d overlay network-tracker
	docker stack deploy -c ./docker-stack-dev.yaml --detach=false --with-registry-auth stack-tracker

docker-test:
	docker build --target test -t image-tracker-django-test -f ./services/django/Dockerfile ./services/django
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock --privileged image-tracker-django-test
