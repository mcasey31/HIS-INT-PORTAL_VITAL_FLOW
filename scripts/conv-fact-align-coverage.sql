-- Alinea catalogo de cobertura para integracion HIS -> CONV-FACT.
-- Script idempotente: puede ejecutarse multiples veces.

create schema if not exists sch_convenios;

-- Tabla de planes minima para resolver id_plan en episodios.
do $$
begin
    if not exists (
        select 1
        from information_schema.tables
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
    ) then
        execute $sql$
            create table sch_convenios.t_planes (
                id bigserial primary key,
                id_financiador bigint,
                cod_externo varchar(80),
                nombre varchar(200),
                activo boolean default true,
                created_at timestamp without time zone default now()
            )
        $sql$;
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
          and column_name = 'cod_externo'
    ) then
        execute 'alter table sch_convenios.t_planes add column cod_externo varchar(80)';
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
          and column_name = 'id_financiador'
    ) then
        execute 'alter table sch_convenios.t_planes add column id_financiador bigint';
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
          and column_name = 'nombre'
    ) then
        execute 'alter table sch_convenios.t_planes add column nombre varchar(200)';
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
          and column_name = 'activo'
    ) then
        execute 'alter table sch_convenios.t_planes add column activo boolean default true';
    end if;

    if not exists (
        select 1
        from information_schema.columns
        where table_schema = 'sch_convenios'
          and table_name = 't_planes'
          and column_name = 'created_at'
    ) then
        execute 'alter table sch_convenios.t_planes add column created_at timestamp without time zone default now()';
    end if;
end
$$;

create unique index if not exists uq_t_planes_financiador_cod_externo
    on sch_convenios.t_planes (id_financiador, cod_externo)
    where cod_externo is not null;

-- Inserta/actualiza plan canonico de Privado Particular para matching con HIS.
with financiador_base as (
    select id
    from sch_convenios.t_financiadores
    where lower(coalesce(cod_externo, '')) = 'particular'
       or lower(coalesce(nombre, '')) like '%privado%particular%'
    order by id
    limit 1
)
insert into sch_convenios.t_planes (id_financiador, cod_externo, nombre, activo, created_at)
select fb.id,
       '30000000-0000-0000-0000-000000000301',
       'Privado Particular',
       true,
       now()
from financiador_base fb
where not exists (
    select 1
    from sch_convenios.t_planes p
    where p.id_financiador = fb.id
      and lower(coalesce(p.cod_externo, '')) = lower('30000000-0000-0000-0000-000000000301')
);

update sch_convenios.t_planes
set nombre = 'Privado Particular',
    activo = true
where lower(coalesce(cod_externo, '')) = lower('30000000-0000-0000-0000-000000000301');

-- Alias adicional para escenarios legacy donde el plan llega como texto 'particular'.
with financiador_base as (
    select id
    from sch_convenios.t_financiadores
    where lower(coalesce(cod_externo, '')) = 'particular'
       or lower(coalesce(nombre, '')) like '%privado%particular%'
    order by id
    limit 1
)
insert into sch_convenios.t_planes (id_financiador, cod_externo, nombre, activo, created_at)
select fb.id,
       'particular',
       'Privado Particular',
       true,
       now()
from financiador_base fb
where not exists (
    select 1
    from sch_convenios.t_planes p
    where p.id_financiador = fb.id
      and lower(coalesce(p.cod_externo, '')) = lower('particular')
);

update sch_convenios.t_planes
set nombre = 'Privado Particular',
    activo = true
where lower(coalesce(cod_externo, '')) = lower('particular');
