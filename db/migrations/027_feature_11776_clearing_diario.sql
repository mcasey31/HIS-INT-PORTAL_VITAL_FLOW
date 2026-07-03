-- HU 11776 - Clearing diario de eventos huerfanos de la lista de espera

create table if not exists sch_admision.clearing_log (
    id uuid primary key,
    ejecutado_en timestamptz not null,
    centro_id text,
    modo text not null default 'AUTOMATICO',
    programados_a_ausente int not null default 0,
    sala_espera_a_no_atendido int not null default 0,
    observacion_a_atendido int not null default 0,
    pendiente_pago_a_no_admitido int not null default 0,
    total_procesados int not null default 0,
    created_at timestamptz not null default now()
);

create index if not exists idx_clearing_log_ejecutado
    on sch_admision.clearing_log (ejecutado_en desc);

create table if not exists sch_admision.clearing_detalle (
    id uuid primary key,
    clearing_id uuid not null references sch_admision.clearing_log(id),
    turno_id text not null,
    estado_anterior text not null,
    estado_nuevo text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_clearing_detalle_clearing
    on sch_admision.clearing_detalle (clearing_id);
