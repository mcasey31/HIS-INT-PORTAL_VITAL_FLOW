-- Feature Personas - Datos de contacto basicos (email / telefono)
-- Permite reutilizar contacto de persona en Turnos (confirmacion de asignacion).

alter table if exists sch_persona.persona
    add column if not exists email varchar(140),
    add column if not exists telefono varchar(30);

-- Normalizacion defensiva para datos legacy.
update sch_persona.persona
set email = null
where email is not null and btrim(email) = '';

update sch_persona.persona
set telefono = null
where telefono is not null and btrim(telefono) = '';
