-- 028 - Enriquecimiento del outbox con práctica asistencial origen
-- Propósito: que CONV_FACT reciba la práctica médica del turno sin leer la BD del HIS.
-- Se agregan columnas opcionales: la idempotencia y la lógica existente NO cambian.
-- Compatible backward: columnas nullable → callers anteriores siguen funcionando.

alter table sch_admision.eventos_facturacion_outbox
    add column if not exists practica_origen_nombre  text,
    add column if not exists practica_origen_codigo  text,
    add column if not exists profesional_id           uuid,
    add column if not exists profesional_nombre       text,
    add column if not exists tipo_origen              varchar(30) not null default 'TURNO',
    add column if not exists event_type               varchar(50) not null default 'ADMISION_EN_SALA_ESPERA',
    add column if not exists retry_count              int         not null default 0,
    add column if not exists next_retry_at            timestamptz;

-- Índice para que el worker pueda procesar reintentos por ventana de tiempo
create index if not exists idx_eventos_fact_outbox_retry
    on sch_admision.eventos_facturacion_outbox (next_retry_at)
    where estado = 'ERROR';

comment on column sch_admision.eventos_facturacion_outbox.practica_origen_nombre
    is 'Nombre de la práctica médica que motivó el turno (ej: Consulta Médica). Obligatorio clínicamente.';
comment on column sch_admision.eventos_facturacion_outbox.practica_origen_codigo
    is 'Código de la práctica en la nomenclatura del HIS (ej: id del bloque/práctica).';
comment on column sch_admision.eventos_facturacion_outbox.tipo_origen
    is 'TURNO | DEMANDA_ESPONTANEA. Indica la modalidad de ingreso.';
comment on column sch_admision.eventos_facturacion_outbox.event_type
    is 'Tipo de evento de integración: ADMISION_EN_SALA_ESPERA (inicial).';
comment on column sch_admision.eventos_facturacion_outbox.retry_count
    is 'Cantidad de intentos de procesamiento fallidos acumulados.';
comment on column sch_admision.eventos_facturacion_outbox.next_retry_at
    is 'Cuándo el worker puede volver a intentar procesar un evento ERROR.';
