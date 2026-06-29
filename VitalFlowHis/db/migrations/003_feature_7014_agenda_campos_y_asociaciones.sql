-- Feature 7014 - Agregar agenda
-- Campos obligatorios + asociaciones: centro, servicio, efector, tipo agenda, visibilidad contact center

create table if not exists sch_agenda.centro (
    id uuid primary key,
    nombre varchar(140) not null unique,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists sch_agenda.servicio (
    id uuid primary key,
    centro_id uuid not null references sch_agenda.centro(id),
    nombre varchar(140) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (centro_id, nombre)
);

create table if not exists sch_agenda.efector (
    id uuid primary key,
    centro_id uuid not null references sch_agenda.centro(id),
    servicio_id uuid not null references sch_agenda.servicio(id),
    tipo_efector varchar(40) not null,
    nombre varchar(180) not null,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

insert into sch_agenda.centro (id, nombre)
values
    ('00000000-0000-0000-0000-000000000001', 'Centro Ambulatorio Central')
on conflict (id) do nothing;

insert into sch_agenda.servicio (id, centro_id, nombre)
values
    ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Clinica Medica')
on conflict (id) do nothing;

insert into sch_agenda.efector (id, centro_id, servicio_id, tipo_efector, nombre)
values
    ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'PROFESIONAL', 'Diaz, Ana - MP123')
on conflict (id) do nothing;

alter table if exists sch_agenda.agenda
    add column if not exists centro_id uuid,
    add column if not exists servicio_id uuid,
    add column if not exists tipo_efector varchar(40),
    add column if not exists efector_id uuid,
    add column if not exists tipo_agenda varchar(40),
    add column if not exists visible_contact_center boolean not null default true;

update sch_agenda.agenda
set centro_id = coalesce(centro_id, '00000000-0000-0000-0000-000000000001'::uuid),
    servicio_id = coalesce(servicio_id, '00000000-0000-0000-0000-000000000101'::uuid),
    tipo_efector = coalesce(tipo_efector, 'PROFESIONAL'),
    efector_id = coalesce(efector_id, '00000000-0000-0000-0000-000000000201'::uuid),
    tipo_agenda = coalesce(tipo_agenda, 'PROGRAMADA')
where centro_id is null
   or servicio_id is null
   or tipo_efector is null
   or efector_id is null
   or tipo_agenda is null;

alter table if exists sch_agenda.agenda
    alter column centro_id set not null,
    alter column servicio_id set not null,
    alter column tipo_efector set not null,
    alter column efector_id set not null,
    alter column tipo_agenda set not null;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_agenda_centro'
    ) then
        alter table sch_agenda.agenda
            add constraint fk_agenda_centro
            foreign key (centro_id) references sch_agenda.centro(id);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_agenda_servicio'
    ) then
        alter table sch_agenda.agenda
            add constraint fk_agenda_servicio
            foreign key (servicio_id) references sch_agenda.servicio(id);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'fk_agenda_efector'
    ) then
        alter table sch_agenda.agenda
            add constraint fk_agenda_efector
            foreign key (efector_id) references sch_agenda.efector(id);
    end if;
end $$;

create index if not exists idx_agenda_centro_servicio on sch_agenda.agenda(centro_id, servicio_id);
create index if not exists idx_efector_search on sch_agenda.efector(centro_id, servicio_id, tipo_efector, nombre);
