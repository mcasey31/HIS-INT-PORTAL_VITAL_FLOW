# Mapa de Componentes - Prestaciones y Catalogos

## Para que sirve este documento

Aterriza el plan en componentes concretos para responder:

- que hay que desarrollar
- en que sprint cae cada componente
- estado actual real
- criterio de cierre por componente

## Donde estaba contemplado hasta ahora

- Vision funcional E2E: docs/16_esquema_funcional_prestaciones_e2e.md
- Ejecucion Sprint A: docs/17_sprint_a_arranque.md
- Reglas de homologacion: docs/19_homologacion_reglas_negocio.md
- Simulacion completa prefactura: docs/20_prefactura_simulacion_completa.md
- Roadmap macro: docs/15_roadmap_sprints_abm.md

Este documento consolida esos artefactos en un backlog por componente.

## Matriz de componentes y estado

## 1) Catalogos ABM

- Componente: alta/edicion/inactivacion/listado/filtros
- Capa backend: endpoints /api/v1/catalogos
- Capa frontend: pantalla ABM Catalogos
- Capa datos: sch_convenios.t_catalogos
- Sprint objetivo: A
- Estado: HECHO
- Cierre:
  - CRUD operativo
  - validacion duplicidad
  - auditoria

## 2) Prestaciones por Catalogo ABM

- Componente: alta/edicion/inactivacion/listado/filtros
- Capa backend: endpoints /api/v1/catalogos/{id}/prestaciones y /api/v1/prestaciones/{id}
- Capa frontend: pantalla ABM Prestaciones
- Capa datos: sch_convenios.t_prestaciones_catalogos
- Sprint objetivo: A
- Estado: HECHO
- Cierre:
  - regla modulo/prioridad
  - duplicidad por catalogo
  - auditoria

## 3) Homologacion simple

- Componente: alta/listado/cambio estado homologacion directa
- Capa backend: /api/v1/prestaciones/homologaciones
- Capa datos: sch_convenios.t_homologaciones_prestaciones
- Sprint objetivo: B
- Estado: HECHO BASE
- Cierre pendiente:
  - UI dedicada de gestion de homologaciones

## 4) Homologacion por reglas complejas

- Componente: reglas por contexto
- Variables de regla:
  - centro
  - especialidad
  - complejidad
  - financiador
  - plan
  - edad
  - ambito
  - tipo_homologacion
  - clasificacion_valor
  - prioridad
- Capa backend:
  - POST /api/v1/prestaciones/homologaciones/reglas
  - GET /api/v1/prestaciones/homologaciones/reglas
  - POST /api/v1/prestaciones/homologaciones/resolver
- Capa datos: sch_convenios.t_homologaciones_reglas_sprint
- Sprint objetivo: B
- Estado: HECHO BACKEND
- Cierre pendiente:
  - UI de reglas
  - versionado/fechas de vigencia

## 5) Integracion Convenio-Plan

- Componente: asociar prestacion para habilitar proceso
- Capa backend: POST /api/v1/convenios-planes/prestaciones
- Capa datos: sch_convenios.t_prestaciones_convenios_planes_sprint
- Sprint objetivo: B
- Estado: HECHO BACKEND
- Cierre pendiente:
  - UI ABM convenio-plan

## 6) Valorizacion Tarifaria

- Componente: crear tarifario y valorizar prestacion
- Capa backend:
  - POST /api/v1/tarifarios
  - POST /api/v1/tarifarios/{id}/prestaciones
- Capa datos:
  - sch_convenios.t_tarifarios_sprint
  - sch_convenios.t_tarifarios_prestaciones_sprint
- Sprint objetivo: B
- Estado: HECHO BACKEND
- Cierre pendiente:
  - UI ABM tarifarios

## 7) Readiness Prefactura

- Componente: evaluacion de estado para entrar al proceso
- Capa backend: GET /api/v1/e2e/readiness/{prestacion_id}
- Sprint objetivo: B
- Estado: HECHO
- Regla:
  - homologada
  - vinculada_convenio_plan
  - valorizada_tarifario

## 8) Simulacion circuito completo

- Componente: flujo de punta a punta en 1 endpoint
- Capa backend: POST /api/v1/prefactura/simular-completar-readiness
- Sprint objetivo: B
- Estado: HECHO
- Caso validado:
  - HIS 420101 -> Swiss Guardia -> destino 420104 -> listo_prefactura true

## 9) UI faltante para cerrar Prestaciones/Catalogos

- Gestion visual de reglas de homologacion
- Gestion visual de convenio-plan
- Gestion visual de tarifarios/valores
- Tablero de readiness por prestacion
- Simulador UI de caso HIS

Sprint objetivo de cierre UI: B/C (segun capacidad)
Estado: PENDIENTE

## 10) Integracion real con SP de iniciar proceso factura

- Componente: adapter de invocacion al SP real
- Entradas: practica HIS + contexto
- Salidas: traza de validaciones y resultado de prefacturacion
- Sprint objetivo: C (antes de prefactura operativa)
- Estado: PENDIENTE

## Proximo plan operativo recomendado

## Sprint B.1 (inmediato)

- UI reglas de homologacion
- UI convenio-plan
- UI tarifarios y valores
- pantalla de readiness por prestacion

## Sprint B.2

- Simulador funcional UI (casos HIS)
- lote de escenarios QA por financiador/ambito/edad
- endurecer validaciones cruzadas

## Criterio de "Prestaciones/Catalogos cerrados"

Se considera cerrado cuando:

- ABM catalogos y prestaciones operativo (ya)
- reglas complejas de homologacion operativas (ya backend)
- convenio-plan y tarifario operativos (ya backend)
- UI completa para operar sin scripts (pendiente)
- evidencia QA multicaso por financiador (pendiente)
