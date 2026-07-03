-- HU7027 - Bloques de programacion fija

create table if not exists sch_agenda.lugar_atencion (
    id uuid primary key,
    nombre varchar(120) not null,
    activo boolean not null default true,
    source_system varchar(80),
    source_id varchar(80),
    fhir_profile varchar(200),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    created_by varchar(80) not null default 'system',
    updated_by varchar(80) not null default 'system'
);

alter table sch_agenda.bloque_programacion
    add column if not exists nombre varchar(70),
    add column if not exists tipo_bloque varchar(20),
    add column if not exists fecha_desde date,
    add column if not exists fecha_hasta date,
    add column if not exists atiende_feriados boolean not null default false,
    add column if not exists dias_semana varchar(32),
    add column if not exists duracion_turno_minutos int,
    add column if not exists lugar_atencion_id uuid,
    add column if not exists frecuencia varchar(20),
    add column if not exists orden_mensual_semanas text,
    add column if not exists sobreturnos int not null default 0;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_bloque_programacion_lugar_atencion'
    ) then
        alter table sch_agenda.bloque_programacion
            add constraint fk_bloque_programacion_lugar_atencion
            foreign key (lugar_atencion_id)
            references sch_agenda.lugar_atencion(id);
    end if;
end $$;

update sch_agenda.bloque_programacion
set nombre = coalesce(nombre, 'Bloque fijo'),
    tipo_bloque = coalesce(tipo_bloque, 'FIJA'),
    fecha_desde = coalesce(fecha_desde, fecha),
    fecha_hasta = coalesce(fecha_hasta, fecha),
    duracion_turno_minutos = coalesce(duracion_turno_minutos, intervalo_minutos),
    frecuencia = coalesce(frecuencia, 'SEMANAL')
where nombre is null
   or tipo_bloque is null
   or fecha_desde is null
   or fecha_hasta is null
   or duracion_turno_minutos is null
   or frecuencia is null;

insert into sch_agenda.lugar_atencion (id, nombre, activo, source_system, source_id, fhir_profile, created_by, updated_by)
values ('00000000-0000-0000-0000-000000000301', 'Consultorio 3', true, 'vitalflow-his', 'lugar-301', 'VitalFlow/Agenda/LugarAtencion', 'migration', 'migration')
on conflict (id) do update set
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now(),
    updated_by = excluded.updated_by;

create index if not exists idx_bloque_programacion_lugar on sch_agenda.bloque_programacion(lugar_atencion_id);
create index if not exists idx_lugar_atencion_nombre on sch_agenda.lugar_atencion(nombre);
