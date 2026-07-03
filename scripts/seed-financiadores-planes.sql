insert into sch_persona.financiador (id, codigo, nombre, activo)
values
  ('30000000-0000-0000-0000-000000000001','OSDE','OSDE',true),
  ('30000000-0000-0000-0000-000000000002','IOMA','IOMA',true),
  ('30000000-0000-0000-0000-000000000003','SWISS','Swiss Medical',true)
on conflict (id) do update
set codigo=excluded.codigo,
    nombre=excluded.nombre,
    activo=excluded.activo,
    updated_at=now();

insert into sch_persona.financiador_plan (id, financiador_id, codigo, nombre, activo)
values
  ('30000000-0000-0000-0000-000000000101','30000000-0000-0000-0000-000000000001','210','OSDE 210',true),
  ('30000000-0000-0000-0000-000000000102','30000000-0000-0000-0000-000000000001','310','OSDE 310',true),
  ('30000000-0000-0000-0000-000000000201','30000000-0000-0000-0000-000000000002','GENERAL','IOMA General',true),
  ('30000000-0000-0000-0000-000000000301','30000000-0000-0000-0000-000000000003','SMG20','SMG 20',true)
on conflict (id) do update
set financiador_id=excluded.financiador_id,
    codigo=excluded.codigo,
    nombre=excluded.nombre,
    activo=excluded.activo,
    updated_at=now();

insert into sch_persona.centro_financiador_plan (id, centro_id, financiador_id, plan_financiador_id, activo)
select gen_random_uuid(), c.id, p.financiador_id, p.id, true
from sch_agenda.centro c
join sch_persona.financiador_plan p on true
where c.codigo='CENTRO-001'
on conflict do nothing;
