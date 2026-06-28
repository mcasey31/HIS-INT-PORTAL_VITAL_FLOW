-- HU 11720 - Visualizacion de problemas cronicos

create schema if not exists sch_hca;

create table if not exists sch_hca.problema_cronico (
    id uuid primary key,
    paciente_id uuid not null references sch_persona.persona(id),
    descripcion varchar(300) not null,
    fecha_creacion timestamptz not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_hca.problema_cronico_evolucion (
    id uuid primary key,
    problema_cronico_id uuid not null references sch_hca.problema_cronico(id) on delete cascade,
    fecha_evolucion timestamptz not null,
    resumen varchar(500),
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_problema_cronico_paciente_fecha
    on sch_hca.problema_cronico (paciente_id, fecha_creacion desc)
    where activo = true;

create index if not exists idx_problema_cronico_evolucion_problema
    on sch_hca.problema_cronico_evolucion (problema_cronico_id, fecha_evolucion desc)
    where activo = true;

insert into sch_hca.problema_cronico (id, paciente_id, descripcion, fecha_creacion, activo)
values
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Hipertension arterial', '2026-05-29 10:15:00+00', true),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Diabetes tipo 2', '2026-05-20 08:50:00+00', true),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Dislipidemia', '2026-05-03 09:10:00+00', true),
    ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Hipotiroidismo', '2026-04-04 11:00:00+00', true)
on conflict (id) do update
set paciente_id = excluded.paciente_id,
    descripcion = excluded.descripcion,
    fecha_creacion = excluded.fecha_creacion,
    activo = excluded.activo,
    updated_at = now();

insert into sch_hca.problema_cronico_evolucion (id, problema_cronico_id, fecha_evolucion, resumen, activo)
values
    ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '2026-05-30 09:30:00+00', 'Control en consultorio', true),
    ('31000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '2026-05-21 10:00:00+00', 'Ajuste terapeutico', true),
    ('31000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '2026-05-11 08:45:00+00', 'Seguimiento', true),
    ('31000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '2026-05-24 12:10:00+00', 'Control metabolico', true),
    ('31000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', '2026-05-14 15:20:00+00', 'Interconsulta nutricion', true),
    ('31000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', '2026-05-18 16:45:00+00', 'Evaluacion anual', true)
on conflict (id) do update
set problema_cronico_id = excluded.problema_cronico_id,
    fecha_evolucion = excluded.fecha_evolucion,
    resumen = excluded.resumen,
    activo = excluded.activo,
    updated_at = now();
