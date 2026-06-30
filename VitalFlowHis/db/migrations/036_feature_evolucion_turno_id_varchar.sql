drop index if exists sch_hca.idx_evolucion_ambulatoria_turno;

alter table sch_hca.evolucion_ambulatoria alter column turno_id type varchar(250) using turno_id::text;

create index idx_evolucion_ambulatoria_turno on sch_hca.evolucion_ambulatoria (turno_id) where turno_id is not null and activo = true;
