-- 031 - Agrega columnas FK a sch_turno.turno_paciente para joins normalizados
-- Las columnas centro_id, servicio_id, efector_id y cupo_id ya eran referenciadas
-- por el código pero nunca se agregaron a la DDL de la tabla.

alter table sch_turno.turno_paciente
    add column if not exists centro_id   uuid,
    add column if not exists servicio_id uuid,
    add column if not exists efector_id  uuid,
    add column if not exists cupo_id     uuid;
