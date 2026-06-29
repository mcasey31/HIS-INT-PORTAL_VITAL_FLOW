-- 021_feature_privado_particular_plan_11.sql
-- Objetivo:
-- 1) Garantizar que el financiador PRIVADO_PARTICULAR tenga un unico plan.
-- 2) Mantener ese plan con codigo/nombre PRIVADO_PARTICULAR / Privado Particular.
-- 3) Evitar futuros duplicados para ese financiador.

begin;

do $$
declare
    v_financiador_id uuid;
    v_canonical_plan_id uuid := '30000000-0000-0000-0000-000000000301'::uuid;
begin
    select f.id
      into v_financiador_id
      from sch_persona.financiador f
     where upper(f.codigo) = 'PRIVADO_PARTICULAR'
     limit 1;

    if v_financiador_id is null then
        raise exception 'No existe financiador PRIVADO_PARTICULAR en sch_persona.financiador';
    end if;

    -- Asegura existencia del plan canonico.
    insert into sch_persona.financiador_plan (
        id,
        financiador_id,
        codigo,
        nombre,
        activo,
        created_at,
        updated_at
    )
    values (
        v_canonical_plan_id,
        v_financiador_id,
        'PRIVADO_PARTICULAR',
        'Privado Particular',
        true,
        now(),
        now()
    )
    on conflict (id) do update
       set financiador_id = excluded.financiador_id,
           codigo = excluded.codigo,
           nombre = excluded.nombre,
           activo = true,
           updated_at = now();

    -- Reasigna referencias de paciente-financiador-plan hacia el plan canonico.
    update sch_administracion.t_paciente_financiador_plan pf
       set plan_financiador_id = v_canonical_plan_id,
           updated_at = now()
      where pf.financiador_id = v_financiador_id
        and pf.plan_financiador_id <> v_canonical_plan_id;

    -- Elimina cualquier otro plan de PRIVADO_PARTICULAR.
    delete from sch_persona.financiador_plan fp
     where fp.financiador_id = v_financiador_id
       and fp.id <> v_canonical_plan_id;
end $$;

-- Garantiza 1:1 para este financiador (no permite mas de un plan).
create unique index if not exists uq_financiador_plan_privado_particular_single
    on sch_persona.financiador_plan (financiador_id)
    where financiador_id = '30000000-0000-0000-0000-000000000003'::uuid;

commit;
