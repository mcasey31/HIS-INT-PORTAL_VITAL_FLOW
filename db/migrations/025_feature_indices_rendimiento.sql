-- 025 - Indices de rendimiento para consultas frecuentes
-- Agrega indices compuestos basados en los patrones de consulta identificados
-- en controladores y servicios del backend.

-- Agenda: busqueda por profesional y rango de fechas
create index if not exists idx_agenda_efector_fecha
    on sch_agenda.agenda (efector_id, fecha_desde, fecha_hasta);

-- Agenda: filtro por centro y estado activo
create index if not exists idx_agenda_centro_estado
    on sch_agenda.agenda (centro_id, estado);

-- Cupo: filtro por estado (libre/reservado/bloqueado) para asignacion rapida
create index if not exists idx_cupo_estado
    on sch_agenda.cupo (estado);

-- Efector: filtro por activos en un centro
create index if not exists idx_efector_activo_centro
    on sch_agenda.efector (activo, centro_id);

-- Servicio: filtro por activos en un centro
create index if not exists idx_servicio_activo_centro
    on sch_agenda.servicio (activo, centro_id);

-- Centro: filtro por activos
create index if not exists idx_centro_activo
    on sch_agenda.centro (activo);

-- Turno paciente: filtro por estado y fecha (consultas del dashboard)
create index if not exists idx_turno_paciente_estado_fecha
    on sch_turno.turno_paciente (estado, fecha_hora);

-- Admision: busqueda por estado y paciente
create index if not exists idx_turno_admision_estado_paciente
    on sch_admision.turno_admision (estado, paciente_id)
    where paciente_id is not null;
