# FEATURE_SEC_004 - Externalizacion de Credenciales

## Objetivo
Eliminar todas las credenciales hardcodeadas del codigo fuente y configuracion, moviendolas a variables de entorno o mecanismos de secrets.

## Referencia de analisis
- Hallazgo critico #2: Credenciales hardcodeadas en appsettings.json y docker-compose.yml (postgres/postgres)
- Recomendacion Prioridad 1, item #4: Externalizar credenciales a variables de entorno / user-secrets / vault

## HU incluidas
- HU SEC-014: Externalizar credenciales de PostgreSQL
- HU SEC-015: Externalizar secrets de JWT

## Archivos impactados
- `docker-compose.yml` (reemplazar valores literales por ${ENV_VARS})
- `back/src/VitalFlow.His.Api/appsettings.json` (connection string)
- Nuevo: `.env.example` (plantilla de variables de entorno)
- Nuevo: `README` actualizado con instrucciones de configuracion

## Dependencias
- Ninguna (puede ejecutarse en paralelo con otras features).
