.PHONY: build-development
build: ## Build the development compose stack.
	docker-compose -p alexpassalis_com-compose-stack up --build