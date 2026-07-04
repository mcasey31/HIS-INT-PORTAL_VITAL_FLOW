-- 043 - Admision: eliminar hardcode de estados en servicios
-- Objetivo: resolver estados y mapeos por datos (acciones parametrizadas), sin fallback.

create schema if not exists sch_admision;

alter table if exists sch_admision.estado_turno_catalogo
    add column if not exists admite_en_admision boolean not null default false;

insert into sch_admision.estado_turno_catalogo (codigo, nombre, consumido, activo, admite_en_admision)
values
    ('AUSENTE', 'Ausente', false, true, false)
on conflict (codigo) do update
set nombre = excluded.nombre,
    consumido = excluded.consumido,
    activo = excluded.activo,
    admite_en_admision = excluded.admite_en_admision,
    updated_at = now();

update sch_admision.estado_turno_catalogo
set admite_en_admision = true,
    updated_at = now()
where codigo in ('PROGRAMADO', 'AGENDADO');

create table if not exists sch_admision.accion_estado_admision (
    accion_codigo   varchar(80) primary key,
    estado_codigo   varchar(60) not null references sch_admision.estado_admision_catalogo (codigo),
    activo          boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table if not exists sch_admision.accion_estado_turno (
    accion_codigo   varchar(80) primary key,
    estado_codigo   varchar(60) not null references sch_admision.estado_turno_catalogo (codigo),
    activo          boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table if not exists sch_admision.estado_admision_turno_mapeo (
    estado_admision_codigo   varchar(60) primary key references sch_admision.estado_admision_catalogo (codigo),
    estado_turno_codigo      varchar(60) not null references sch_admision.estado_turno_catalogo (codigo),
    activo                   boolean not null default true,
    created_at               timestamptz not null default now(),
    updated_at               timestamptz not null default now()
);

insert into sch_admision.accion_estado_admision (accion_codigo, estado_codigo, activo)
values
    ('DEFAULT_ESTADO_ADMISION', 'PROGRAMADO', true),
    ('ESTADO_EN_ATENCION', 'EN_ATENCION', true),
    ('ESTADO_ATENDIDO', 'ATENDIDO', true),
    ('ESTADO_NO_ATENDIDO', 'NO_ATENDIDO', true),
    ('ESTADO_NO_ADMITIDO', 'NO_ADMITIDO', true),
    ('ESTADO_AUSENTE', 'AUSENTE', true),
    ('CONFIRMAR_ARRIBO_REQUIERE_PAGO', 'PENDIENTE_DE_PAGO', true),
    ('CONFIRMAR_ARRIBO_OK', 'EN_SALA_DE_ESPERA', true),
    ('AUTOCIERRE_ENCUENTRO_VENCIDO', 'NO_ATENDIDO', true)
on conflict (accion_codigo) do update
set estado_codigo = excluded.estado_codigo,
    activo = excluded.activo,
    updated_at = now();

insert into sch_admision.accion_estado_turno (accion_codigo, estado_codigo, activo)
values
    ('DEFAULT_ESTADO_TURNO', 'PROGRAMADO', true),
    ('CONFIRMAR_ARRIBO_TURNO_CIEN_CONVENIDA', 'CONSUMIDO', true),
    ('CONFIRMAR_ARRIBO_TURNO_NO_CIEN_CONVENIDA', 'PROGRAMADO', true),
    ('CIERRE_ENCUENTRO_ESTADO_TURNO_DEFAULT', 'CONSUMIDO', true)
on conflict (accion_codigo) do update
set estado_codigo = excluded.estado_codigo,
    activo = excluded.activo,
    updated_at = now();

insert into sch_admision.estado_admision_turno_mapeo (estado_admision_codigo, estado_turno_codigo, activo)
values
    ('PROGRAMADO', 'AGENDADO', true),
    ('PENDIENTE_DE_PAGO', 'AGENDADO', true),
    ('EN_SALA_DE_ESPERA', 'AGENDADO', true),
    ('EN_ATENCION', 'AGENDADO', true),
    ('EN_OBSERVACION', 'AGENDADO', true),
    ('ATENDIDO', 'CONSUMIDO', true),
    ('AUSENTE', 'AUSENTE', true),
    ('NO_ADMITIDO', 'ANULADO', true),
    ('NO_ATENDIDO', 'ANULADO', true)
on conflict (estado_admision_codigo) do update
set estado_turno_codigo = excluded.estado_turno_codigo,
    activo = excluded.activo,
    updated_at = now();

comment on table sch_admision.accion_estado_admision
    is 'Resuelve estado de admision por accion funcional para evitar hardcode en servicios.';

comment on table sch_admision.accion_estado_turno
    is 'Resuelve estado de turno por accion funcional para evitar hardcode en servicios.';

comment on table sch_admision.estado_admision_turno_mapeo
    is 'Mapeo de estado admision -> estado turno definido por datos.';