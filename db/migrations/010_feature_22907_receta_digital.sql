-- HU 22907 - Integracion a Receta Electronica Online (RECETARIO)

create schema if not exists sch_hca;

create table if not exists sch_hca.receta_digital (
    id uuid primary key,
    paciente_id uuid not null references sch_persona.persona(id),
    encuentro_id uuid,
    turno_id uuid,
    prescriptor_usuario_id uuid not null,
    prescriptor_matricula varchar(64) not null,
    organizacion_oid varchar(128) not null,
    estado varchar(40) not null,
    rdiar_profile varchar(40) not null,
    fhir_bundle_json jsonb not null,
    external_recipe_id varchar(128),
    external_repository_uri varchar(300),
    validacion_outcome_json jsonb,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_hca.receta_digital_item (
    id uuid primary key,
    receta_id uuid not null references sch_hca.receta_digital(id) on delete cascade,
    medicamento_codigo varchar(64) not null,
    medicamento_sistema varchar(200) not null,
    medicamento_display varchar(300) not null,
    dosis_texto varchar(200),
    frecuencia_texto varchar(200),
    duracion_dias int,
    indicacion varchar(500),
    estado varchar(40) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_hca.receta_digital_evento (
    id uuid primary key,
    receta_id uuid not null references sch_hca.receta_digital(id) on delete cascade,
    tipo_evento varchar(40) not null,
    payload_json jsonb,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_receta_digital_paciente_fecha
    on sch_hca.receta_digital (paciente_id, created_at desc)
    where activo = true;

create index if not exists idx_receta_digital_estado
    on sch_hca.receta_digital (estado)
    where activo = true;

create index if not exists idx_receta_digital_external
    on sch_hca.receta_digital (external_recipe_id)
    where activo = true and external_recipe_id is not null;

create index if not exists idx_receta_digital_item_receta
    on sch_hca.receta_digital_item (receta_id)
    where activo = true;

create index if not exists idx_receta_digital_evento_receta_fecha
    on sch_hca.receta_digital_evento (receta_id, created_at desc)
    where activo = true;