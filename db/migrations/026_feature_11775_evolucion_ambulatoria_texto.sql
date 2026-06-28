-- HU 11775 - Validacion de registro minimo de informacion asociada al cierre del encuentro
-- Agrega columna texto y turno_id a sch_hca.evolucion_ambulatoria

alter table sch_hca.evolucion_ambulatoria
    add column if not exists texto text not null default '';

alter table sch_hca.evolucion_ambulatoria
    add column if not exists turno_id uuid;

create index if not exists idx_evolucion_ambulatoria_turno
    on sch_hca.evolucion_ambulatoria (turno_id)
    where turno_id is not null and activo = true;
