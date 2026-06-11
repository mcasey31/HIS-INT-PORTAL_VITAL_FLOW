# Estrategia de Desarrollo - EPICA SEGURIDAD

Fecha: 2026-05-31

## 1) Contexto revisado

Fuentes base revisadas:
- EPICA SEGURIDAD/product-brief-integral.md
- EPICA SEGURIDAD/user-histories.md
- EPICA SEGURIDAD/FEATURE_HU/index.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_001_AUTENTICACION-JWT-BACKEND/feature.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_002_AUTORIZACION-CONTROLLERS/feature.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_003_LOGIN-FRONTEND/feature.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_004_EXTERNALIZACION-CREDENCIALES/feature.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_005_MIDDLEWARE-ERRORES/feature.md
- EPICA SEGURIDAD/FEATURE_HU/FEATURE_SEC_006_MODELO-DATOS-SEGURIDAD/feature.md
- docs/arquitectura-tecnica-front-back-db.md
- docs/decision-stack-tecnologico-his.md

Hallazgos del estado actual:
- Backend sin autenticacion/autorizacion configurada en Program.cs.
- Controllers sin [Authorize]/[AllowAnonymous].
- Errores manejados mayormente con try/catch repetidos por controller.
- Credenciales hardcodeadas en docker-compose.yml y appsettings.json.
- Frontend sin login ni guard de navegacion.

## 2) Orden recomendado (por dependencias reales)

Orden de ejecucion:
1. HU SEC-014 y HU SEC-015 (externalizacion de secretos y credenciales)
2. HU SEC-018 y HU SEC-019 (modelo de datos de seguridad + seed)
3. HU SEC-016 y HU SEC-017 (middleware global + ProblemDetails)
4. HU SEC-001, HU SEC-002, HU SEC-003, HU SEC-004 (auth JWT backend)
5. HU SEC-011, HU SEC-012, HU SEC-013 (login y manejo de token frontend)
6. HU SEC-005 a HU SEC-010 (activar autorizacion por controllers de forma progresiva)

Motivo del orden:
- Sin secretos externalizados, se reintroduce deuda critica.
- Sin modelo de datos, login/refresh/logout queda acoplado a mocks.
- Sin middleware/ProblemDetails, el contrato de errores no queda estable.
- Frontend depende de endpoints de auth funcionando.
- Proteger todos los controllers antes del login front bloquearia uso de la app.

## 3) Plan de ejecucion por oleadas

### Oleada 0 - Baseline y seguridad operativa
- Objetivo: cerrar exposicion de credenciales inmediatamente.
- HU: SEC-014, SEC-015.
- Entregables:
  - docker-compose.yml con variables de entorno para DB/JWT.
  - appsettings.json sin secretos versionados.
  - .env.example y README de configuracion.
- Salida: no existen secretos reales en repositorio ni en compose/appsettings.

### Oleada 1 - Fundacion tecnica de seguridad
- Objetivo: base de datos y contrato de errores listos.
- HU: SEC-018, SEC-019, SEC-016, SEC-017.
- Entregables:
  - Migracion 014_feature_seguridad_auth.sql con schema sch_seguridad y seeds base.
  - Middleware global de excepciones.
  - Estandar RFC7807 para respuestas de error.
- Salida: API retorna errores consistentes y DB soporta usuarios/roles/sesiones.

### Oleada 2 - Autenticacion backend
- Objetivo: emitir, renovar e invalidar sesiones JWT.
- HU: SEC-001, SEC-002, SEC-003, SEC-004.
- Entregables:
  - Configuracion AddAuthentication/AddJwtBearer en Program.cs.
  - AuthController con login/refresh/logout.
  - Rotacion de refresh token.
  - Auditoria de intentos/eventos de sesion.
- Salida: flujo completo de sesion funcional por API y cubierto por pruebas.

### Oleada 3 - Login frontend
- Objetivo: entrada al sistema y gestion de sesion en cliente.
- HU: SEC-011, SEC-012, SEC-013.
- Entregables:
  - LoginPage con validaciones.
  - AuthContext/AuthService centralizado.
  - Cliente HTTP con inyeccion de token y manejo de 401.
  - Guard de navegacion y logout.
- Salida: usuario no autenticado no accede a modulos; autenticado navega normal.

### Oleada 4 - Cierre de superficie expuesta
- Objetivo: todos los endpoints de negocio protegidos.
- HU: SEC-005 a SEC-010.
- Entregables:
  - [Authorize] en controllers y politicas por modulo/rol cuando aplique.
  - [AllowAnonymous] solo en auth/login/refresh y health (si existe).
- Salida: 100% endpoints de negocio requieren token valido.

## 4) Secuencia HU por HU (orden fino)

1. SEC-014
2. SEC-015
3. SEC-018
4. SEC-019
5. SEC-016
6. SEC-017
7. SEC-001
8. SEC-002
9. SEC-003
10. SEC-004
11. SEC-011
12. SEC-012
13. SEC-013
14. SEC-005
15. SEC-006
16. SEC-007
17. SEC-008
18. SEC-009
19. SEC-010

## 5) Criterios de Definition of Ready (DoR) por HU

Cada HU entra a desarrollo solo si cumple:
- Contrato API o impacto de contrato definido.
- Impacto por capa identificado (front/back/db).
- Datos de prueba y casos de error definidos.
- Riesgos de migracion y rollback identificados.
- Criterios de aceptacion testeables y no ambiguos.

## 6) Criterios de Definition of Done (DoD) por HU

Cada HU se cierra solo si:
- Cumple criterios funcionales de la HU.
- Tiene pruebas de backend (unit/integration) y, si aplica, frontend/e2e.
- Incluye manejo de errores estandar (ProblemDetails).
- No agrega secretos hardcodeados.
- Documentacion tecnica y operativa actualizada.

## 7) Matriz minima de pruebas recomendada

Por cada HU de seguridad:
- Caso feliz.
- Credenciales/token invalido.
- Permiso insuficiente (403 cuando aplique).
- Expiracion de token y refresh.
- Regresion de modulos existentes (agenda/personas/turnos/admision/hca/recetas/fhir/abms).

## 8) Riesgos principales y mitigacion

Riesgo 1: cortar acceso al front al activar [Authorize] demasiado temprano.
- Mitigacion: activar controllers protegidos solo despues de Oleada 3.

Riesgo 2: secretos expuestos en commits intermedios.
- Mitigacion: Oleada 0 primero y regla de PR bloqueante para secretos.

Riesgo 3: respuestas de error inconsistentes durante transicion.
- Mitigacion: middleware global antes de auth y refactor gradual de try/catch.

Riesgo 4: migraciones no aplicadas automaticamente en volumen existente.
- Mitigacion: aplicar SQL manualmente en ambientes con volumen persistido.

## 9) Entregable sugerido por sprint

Sprint A:
- SEC-014, SEC-015, SEC-018, SEC-019, SEC-016, SEC-017.

Sprint B:
- SEC-001, SEC-002, SEC-003, SEC-004, SEC-011.

Sprint C:
- SEC-012, SEC-013, SEC-005, SEC-006, SEC-007, SEC-008, SEC-009, SEC-010.

## 10) Criterio de cierre de epica

La epica SEGURIDAD se considera cerrada cuando:
- Ningun endpoint de negocio responde sin token valido.
- Login/refresh/logout funciona E2E desde frontend.
- Secretos no estan hardcodeados en codigo versionado.
- Errores siguen ProblemDetails sin fuga de stack traces en produccion.
- Existe usuario admin inicial y roles base operativos.

## 11) Backlog de evolucion: seguridad por centro

Objetivo:
- Incorporar control de acceso contextual por centro/sede para evitar cruces de datos entre estructuras asistenciales.

Lineamientos:
1. En login, cuando el usuario tenga mas de un centro habilitado, solicitar seleccion obligatoria de `centro de contexto`.
2. Incluir `centro_id` (o claim equivalente) en sesion/token para aplicar filtros y autorizaciones por contexto.
3. Resolver autorizacion efectiva por interseccion de rol + centro (`usuario-rol-centro`) y no solo por rol global.
4. Permitir medicos multi-centro: cambio controlado de contexto de centro con trazabilidad de auditoria.
5. Para estructuras con sedes, modelar sede operativa como centro a nivel agenda/turnos/admision, manteniendo relacion jerarquica con centro padre.
6. Modelar `features` como objetos versionables (feature_id, accion, modulo) para asignaciones granulares junto a centro en el ABM de roles.
