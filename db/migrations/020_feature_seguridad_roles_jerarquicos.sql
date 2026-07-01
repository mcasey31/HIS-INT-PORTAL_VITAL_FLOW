-- Feature Seguridad - Modelo de Roles Padre/Hijo con herencia
-- Objetivo: permitir roles hijos que heredan permisos del rol padre y puedan cambiar alcance por centro.
-- Excepcion: rol Administrador con alcance global.

alter table if exists sch_seguridad.rol
    add column if not exists parent_rol_id uuid,
    add column if not exists hereda_features boolean not null default true,
    add column if not exists hereda_centros boolean not null default false,
    add column if not exists es_admin_global boolean not null default false;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_rol_parent'
    ) then
        alter table sch_seguridad.rol
            add constraint fk_rol_parent
            foreign key (parent_rol_id) references sch_seguridad.rol(id);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'ck_rol_parent_not_self'
    ) then
        alter table sch_seguridad.rol
            add constraint ck_rol_parent_not_self
            check (parent_rol_id is null or parent_rol_id <> id);
    end if;
end $$;

create table if not exists sch_seguridad.rol_feature_permiso (
    rol_id uuid not null references sch_seguridad.rol(id) on delete cascade,
    feature_key varchar(160) not null,
    permitido boolean not null default true,
    origen varchar(20) not null default 'DIRECTO',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (rol_id, feature_key)
);

create table if not exists sch_seguridad.rol_centro_alcance (
    rol_id uuid not null references sch_seguridad.rol(id) on delete cascade,
    centro_id uuid not null references sch_agenda.centro(id) on delete cascade,
    permitido boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (rol_id, centro_id)
);

create index if not exists idx_rol_parent
    on sch_seguridad.rol(parent_rol_id);

create index if not exists idx_rol_feature_key
    on sch_seguridad.rol_feature_permiso(feature_key);

update sch_seguridad.rol
set es_admin_global = true,
    hereda_features = true,
    hereda_centros = false,
    parent_rol_id = null
where lower(nombre) = 'administrador';
