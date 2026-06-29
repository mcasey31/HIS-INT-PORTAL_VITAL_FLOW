-- Feature Estructura Interna - Datos de contacto de Centro
-- Agrega direccion, telefono y mail para ser reutilizados en otros modulos.

alter table if exists sch_agenda.centro
    add column if not exists direccion varchar(240),
    add column if not exists telefono varchar(80),
    add column if not exists mail varchar(140);

update sch_agenda.centro
set direccion = coalesce(direccion, ''),
    telefono = coalesce(telefono, ''),
    mail = coalesce(mail, '')
where direccion is null
   or telefono is null
   or mail is null;

alter table if exists sch_agenda.centro
    alter column direccion set default '',
    alter column telefono set default '',
    alter column mail set default '',
    alter column direccion set not null,
    alter column telefono set not null,
    alter column mail set not null;
