-- HU 11728 - Evolucion ultima atencion ambulatoria

create schema if not exists sch_hca;

create table if not exists sch_hca.evolucion_ambulatoria (
    id uuid primary key,
    paciente_id uuid not null references sch_persona.persona(id),
    fecha_atencion timestamptz not null,
    especialidad varchar(120) not null,
    profesional varchar(160) not null,
    problemas_asociados_json jsonb not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_evolucion_ambulatoria_paciente_fecha
    on sch_hca.evolucion_ambulatoria (paciente_id, fecha_atencion desc)
    where activo = true;

insert into sch_hca.evolucion_ambulatoria
    (id, paciente_id, fecha_atencion, especialidad, profesional, problemas_asociados_json, activo)
values
    (
        '32000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        '2026-05-28 15:12:00+00',
        'Clinica medica',
        'Dra. Carla Iriarte',
        '["Hipertension arterial","Dislipidemia"]'::jsonb,
        true
    ),
    (
        '32000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000001',
        '2026-04-11 10:45:00+00',
        'Cardiologia',
        'Dr. Tomas Bianchi',
        '["Hipertension arterial"]'::jsonb,
        true
    ),
    (
        '32000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000001',
        '2026-02-21 14:15:00+00',
        'Nutricion',
        'Lic. Abril Mendez',
        '["Dislipidemia","Diabetes tipo 2"]'::jsonb,
        true
    ),
    (
        '32000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000002',
        '2026-05-07 09:30:00+00',
        'Clinica medica',
        'Dr. Pedro Salas',
        '["Hipotiroidismo"]'::jsonb,
        true
    )
on conflict (id) do update
set paciente_id = excluded.paciente_id,
    fecha_atencion = excluded.fecha_atencion,
    especialidad = excluded.especialidad,
    profesional = excluded.profesional,
    problemas_asociados_json = excluded.problemas_asociados_json,
    activo = excluded.activo,
    updated_at = now();