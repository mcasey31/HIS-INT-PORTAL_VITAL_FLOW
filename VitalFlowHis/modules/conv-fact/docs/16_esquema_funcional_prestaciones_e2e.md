# Esquema Funcional E2E - Prestaciones y Catalogo

## Objetivo

Definir los componentes necesarios para desarrollar punta a punta el flujo de Prestaciones desde UX (ABM) hasta impacto en prefacturacion/facturacion.

## Evidencia UX analizada

Link fuente:
- https://xd.adobe.com/view/290bf734-74f2-42c9-9bcf-b04e31ee477f-7c58/

Pantallas/HU visibles en el recorrido:
- 6078 - Listado prestaciones de un catalogo
- 6079 - Alta de prestacion de un catalogo (multiples variantes y alertas)
- 6081 - Inactivar prestacion de un catalogo
- 7625 - Homologacion directa (subflujo)

Senales funcionales detectadas en UX:
- Alta de prestacion con modalidad Modulo Si/No.
- Validaciones y alertas de prioridad.
- Alertas de prestacion duplicada o conflicto.
- Subflujo de homologacion directa.
- Grilla de consulta y acciones de mantenimiento.

## Componentes necesarios para el desarrollo E2E

## 1. Frontend

### 1.1 Modulo de Catalogos

- Pantalla de listado de catalogos.
- Alta/edicion de catalogo.
- Estado activo/inactivo.

### 1.2 Modulo de Prestaciones por Catalogo

- Grilla 6078 con filtros (codigo, descripcion, estado, clasificacion, modulo).
- Alta 6079 con formulario en bloques:
  - Datos base de prestacion.
  - Parametros de clasificacion.
  - Configuracion Modulo Si/No.
  - Prioridad y reglas asociadas.
- Edicion de prestacion (misma estructura que alta con bloqueo de campos clave segun regla).
- Inactivacion 6081 con confirmacion y motivo obligatorio.

### 1.3 Subflujo Homologacion Directa

- Pantallas 7625-x para mapear prestacion origen -> prestacion interna.
- Visualizacion de estado homologada/no homologada.
- Deteccion de duplicados de mapeo.

### 1.4 Componentes UI reutilizables

- DataGrid con filtros avanzados y exportacion.
- Formulario dinamico por tipo de prestacion.
- Modales de confirmacion y alerta de conflicto.
- Selector jerarquico de clasificaciones.

## 2. Backend API

### 2.1 Catalogos

- GET /api/v1/catalogos
- POST /api/v1/catalogos
- PUT /api/v1/catalogos/{id}
- PATCH /api/v1/catalogos/{id}/estado

### 2.2 Prestaciones

- GET /api/v1/catalogos/{idCatalogo}/prestaciones
- POST /api/v1/catalogos/{idCatalogo}/prestaciones
- GET /api/v1/prestaciones/{id}
- PUT /api/v1/prestaciones/{id}
- PATCH /api/v1/prestaciones/{id}/estado

### 2.3 Homologacion

- GET /api/v1/prestaciones/homologaciones
- POST /api/v1/prestaciones/homologaciones
- PATCH /api/v1/prestaciones/homologaciones/{id}

### 2.4 Servicios de dominio requeridos

- Servicio de validacion de prioridad de prestacion.
- Servicio de deteccion de duplicidad por codigo/descripcion/combinacion de atributos.
- Servicio de evaluacion de modularizacion (Modulo Si/No) y consistencia con clasificaciones.
- Servicio de auditoria de cambios.

## 3. Datos y persistencia

Tablas reales involucradas (relevamiento BD):

### 3.1 Maestro catalogo/prestacion

- sch_convenios.t_catalogos
- sch_convenios.t_prestaciones_catalogos
- sch_convenios.t_prestaciones_catalogos_ambitos
- sch_convenios.t_modulos_prestaciones
- sch_convenios.t_componentes_prestaciones

### 3.2 Clasificaciones

- sch_convenios.t_clasificacion_prestaciones
- sch_convenios.t_clasificacion_prestaciones_valores
- sch_convenios.t_clasificacion_prestaciones_valores_catalogo
- sch_convenios.t_clasificacion_prestaciones_valores_referencia

### 3.3 Relacion con convenios y valorizacion

- sch_convenios.t_prestaciones_convenios_planes
- sch_convenios.t_tarifarios
- sch_convenios.t_tarifarios_prestaciones_catalogos
- sch_convenios.t_tarifarios_convenios_planes

### 3.4 Consumo en proceso facturador

- sch_facturador.t_prestaciones
- sch_facturador.t_prestaciones_episodios
- sch_facturador.t_prestaciones_conceptos_facturables
- sch_facturador.t_prefacturas_conceptos

## 4. Reglas funcionales criticas

- No permitir alta de prestacion duplicada dentro del mismo catalogo por clave funcional.
- Si Modulo = Si, requerir parametros de modularizacion y prioridad valida.
- Si Modulo = No, deshabilitar atributos exclusivos de modulo.
- Inactivacion de prestacion bloqueada si tiene uso activo en convenios vigentes (o manejar baja logica diferida).
- Toda mutacion debe generar evento de auditoria.

## 5. Secuencia E2E objetivo

1. Crear/editar catalogo.
2. Alta de prestacion en catalogo (6079).
3. Configurar clasificaciones y modulo.
4. Resolver alertas de prioridad/duplicidad.
5. Homologacion directa (7625) cuando aplique.
6. Asociar prestacion a convenio-plan.
7. Asociar valorizacion en tarifario.
8. Consumir prestacion en episodio y procesamiento.
9. Impactar en prefactura (conceptos).
10. Impactar en factura final.

## 6. Plan de construccion sugerido (2 sprints)

### Sprint A - ABM Prestaciones Base

- Catalogos + grilla 6078.
- Alta/edicion 6079.
- Inactivacion 6081.
- Validaciones base + auditoria.

### Sprint B - Homologacion y salida a proceso

- Subflujo 7625 homologacion directa.
- Integracion con convenio-plan y tarifario.
- Prueba integrada hasta prefactura.

## 7. Checklist de Definition of Done

- UX implementada para 6078/6079/6081 y rama 7625.
- Endpoints backend con validaciones y errores normalizados.
- Persistencia en tablas maestras y relaciones.
- Auditoria activa en cada mutacion.
- Prueba E2E: Catalogo -> Prestacion -> Convenio/Plan -> Tarifario -> Prefactura.

## 8. Riesgos y mitigacion

- Riesgo: reglas ambiguas de prioridad/modularizacion.
  - Mitigacion: matriz de reglas funcionales firmada antes de build.
- Riesgo: duplicidad de prestaciones por historico de datos.
  - Mitigacion: job de saneamiento + constraints logicos.
- Riesgo: desvinculo entre homologacion y proceso de prefactura.
  - Mitigacion: prueba de contrato entre servicios de homologacion y procesamiento.
