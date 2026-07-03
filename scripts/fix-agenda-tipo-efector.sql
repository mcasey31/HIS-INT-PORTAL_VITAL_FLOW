alter table if exists sch_agenda.agenda
    add column if not exists tipo_efector varchar(40);

update sch_agenda.agenda a
set tipo_efector = coalesce(a.tipo_efector, e.tipo_efector, 'PROFESIONAL')
from sch_agenda.efector e
where a.efector_id = e.id
  and (a.tipo_efector is null or btrim(a.tipo_efector)='');

update sch_agenda.agenda
set tipo_efector = 'PROFESIONAL'
where tipo_efector is null or btrim(tipo_efector)='';
