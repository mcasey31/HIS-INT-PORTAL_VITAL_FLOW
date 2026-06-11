.PHONY: help up down restart rebuild logs status build clean shell test debug-on debug-off

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Docker Compose
DC := docker-compose -f docker-compose.yml --env-file .env.docker
DC_PROFILE := docker-compose -f docker-compose.yml --env-file .env.docker --profile

help:
	@echo "$(BLUE)========================================$(NC)"
	@echo "$(BLUE)VitalFlow Docker Management$(NC)"
	@echo "$(BLUE)========================================$(NC)"
	@echo ""
	@echo "$(GREEN)Usage: make <target> [options]$(NC)"
	@echo ""
	@echo "$(YELLOW)Targets:$(NC)"
	@echo "  $(BLUE)up$(NC)              Start the entire stack"
	@echo "  $(BLUE)down$(NC)            Stop the entire stack"
	@echo "  $(BLUE)restart$(NC)         Restart the entire stack"
	@echo "  $(BLUE)rebuild$(NC)         Rebuild and restart all services"
	@echo "  $(BLUE)logs$(NC)            Show logs (use: make logs SVC=service_name)"
	@echo "  $(BLUE)status$(NC)          Show status of all services"
	@echo "  $(BLUE)build$(NC)           Build all services"
	@echo "  $(BLUE)clean$(NC)           Remove containers, volumes, networks"
	@echo "  $(BLUE)shell-postgres$(NC)  Enter PostgreSQL shell"
	@echo "  $(BLUE)shell-redis$(NC)     Enter Redis shell"
	@echo "  $(BLUE)shell-his$(NC)       Enter HIS backend container"
	@echo "  $(BLUE)shell-portal$(NC)    Enter Portal container"
	@echo "  $(BLUE)test$(NC)            Run health checks"
	@echo "  $(BLUE)debug-on$(NC)        Enable debug services (pgAdmin, Redis Commander)"
	@echo "  $(BLUE)debug-off$(NC)       Disable debug services"
	@echo ""

up:
	@echo "$(BLUE)Starting VitalFlow Docker Stack...$(NC)"
	@$(DC) up -d
	@echo "$(GREEN)✓ Stack started!$(NC)"
	@echo ""
	@echo "$(GREEN)Services available at:$(NC)"
	@echo "  $(BLUE)Portal:$(NC)       http://localhost:3000"
	@echo "  $(BLUE)HIS Backend:$(NC)   http://localhost:3001/api"
	@echo "  $(BLUE)Nginx:$(NC)         http://localhost:80"
	@echo "  $(BLUE)PostgreSQL:$(NC)    localhost:5432"
	@echo "  $(BLUE)Redis:$(NC)         localhost:6379"
	@sleep 5
	@$(DC) ps

down:
	@echo "$(BLUE)Stopping VitalFlow Docker Stack...$(NC)"
	@$(DC) down
	@echo "$(GREEN)✓ Stack stopped$(NC)"

restart: down
	@sleep 2
	@$(MAKE) up

rebuild:
	@echo "$(BLUE)Rebuilding all services...$(NC)"
	@$(DC) build
	@$(MAKE) restart

logs:
	@$(DC) logs -f $(SVC)

status:
	@echo "$(BLUE)VitalFlow Stack Status$(NC)"
	@$(DC) ps

build:
	@echo "$(BLUE)Building all services...$(NC)"
	@$(DC) build
	@echo "$(GREEN)✓ Build completed$(NC)"

clean:
	@echo "$(RED)WARNING: This will remove containers, volumes, and networks!$(NC)"
	@read -p "Are you sure? (yes/no) " -n 3 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy][Ee][Ss]$$ ]]; then \
		$(DC) down -v; \
		echo "$(GREEN)✓ Cleaned$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

shell-postgres:
	@$(DC) exec postgres psql -U vitalflow_user -d vitalflow_his

shell-redis:
	@$(DC) exec redis redis-cli -a redis_secure_password

shell-his:
	@$(DC) exec his_backend sh

shell-portal:
	@$(DC) exec portal_backend sh

test:
	@echo "$(BLUE)Running health checks...$(NC)"
	@echo "$(YELLOW)Checking PostgreSQL...$(NC)"
	@$(DC) exec -T postgres pg_isready -U vitalflow_user && echo "$(GREEN)✓ PostgreSQL OK$(NC)" || echo "$(RED)✗ PostgreSQL FAILED$(NC)"
	@echo "$(YELLOW)Checking Redis...$(NC)"
	@$(DC) exec -T redis redis-cli -a redis_secure_password ping && echo "$(GREEN)✓ Redis OK$(NC)" || echo "$(RED)✗ Redis FAILED$(NC)"
	@echo "$(YELLOW)Checking HIS Backend...$(NC)"
	@curl -s http://localhost:3001/api/health > /dev/null && echo "$(GREEN)✓ HIS Backend OK$(NC)" || echo "$(RED)✗ HIS Backend FAILED$(NC)"
	@echo "$(YELLOW)Checking Portal...$(NC)"
	@curl -s http://localhost:3000/api/health > /dev/null && echo "$(GREEN)✓ Portal OK$(NC)" || echo "$(RED)✗ Portal FAILED$(NC)"

debug-on:
	@echo "$(BLUE)Enabling debug services...$(NC)"
	@$(DC_PROFILE) debug up -d
	@echo "$(GREEN)✓ Debug services started$(NC)"
	@echo ""
	@echo "$(GREEN)Available at:$(NC)"
	@echo "  $(BLUE)pgAdmin:$(NC)           http://localhost:5050"
	@echo "  $(BLUE)Redis Commander:$(NC)   http://localhost:8081"

debug-off:
	@echo "$(BLUE)Disabling debug services...$(NC)"
	@$(DC_PROFILE) debug down
	@echo "$(GREEN)✓ Debug services stopped$(NC)"

.DEFAULT_GOAL := help
