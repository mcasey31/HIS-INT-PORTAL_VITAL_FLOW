-- 026 - Estructura Interna: asociacion Centro | Financiador | Plan configurable por efector

create extension if not exists pgcrypto;

create table if not exists sch_persona.centro_financiador_plan (
    id uuid primary key,
    centro_id uuid not null references sch_agenda.centro(id),
    financiador_id uuid not null references sch_persona.financiador(id),
    plan_financiador_id uuid not null references sch_persona.financiador_plan(id),
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists uq_centro_financiador_plan
    on sch_persona.centro_financiador_plan (centro_id, financiador_id, plan_financiador_id);

create index if not exists idx_centro_financiador_plan_centro
    on sch_persona.centro_financiador_plan (centro_id, activo);

create index if not exists idx_centro_financiador_plan_financiador
    on sch_persona.centro_financiador_plan (financiador_id, plan_financiador_id, activo);

insert into sch_persona.centro_financiador_plan (id, centro_id, financiador_id, plan_financiador_id, activo)
select gen_random_uuid(),
       c.id,
       fp.financiador_id,
       fp.id,
       coalesce(f.activo, true) and coalesce(fp.activo, true)
from sch_agenda.centro c
cross join sch_persona.financiador_plan fp
join sch_persona.financiador f on f.id = fp.financiador_id
where not exists (
    select 1
    from sch_persona.centro_financiador_plan cfp
    where cfp.centro_id = c.id
      and cfp.financiador_id = fp.financiador_id
      and cfp.plan_financiador_id = fp.id
);