create schema if not exists sch_persona;

create table if not exists sch_persona.financiador (
    id uuid primary key,
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_persona.financiador_plan (
    id uuid primary key,
    financiador_id uuid not null references sch_persona.financiador(id),
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_agenda.practica (
    id uuid primary key,
    servicio_id uuid not null references sch_agenda.servicio(id),
    nombre varchar(160) not null,
    duracion_minutos_sugerida int,
    codigo_clinico varchar(60),
    activa boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_agenda.dispositivo (
    id uuid primary key,
    centro_id uuid not null references sch_agenda.centro(id),
    servicio_id uuid not null references sch_agenda.servicio(id),
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    tipo varchar(40) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_agenda.grupo_profesional (
    id uuid primary key,
    centro_id uuid not null references sch_agenda.centro(id),
    servicio_id uuid not null references sch_agenda.servicio(id),
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    descripcion varchar(300),
    activo boolean not null default true,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null default 'system',
    updated_by varchar(80) not null default 'system'
);

create table if not exists sch_agenda.grupo_profesional_miembro (
    id uuid primary key,
    grupo_profesional_id uuid not null references sch_agenda.grupo_profesional(id) on delete cascade,
    efector_id uuid not null references sch_agenda.efector(id),
    rol varchar(40),
    orden int,
    activo boolean not null default true,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null default 'system',
    updated_by varchar(80) not null default 'system'
);

alter table if exists sch_agenda.efector
  add column if not exists matricula_provincial varchar(64),
  add column if not exists matricula_nacional varchar(64);

create unique index if not exists uq_financiador_codigo on sch_persona.financiador (upper(codigo));
create unique index if not exists uq_financiador_plan_codigo on sch_persona.financiador_plan (financiador_id, upper(codigo));
create unique index if not exists uq_practica_servicio_nombre on sch_agenda.practica (servicio_id, upper(nombre));
create unique index if not exists uq_dispositivo_codigo on sch_agenda.dispositivo (upper(codigo));
create unique index if not exists uq_grupo_profesional_codigo on sch_agenda.grupo_profesional (upper(codigo));
create unique index if not exists uq_grupo_profesional_miembro on sch_agenda.grupo_profesional_miembro (grupo_profesional_id, efector_id);
