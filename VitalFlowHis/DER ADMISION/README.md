# DER ADMISION - Estrategia de reestructuracion de BD sin romper base actual

## Objetivo
Definir una estrategia de evolucion del modelo de datos de Admision para:
- estructurar el dominio en base al DER compartido,
- evitar hardcode y datos en memoria para catalogos de negocio,
- preservar compatibilidad hacia atras con tablas y contratos ya productivos.

Esta propuesta es incremental y no destructiva: no elimina tablas ni columnas existentes en esta etapa.

## Decision de nomenclatura DER (aclaracion solicitada)
- El nombre canonico de entidad/tabla es **Centros**.
- La referencia estructural actual se mantiene sobre `sch_agenda.centro` (compatible hacia atras).

## Estado actual relevado
Base existente en BD:
- `sch_admision.turno_admision` (migracion 012)
- `sch_admision.encuentro` (migracion 012)
- `sch_admision.homologacion_practica_catalogo_facturacion` (migracion 029)
- `sch_admision.eventos_facturacion_outbox` (migraciones 027/029)

Hallazgos de acoplamiento a hardcode (backend):
- Estados de admision y transiciones definidos como constantes y estructuras en memoria.
- Estados de turno con valores literales en servicios/repositorios.
- Filtros SQL con estados fijos embebidos.

Impacto: cada cambio funcional de estados requiere deploy de backend, y no solo migracion/configuracion de BD.

## Principios de diseno para no romper
1. Aditivo primero: solo agregar tablas, vistas, indices y constraints no bloqueantes.
2. Compatibilidad temporal: mantener columnas actuales (`estado`, `estado_turno`) y mapear contra catalogos.
3. Feature toggles por datos: habilitar cambios por parametria y no por codigo.
4. Backfill controlado: completar catalogos y referencias antes de activar validaciones estrictas.
5. Desacople progresivo: primero lectura desde catalogo, luego validacion, luego retiro de hardcode.

## Fase 1 (esta rama): Catalogos y transiciones en BD
Se crea migracion aditiva para:
- catalogo de estados de admision,
- matriz de transiciones permitidas,
- catalogo de estados de turno.

Beneficio inmediato:
- el origen de verdad de estados queda en BD,
- habilita que servicios consulten catalogos en vez de arrays/diccionarios hardcodeados.

## Fase 2: Consumo desde backend sin ruptura
Cambios sugeridos en API:
- agregar repositorio de catalogos de admision (lectura de estados y transiciones activas),
- reemplazar listas/constantes en memoria por consultas a BD,
- resolver estados por acciones parametrizadas y mapeos en BD (sin fallback).

Regla de oro:
- cualquier estado nuevo se incorpora por migracion/seed en BD; no por cambio de constantes.

## Fase 3: Validacion fuerte y endurecimiento
Con cobertura de datos validada:
- agregar constraints o FK sobre `turno_admision.estado` y `turno_admision.estado_turno`,
- bloquear insercion de estados fuera de catalogo,
- opcional: migrar a IDs tecnicos manteniendo codigos semanticos unicos.

## Renombre/restructura de tablas existentes
Si el DER final exige renombres:
- no renombrar en caliente tablas productivas usadas por la app,
- crear tabla nueva o vista de compatibilidad,
- migrar datos por lote,
- conmutar lectura/escritura por feature flag,
- retirar tabla legada solo cuando no existan consumidores.

Patron recomendado para renombres:
1. crear nueva estructura,
2. dual-write temporal,
3. reconciliar,
4. switch de lectura,
5. retiro progresivo.

## Reglas anti-hardcode y anti-memoria
Para catalogos funcionales (estados, tipos, motivos, transiciones):
- persistidos en BD,
- auditables (created_at, updated_at, activo),
- administrables por ABM o scripts SQL,
- no definidos como colecciones estaticas en codigo.

Para defaults:
- usar filas marcadas como `is_default` o `orden` en catalogo,
- resolver por consulta, no por literal en servicio.

## Plan de ejecucion recomendado
1. Aplicar migracion 042 (catalogos de estados/transiciones).
2. Aplicar migracion 043 (acciones/mapeos para resolver estados por datos).
3. Implementar lectura de catalogos y acciones desde backend.
4. Activar validacion de transiciones por BD.
5. Agregar tests de regresion de transiciones y cierre de encuentro.

## Criterios de exito
- Se agrega un estado nuevo sin cambiar codigo de negocio.
- No hay regresion en alta/cambio de estado/cierre de encuentro.
- Las tablas actuales siguen operativas durante toda la transicion.
- No existen estados huerfanos fuera de catalogo en produccion.

## Alcance del documento
Este documento define la arquitectura de evolucion. El detalle de pasos operativos y verificacion esta en `checklist-migracion-sin-ruptura.md` dentro de esta misma carpeta.
