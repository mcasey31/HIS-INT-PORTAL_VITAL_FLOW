with c as (
  select id as centro_id from sch_agenda.centro where codigo='CENTRO-001' limit 1
), s as (
  select id as servicio_id from sch_agenda.servicio where codigo='SRV-CARDIO' limit 1
), r as (
  select id as rol_id from sch_seguridad.rol where nombre='Medico' limit 1
), base_hash as (
  select password_hash from sch_seguridad.usuario_sistema where username='admin' limit 1
)
insert into sch_seguridad.usuario_sistema (id, username, password_hash, email, persona_id, estado)
select '50000000-0000-0000-0000-000000000250'::uuid, 'jose.perez.med', bh.password_hash, 'jose.perez.med@local', '10000000-0000-0000-0000-000000000003'::uuid, 'ACTIVO'
from base_hash bh
on conflict (username) do update
set password_hash = excluded.password_hash,
    email = excluded.email,
    persona_id = excluded.persona_id,
    estado = excluded.estado,
    updated_at = now();

insert into sch_seguridad.usuario_rol (id, usuario_id, rol_id, centro_id, servicio_id)
select gen_random_uuid(), u.id, r.id, c.id, s.id
from sch_seguridad.usuario_sistema u
join sch_seguridad.rol r on r.nombre='Medico'
join sch_agenda.centro c on c.codigo='CENTRO-001'
join sch_agenda.servicio s on s.codigo='SRV-CARDIO' and s.centro_id=c.id
where u.username='jose.perez.med'
on conflict (usuario_id, rol_id, centro_id) do update
set servicio_id = excluded.servicio_id;

select u.username, u.estado, ur.centro_id::text as centro_id, ur.servicio_id::text as servicio_id, r.nombre as rol
from sch_seguridad.usuario_sistema u
left join sch_seguridad.usuario_rol ur on ur.usuario_id=u.id
left join sch_seguridad.rol r on r.id=ur.rol_id
where u.username='jose.perez.med';
