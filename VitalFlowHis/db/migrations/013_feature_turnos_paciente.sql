-- 013 - Turnos paciente: turno asignado + disponibilidad de sobreturnos
-- Persiste los turnos asignados a pacientes y los cupos de sobreturnos.

create schema if not exists sch_turno;

-- Turno asignado a un paciente desde el modulo de Turnos.
-- id: formato libre generado por el servicio (ej: "{pacienteId}-{slotId}-{guid}")
create table if not exists sch_turno.turno_paciente (
    id          varchar(300)  primary key,
    paciente_id varchar(80)   not null,
    profesional varchar(200)  not null,
    servicio    varchar(200)  not null,
    centro      varchar(200)  not null,
    fecha_hora  timestamptz   not null,
    estado      varchar(60)   not null,
    motivo      varchar(300),
    created_at  timestamptz   not null default now(),
    updated_at  timestamptz   not null default now()
);

create index if not exists idx_turno_paciente_paciente_fecha
    on sch_turno.turno_paciente (paciente_id, fecha_hora);

-- Disponibilidad de sobreturnos por bloque/fecha.
-- st_key: "{agendaId:N}:{bloqueId:N}:{fecha:yyyyMMdd}"
create table if not exists sch_turno.sobreturno_disponibilidad (
    st_key      varchar(200) primary key,
    disponibles int          not null default 0 check (disponibles >= 0),
    updated_at  timestamptz  not null default now()
);
