-- Auditoria de integridad asistencial
-- Ejecutar con:
-- docker exec -i vitalflow_postgres psql -U vitalflow_user -d vitalflow_his -f /dev/stdin < scripts/auditoria-integridad-asistencial.sql

-- 1. Profesionales sin usuario del sistema asociado.
select
    'profesionales_sin_usuario' as control,
    e.id,
    e.nombre,
    e.activo::text as activo,
    c.nombre as centro,
    s.nombre as servicio
from sch_agenda.efector e
left join sch_agenda.centro c on c.id = e.centro_id
left join sch_agenda.servicio s on s.id = e.servicio_id
where upper(e.tipo_efector) = 'PROFESIONAL'
  and e.usuario_id is null
order by e.nombre;

-- 2. Profesionales con usuario pero sin persona.
select
    'profesionales_con_usuario_sin_persona' as control,
    e.id,
    e.nombre,
    u.username,
    u.persona_id::text as persona_id
from sch_agenda.efector e
join sch_seguridad.usuario_sistema u on u.id = e.usuario_id
where upper(e.tipo_efector) = 'PROFESIONAL'
  and u.persona_id is null
order by e.nombre;

-- 3. Usuarios medicos sin persona.
select
    'usuarios_medicos_sin_persona' as control,
    u.id,
    u.username,
    string_agg(distinct c.nombre, ', ' order by c.nombre) as centros,
    string_agg(distinct s.nombre, ', ' order by s.nombre) as servicios
from sch_seguridad.usuario_sistema u
join sch_seguridad.usuario_rol ur on ur.usuario_id = u.id
join sch_seguridad.rol r on r.id = ur.rol_id
left join sch_agenda.centro c on c.id = ur.centro_id
left join sch_agenda.servicio s on s.id = ur.servicio_id
where lower(r.nombre) = 'medico'
  and u.persona_id is null
group by u.id, u.username
order by u.username;

-- 4. Agendas que apuntan a profesionales inactivos.
select
    'agendas_con_profesional_inactivo' as control,
    a.id,
    a.nombre,
    e.nombre as profesional,
    c.nombre as centro,
    s.nombre as servicio
from sch_agenda.agenda a
join sch_agenda.efector e on e.id = a.efector_id
left join sch_agenda.centro c on c.id = a.centro_id
left join sch_agenda.servicio s on s.id = a.servicio_id
where upper(e.tipo_efector) = 'PROFESIONAL'
  and coalesce(e.activo, false) = false
order by a.nombre;

-- 5. Centros duplicados por nombre normalizado.
select
    'centros_duplicados' as control,
    lower(btrim(nombre)) as nombre_normalizado,
    count(*) as cantidad,
    string_agg(id::text, ', ' order by id::text) as centro_ids
from sch_agenda.centro
group by lower(btrim(nombre))
having count(*) > 1
order by nombre_normalizado;

-- 6. Servicios duplicados por centro y nombre normalizado.
select
    'servicios_duplicados_por_centro' as control,
    c.nombre as centro,
    lower(btrim(s.nombre)) as nombre_normalizado,
    count(*) as cantidad,
    string_agg(s.id::text, ', ' order by s.id::text) as servicio_ids
from sch_agenda.servicio s
join sch_agenda.centro c on c.id = s.centro_id
group by c.nombre, lower(btrim(s.nombre))
having count(*) > 1
order by c.nombre, nombre_normalizado;

-- 7. Profesionales inactivos sin referencias, candidatos a depuracion.
select
    'profesionales_inactivos_sin_referencias' as control,
    e.id,
    e.nombre,
    c.nombre as centro,
    s.nombre as servicio
from sch_agenda.efector e
left join sch_agenda.centro c on c.id = e.centro_id
left join sch_agenda.servicio s on s.id = e.servicio_id
where upper(e.tipo_efector) = 'PROFESIONAL'
  and coalesce(e.activo, false) = false
  and not exists (
      select 1
      from sch_agenda.agenda a
      where a.efector_id = e.id
  )
  and not exists (
      select 1
      from sch_turno.turno_paciente t
      where t.efector_id = e.id
  )
  and not exists (
      select 1
      from sch_agenda.grupo_profesional_miembro gpm
      where gpm.efector_id = e.id
  )
order by e.nombre;
