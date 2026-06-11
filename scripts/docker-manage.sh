#!/bin/bash
# ================================================
# VitalFlow Docker Management Scripts
# ================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env.docker"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ================================================
# Helper functions
# ================================================

print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

# ================================================
# Main commands
# ================================================

cmd_up() {
  print_header "Starting VitalFlow Docker Stack"
  
  if [ ! -f "$ENV_FILE" ]; then
    print_error ".env.docker file not found"
    exit 1
  fi
  
  print_info "Loading environment from $ENV_FILE"
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" --env-file "$ENV_FILE" up -d
  
  print_success "Stack started!"
  print_info "Waiting for services to be healthy..."
  sleep 10
  
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" ps
  
  echo ""
  echo -e "${GREEN}Services available at:${NC}"
  echo -e "  ${BLUE}Portal:${NC}       http://localhost:3000"
  echo -e "  ${BLUE}HIS Backend:${NC}   http://localhost:3001/api"
  echo -e "  ${BLUE}Nginx:${NC}         http://localhost:80"
  echo -e "  ${BLUE}PostgreSQL:${NC}    localhost:5432"
  echo -e "  ${BLUE}Redis:${NC}         localhost:6379"
}

cmd_down() {
  print_header "Stopping VitalFlow Docker Stack"
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" down
  print_success "Stack stopped"
}

cmd_restart() {
  print_header "Restarting VitalFlow Docker Stack"
  cmd_down
  sleep 2
  cmd_up
}

cmd_logs() {
  local service="${1:-}"
  if [ -z "$service" ]; then
    print_info "Showing logs for all services"
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" logs -f
  else
    print_info "Showing logs for $service"
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" logs -f "$service"
  fi
}

cmd_status() {
  print_header "VitalFlow Stack Status"
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" ps
}

cmd_build() {
  local service="${1:-}"
  if [ -z "$service" ]; then
    print_info "Building all services"
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" build
  else
    print_info "Building $service"
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" build "$service"
  fi
  print_success "Build completed"
}

cmd_rebuild() {
  local service="${1:-}"
  print_header "Rebuilding and Restarting"
  cmd_build "$service"
  cmd_restart
}

cmd_clean() {
  print_header "Cleaning VitalFlow Docker Stack"
  print_info "This will remove containers, volumes, and networks"
  read -p "Are you sure? (yes/no) " -n 3 -r
  echo
  if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" down -v
    print_success "Cleaned"
  else
    print_info "Cancelled"
  fi
}

cmd_shell() {
  local service="${1:-postgres}"
  case $service in
    postgres)
      print_info "Entering PostgreSQL shell"
      docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec postgres psql -U vitalflow_user -d vitalflow_his
      ;;
    redis)
      print_info "Entering Redis shell"
      docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec redis redis-cli -a redis_secure_password
      ;;
    his)
      print_info "Entering HIS backend container"
      docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec his_backend sh
      ;;
    portal)
      print_info "Entering Portal container"
      docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec portal_backend sh
      ;;
    *)
      print_error "Unknown service: $service"
      print_info "Available: postgres, redis, his, portal"
      ;;
  esac
}

cmd_test() {
  print_header "Running health checks"
  
  print_info "Checking PostgreSQL..."
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec -T postgres pg_isready -U vitalflow_user && print_success "PostgreSQL OK" || print_error "PostgreSQL FAILED"
  
  print_info "Checking Redis..."
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" exec -T redis redis-cli -a redis_secure_password ping && print_success "Redis OK" || print_error "Redis FAILED"
  
  print_info "Checking HIS Backend..."
  curl -s http://localhost:3001/api/health > /dev/null && print_success "HIS Backend OK" || print_error "HIS Backend FAILED"
  
  print_info "Checking Portal..."
  curl -s http://localhost:3000/api/health > /dev/null && print_success "Portal OK" || print_error "Portal FAILED"
}

cmd_debug_on() {
  print_header "Enabling debug services (pgAdmin, Redis Commander)"
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" --profile debug up -d
  print_success "Debug services started"
  echo ""
  echo -e "${GREEN}Available at:${NC}"
  echo -e "  ${BLUE}pgAdmin:${NC}           http://localhost:5050 (admin@vitalflow.local / pgadmin_change_me)"
  echo -e "  ${BLUE}Redis Commander:${NC}   http://localhost:8081"
}

cmd_debug_off() {
  print_header "Disabling debug services"
  docker-compose -f "$PROJECT_DIR/docker-compose.yml" --profile debug down
  print_success "Debug services stopped"
}

cmd_help() {
  cat << EOF
VitalFlow Docker Management

Usage: $0 <command> [options]

Commands:
  up              Start the entire stack
  down            Stop the entire stack
  restart         Restart the entire stack
  rebuild [svc]   Rebuild and restart service or all
  logs [svc]      Show logs for service or all (default: all)
  status          Show status of all services
  build [svc]     Build service or all (default: all)
  clean           Remove containers, volumes, networks (destructive)
  shell [svc]     Enter shell of service (postgres|redis|his|portal)
  test            Run health checks on all services
  debug-on        Enable debug services (pgAdmin, Redis Commander)
  debug-off       Disable debug services
  help            Show this help message

Examples:
  $0 up
  $0 logs his_backend
  $0 rebuild his_backend
  $0 shell postgres
  $0 test

EOF
}

# ================================================
# Main entry point
# ================================================

case "${1:-help}" in
  up)
    cmd_up
    ;;
  down)
    cmd_down
    ;;
  restart)
    cmd_restart
    ;;
  rebuild)
    cmd_rebuild "$2"
    ;;
  logs)
    cmd_logs "$2"
    ;;
  status)
    cmd_status
    ;;
  build)
    cmd_build "$2"
    ;;
  clean)
    cmd_clean
    ;;
  shell)
    cmd_shell "$2"
    ;;
  test)
    cmd_test
    ;;
  debug-on)
    cmd_debug_on
    ;;
  debug-off)
    cmd_debug_off
    ;;
  help)
    cmd_help
    ;;
  *)
    print_error "Unknown command: $1"
    cmd_help
    exit 1
    ;;
esac
