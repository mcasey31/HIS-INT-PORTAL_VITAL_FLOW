-- 016 - Turnos: extender catalogo financiadores/planes para edicion persistente

insert into sch_persona.financiador (id, codigo, nombre, activo)
values
    ('30000000-0000-0000-0000-000000000004', 'SWISS_MEDICAL', 'Swiss Medical', true),
    ('30000000-0000-0000-0000-000000000005', 'PAMI', 'PAMI', true)
on conflict (id) do update
set codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_persona.financiador_plan (id, financiador_id, codigo, nombre, activo)
values
    ('30000000-0000-0000-0000-000000000103', '30000000-0000-0000-0000-000000000001', '410', '410', true),
    ('30000000-0000-0000-0000-000000000202', '30000000-0000-0000-0000-000000000002', 'I700', 'I700', true),
    ('30000000-0000-0000-0000-000000000401', '30000000-0000-0000-0000-000000000004', 'SMG20', 'SMG20', true),
    ('30000000-0000-0000-0000-000000000402', '30000000-0000-0000-0000-000000000004', 'SMG50', 'SMG50', true),
    ('30000000-0000-0000-0000-000000000501', '30000000-0000-0000-0000-000000000005', 'PAMI_GENERAL', 'General', true),
    ('30000000-0000-0000-0000-000000000502', '30000000-0000-0000-0000-000000000005', 'PAMI_PLUS', 'Plus', true)
on conflict (id) do update
set financiador_id = excluded.financiador_id,
    codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();
