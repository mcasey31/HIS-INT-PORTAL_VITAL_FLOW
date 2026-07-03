CREATE SCHEMA IF NOT EXISTS sch_ubicacion;

CREATE TABLE IF NOT EXISTS sch_ubicacion.provincia (
    id          varchar(5)    primary key,
    nombre      varchar(120)  not null,
    pais        varchar(60)   not null default 'Argentina',
    activo      boolean       not null default true,
    created_at  timestamptz   not null default now(),
    updated_at  timestamptz   not null default now()
);

CREATE INDEX IF NOT EXISTS idx_provincia_nombre ON sch_ubicacion.provincia (upper(nombre));

CREATE TABLE IF NOT EXISTS sch_ubicacion.localidad (
    id           varchar(10)   primary key,
    provincia_id varchar(5)    not null references sch_ubicacion.provincia(id),
    nombre       varchar(200)  not null,
    activo       boolean       not null default true,
    created_at   timestamptz   not null default now(),
    updated_at   timestamptz   not null default now()
);

CREATE INDEX IF NOT EXISTS idx_localidad_provincia ON sch_ubicacion.localidad (provincia_id, upper(nombre));
