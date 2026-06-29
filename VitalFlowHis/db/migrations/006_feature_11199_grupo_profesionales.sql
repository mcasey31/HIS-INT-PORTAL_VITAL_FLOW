-- HU 11199 - Crear Grupo de Profesionales
-- Modelo relacional base para gestion de grupos y sus miembros.

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

create unique index if not exists uq_grupo_profesional_codigo
    on sch_agenda.grupo_profesional (upper(codigo));

create unique index if not exists uq_grupo_profesional_nombre_por_servicio
    on sch_agenda.grupo_profesional (centro_id, servicio_id, upper(nombre));

create unique index if not exists uq_grupo_profesional_miembro
    on sch_agenda.grupo_profesional_miembro (grupo_profesional_id, efector_id);

create index if not exists idx_grupo_profesional_centro_servicio
    on sch_agenda.grupo_profesional (centro_id, servicio_id, activo);

create index if not exists idx_grupo_profesional_miembro_grupo
    on sch_agenda.grupo_profesional_miembro (grupo_profesional_id, activo);

create index if not exists idx_grupo_profesional_miembro_efector
    on sch_agenda.grupo_profesional_miembro (efector_id, activo);

create or replace function sch_agenda.fn_validar_miembro_grupo_profesional()
returns trigger
language plpgsql
as $$
declare
    v_tipo_efector varchar(40);
    v_efector_centro uuid;
    v_efector_servicio uuid;
    v_grupo_centro uuid;
    v_grupo_servicio uuid;
begin
    select e.tipo_efector, e.centro_id, e.servicio_id
      into v_tipo_efector, v_efector_centro, v_efector_servicio
      from sch_agenda.efector e
     where e.id = new.efector_id;

    if v_tipo_efector is null then
        raise exception 'Efector invalido para miembro del grupo.';
    end if;

    if upper(v_tipo_efector) <> 'PROFESIONAL' then
        raise exception 'Solo se permiten efectores de tipo PROFESIONAL en un grupo.';
    end if;

    select g.centro_id, g.servicio_id
      into v_grupo_centro, v_grupo_servicio
      from sch_agenda.grupo_profesional g
     where g.id = new.grupo_profesional_id;

    if v_grupo_centro is null then
        raise exception 'Grupo profesional invalido.';
    end if;

    if v_efector_centro <> v_grupo_centro or v_efector_servicio <> v_grupo_servicio then
        raise exception 'El profesional debe pertenecer al mismo centro/servicio del grupo.';
    end if;

    return new;
end;
$$;

drop trigger if exists trg_validar_miembro_grupo_profesional on sch_agenda.grupo_profesional_miembro;

create trigger trg_validar_miembro_grupo_profesional
before insert or update on sch_agenda.grupo_profesional_miembro
for each row
execute function sch_agenda.fn_validar_miembro_grupo_profesional();
