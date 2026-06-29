# Product Brief Integral - EPICA SEGURIDAD

## Contexto
La epica SEGURIDAD abarca todos los aspectos de autenticacion, autorizacion, gestion de roles y permisos, politicas de sesion y hardening del sistema HIS.

Segun el analisis completo v1 del proyecto, los hallazgos criticos #1 y #2 son:
- **Sin autenticacion ni autorizacion** — ni en frontend ni en backend. No hay login, JWT, roles, ni guards. Cualquier persona puede acceder a todos los endpoints y datos clinicos.
- **Credenciales hardcodeadas** en `appsettings.json` y `docker-compose.yml` (`postgres/postgres`). Riesgo de seguridad en cualquier despliegue.

Estos son los puntos de **Prioridad 1 (Inmediato)** segun la seccion 10 del analisis.

- Epic nombre: SEGURIDAD
- Prioridad: 1 (transversal critico - Inmediato)

## Objetivo de negocio
Garantizar la confidencialidad, integridad y disponibilidad de los datos clinicos y operativos del HIS, cerrando las vulnerabilidades criticas detectadas en el analisis.

## Alcance funcional (alineado a Recomendaciones Prioridad 1 del analisis)

### 1. Autenticacion JWT (Backend)
- Implementar autenticacion JWT con Identity Server o mecanismo similar en .NET 8.
- Emision de tokens con claims de usuario, roles y centro.
- Refresh token para sesiones largas.
- Referencia: Hallazgo critico #1, Recomendacion #1.

### 2. Autorizacion en Controllers (Backend)
- Agregar `[Authorize]` a todos los controllers existentes (9 controllers, ~40 endpoints).
- Definir politicas de autorizacion por modulo.
- Endpoints publicos explicitamente excluidos: health, login.
- Referencia: Recomendacion #2.

### 3. Login en Frontend
- Implementar pantalla de login con manejo de tokens JWT.
- Almacenamiento seguro de token (httpOnly cookie o memory).
- Guard de rutas (cuando se implemente router - vinculado a Prioridad 2 #7).
- Interceptor de auth en llamadas HTTP.
- Referencia: Recomendacion #3.

### 4. Externalizacion de Credenciales
- Mover credenciales de `appsettings.json` y `docker-compose.yml` a variables de entorno / user-secrets / vault.
- Eliminar `postgres/postgres` hardcodeado.
- Referencia: Hallazgo critico #2, Recomendacion #4.

### 5. Middleware Global de Errores (Backend)
- Agregar middleware centralizado de excepciones para evitar leaks de informacion.
- Reemplazar los try/catch individuales de cada controller.
- Respuestas de error estandarizadas sin exponer stack traces.
- Referencia: Hallazgo importante #9, Recomendacion #5.

## Dependencias con otros modulos
- Impacta TODOS los controllers existentes: Agenda (22 endpoints), Personas (5), Turnos (7), Admision (6), HCA (2), Recetas (4), FHIR (3).
- Frontend: impacta App.tsx y todas las paginas (7 paginas + 2 componentes UI).
- Docker: impacta docker-compose.yml y configuracion de build.
- Infraestructura: impacta Program.cs (entry point + DI).

## Impacto arquitectonico

### Backend (back/src/VitalFlow.His.Api/)
- `Program.cs`: agregar servicios de auth, middleware de errores.
- Nuevo modulo `Auth/` o `Shared/Security/` con:
  - AuthController (login, refresh, logout)
  - JwtService (generacion/validacion de tokens)
  - Modelo de usuario/rol (si no existe en sch_persona)
- Decorador `[Authorize]` en los 9 controllers existentes.
- Middleware global de excepciones.

### Frontend (front/src/)
- Nueva pagina `LoginPage.tsx`.
- Shared HTTP client con interceptor de auth token.
- Logica de proteccion de rutas/navegacion.

### Base de datos
- Schema sugerido: `sch_seguridad`
- Tablas minimas: `usuario_sistema`, `rol`, `permiso`, `usuario_rol`, `sesion_log`.
- Migracion: `014_feature_seguridad_auth.sql`

### Docker/Config
- `docker-compose.yml`: variables de entorno para credenciales.
- `appsettings.json`: referencia a env vars en lugar de valores literales.

## Fuente de HU
Ver detalle completo en user-histories.md de esta carpeta.

## Referencia
Basado en: `docs/🏥 Análisis Completo_v1.docx` — Seccion 9 (Hallazgos criticos #1, #2) y Seccion 10 (Recomendaciones Prioridad 1).
