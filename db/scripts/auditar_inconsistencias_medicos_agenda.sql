-- Auditoria de consistencia entre Agenda (efector profesional) y Seguridad/Personas.
-- Inconsistencias detectadas:
-- 1) Efector profesional sin usuario asociado.
-- 2) Usuario asociado sin rol Medico.
-- 3) Usuario asociado sin persona_id.
-- 4) persona_id referenciado pero inexistente en sch_persona.persona.

with roles_por_usuario as (
  select
    ur.usuario_id,
    array_remove(array_agg(distinct r.nombre), null) as roles
  from sch_seguridad.usuario_rol ur
  left join sch_seguridad.rol r on r.id = ur.rol_id
  group by ur.usuario_id
),
base as (
  select
    e.id as efector_id,
    e.nombre as efector_nombre,
    e.centro_id,
    c.nombre as centro_nombre,
    e.servicio_id,
    s.nombre as servicio_nombre,
    e.usuario_id,
    u.username,
    u.estado as usuario_estado,
    u.persona_id,
    p.apellido,
    p.nombre,
    p.numero_documento,
    coalesce(rpu.roles, '{}'::varchar[]) as roles
  from sch_agenda.efector e
  left join sch_seguridad.usuario_sistema u on u.id = e.usuario_id
  left join sch_persona.persona p on p.id = u.persona_id
  left join roles_por_usuario rpu on rpu.usuario_id = u.id
  left join sch_agenda.centro c on c.id = e.centro_id
  left join sch_agenda.servicio s on s.id = e.servicio_id
  where upper(e.tipo_efector) = 'PROFESIONAL'
)
select
  efector_id,
  efector_nombre,
  centro_nombre,
  servicio_nombre,
  usuario_id,
  username,
  usuario_estado,
  persona_id,
  coalesce(apellido || ', ' || nombre, '-') as persona,
  coalesce(numero_documento, '-') as numero_documento,
  array_to_string(roles, ', ') as roles,
  case
    when usuario_id is null then 'EFECTOR_SIN_USUARIO'
    when not ('Medico' = any(roles)) then 'USUARIO_SIN_ROL_MEDICO'
    when persona_id is null then 'USUARIO_SIN_PERSONA'
    when persona_id is not null and apellido is null and nombre is null then 'PERSONA_REFERENCIADA_INEXISTENTE'
    else 'OK'
  end as estado_consistencia
from base
where
  usuario_id is null
  or not ('Medico' = any(roles))
  or persona_id is null
  or (persona_id is not null and apellido is null and nombre is null)
order by estado_consistencia, efector_nombre;
