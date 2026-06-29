# Trazabilidad HU y Pantallas - Step-by-step Funcional

## Confirmacion de lectura

Se esta leyendo y usando como fuente:

- HU y flujo en Adobe XD ABM Prestaciones
- Referencia activa observada: 7625 - Homologacion directa (pantalla 36/92)
- HU detectadas en el flujo trabajado: 6078, 6079, 6081, 7625

## Matriz HU -> Pantallas -> Componentes -> Estado

## HU 6078 - Listado prestaciones de un catalogo

- Pantallas: grilla/listado prestaciones
- Componentes backend:
  - GET /api/v1/catalogos/{id}/prestaciones
  - filtros por codigo/descripcion/estado/modulo
- Componentes frontend:
  - tabla de prestaciones por catalogo
  - filtros
- Estado: HECHO

## HU 6079 - Alta de prestacion de un catalogo

- Pantallas: alta/edicion y variantes modulo si/no
- Componentes backend:
  - POST /api/v1/catalogos/{id}/prestaciones
  - PUT /api/v1/prestaciones/{id}
  - validacion modulo/prioridad
  - validacion duplicidad
- Componentes frontend:
  - formulario alta
  - accion editar
  - manejo de errores
- Estado: HECHO BASE
- Pendiente fino UX:
  - formularios avanzados por clasificacion
  - alertas visuales 1:1 con prototipo

## HU 6081 - Inactivar prestacion de un catalogo

- Pantallas: accion de inactivacion
- Componentes backend:
  - PATCH /api/v1/prestaciones/{id}/estado
- Componentes frontend:
  - boton inactivar
  - refresco de estado en grilla
- Estado: HECHO

## HU 7625 - Homologacion directa

- Pantallas: subflujo homologacion
- Componentes backend:
  - POST /api/v1/prestaciones/homologaciones/reglas
  - POST /api/v1/prestaciones/homologaciones/resolver
  - soporte directa y clasificacion
  - criterios: centro/especialidad/complejidad/financiador/plan/edad/ambito/prioridad
- Componentes frontend:
  - UI dedicada de reglas y simulacion
- Estado:
  - Backend: HECHO
  - Frontend: PENDIENTE

## Step-by-step funcional implementado en backend

1. Entrada HIS (codigo_origen)
2. Modulacion a prestacion ODI
3. Evaluacion homologacion por reglas
4. Asociacion convenio-plan
5. Valorizacion tarifaria
6. Readiness prefactura

Endpoint de simulacion completa:

- POST /api/v1/prefactura/simular-completar-readiness

Estado: HECHO

## Estado global actual

- Backend funcional del circuito step-by-step: HECHO
- Frontend ABM basico catalogos/prestaciones: HECHO
- Frontend especifico de homologacion por reglas: PENDIENTE

## Siguiente bloque recomendado (B.1)

- Pantalla de reglas de homologacion
- Pantalla de simulacion de caso HIS
- Pantalla de readiness por prestacion
