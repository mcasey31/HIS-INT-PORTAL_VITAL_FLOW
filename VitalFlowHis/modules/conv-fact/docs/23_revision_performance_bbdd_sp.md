# Revision Performance BBDD y SP (Prefactura/Factura)

## Contexto

- Repo analizado: back_facturacion
- Alcance revisado: SP criticos de prefactura, tarifarios y arranque de proceso factura.
- Aclaracion funcional: este repo aun no incluye la nueva logica de reglas de facturacion solicitada (mas alla de homologacion existente).

## Hallazgos tecnicos (priorizados)

## 1. Riesgo alto - Procesamiento fila por fila en revalorizacion de prefactura

SP observado:
- sch_facturador.sp_prfr_actualizar_valores_prefactura

Patron detectado:
- 3 loops FOR independientes (prestaciones, medicamentos, descartables) con SELECT + UPDATE por fila.
- Este patron escala mal cuando crece el lote de prefactura.

Impacto:
- Tiempo de CPU elevado.
- Mayor tiempo de locks por fila.
- Riesgo de degradacion exponencial percibida por financiador/centro con lotes grandes.

## 2. Riesgo alto - Validacion de conceptos facturables con condiciones complejas por fila

SP observado:
- sch_facturador.sp_iniciar_proceso_factura

Patron detectado:
- FOR sobre prestaciones con NOT EXISTS y multiples OR en filtros de conceptos/vigencias.
- Este esquema suele romper uso eficiente de indices y aumenta costo por cardinalidad.

Impacto:
- Planes de ejecucion inestables.
- Posible full scan sobre tablas de conceptos en picos.

## 3. Riesgo medio/alto - Falta de estrategia explicita de concurrencia en inicio de proceso factura

SP observado:
- sch_facturador.sp_iniciar_proceso_factura

Patron detectado:
- Actualizacion de prefacturas a estado procesando por array de IDs sin lock previo explicito por fila de trabajo.
- No se observan protecciones tipo FOR UPDATE SKIP LOCKED para paralelismo seguro por lotes.

Impacto:
- Riesgo de doble toma de prefacturas en ejecuciones concurrentes.
- Reintentos/correciones manuales en escenarios de alta simultaneidad.

## 4. Riesgo medio - SP de procesamiento de tarifarios con staging y loop iterativo

SP observado:
- sch_facturador.sp_procesar_tarifario_prestaciones_catalogo

Patron detectado:
- Multiples UPDATEs sobre staging + loop por registro y por ambito.
- Muchas transiciones de estado en la misma tabla durante el proceso.

Impacto:
- Alto I/O en staging.
- Mala performance con lotes de carga grandes.

## 5. Riesgo medio - Cobertura de indices incompleta para rutas de prefactura

Observado:
- Existen indices para lookup tarifario/componentes.
- No queda evidenciado en este barrido un set completo de indices para todas las FK/filtros criticos de prefactura masiva (prefactura -> episodios -> prestaciones homologadas -> conceptos).

Impacto:
- Degradacion por joins sobre tablas grandes.
- Sensibilidad al crecimiento historico.

## Brecha funcional confirmada (tu cambio requerido)

La nueva logica de reglas de facturacion (ademas de homologacion) debe incorporarse al circuito, no esta resuelta en estos SP actuales.

Reglas requeridas a integrar:
- centro
- especialidad
- complejidad
- financiador
- plan
- edad paciente
- ambito
- criterio directa/clasificacion

## Recomendacion de rediseno (v2)

## A) Resolver reglas por contexto primero (set-based)

- Calcular resolucion de regla por combinacion unica de contexto en el lote, no por fila individual.
- Persistir resultado en tabla temporal/materializada de lote para reutilizacion durante todo el proceso.

## B) Reescribir SP de revalorizacion a UPDATE set-based

- Reemplazar loops por UPDATE ... FROM con joins a tarifa vigente + regla resuelta.
- Un solo paso por tipo de prestacion (normal/medicamento/descartable) sin cursor por fila.

## C) Concurrencia robusta

- Seleccion de prefacturas candidatas con FOR UPDATE SKIP LOCKED.
- Marcado atomico de estado/lote en la misma transaccion corta.

## D) Indices obligatorios por ruta critica

- t_episodios_homologados(id_prefactura)
- t_prestaciones_episodios_homologadas(id_episodio_homologado)
- t_prestaciones_episodios_homologadas(id_convenio_plan, id_prestacion_catalogo, fecha_y_hora)
- t_prestaciones_conceptos_facturables(id_convenio_plan, id_tipo_iva, id_ambito, id_prestacion_catalogo, id_clasificacion_valor_entidad)
- Compuestos de vigencia en tablas tarifarias con orden por fecha

## E) Operacion para escala

- Particionar tablas transaccionales grandes por periodo (mensual/trimestral).
- Procesamiento por chunks con commit controlado y telemetria por lote.
- Alertas de timeout y lock wait.

## Proximo paso recomendado

- Crear SP v2 de inicio de proceso factura que consuma la nueva tabla de reglas de facturacion y deje trazabilidad de regla aplicada por prestacion.
- Ejecutar benchmark comparativo v1 vs v2 con lote chico/medio/grande.
