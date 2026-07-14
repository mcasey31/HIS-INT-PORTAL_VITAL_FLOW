-- Ensure ON CONFLICT (bloque_id, hora_inicio) works for cupo upsert/reserva operations
create unique index if not exists uq_cupo_bloque_hora
    on sch_agenda.cupo(bloque_id, hora_inicio);
