# Relevamiento Base de Datos Facturador ODI

## Contexto

- Base: odi_db_facturacion
- Esquemas analizados: sch_auditoria, sch_convenios, sch_facturador, sch_motor_reglas
- Usuario de lectura: odi_usr_facturacion_read
- Fecha: 2026-06-06

## Resumen cuantitativo

- Tablas totales: 161
- Columnas totales: 1418
- PKs detectadas: 156
- FKs detectadas: 218
- Indices detectados: 200
- FKs entre esquemas (cross-schema): 42

### Tablas por esquema

- sch_auditoria: 5
- sch_convenios: 86
- sch_facturador: 61
- sch_motor_reglas: 9

### Acoplamiento entre esquemas (FK origen -> destino)

| Origen -> Destino | Cantidad de columnas FK |
|---|---|
| sch_facturador ->  sch_convenios | 34 |
| sch_convenios ->  sch_facturador | 6 |
| sch_motor_reglas ->  sch_facturador | 2 |

## Tablas mas referenciadas (target de FKs)

| Tabla objetivo | Cantidad de columnas FK entrantes |
|---|---|
| sch_convenios. t_prestadores | 13 |
| sch_convenios. t_financiadores | 12 |
| sch_facturador. t_prestaciones | 12 |
| sch_convenios. t_prestaciones_catalogos | 9 |
| sch_facturador. t_prestaciones_episodios | 9 |
| sch_convenios. t_convenios | 8 |
| sch_convenios. t_convenios_planes | 8 |
| sch_facturador. t_episodios_generales | 7 |
| sch_convenios. t_planes | 6 |
| sch_convenios. t_catalogos | 6 |
| sch_convenios. t_clasificacion_prestaciones_valores | 6 |
| sch_convenios. t_tarifarios | 4 |
| sch_convenios. t_contactos | 4 |
| sch_convenios. t_normas_operativas | 4 |
| sch_facturador. t_prefacturas | 4 |

## Tablas con mayor acoplamiento saliente (outbound FKs)

| Tabla origen | Cantidad de columnas FK salientes |
|---|---|
| sch_facturador. t_procesamientos | 17 |
| sch_facturador. t_prestaciones_episodios | 10 |
| sch_facturador. t_episodios_procesados | 8 |
| sch_facturador. t_episodios_generales | 8 |
| sch_convenios. t_componentes_prestaciones | 5 |
| sch_facturador. t_prefacturas | 5 |
| sch_facturador. t_prestaciones_episodios_homologadas | 5 |
| sch_facturador. t_modulos_prestaciones_procesamientos | 4 |
| sch_convenios. t_tarifarios_prestaciones_catalogos | 4 |
| sch_convenios. t_homologaciones | 4 |
| sch_facturador. t_episodios_homologados | 3 |
| sch_facturador. t_facturas | 3 |
| sch_convenios. t_modulos_reglas | 3 |
| sch_convenios. t_normas_documentos | 3 |
| sch_convenios. t_prestaciones_convenios_planes | 3 |

## Lectura funcional inicial por esquema

- sch_convenios: nucleo de entidades contractuales, tarifas asociadas, coberturas y configuraciones por convenio.
- sch_facturador: capa transaccional del ciclo prefactura/factura y estados operativos.
- sch_motor_reglas: reglas y criterios de validacion para procesamiento y control.
- sch_auditoria: trazabilidad de cambios y eventos de negocio/tecnicos.

## Riesgos de arquitectura detectables desde modelo relacional

- Acoplamiento alto entre tablas de convenios/facturacion: conviene separar servicios por dominio y exponer contratos estables.
- Riesgo de reglas duplicadas entre sch_motor_reglas y backend de negocio si no hay un motor unico de decision.
- Riesgo de degradacion en listados operativos si no se reutilizan indices en filtros de busqueda frecuentes.

## Archivos de soporte (export completo)

- docs/11_base_datos/exports/schemas_table_counts.csv
- docs/11_base_datos/exports/tables.csv
- docs/11_base_datos/exports/columns.csv
- docs/11_base_datos/exports/primary_keys.csv
- docs/11_base_datos/exports/foreign_keys.csv
- docs/11_base_datos/exports/indexes.csv
