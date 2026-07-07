-- 042 - Enriquecimiento del outbox con practica asistencial origen
-- Proposito: que CONV_FACT reciba la practica medica del turno sin leer la BD del HIS.
-- Compatible backward: columnas nullable -> callers anteriores siguen funcionando.

alter table sch_admision.eventos_facturacion_outbox
    add column if not exists practica_origen_nombre  text,
    add column if not exists practica_origen_codigo  text,
    add column if not exists profesional_id           uuid,
    add column if not exists profesional_nombre       text,
    add column if not exists tipo_origen              varchar(30) not null default 'TURNO',
    add column if not exists event_type               varchar(50) not null default 'ADMISION_EN_SALA_ESPERA',
    add column if not exists retry_count              int         not null default 0,
    add column if not exists next_retry_at            timestamptz;

-- Indice para que el worker pueda procesar reintentos por ventana de tiempo
create index if not exists idx_eventos_fact_outbox_retry
    on sch_admision.eventos_facturacion_outbox (next_retry_at)
    where estado = 'ERROR';

comment on column sch_admision.eventos_facturacion_outbox.practica_origen_nombre
    is 'Nombre de la practica medica que motivo el turno (ej: Consulta Medica).';
comment on column sch_admision.eventos_facturacion_outbox.practica_origen_codigo
    is 'Codigo de la practica en la nomenclatura del HIS (ej: id del bloque/practica).';
comment on column sch_admision.eventos_facturacion_outbox.tipo_origen
    is 'TURNO | DEMANDA_ESPONTANEA. Indica la modalidad de ingreso.';
comment on column sch_admision.eventos_facturacion_outbox.event_type
    is 'Tipo de evento de integracion: ADMISION_EN_SALA_ESPERA (inicial).';
comment on column sch_admision.eventos_facturacion_outbox.retry_count
    is 'Cantidad de intentos de procesamiento fallidos acumulados.';
comment on column sch_admision.eventos_facturacion_outbox.next_retry_at
    is 'Cuando el worker puede volver a intentar procesar un evento ERROR.';
