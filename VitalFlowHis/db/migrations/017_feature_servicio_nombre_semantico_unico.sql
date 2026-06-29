-- 017 - Evitar alta de servicios semanticos duplicados por centro
-- Regla DB: no permitir nombres equivalentes por acentos, mayusculas y espacios.
-- (Plural/singular se valida en backend para evitar falsos positivos a nivel SQL.)

create extension if not exists unaccent;

create or replace function sch_agenda.normalizar_nombre_servicio(input_name text)
returns text
language sql
immutable
as $$
    select trim(
        regexp_replace(
            regexp_replace(
                lower(unaccent(coalesce(input_name, ''))),
                '[^a-z0-9]+',
                ' ',
                'g'
            ),
            '\s+',
            ' ',
            'g'
        )
    );
$$;

create or replace function sch_agenda.validar_servicio_nombre_semantico_unico()
returns trigger
language plpgsql
as $$
declare
    v_existing_nombre text;
begin
    if exists (
        select 1
        from sch_agenda.servicio s
        where s.centro_id = new.centro_id
          and s.id <> new.id
          and sch_agenda.normalizar_nombre_servicio(s.nombre) = sch_agenda.normalizar_nombre_servicio(new.nombre)
    ) then
        select s.nombre
        into v_existing_nombre
        from sch_agenda.servicio s
        where s.centro_id = new.centro_id
          and s.id <> new.id
          and sch_agenda.normalizar_nombre_servicio(s.nombre) = sch_agenda.normalizar_nombre_servicio(new.nombre)
        order by s.nombre
        limit 1;

        raise exception 'Ya existe un servicio equivalente en el centro: %', coalesce(v_existing_nombre, '(sin nombre)');
    end if;

    return new;
end;
$$;

drop trigger if exists trg_servicio_nombre_semantico_unico on sch_agenda.servicio;

create trigger trg_servicio_nombre_semantico_unico
before insert or update of centro_id, nombre
on sch_agenda.servicio
for each row
execute function sch_agenda.validar_servicio_nombre_semantico_unico();
