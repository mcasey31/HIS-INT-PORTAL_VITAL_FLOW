-- 041 - Modulos HIS opcionales + Outbox de eventos para CONV-FACT
-- Modulo CONV-FACT es opcional; si no esta activo, el outbox no recibe filas.

-- Modulos HIS (toggle por Estructura Interna)

create table if not exists sch_admision.modulos_his (
    id         uuid primary key default gen_random_uuid(),
    codigo     varchar(50)  not null unique,
    nombre     varchar(140) not null,
    activo     boolean      not null default false,
    created_at timestamptz  not null default now(),
    updated_at timestamptz  not null default now()
);

insert into sch_admision.modulos_his (codigo, nombre, activo)
values ('CONV_FACT', 'Convenios y Facturacion', false)
on conflict (codigo) do nothing;

-- Outbox confiable: HIS -> CONV-FACT
-- Un worker del modulo CONV-FACT lee PENDIENTE y crea el Episodio.
-- Si el modulo esta desactivado, simplemente nadie lee este outbox.

create table if not exists sch_admision.eventos_facturacion_outbox (
    id               uuid        primary key default gen_random_uuid(),
    turno_id         text        not null,
    encuentro_id     uuid,
    paciente_id      uuid        not null,
    paciente_nombre  text        not null,
    documento        text        not null,
    financiador      text,
    financiador_id   uuid,
    plan_id          uuid,
    servicio_nombre  text,
    centro_id        uuid,
    llegada_en       timestamptz not null,
    payload          jsonb       not null,
    estado           varchar(20) not null default 'PENDIENTE',
    error_detalle    text,
    created_at       timestamptz not null default now(),
    processed_at     timestamptz,
    constraint chk_estado_outbox check (estado in ('PENDIENTE', 'PROCESADO', 'ERROR'))
);

create index if not exists idx_eventos_facturacion_outbox_pendiente
    on sch_admision.eventos_facturacion_outbox (created_at)
    where estado = 'PENDIENTE';

create unique index if not exists uq_eventos_facturacion_outbox_turno
    on sch_admision.eventos_facturacion_outbox (turno_id)
    where estado = 'PENDIENTE';
