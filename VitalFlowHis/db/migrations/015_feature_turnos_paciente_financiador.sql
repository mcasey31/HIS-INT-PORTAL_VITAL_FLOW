-- 015 - Turnos: registro paciente-financiador-plan (HU 9741)
-- Crea relacion de cobertura para paciente y seed de Privado Particular.

create schema if not exists sch_administracion;

create table if not exists sch_administracion.t_paciente_financiador_plan (
    id                 uuid primary key,
    paciente_id        uuid not null references sch_persona.persona(id),
    financiador_id     uuid not null references sch_persona.financiador(id),
    plan_financiador_id uuid not null references sch_persona.financiador_plan(id),
    numero_afiliado    varchar(80),
    fecha_desde        date not null,
    fecha_hasta        date,
    vigente            boolean not null default true,
    created_at         timestamptz not null default now(),
    updated_at         timestamptz not null default now(),
    constraint ck_tpfp_fechas check (fecha_hasta is null or fecha_hasta >= fecha_desde)
);

create index if not exists idx_tpfp_paciente_vigente
    on sch_administracion.t_paciente_financiador_plan (paciente_id, vigente, fecha_hasta);

create index if not exists idx_tpfp_financiador_plan
    on sch_administracion.t_paciente_financiador_plan (financiador_id, plan_financiador_id);

insert into sch_persona.financiador (id, codigo, nombre, activo)
values ('30000000-0000-0000-0000-000000000003', 'PRIVADO_PARTICULAR', 'Privado Particular', true)
on conflict (id) do update
set codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();

insert into sch_persona.financiador_plan (id, financiador_id, codigo, nombre, activo)
values ('30000000-0000-0000-0000-000000000301', '30000000-0000-0000-0000-000000000003', 'PRIVADO_PARTICULAR', 'Privado Particular', true)
on conflict (id) do update
set financiador_id = excluded.financiador_id,
    codigo = excluded.codigo,
    nombre = excluded.nombre,
    activo = excluded.activo,
    updated_at = now();
