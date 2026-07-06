# Checklist de migracion ADMISION sin ruptura

## Pre-migracion
- [ ] Confirmar backup reciente de BD.
- [ ] Confirmar rama activa: `restructura_db_sin_romper_base_actual`.
- [ ] Confirmar que no existan scripts manuales pendientes fuera de `db/migrations`.
- [ ] Confirmar decision DER: nombre funcional = `Centros` (persistencia actual sobre `sch_agenda.centro`).
- [ ] Relevar valores actuales distintos de `estado` y `estado_turno` en `sch_admision.turno_admision`.

## Ejecucion
- [ ] Aplicar migracion `042_feature_admision_parametrizacion_estados.sql`.
- [ ] Aplicar migracion `043_feature_admision_estado_acciones_y_mapeos.sql`.
- [ ] Verificar creacion de tablas:
  - `sch_admision.estado_admision_catalogo`
  - `sch_admision.estado_admision_transicion`
  - `sch_admision.estado_turno_catalogo`
- [ ] Verificar creacion de tablas de resolucion por datos:
  - `sch_admision.accion_estado_admision`
  - `sch_admision.accion_estado_turno`
  - `sch_admision.estado_admision_turno_mapeo`
- [ ] Verificar seeds base (`PROGRAMADO`, `EN_SALA_DE_ESPERA`, `ATENDIDO`, etc.).

## Validacion de datos
- [ ] Verificar que todos los estados usados en `turno_admision` existen en catalogo.
- [ ] Verificar que no haya transiciones huerfanas en matriz.
- [ ] Verificar que `estado_turno` usados existen en `estado_turno_catalogo`.

## Integracion backend
- [ ] Implementar repositorio de catalogos de estados y transiciones.
- [ ] Sustituir arrays/diccionarios hardcode por lectura desde BD.
- [ ] Sustituir decisiones de estado por acciones parametrizadas en BD.
- [ ] Validar que no exista fallback de estados en memoria.
- [ ] Agregar tests unitarios de transiciones validas/invalidas.

## Endurecimiento (post-estabilizacion)
- [ ] Eliminar fallback de hardcode.
- [ ] Agregar constraints/FK para evitar estados fuera de catalogo.
- [ ] Monitorear errores por 7 dias y cerrar fase.

## Aprobacion
- [ ] QA funcional ADMISION ok.
- [ ] QA regresion TURNOS/HCA ok.
- [ ] Aprobacion tecnica para siguiente etapa DER (renombres o split de tablas, si aplica).
