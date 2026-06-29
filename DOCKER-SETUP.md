# VitalFlow Docker Setup - Guía Completa

## 📋 Requisitos

- **Docker:** 20.10+ ([Descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose:** 1.29+ (incluido en Docker Desktop)
- **Make:** (opcional, para Windows usa `make` del WSL o corre comandos directamente)
- **Bash:** (para scripts, Windows usa WSL o Git Bash)

Verificar instalación:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Inicio Rápido

### Opción 1: Con Makefile (recomendado)
```bash
# Iniciar stack completo
make up

# Ver estado
make status

# Ver logs en tiempo real
make logs

# Detener
make down
```

### Opción 2: Con docker-compose directamente
```bash
# Iniciar con archivo .env.docker
docker-compose -f docker-compose.yml --env-file .env.docker up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Opción 3: Con script bash
```bash
# Hacer ejecutable
chmod +x scripts/docker-manage.sh

# Usar
./scripts/docker-manage.sh up
./scripts/docker-manage.sh logs
./scripts/docker-manage.sh down
```

---

## 📊 Arquitectura de Servicios

```
┌─────────────────────────────────────────────────────────┐
│                       Nginx (Reverse Proxy)              │
│                    http://localhost:80                   │
└─────────────────────────────────────────────────────────┘
         │                                   │
         ▼                                   ▼
    ┌─────────────┐                  ┌──────────────┐
    │ HIS Backend │                  │    Portal    │
    │ Node.js/    │                  │  Next.js     │
    │ NestJS      │                  │              │
    │ :3001       │                  │  :3000       │
    └─────────────┘                  └──────────────┘
         │                                   │
         └───────────────────┬───────────────┘
                             │
                    ┌────────▼─────────┐
                    │   PostgreSQL     │
                    │   sch_agenda.*   │
                    │   sch_turno.*    │
                    │   sch_fhir.*     │
                    │   :5432          │
                    └──────────────────┘
                             │
                    ┌────────▼─────────┐
                    │      Redis       │
                    │  (Cache)         │
                    │  :6379           │
                    └──────────────────┘
```

---

## 🔧 Configuración

### .env.docker
```bash
# Database
POSTGRES_DB=vitalflow_his
POSTGRES_USER=vitalflow_user
POSTGRES_PASSWORD=secure_password_change_me
POSTGRES_PORT=5432

# Redis
REDIS_PASSWORD=redis_secure_password
REDIS_PORT=6379

# HIS Backend
HIS_PORT=3001
JWT_SECRET_KEY=change-me-in-production

# Portal
PORTAL_PORT=3000
NEXTAUTH_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Cambiar passwords en producción

---

## 📍 Acceso a Servicios

### En desarrollo (local)
| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Portal** | http://localhost:3000 | N/A |
| **HIS API** | http://localhost:3001/api | JWT token |
| **Nginx** | http://localhost | Router |
| **PostgreSQL** | localhost:5432 | vitalflow_user / password |
| **Redis** | localhost:6379 | redis_secure_password |

### Debug (opcional con `make debug-on`)
| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **pgAdmin** | http://localhost:5050 | admin@vitalflow.local / pgadmin_change_me |
| **Redis Commander** | http://localhost:8081 | N/A |

---

## 📝 Comandos Comunes

### Iniciar/Detener

```bash
# Iniciar todo
make up

# Iniciar servicio específico
docker-compose up -d his_backend

# Detener todo
make down

# Reiniciar todo
make restart

# Parar y limpiar (DESTRUCTIVO - elimina volumes)
make clean
```

### Monitoreo

```bash
# Ver estado de todos los servicios
make status

# Ver logs de todos
make logs

# Ver logs de un servicio
make logs SVC=his_backend
# Alternativas: portal_backend, postgres, redis, nginx

# Logs en tiempo real
make logs SVC=his_backend -f
```

### Acceso a Containers

```bash
# Entrar a PostgreSQL
make shell-postgres

# Entrar a Redis
make shell-redis

# Entrar a HIS backend
make shell-his

# Entrar a Portal
make shell-portal
```

### Health Checks

```bash
# Correr health checks en todos los servicios
make test

# Output esperado:
# ✓ PostgreSQL OK
# ✓ Redis OK
# ✓ HIS Backend OK
# ✓ Portal OK
```

### Rebuild

```bash
# Rebuildar todos los servicios
make rebuild

# Rebuildar servicio específico
docker-compose build his_backend
docker-compose up -d his_backend
```

---

## 🐘 PostgreSQL

### Conectarse
```bash
# Opción 1: Via psql
make shell-postgres

# Opción 2: Desde cliente local
psql -h localhost -U vitalflow_user -d vitalflow_his

# Password: secure_password_change_me
```

### Ver tablas
```sql
-- Dentro de psql
\dn                           -- Listar schemas
\dt sch_agenda.*              -- Listar tablas de agenda
\dt sch_turno.*               -- Listar tablas de turnos
\dt sch_fhir.*                -- Listar audit trail FHIR
SELECT * FROM sch_agenda.centro;
SELECT * FROM sch_agenda.agenda;
SELECT * FROM sch_agenda.cupo;
```

### Ejecutar SQL
```bash
# Desde archivo
docker-compose exec postgres psql -U vitalflow_user -d vitalflow_his -f /path/to/query.sql

# Interactivo
make shell-postgres
# luego tipear SQL
```

---

## 🔴 Redis

### Conectarse
```bash
# Via redis-cli
make shell-redis

# Comandos básicos
PING
KEYS *
GET key_name
SET key_name value
DEL key_name
FLUSHDB
```

### Monitoreo
```bash
# Ver todas las keys
redis-cli KEYS *

# Ver tamaño de memoria
redis-cli INFO memory

# Monitor en tiempo real
redis-cli MONITOR
```

---

## 🌐 API Testing

### Verificar HIS Backend
```bash
# Health check
curl http://localhost:3001/api/health

# FHIR endpoints (requiere JWT token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:3001/api/fhir/R4/Schedule

# Ver OpenAPI spec
curl http://localhost:3001/api/spec
```

### Verificar Portal
```bash
# Health check
curl http://localhost:3000/api/health

# API endpoint
curl http://localhost:3000/api/appointments
```

---

## 🔄 Workflow de Desarrollo

### Cuando modificas código

1. **HIS Backend** (Node.js)
   ```bash
   # Si cambios son en src/
   docker-compose restart his_backend
   
   # Si cambios requieren npm install
   make rebuild
   ```

2. **Portal** (Next.js)
   ```bash
   # Hot reload automático (volume mounted)
   # Sin necesidad de restart
   
   # Si cambios requieren npm install
   make rebuild
   ```

3. **Base de datos**
   ```bash
   # Aplicar nuevas migraciones
   docker-compose exec his_backend npm run migrate
   
   # Seed data
   docker-compose exec postgres psql -U vitalflow_user -d vitalflow_his -f scripts/seed-data.sql
   ```

---

## 🐛 Troubleshooting

### "Address already in use"
```bash
# Puerto 3000, 3001, 5432 ocupado
# Cambiar en .env.docker o liberar puerto

# Ver qué está usando el puerto
lsof -i :3000

# Matar proceso
kill -9 {PID}

# O usar diferente puerto en .env.docker
PORTAL_PORT=3001
HIS_PORT=3002
```

### "Cannot connect to Docker daemon"
```bash
# Docker no está corriendo
# Solución: Abrir Docker Desktop o iniciar dockerd
```

### "Container exited with code 1"
```bash
# Ver logs
docker-compose logs his_backend

# Entrar a container
docker-compose exec his_backend sh

# Ver archivos
ls -la /app/
```

### "PostgreSQL not accepting connections"
```bash
# Esperar a que PostgreSQL esté listo
docker-compose logs postgres

# Ejecutar health check
make test

# Reiniciar PostgreSQL
docker-compose restart postgres
```

### "Redis connection refused"
```bash
# Redis no está escuchando
docker-compose logs redis

# Reiniciar
docker-compose restart redis

# Verificar password
redis-cli -a redis_secure_password ping
```

---

## 🔐 Seguridad en Producción

**ANTES DE DEPLOYING A PROD:**

1. **Cambiar todas las passwords** en `.env.docker`
   ```bash
   POSTGRES_PASSWORD=<STRONG_RANDOM_PASSWORD>
   REDIS_PASSWORD=<STRONG_RANDOM_PASSWORD>
   JWT_SECRET_KEY=<STRONG_RANDOM_KEY>
   ```

2. **Usar secrets manager** (no .env file)
   ```bash
   # AWS Secrets Manager, HashiCorp Vault, etc.
   ```

3. **Habilitar SSL/TLS** en Nginx
   ```bash
   # Descomentar en docker/nginx/nginx.conf
   # Generar certificados (Let's Encrypt)
   ```

4. **Limitar acceso a DB**
   ```bash
   # No exponer puerto 5432 en producción
   # Usar conexión interna dentro de Docker network
   ```

5. **Configurar backups**
   ```bash
   # Volumen de datos persistente para PostgreSQL
   # Cronjob diario de backup
   ```

---

## 📚 Archivos Importantes

```
.
├── docker-compose.yml           # Orquestación de servicios
├── .env.docker                  # Variables de entorno
├── Makefile                     # Comandos útiles
├── scripts/
│   ├── docker-manage.sh         # Script bash de gestión
│   ├── init-db.sql              # Inicialización de BD
│   └── seed-data.sql            # Datos de prueba
├── docker/
│   └── nginx/
│       ├── nginx.conf           # Configuración Nginx
│       └── conf.d/
│           └── vitalflow.conf   # Virtual hosts
├── VitalFlowHis/back/
│   └── Dockerfile               # HIS backend image
└── VitalFlowPortal/
    └── Dockerfile               # Portal image
```

---

## 🔗 Referencias

- [Docker Compose Spec](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Docs](https://hub.docker.com/_/postgres)
- [Redis Docker Docs](https://hub.docker.com/_/redis)
- [Nginx Docker Docs](https://hub.docker.com/_/nginx)
- [VitalFlow OpenAPI Spec](../alcance/openapi-3.0-fhir-r4.yaml)

---

## 💬 Preguntas Frecuentes

**P: ¿Puedo usar SQL Server en lugar de PostgreSQL?**  
R: No - el schema de HIS está en PostgreSQL. Cambiar requiere migrar todas las migraciones.

**P: ¿Cómo agrego nuevas dependencias en Node.js?**  
R: `docker-compose exec his_backend npm install @nuevo/paquete` y rebuild.

**P: ¿Se persisten los datos después de `docker-compose down`?**  
R: Sí - los volúmenes (`postgres_data`, `redis_data`) se mantienen a menos que hagas `make clean`.

**P: ¿Cómo veo las migraciones de base de datos?**  
R: Están en `VitalFlowHis/back/migrations/` (Prisma) o consulta `information_schema.tables` en PostgreSQL.

**P: ¿Puedo correr solo HIS sin Portal?**  
R: Sí - `docker-compose up -d postgres redis his_backend`

---

**¡Listo!** 🎉 Tu stack Docker de VitalFlow está configurado.

Para empezar: `make up`
