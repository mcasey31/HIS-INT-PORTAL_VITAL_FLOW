-- Feature Seguridad - Rol por Centro
-- Asigna el alcance de cada rol a un centro especifico.

alter table if exists sch_seguridad.usuario_rol
    add column if not exists centro_id uuid;

update sch_seguridad.usuario_rol
set centro_id = coalesce(centro_id, '00000000-0000-0000-0000-000000000001'::uuid)
where centro_id is null;

alter table if exists sch_seguridad.usuario_rol
    alter column centro_id set not null;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_usuario_rol_centro'
    ) then
        alter table sch_seguridad.usuario_rol
            add constraint fk_usuario_rol_centro
            foreign key (centro_id) references sch_agenda.centro(id) on delete cascade;
    end if;
end $$;

do $$
begin
    if exists (
        select 1
        from pg_constraint
        where conname = 'usuario_rol_pkey'
    ) then
        alter table sch_seguridad.usuario_rol
            drop constraint usuario_rol_pkey;
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'pk_usuario_rol_centro'
    ) then
        alter table sch_seguridad.usuario_rol
            add constraint pk_usuario_rol_centro primary key (usuario_id, rol_id, centro_id);
    end if;
end $$;

create index if not exists idx_usuario_rol_usuario_centro
    on sch_seguridad.usuario_rol (usuario_id, centro_id);
