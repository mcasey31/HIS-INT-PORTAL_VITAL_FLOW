# Cierre de Hito - Agenda (2026-05-30)

## Objetivo del hito
Consolidar la gestion de agendas y bloques con foco en practicas asociadas, demanda espontanea y grupos de profesionales, incluyendo validacion funcional end-to-end desde la web.

## Alcance cerrado
- HU 8990: alta de bloques de demanda espontanea.
- HU 7029: agregar practicas a bloque (fija y variable).
- HU 11197: eliminar practicas medicas de bloque.
- HU 7028: listado y busqueda de practicas medicas.
- HU 11199: crear grupo de profesionales (modelo, migracion, API y UI).

## Implementaciones tecnicas relevantes
### Backend
- Soporte de parseo de hora en alta/edicion de bloque para formatos `HH:mm` y `HH:mm:ss`.
- Correccion de SQL en insercion de bloque de programacion (consulta con columnas duplicadas en `INSERT`).
- Endpoint para quitar practica de bloque y reglas de validacion asociadas.
- Endpoint para crear grupo profesional con validaciones de unicidad y miembros.

### Frontend
- Flujo completo para agregar practicas en bloque fijo y variable.
- Flujo de quitar practica con confirmacion.
- Tarjeta de listado de practicas con filtro de busqueda.
- Formulario de alta para grupo profesional (HU 11199).

### Base de datos
- Migracion `006_feature_11199_grupo_profesionales.sql` aplicada y verificada.
- Tablas: `sch_agenda.grupo_profesional` y `sch_agenda.grupo_profesional_miembro` con restricciones e indices.

## Evidencia funcional ejecutada
### Casos web ejecutados
- Programada fija con bloque: OK.
- Programada variable con bloque: OK.
- Demanda espontanea sin bloque: OK.

### Agendas de evidencia
- `AG-E2E-FIJA-141987`: activa, bloques 1.
- `AG-E2E-VAR-163928`: activa, bloques 1.
- `AG-E2E-DEM-163928`: activa, bloques 0.

### Disponibilidad validada
- `AG-E2E-FIJA-141987`: Cupos totales 8, disponibles 8, bloqueos 0.
- `AG-E2E-VAR-163928`: Cupos totales 24, disponibles 24, bloqueos 0.
- `AG-E2E-DEM-163928`: Cupos totales 0, disponibles 0, bloqueos 0.

## Incidencias resueltas durante el cierre
- Error 400 en alta de bloque por conversion de hora desde web (`HH:mm`).
- Error SQL `42601` en insercion de bloque por sentencia malformada.
- Interferencia de modal de confirmacion en la automatizacion web.

## Estado final del hito
- Hito de Agenda: CERRADO.
- Build backend: OK.
- Build frontend: OK.
- Validacion end-to-end web: OK.

## Siguiente paso recomendado
Iniciar EPICA TURNOS con HU de mayor traccion funcional y menor dependencia externa.
- Opcion recomendada para arranque: HU 12136 (Asignacion de Sobre turnos, estado Committed).
- Alternativa de onboarding rapido: HU 12072 (Visualizacion de turnos todos-callcenter, estado New).
