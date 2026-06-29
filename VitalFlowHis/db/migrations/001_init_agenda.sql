-- VitalFlow HIS - Agenda schema v1
-- PostgreSQL

create schema if not exists sch_agenda;

create table if not exists sch_agenda.agenda (
    id uuid primary key,
    codigo varchar(40) not null unique,
    nombre varchar(140) not null,
    estado varchar(20) not null,
    fecha_desde date not null,
    fecha_hasta date,
    location_id uuid,
    practitioner_role_id uuid,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null,
    updated_by varchar(80) not null
);

create table if not exists sch_agenda.bloque_programacion (
    id uuid primary key,
    agenda_id uuid not null references sch_agenda.agenda(id),
    fecha date not null,
    hora_inicio time not null,
    hora_fin time not null,
    intervalo_minutos int not null,
    estado varchar(20) not null,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null,
    updated_by varchar(80) not null
);

create table if not exists sch_agenda.cupo (
    id uuid primary key,
    bloque_id uuid not null references sch_agenda.bloque_programacion(id),
    hora_inicio timestamptz not null,
    hora_fin timestamptz not null,
    estado varchar(30) not null,
    overbooking_permitido boolean not null default false,
    capacidad int not null default 1,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null,
    updated_by varchar(80) not null
);

create table if not exists sch_agenda.bloqueo_agenda (
    id uuid primary key,
    agenda_id uuid not null references sch_agenda.agenda(id),
    inicio timestamptz not null,
    fin timestamptz not null,
    motivo_codigo varchar(40),
    tipo varchar(30) not null,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null,
    updated_by varchar(80) not null
);

create table if not exists sch_agenda.calendario_excepcion (
    id uuid primary key,
    fecha date not null,
    es_feriado boolean not null,
    descripcion varchar(140),
    ambito varchar(20) not null,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null,
    updated_by varchar(80) not null
);

create index if not exists idx_bloque_agenda_fecha on sch_agenda.bloque_programacion(agenda_id, fecha);
create index if not exists idx_cupo_bloque_hora on sch_agenda.cupo(bloque_id, hora_inicio);
create index if not exists idx_bloqueo_agenda_inicio_fin on sch_agenda.bloqueo_agenda(agenda_id, inicio, fin);
