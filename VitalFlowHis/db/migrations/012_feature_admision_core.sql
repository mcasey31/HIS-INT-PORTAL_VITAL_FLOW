-- 012 - Admision core: turno_admision + encuentro
-- Persiste el estado de admision por slot de agenda y el encuentro clinico asociado.

create schema if not exists sch_admision;

-- Estado de admision por slot de agenda.
-- turno_id es la clave compuesta calculada: "adm:{agendaId:N}:{bloqueId:N}:{fecha:yyyyMMdd}:{hora:HHmm}"
create table if not exists sch_admision.turno_admision (
    turno_id        varchar(250) primary key,
    paciente_id     varchar(80),            -- uuid como string (null = no admitido todavia)
    paciente_nombre varchar(300),
    documento       varchar(80),
    financiador     varchar(200),
    estado          varchar(40)  not null default 'PROGRAMADO',
    estado_turno    varchar(40)  not null default 'PROGRAMADO',
    motivo          varchar(300),
    llegada_en      timestamptz,
    created_at      timestamptz  not null default now(),
    updated_at      timestamptz  not null default now()
);

create index if not exists idx_turno_admision_estado
    on sch_admision.turno_admision (estado);

create index if not exists idx_turno_admision_paciente
    on sch_admision.turno_admision (paciente_id)
    where paciente_id is not null;

-- Encuentro clinico (uno por turno admitido).
-- encuentro_id: "enc:{turnoId}"
create table if not exists sch_admision.encuentro (
    encuentro_id  varchar(300) primary key,
    turno_id      varchar(250) not null references sch_admision.turno_admision (turno_id),
    paciente_id   varchar(80)  not null,
    estado        varchar(40)  not null default 'ABIERTO',
    creado_en     timestamptz  not null default now(),
    cerrado_en    timestamptz,
    motivo_cierre varchar(300),
    updated_at    timestamptz  not null default now()
);

-- Un turno tiene como mucho un encuentro activo.
create unique index if not exists uq_encuentro_turno
    on sch_admision.encuentro (turno_id);

create index if not exists idx_encuentro_estado_creado
    on sch_admision.encuentro (estado, creado_en)
    where estado = 'ABIERTO';
