-- Feature Seguridad - Servicio por usuario/rol
-- Permite asociar un usuario del sistema a un servicio cuando el rol es Medico.

alter table if exists sch_seguridad.usuario_rol
    add column if not exists servicio_id uuid;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_usuario_rol_servicio'
    ) then
        alter table sch_seguridad.usuario_rol
            add constraint fk_usuario_rol_servicio
            foreign key (servicio_id) references sch_agenda.servicio(id) on delete restrict;
    end if;
end $$;

create index if not exists idx_usuario_rol_usuario_servicio
    on sch_seguridad.usuario_rol (usuario_id, servicio_id);