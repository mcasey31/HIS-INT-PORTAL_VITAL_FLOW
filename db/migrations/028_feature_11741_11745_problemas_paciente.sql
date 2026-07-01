-- HU 11741 / 11745 - Asignar problema del paciente + Visualizacion simple
-- Agrega soporte de categorias y fecha_inicio a sch_hca.problema_cronico

alter table sch_hca.problema_cronico
    add column if not exists categoria varchar(50) not null default 'Activo';

alter table sch_hca.problema_cronico
    add column if not exists fecha_inicio date not null default current_date;

create index if not exists idx_problema_cronico_paciente_categoria
    on sch_hca.problema_cronico (paciente_id, categoria);
