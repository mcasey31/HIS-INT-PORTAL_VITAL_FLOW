-- HU 8989 - Practicas asociadas a bloque de programacion variable

alter table sch_agenda.bloque_programacion
    add column if not exists practicas_json text;

update sch_agenda.bloque_programacion
set practicas_json = '[]'
where practicas_json is null;
