-- 029 - Homologacion práctica HIS -> catálogo de facturación (VitalFlow)
-- Objetivo: resolver qué prestación de catálogo debe usar el módulo de facturación
-- al recibir un evento de admisión desde HIS, según práctica + financiador/plan.

create table if not exists sch_admision.homologacion_practica_catalogo_facturacion (
    id uuid primary key default gen_random_uuid(),
    practica_origen_codigo varchar(80) not null,
    practica_origen_nombre varchar(200),
    financiador_id uuid,
    plan_id uuid,
    catalogo_codigo varchar(40) not null default 'VITALFLOW',
    prestacion_destino_codigo varchar(80) not null,
    prestacion_destino_nombre varchar(200),
    prioridad int not null default 100,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint chk_homologacion_prioridad_gt_0 check (prioridad > 0)
);

create index if not exists idx_homolog_practica_codigo_ctx
    on sch_admision.homologacion_practica_catalogo_facturacion (
        upper(practica_origen_codigo),
        financiador_id,
        plan_id,
        activo,
        prioridad
    );

create unique index if not exists uq_homolog_practica_codigo_ctx
    on sch_admision.homologacion_practica_catalogo_facturacion (
        upper(practica_origen_codigo),
        coalesce(financiador_id::text, ''),
        coalesce(plan_id::text, ''),
        upper(catalogo_codigo)
    );

alter table sch_admision.eventos_facturacion_outbox
    add column if not exists homologacion_encontrada boolean not null default false,
    add column if not exists catalogo_destino_codigo varchar(40),
    add column if not exists practica_destino_codigo varchar(80),
    add column if not exists practica_destino_nombre varchar(200);

comment on table sch_admision.homologacion_practica_catalogo_facturacion
    is 'Reglas de homologación entre práctica de HIS y prestación de catálogo para facturación.';

comment on column sch_admision.homologacion_practica_catalogo_facturacion.practica_origen_codigo
    is 'Código de práctica de HIS (sch_agenda.practica.codigo_clinico o código funcional equivalente).';

comment on column sch_admision.homologacion_practica_catalogo_facturacion.catalogo_codigo
    is 'Código de catálogo destino en facturación. Default: VITALFLOW.';

comment on column sch_admision.homologacion_practica_catalogo_facturacion.prestacion_destino_codigo
    is 'Código de prestación destino en catálogo de facturación.';

comment on column sch_admision.eventos_facturacion_outbox.homologacion_encontrada
    is 'True cuando HIS pudo resolver homologación práctica->catálogo para el evento.';
