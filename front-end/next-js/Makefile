.PHONY: build-development
build-development: ## Build the development docker image.
	docker-compose -f docker-compose-development.yml build

.PHONY: start-development
start-development: ## Start the development docker container.
	docker-compose -f docker-compose-development.yml up -d

# .PHONY: stop-development
# stop-development: ## Stop and remove the development docker container.
# 	docker-compose -f docker-compose-development.yml down

# .PHONY: build-staging
# build-staging: ## Build the staging docker image.
# 	docker compose -f docker/staging/compose.yaml build

# .PHONY: start-staging
# start-staging: ## Start the staging docker container.
# 	docker compose -f docker/staging/compose.yaml up -d

# .PHONY: stop-staging
# stop-staging: ## Stop the staging docker container.
# 	docker compose -f docker/staging/compose.yaml down
  
.PHONY: build-production
build-production: ## Build the production docker image.
	docker-compose -f docker-compose-production.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	docker-compose -f docker-compose-production.yml up -d

# .PHONY: stop-production
# stop-production: ## Stop the production docker container.
# 	docker compose -f docker/production/compose.yaml down
