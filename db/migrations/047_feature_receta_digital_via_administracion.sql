-- HU 22907 - Agrega via_administracion a receta_digital_item

alter table sch_hca.receta_digital_item
    add column if not exists via_administracion varchar(100);
