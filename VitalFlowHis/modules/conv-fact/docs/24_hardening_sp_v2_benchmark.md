# Hardening SP v2 + Benchmark

## Objetivo
Definir y medir una primera version de hardening para prefactura/factura con enfoque set-based y concurrencia segura.

## Artefactos SQL creados
1. back_facturacion/database/db/sprint0014/20260606_SPR0014_PERF_prefactura_indexes.sql
2. back_facturacion/database/db/sprint0014/20260606_SPR0014_HU28575_sp_iniciar_proceso_factura_v2.sql
3. back_facturacion/database/db/sprint0014/20260606_SPR0014_HU29083_sp_prfr_actualizar_valores_prefactura_v2.sql

## Cambios clave
1. sp_iniciar_proceso_factura_v2:
   - Reemplaza validacion row-by-row de no facturable por conteo set-based.
   - Usa FOR UPDATE SKIP LOCKED para reclamar prefacturas pendientes y evitar colision entre workers.
   - Conserva firma funcional equivalente para facilitar rollout controlado.
2. sp_prfr_actualizar_valores_prefactura_v2:
   - Elimina loops por registro en prestaciones, medicamentos y descartables.
   - Usa CTE + ROW_NUMBER para elegir vigencia mas reciente por item en forma masiva.
   - Mantiene recalculo de totales a nivel episodio y prefactura.
3. Indices:
   - Agrega cobertura para rutas de join y filtros de estado/vigencia/lote.

## Plan de benchmark (v1 vs v2)
1. Dataset
   - Escenario A: 5k prefacturas.
   - Escenario B: 25k prefacturas.
   - Escenario C: 100k prefacturas.
   - Mix por financiador, centro, ambito, plan, con distribucion sesgada (top 5 financiadores concentran 70%).
2. Metricas
   - p50/p95/p99 tiempo total por llamada de SP.
   - throughput (prefacturas/minuto).
   - lock wait time.
   - deadlocks por hora.
   - buffer hits vs reads y temp spill.
3. Ejecucion
   - Capturar EXPLAIN (ANALYZE, BUFFERS) en querys internas criticas.
   - Correr 3 rondas por escenario y descartar warm-up inicial.
   - Correr con concurrencia 1, 4, 8 y 16 workers.
4. Criterios de aceptacion
   - Mejora >= 40% en p95 para valorizacion de prefactura.
   - Escalamiento casi lineal hasta 8 workers en iniciar proceso factura.
   - Sin deadlocks en 60 minutos de carga sostenida.

## Integracion de nuevas reglas de facturacion
1. Resolver reglas por contexto (centro/especialidad/complejidad/financiador/plan/edad/ambito) en etapa set-based previa al inicio de proceso.
2. Persistir resultado de regla aplicada por prestacion y lote para trazabilidad.
3. Inyectar esa resolucion en la evaluacion de concepto facturable para evitar OR explosivos y mejorar estabilidad de plan.

## Despliegue sugerido
1. Ejecutar primero indices.
2. Desplegar SP v2 con feature flag de backend para canary por financiador.
3. Monitorear p95 y lock waits 48h.
4. Si cumple, promover v2 a default y dejar v1 como fallback temporal.
