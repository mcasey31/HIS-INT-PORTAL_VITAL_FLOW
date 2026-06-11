# User Histories - EPICA SEGURIDAD

## Origen
Estas HU se derivan del documento `docs/🏥 Análisis Completo_v1.docx`, secciones 9 y 10.
Corresponden a los hallazgos criticos #1 y #2 y las recomendaciones de Prioridad 1 (Inmediato).

## Lista de Features y HU

### FEATURE_SEC_001 - Autenticacion JWT Backend
Implementar autenticacion basada en JWT en el backend .NET 8.

1. HU SEC-001 - Configuracion de servicio JWT en backend
   - Como equipo tecnico, quiero configurar la generacion y validacion de JWT en Program.cs para que el backend pueda autenticar requests.
   - Criterios de aceptacion:
     - Se configura `AddAuthentication` + `AddJwtBearer` en Program.cs.
     - Se define clave de firma via user-secrets o variable de entorno.
     - Token incluye claims: userId, username, roles, centroId.
     - Token tiene expiracion configurable.

2. HU SEC-002 - Endpoint de login
   - Como usuario del HIS, quiero autenticarme con credenciales para obtener un token de acceso.
   - Criterios de aceptacion:
     - POST `/api/v1/auth/login` con body `{username, password}`.
     - Retorna JWT + refresh token si credenciales validas.
     - Retorna 401 con mensaje generico si credenciales invalidas.
     - Se registra intento (exitoso/fallido) en log.

3. HU SEC-003 - Endpoint de refresh token
   - Como usuario autenticado, quiero renovar mi sesion sin re-ingresar credenciales.
   - Criterios de aceptacion:
     - POST `/api/v1/auth/refresh` con refresh token.
     - Retorna nuevo JWT si refresh token es valido y no expirado.
     - Invalida el refresh token anterior (rotation).

4. HU SEC-004 - Endpoint de logout
   - Como usuario, quiero cerrar mi sesion de forma segura.
   - Criterios de aceptacion:
     - POST `/api/v1/auth/logout` invalida el refresh token.
     - Se registra evento en log.

### FEATURE_SEC_002 - Autorizacion en Controllers
Agregar `[Authorize]` y politicas a los 9 controllers existentes.

5. HU SEC-005 - Proteger AgendaController con [Authorize]
   - Los 22 endpoints de agenda requieren usuario autenticado.

6. HU SEC-006 - Proteger PersonasController con [Authorize]
   - Los 5 endpoints de personas requieren usuario autenticado.

7. HU SEC-007 - Proteger TurnosController con [Authorize]
   - Los 7 endpoints de turnos requieren usuario autenticado.

8. HU SEC-008 - Proteger AdmisionController con [Authorize]
   - Los 6 endpoints de admision requieren usuario autenticado.

9. HU SEC-009 - Proteger HCA y Recetas Controllers con [Authorize]
   - Los 6 endpoints (2 HCA + 4 Recetas) requieren usuario autenticado.

10. HU SEC-010 - Proteger FHIR y ABMs Controllers con [Authorize]
    - Los endpoints FHIR y ABMs requieren usuario autenticado.

### FEATURE_SEC_003 - Login en Frontend
Implementar pantalla de login y manejo de tokens en el frontend React.

11. HU SEC-011 - Pantalla de login
    - Como usuario, quiero ver una pantalla de login al acceder al sistema para autenticarme.
    - Criterios de aceptacion:
      - Formulario con campos usuario y contrasena.
      - Validacion de campos requeridos.
      - Mensaje de error generico ante fallo.
      - Redireccion a Home tras login exitoso.
      - Diseno alineado al estilo visual existente del HIS.

12. HU SEC-012 - Manejo de token en frontend
    - Como equipo tecnico, quiero un servicio centralizado de auth en el frontend.
    - Criterios de aceptacion:
      - Almacenamiento seguro del token (memory + httpOnly cookie ideal).
      - Interceptor en llamadas HTTP que agrega header `Authorization: Bearer <token>`.
      - Renovacion automatica via refresh token antes de expiracion.
      - Redireccion a login si token expiro o fue revocado.

13. HU SEC-013 - Proteccion de navegacion
    - Como sistema, quiero evitar que usuarios no autenticados accedan a las paginas del HIS.
    - Criterios de aceptacion:
      - Si no hay token valido, se muestra LoginPage.
      - Si hay token valido, se muestra la aplicacion normal (Home y modulos).
      - Al cerrar sesion, se vuelve a LoginPage.

### FEATURE_SEC_004 - Externalizacion de Credenciales
Eliminar credenciales hardcodeadas de codigo fuente y configuracion.

14. HU SEC-014 - Externalizar credenciales de PostgreSQL
    - Como equipo de operaciones, quiero que las credenciales de DB no esten en archivos de codigo fuente.
    - Criterios de aceptacion:
      - `docker-compose.yml` usa variables de entorno (`${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`).
      - `appsettings.json` usa placeholder o referencia a env var para connection string.
      - Se documenta en README como configurar las credenciales.
      - Se provee `.env.example` con valores de ejemplo (no reales).

15. HU SEC-015 - Externalizar secrets de JWT
    - Como equipo tecnico, quiero que la clave de firma JWT este en user-secrets o variable de entorno.
    - Criterios de aceptacion:
      - Clave de firma no aparece en ningun archivo versionado.
      - En desarrollo se usa `dotnet user-secrets`.
      - En Docker se pasa como variable de entorno.

### FEATURE_SEC_005 - Middleware Global de Errores
Manejo centralizado de excepciones en backend.

16. HU SEC-016 - Middleware de excepciones global
    - Como equipo tecnico, quiero un middleware que capture excepciones no manejadas para evitar leaks de informacion.
    - Criterios de aceptacion:
      - Se registra en pipeline de .NET 8 (antes de controllers).
      - Excepciones no controladas retornan 500 con mensaje generico.
      - En ambiente desarrollo, se incluye detalle en response.
      - Se loguea excepcion completa en servidor.
      - Se eliminan los try/catch genericos de controllers existentes (gradual).

17. HU SEC-017 - Respuestas de error estandarizadas (ProblemDetails)
    - Como consumidor de la API, quiero respuestas de error consistentes.
    - Criterios de aceptacion:
      - Todas las respuestas de error siguen formato ProblemDetails (RFC 7807).
      - Codigos HTTP correctos: 400 (validacion), 401 (auth), 403 (permisos), 404, 500.
      - No se exponen stack traces en produccion.

### FEATURE_SEC_006 - Modelo de Datos de Seguridad
Tablas base para usuarios del sistema, roles y sesiones.

18. HU SEC-018 - Migracion SQL para schema de seguridad
    - Como equipo tecnico, quiero las tablas base de seguridad en la base de datos.
    - Tablas:
      - `sch_seguridad.usuario_sistema` (id, persona_id FK, username, password_hash, estado, ultimo_login, created_at, updated_at)
      - `sch_seguridad.rol` (id, nombre, descripcion, es_predefinido, created_at)
      - `sch_seguridad.usuario_rol` (usuario_id FK, rol_id FK)
      - `sch_seguridad.sesion_log` (id, usuario_id, accion, ip, user_agent, resultado, created_at)
    - Migracion: `014_feature_seguridad_auth.sql`

19. HU SEC-019 - Seed de datos iniciales de seguridad
    - Como equipo tecnico, quiero un usuario administrador y roles base precargados.
    - Datos:
      - Rol: Administrador, Medico, Administrativo, Cajero, Auditor.
      - Usuario admin por defecto (con contrasena temporal que debe cambiarse en primer login).

## Nota
Estas HU cubren exclusivamente la Prioridad 1 (Seguridad - Inmediato) del analisis.
Las prioridades 2, 3 y 4 se gestionan como mejoras transversales en el plan de accion general.
