# Matriz HU -> Tablas -> Endpoints Sugeridos

## Objetivo

Traducir HUs funcionales de los 5 dominios criticos a un backlog tecnico inicial para webapp, indicando tablas principales y endpoints sugeridos.

Base: odi_db_facturacion
Esquemas: sch_convenios, sch_facturador, sch_motor_reglas, sch_auditoria

## Convenciones

- Prioridad:
  - P1: base transaccional critica para salida a produccion.
  - P2: mejora funcional o soporte operativo.
- Endpoints propuestos con prefijo sugerido:
  - /api/v1/convenios
  - /api/v1/prestadores
  - /api/v1/tarifarios
  - /api/v1/prefacturas
  - /api/v1/facturas

## Matriz

| Dominio | HU | Prioridad | Tablas principales | Endpoints sugeridos |
|---|---|---|---|---|
| Convenios | 6461 - Grilla listado de convenios | P1 | sch_convenios.t_convenios, sch_convenios.t_convenios_planes, sch_convenios.t_convenios_prestadores | GET /api/v1/convenios, GET /api/v1/convenios?filtros= |
| Convenios | 6462 - Alta cabecera de convenio | P1 | sch_convenios.t_convenios, sch_convenios.tm_tipos_convenios | POST /api/v1/convenios |
| Convenios | 6463 - Editar cabecera de convenio | P1 | sch_convenios.t_convenios | PUT /api/v1/convenios/{id}, PATCH /api/v1/convenios/{id} |
| Convenios | 6464 - Inactivar convenio | P1 | sch_convenios.t_convenios | PATCH /api/v1/convenios/{id}/estado |
| Convenios | 6468 - Gestionar tarifario de convenio | P1 | sch_convenios.t_convenios_planes, sch_convenios.t_tarifarios_convenios_planes | GET /api/v1/convenios/{id}/planes/{idPlan}/tarifarios, PUT /api/v1/convenios/{id}/planes/{idPlan}/tarifarios |
| Convenios | 6466 - Gestionar normas operativas del convenio | P1 | sch_convenios.t_normas_convenios_planes, sch_convenios.t_normas_operativas | GET /api/v1/convenios/{id}/normas, PUT /api/v1/convenios/{id}/normas |
| Prestador | 5917 - Listado de prestadores | P1 | sch_convenios.t_prestadores, sch_convenios.t_sociedades_prestadores | GET /api/v1/prestadores |
| Prestador | 5916 - Alta de prestador | P1 | sch_convenios.t_prestadores, sch_convenios.t_domicilios | POST /api/v1/prestadores |
| Prestador | 5919 - Editar prestador | P1 | sch_convenios.t_prestadores | PUT /api/v1/prestadores/{id}, PATCH /api/v1/prestadores/{id} |
| Prestador | 5918 - Inactivar prestador | P1 | sch_convenios.t_prestadores | PATCH /api/v1/prestadores/{id}/estado |
| Prestador | 6338 - Locaciones de un prestador | P2 | sch_convenios.t_locaciones, sch_convenios.t_prestadores | GET /api/v1/prestadores/{id}/locaciones, POST /api/v1/prestadores/{id}/locaciones |
| Tarifarios | 6479 - Listado de tarifarios | P1 | sch_convenios.t_tarifarios, sch_convenios.t_catalogos | GET /api/v1/tarifarios |
| Tarifarios | 6480 - Alta de tarifario | P1 | sch_convenios.t_tarifarios | POST /api/v1/tarifarios |
| Tarifarios | 6481 - Editar tarifario | P1 | sch_convenios.t_tarifarios | PUT /api/v1/tarifarios/{id}, PATCH /api/v1/tarifarios/{id} |
| Tarifarios | 11206 - Listado de prestaciones de un tarifario | P1 | sch_convenios.t_tarifarios_prestaciones_catalogos, sch_convenios.t_prestaciones_catalogos | GET /api/v1/tarifarios/{id}/prestaciones |
| Tarifarios | 6482 - Actualizacion masiva de precios por archivo | P2 | sch_facturador.t_importacion_tarifario_job, sch_facturador.t_staging_prestaciones_tarifarios | POST /api/v1/tarifarios/{id}/importaciones, GET /api/v1/tarifarios/importaciones/{jobId} |
| Prefacturas | 6263 - Grilla pre facturas | P1 | sch_facturador.t_prefacturas, sch_facturador.tm_prefacturas_estados | GET /api/v1/prefacturas |
| Prefacturas | 6262 - Filtro pre facturas | P1 | sch_facturador.t_prefacturas, sch_convenios.t_convenios, sch_convenios.t_prestadores | GET /api/v1/prefacturas?estado=&convenio=&prestador=&periodo= |
| Prefacturas | 6265 - Ver pre factura | P1 | sch_facturador.t_prefacturas, sch_facturador.t_prefacturas_conceptos | GET /api/v1/prefacturas/{id} |
| Prefacturas | 6256 - Proceso de prefactura de un episodio | P1 | sch_facturador.t_episodios_procesados, sch_facturador.t_prefacturas, sch_facturador.t_procesamientos | POST /api/v1/prefacturas/procesar |
| Prefacturas | 8424 - Disparar proceso de pre factura de un episodio | P1 | sch_facturador.t_procesamientos, sch_facturador.t_prefacturas | POST /api/v1/prefacturas/procesamientos |
| Prefacturas | 6445 - Editar prefactura | P1 | sch_facturador.t_prefacturas, sch_facturador.t_prefacturas_conceptos | PATCH /api/v1/prefacturas/{id} |
| Prefacturas | 6264 - Generar TXT PAMI | P2 | sch_facturador.t_prefacturas, sch_facturador.t_exportacion_pami_job_prestadores | POST /api/v1/prefacturas/{id}/exportaciones/pami |
| Facturas | 6453 - Grilla listado de facturas | P1 | sch_facturador.t_facturas, sch_facturador.tm_estados_facturas | GET /api/v1/facturas |
| Facturas | 6452 - Filtro listado de facturas | P1 | sch_facturador.t_facturas, sch_facturador.t_facturas_prefacturas | GET /api/v1/facturas?estado=&prefactura=&periodo= |
| Facturas | 6447 - Facturar prefacturas en ODI | P1 | sch_facturador.t_facturas, sch_facturador.t_facturas_prefacturas, sch_facturador.t_prefacturas | POST /api/v1/facturas |
| Facturas | 11251 - Ver detalle de factura | P1 | sch_facturador.t_facturas, sch_facturador.t_detalle_factura, sch_facturador.t_facturas_estado_factura | GET /api/v1/facturas/{id} |
| Facturas | 7757 - Editar factura | P1 | sch_facturador.t_facturas, sch_facturador.t_detalle_factura | PATCH /api/v1/facturas/{id} |
| Facturas | 6455 - Anular factura | P1 | sch_facturador.t_facturas, sch_facturador.t_facturas_estado_factura | POST /api/v1/facturas/{id}/anulacion |
| Facturas | 6456 - Marcar factura como enviada | P2 | sch_facturador.t_facturas_estado_factura, sch_facturador.tm_estados_facturas | POST /api/v1/facturas/{id}/estados |

## Endpoint transversal de reglas y auditoria

- POST /api/v1/reglas/evaluar
  - Tablas vinculadas: sch_motor_reglas.*, sch_convenios.t_normas_operativas, sch_convenios.t_normas_convenios_planes.
- GET /api/v1/auditoria/eventos
  - Tablas vinculadas: sch_auditoria.*

## Criterios de implementacion sugeridos

1. Construir primero endpoints P1 de lectura y detalle para estabilizar pantallas.
2. Luego habilitar endpoints P1 de mutacion (alta/edicion/procesos).
3. Dejar P2 en segundo release, excepto cuando bloqueen flujo operativo.
4. Toda mutacion debe escribir evento de auditoria y actualizar estado de forma transaccional.
