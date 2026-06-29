# Relevamiento BD por Dominio para WebApp ODI Facturacion

## Objetivo

Aterrizar la base de datos real en una vista por dominio funcional para disenar backend/frontend webapp con joins recomendados, orden de implementacion y riesgos de acoplamiento.

Base analizada: odi_db_facturacion
Esquemas: sch_convenios, sch_facturador, sch_motor_reglas, sch_auditoria
Fecha: 2026-06-06

## Resumen ejecutivo

- Dominio contractual y maestro concentrado en sch_convenios.
- Dominio transaccional de ciclo operativo concentrado en sch_facturador.
- Dependencia fuerte de sch_facturador hacia sch_convenios (34 columnas FK cross-schema).
- El diseno webapp debe separar contextos de dominio en servicios para bajar acoplamiento.

## Dominio 1 - Convenios

### Tablas nucleo

- sch_convenios.t_convenios
- sch_convenios.t_convenios_planes
- sch_convenios.t_convenios_prestadores
- sch_convenios.t_catalogos_convenios
- sch_convenios.t_prestaciones_convenios_planes
- sch_convenios.t_normas_convenios_planes

### Relaciones clave (FK reales)

- t_convenios_planes -> t_convenios
- t_convenios_planes -> t_planes
- t_convenios_prestadores -> t_convenios
- t_convenios_prestadores -> t_prestadores
- t_catalogos_convenios -> t_convenios
- t_catalogos_convenios -> t_catalogos
- t_prestaciones_convenios_planes -> t_convenios_planes
- t_normas_convenios_planes -> t_convenios_planes

### Join recomendado de lectura web

Caso: ver cabecera de convenio + planes + prestadores asociados

- t_convenios c
- join t_convenios_planes cp on cp.id_convenio = c.id
- left join t_convenios_prestadores cpr on cpr.id_convenio = c.id
- left join t_prestadores p on p.id = cpr.id_prestadores

## Dominio 2 - Prestador

### Tablas nucleo

- sch_convenios.t_prestadores
- sch_convenios.t_prestadores_contactos
- sch_convenios.t_sociedades_prestadores
- sch_convenios.t_prestadores_modulos
- sch_convenios.t_convenios_prestadores

### Relaciones clave (FK reales)

- t_prestadores_contactos -> t_prestadores
- t_sociedades_prestadores -> t_prestadores
- t_prestadores_modulos -> t_prestadores
- t_convenios_prestadores -> t_prestadores
- t_episodios_generales (sch_facturador) -> t_prestadores
- t_prefacturas (sch_facturador) -> t_prestadores

### Join recomendado de lectura web

Caso: ficha de prestador con convenios activos

- t_prestadores p
- left join t_prestadores_contactos pc on pc.id_prestadores = p.id
- left join t_sociedades_prestadores sp on sp.id_prestador = p.id
- left join t_convenios_prestadores cp on cp.id_prestadores = p.id
- left join t_convenios c on c.id = cp.id_convenio

## Dominio 3 - Tarifarios

### Tablas nucleo

- sch_convenios.t_tarifarios
- sch_convenios.t_tarifarios_componentes
- sch_convenios.t_tarifarios_convenios_planes
- sch_convenios.t_tarifarios_medicamentos
- sch_convenios.t_tarifarios_prestaciones_catalogos

### Relaciones clave (FK reales)

- t_tarifarios -> t_catalogos
- t_tarifarios_convenios_planes -> t_tarifarios
- t_tarifarios_convenios_planes -> t_convenios_planes
- t_tarifarios_prestaciones_catalogos -> t_tarifarios
- t_tarifarios_prestaciones_catalogos -> t_prestaciones_catalogos
- t_tarifarios_medicamentos -> t_medicamentos_comerciales

### Join recomendado de lectura web

Caso: tarifario vigente por convenio-plan

- t_convenios_planes cp
- join t_tarifarios_convenios_planes tcp on tcp.id_convenio_plan = cp.id
- join t_tarifarios t on t.id = tcp.id_tarifario
- left join t_tarifarios_prestaciones_catalogos tpc on tpc.id_tarifario = t.id
- left join t_prestaciones_catalogos pc on pc.id = tpc.id_prestacion_catalogo

## Dominio 4 - Prefacturas

### Tablas nucleo

- sch_facturador.t_prefacturas
- sch_facturador.t_prefacturas_conceptos
- sch_facturador.tm_prefacturas_estados
- sch_facturador.t_facturas_prefacturas

### Relaciones clave (FK reales)

- t_prefacturas -> t_convenios (sch_convenios)
- t_prefacturas -> t_financiadores (sch_convenios)
- t_prefacturas -> t_prestadores (sch_convenios)
- t_prefacturas -> tm_prefacturas_estados
- t_prefacturas_conceptos -> t_prefacturas
- t_prefacturas_conceptos -> t_conceptos_facturables
- t_facturas_prefacturas -> t_prefacturas

### Join recomendado de lectura web

Caso: listado de prefacturas con estado y datos de convenio/prestador

- t_prefacturas pf
- join tm_prefacturas_estados pe on pe.id = pf.id_prefacturas_estado
- left join sch_convenios.t_convenios c on c.id = pf.id_convenio
- left join sch_convenios.t_prestadores p on p.id = pf.id_prestador
- left join t_prefacturas_conceptos pfc on pfc.id_prefactura = pf.id

## Dominio 5 - Facturas

### Tablas nucleo

- sch_facturador.t_facturas
- sch_facturador.t_detalle_factura
- sch_facturador.t_facturas_estado_factura
- sch_facturador.tm_estados_facturas
- sch_facturador.t_facturas_prestadores

### Relaciones clave (FK reales)

- t_detalle_factura -> t_facturas
- t_detalle_factura -> t_conceptos_facturables
- t_facturas_estado_factura -> t_facturas
- t_facturas_estado_factura -> tm_estados_facturas
- t_facturas_prestadores -> t_facturas
- t_facturas_prestadores -> sch_convenios.t_prestadores
- t_facturas_prefacturas -> t_facturas

### Join recomendado de lectura web

Caso: detalle de factura con estado historico y vinculo a prefacturas

- t_facturas f
- left join t_facturas_estado_factura fe on fe.id_factura = f.id
- left join tm_estados_facturas ef on ef.id = fe.id_estado_factura
- left join t_detalle_factura df on df.id_factura = f.id
- left join t_facturas_prefacturas fp on fp.id_factura = f.id

## Dominio transversal - Normas Operativas y Motor de Reglas

### Tablas relevantes

- sch_convenios.t_normas_operativas
- sch_convenios.t_normas_convenios_planes
- sch_motor_reglas (tablas de reglas y validacion)

### Recomendacion de arquitectura

- Exponer endpoint de evaluacion de reglas como servicio de dominio.
- Evitar replicar logica en frontend y en procesos batch por separado.
- Registrar resultados de evaluacion en sch_auditoria para trazabilidad.

## Dominio transversal - Auditoria

### Tabla/esquema

- sch_auditoria (5 tablas)

### Recomendacion

- Toda accion sensible de ABM y ciclo prefactura/factura debe registrar actor, fecha, entidad, accion y payload resumido.

## Orden de implementacion webapp guiado por BD

1. Catalogos maestros y convenios (sch_convenios base).
2. Prestadores y asociacion a convenios.
3. Tarifarios por convenio-plan.
4. Prefacturas con estados y conceptos.
5. Facturas, detalle y trazabilidad de estados.
6. Normas operativas y motor de reglas transversal.

## Riesgos tecnicos y mitigacion

- Riesgo: alto acoplamiento sch_facturador -> sch_convenios.
  Mitigacion: contratos de servicio estables y capa anti-corrupcion.
- Riesgo: joins muy anchos para listados operativos.
  Mitigacion: vistas materializadas o read models por pantalla critica.
- Riesgo: estados inconsistentes entre prefacturas y facturas.
  Mitigacion: maquina de estados en backend y validaciones transaccionales.

## Referencias

- docs/11_base_datos/relevamiento_bd_facturador.md
- docs/11_base_datos/exports/foreign_keys.csv
- docs/11_base_datos/exports/primary_keys.csv
- docs/11_base_datos/exports/tables.csv
