# Docker Setup - ODI Convenios-Facturacion

## Archivos principales

- docker-compose.yml
- .env.docker.example
- docker/db/init/01-init.sql
- docker/backend/*
- docker/frontend/*

## Primer uso

1. Copiar .env de ejemplo:
   - PowerShell: `Copy-Item .env.docker.example .env`
2. Levantar stack:
   - `docker compose --env-file .env up -d --build`
3. Ver estado:
   - `docker compose ps`

## Endpoints locales

- Frontend: http://localhost:8080
- Backend health: http://localhost:8000/health
- pgAdmin: http://localhost:5050
- PostgreSQL: localhost:15432
- pgAdmin user: admin@odi.local.com

## Servicios incluidos

- db (PostgreSQL 16)
- redis (Redis 7)
- backend (FastAPI base)
- frontend (React + Vite build servido por Nginx)
- pgadmin (UI de base)

## Esquemas iniciales

Al iniciar la base por primera vez se crean:

- sch_auditoria
- sch_convenios
- sch_facturador
- sch_motor_reglas

Tambien se crea tabla de auditoria inicial:

- sch_auditoria.t_eventos

## Comandos utiles

- Apagar: `docker compose down`
- Apagar y borrar volumenes: `docker compose down -v`
- Ver logs backend: `docker compose logs -f backend`
- Ver logs db: `docker compose logs -f db`
