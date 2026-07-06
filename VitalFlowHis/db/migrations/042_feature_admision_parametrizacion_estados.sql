-- 042 - Admision: parametrizacion de estados y transiciones en BD
-- Objetivo: iniciar eliminacion de hardcode de estados en servicios,
-- manteniendo compatibilidad con estructura actual.

create schema if not exists sch_admision;

create table if not exists sch_admision.estado_admision_catalogo (
    codigo      varchar(60) primary key,
    nombre      varchar(120) not null,
    es_final    boolean not null default false,
    orden       int not null default 100,
    activo      boolean not null default true,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now(),
    constraint chk_estado_admision_orden_gt_0 check (orden > 0)
);

create table if not exists sch_admision.estado_admision_transicion (
    estado_origen_codigo   varchar(60) not null,
    estado_destino_codigo  varchar(60) not null,
    activo                 boolean not null default true,
    created_at             timestamptz not null default now(),
    updated_at             timestamptz not null default now(),
    primary key (estado_origen_codigo, estado_destino_codigo),
    constraint fk_estado_admision_transicion_origen
        foreign key (estado_origen_codigo)
        references sch_admision.estado_admision_catalogo (codigo),
    constraint fk_estado_admision_transicion_destino
        foreign key (estado_destino_codigo)
        references sch_admision.estado_admision_catalogo (codigo),
    constraint chk_estado_admision_transicion_distinta
        check (estado_origen_codigo <> estado_destino_codigo)
);

create table if not exists sch_admision.estado_turno_catalogo (
    codigo      varchar(60) primary key,
    nombre      varchar(120) not null,
    consumido   boolean not null default false,
    activo      boolean not null default true,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists idx_estado_admision_catalogo_activo_orden
    on sch_admision.estado_admision_catalogo (activo, orden);

create index if not exists idx_estado_admision_transicion_origen
    on sch_admision.estado_admision_transicion (estado_origen_codigo)
    where activo = true;

create index if not exists idx_estado_admision_transicion_destino
    on sch_admision.estado_admision_transicion (estado_destino_codigo)
    where activo = true;

create index if not exists idx_estado_turno_catalogo_activo
    on sch_admision.estado_turno_catalogo (activo);

insert into sch_admision.estado_admision_catalogo (codigo, nombre, es_final, orden, activo)
values
    ('PROGRAMADO', 'Programado', false, 10, true),
    ('PENDIENTE_DE_PAGO', 'Pendiente de pago', false, 20, true),
    ('EN_SALA_DE_ESPERA', 'En sala de espera', false, 30, true),
    ('EN_ATENCION', 'En atencion', false, 40, true),
    ('EN_OBSERVACION', 'En observacion', false, 50, true),
    ('ATENDIDO', 'Atendido', true, 60, true),
    ('AUSENTE', 'Ausente', true, 70, true),
    ('NO_ADMITIDO', 'No admitido', true, 80, true),
    ('NO_ATENDIDO', 'No atendido', true, 90, true)
on conflict (codigo) do update
set nombre = excluded.nombre,
    es_final = excluded.es_final,
    orden = excluded.orden,
    activo = excluded.activo,
    updated_at = now();

insert into sch_admision.estado_admision_transicion (estado_origen_codigo, estado_destino_codigo, activo)
values
    ('PROGRAMADO', 'EN_SALA_DE_ESPERA', true),
    ('PROGRAMADO', 'AUSENTE', true),
    ('PROGRAMADO', 'NO_ADMITIDO', true),
    ('PROGRAMADO', 'PENDIENTE_DE_PAGO', true),
    ('PENDIENTE_DE_PAGO', 'EN_SALA_DE_ESPERA', true),
    ('PENDIENTE_DE_PAGO', 'NO_ADMITIDO', true),
    ('EN_SALA_DE_ESPERA', 'EN_ATENCION', true),
    ('EN_SALA_DE_ESPERA', 'ATENDIDO', true),
    ('EN_SALA_DE_ESPERA', 'NO_ATENDIDO', true),
    ('EN_SALA_DE_ESPERA', 'PENDIENTE_DE_PAGO', true),
    ('EN_ATENCION', 'ATENDIDO', true),
    ('EN_ATENCION', 'EN_OBSERVACION', true),
    ('EN_ATENCION', 'NO_ATENDIDO', true),
    ('EN_OBSERVACION', 'EN_ATENCION', true),
    ('EN_OBSERVACION', 'ATENDIDO', true),
    ('EN_OBSERVACION', 'NO_ATENDIDO', true)
on conflict (estado_origen_codigo, estado_destino_codigo) do update
set activo = excluded.activo,
    updated_at = now();

insert into sch_admision.estado_turno_catalogo (codigo, nombre, consumido, activo)
values
    ('PROGRAMADO', 'Programado', false, true),
    ('AGENDADO', 'Agendado', false, true),
    ('CONSUMIDO', 'Consumido', true, true),
    ('ANULADO', 'Anulado', false, true)
on conflict (codigo) do update
set nombre = excluded.nombre,
    consumido = excluded.consumido,
    activo = excluded.activo,
    updated_at = now();

comment on table sch_admision.estado_admision_catalogo
    is 'Catalogo de estados de admision. Fuente de verdad para UI y reglas de negocio.';

comment on table sch_admision.estado_admision_transicion
    is 'Matriz de transiciones permitidas entre estados de admision.';

comment on table sch_admision.estado_turno_catalogo
    is 'Catalogo de estados de turno vinculados al flujo de admision.';