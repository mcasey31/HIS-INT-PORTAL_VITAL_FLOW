-- EPICA ABMs - Estructura Interna
-- Catalogos para ABM de financiadores/planes, practicas normalizadas y dispositivos.

create schema if not exists sch_persona;

create table if not exists sch_persona.financiador (
    id uuid primary key,
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_financiador_codigo
    on sch_persona.financiador (upper(codigo));

create unique index if not exists uq_financiador_nombre
    on sch_persona.financiador (upper(nombre));

create table if not exists sch_persona.financiador_plan (
    id uuid primary key,
    financiador_id uuid not null references sch_persona.financiador(id),
    codigo varchar(40) not null,
    nombre varchar(140) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_financiador_plan_codigo
    on sch_persona.financiador_plan (financiador_id, upper(codigo));

create unique index if not exists uq_financiador_plan_nombre
    on sch_persona.financiador_plan (financiador_id, upper(nombre));

create table if not exists sch_agenda.practica (
    id uuid primary key,
    servicio_id uuid not null references sch_agenda.servicio(id),
    nombre varchar(160) not null,
    duracion_minutos_sugerida int,
    codigo_clinico varchar(40),
    activa boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_practica_servicio_nombre
    on sch_agenda.practica (servicio_id, upper(nombre));

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

create unique index if not exists uq_dispositivo_codigo
    on sch_agenda.dispositivo (upper(codigo));

create index if not exists idx_dispositivo_centro_servicio
    on sch_agenda.dispositivo (centro_id, servicio_id, activo);

insert into sch_persona.financiador (id, codigo, nombre, activo)
values
    ('30000000-0000-0000-0000-000000000001', 'OSDE', 'OSDE', true),
    ('30000000-0000-0000-0000-000000000002', 'IOMA', 'IOMA', true)
on conflict (id) do update
set codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_persona.financiador_plan (id, financiador_id, codigo, nombre, activo)
values
    ('30000000-0000-0000-0000-000000000101', '30000000-0000-0000-0000-000000000001', '310', '310', true),
    ('30000000-0000-0000-0000-000000000102', '30000000-0000-0000-0000-000000000001', '210', '210', true),
    ('30000000-0000-0000-0000-000000000201', '30000000-0000-0000-0000-000000000002', 'GOLD', 'GOLD', true)
on conflict (id) do update
set financiador_id = excluded.financiador_id,
    codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_agenda.practica (id, servicio_id, nombre, duracion_minutos_sugerida, codigo_clinico, activa)
values
    ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Consulta general', 15, 'CG001', true),
    ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000101', 'Control clinico', 20, 'CC001', true)
on conflict (id) do update
set servicio_id = excluded.servicio_id,
    nombre = excluded.nombre,
    duracion_minutos_sugerida = excluded.duracion_minutos_sugerida,
    codigo_clinico = excluded.codigo_clinico,
    activa = excluded.activa,
    updated_at = now();

insert into sch_agenda.dispositivo (id, centro_id, servicio_id, codigo, nombre, tipo, activo)
values
    ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'DISP-ECG-01', 'Electrocardiografo 01', 'ECG', true)
on conflict (id) do update
set centro_id = excluded.centro_id,
    servicio_id = excluded.servicio_id,
    codigo = excluded.codigo,
    nombre = excluded.nombre,
    tipo = excluded.tipo,
    activo = excluded.activo,
    updated_at = now();
