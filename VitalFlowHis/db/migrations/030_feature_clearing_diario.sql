CREATE TABLE IF NOT EXISTS sch_admision.clearing_log (
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

CREATE INDEX IF NOT EXISTS idx_clearing_log_ejecutado
    ON sch_admision.clearing_log (ejecutado_en desc);

CREATE TABLE IF NOT EXISTS sch_admision.clearing_detalle (
    id uuid primary key,
    clearing_id uuid not null references sch_admision.clearing_log(id),
    turno_id text not null,
    estado_anterior text not null,
    estado_nuevo text not null,
    created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS idx_clearing_detalle_clearing
    ON sch_admision.clearing_detalle (clearing_id);
