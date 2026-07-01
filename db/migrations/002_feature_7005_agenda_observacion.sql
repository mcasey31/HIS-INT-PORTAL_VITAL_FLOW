-- Feature 7005 - Gestion de Agenda
-- Incremento: observacion en detalle/edicion

alter table if exists sch_agenda.agenda
    add column if not exists observacion varchar(400);
