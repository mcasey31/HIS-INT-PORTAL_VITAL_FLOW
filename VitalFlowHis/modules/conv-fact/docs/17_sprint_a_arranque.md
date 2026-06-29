# Sprint A - Arranque ejecutado

Fecha: 2026-06-06

## Alcance implementado en este arranque

Se implemento el primer incremento funcional del Sprint A para ABM Prestaciones/Catalogo.

### Backend (FastAPI)

Endpoints creados:

- GET /api/v1/catalogos
- POST /api/v1/catalogos
- PATCH /api/v1/catalogos/{id}/estado
- GET /api/v1/catalogos/{id}/prestaciones
- POST /api/v1/catalogos/{id}/prestaciones
- GET /api/v1/prestaciones/{id}
- PATCH /api/v1/prestaciones/{id}/estado
- GET /api/v1/auditoria

Reglas implementadas:

- Duplicidad de codigo de catalogo.
- Duplicidad de codigo de prestacion dentro del catalogo.
- Si modulo = true, prioridad obligatoria.
- Inactivacion por cambio de estado (baja logica).
- Registro de auditoria en altas y cambios de estado.

Nota tecnica:

- Persistencia actual: PostgreSQL local dockerizado (tablas en sch_convenios + auditoria en sch_auditoria).
- Endpoints ABM ya migrados de memoria a SQL.

### Frontend (React)

Pantalla integrada Sprint A:

- Listado de catalogos.
- Alta de catalogo.
- Inactivacion de catalogo.
- Seleccion de catalogo activo de trabajo.
- Listado de prestaciones por catalogo.
- Alta de prestacion con opcion modulo/prioridad.
- Inactivacion de prestacion.
- Visualizacion de errores de validacion retornados por API.

## Pendientes para completar Sprint A

- Edicion de catalogo/prestacion (PUT/PATCH de atributos). (completado)
- Filtros de grilla (codigo, descripcion, estado). (completado)
- Persistencia en BD local dockerizada. (completado)
- Integrar auditoria con tabla real. (completado)
- Casos de prueba API y smoke test UI. (completado)

## Delta de avance 2026-06-06 (continuacion)

- API:
	- GET /api/v1/catalogos con filtros opcionales por codigo, descripcion y estado.
	- PUT /api/v1/catalogos/{id} para edicion.
	- GET /api/v1/catalogos/{id}/prestaciones con filtros opcionales por codigo, descripcion, estado y modulo.
	- PUT /api/v1/prestaciones/{id} para edicion.
- Frontend:
	- Filtros de catalogos y prestaciones en pantalla ABM.
	- Acciones de editar catalogo y editar prestacion desde UI.
- Validacion:
	- Smoke test API para edicion/filtros ejecutado OK.

## Validacion automatizada agregada

- Script API: scripts/test_api_sprint_a.ps1
	- Cubre alta, duplicidad, edicion, filtros y auditoria.
- Script seed UI: scripts/seed_ui_smoke_sprint_a.ps1
- Checklist UI reproducible: docs/18_sprint_a_smoke_ui.md

## Criterio de aceptacion cubierto parcialmente

- 6078 listado: cubierto base.
- 6079 alta: cubierto base con regla modulo/prioridad.
- 6081 inactivar: cubierto base.
- Alertas de duplicidad/prioridad: cubierto base.

## Comando de verificacion sugerido

- docker compose --env-file .env up -d --build
- docker compose ps
