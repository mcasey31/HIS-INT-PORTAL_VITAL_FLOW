-- ================================================
-- Seed Data - VitalFlow Test Data
-- ================================================

-- Test Centers
INSERT INTO sch_agenda.centro (codigo, nombre, direccion, telefono, mail, activo)
VALUES 
  ('CENTRO-001', 'Centro Ambulatorio Central', 'Av. Rivadavia 1234, Buenos Aires', '+54-11-4543-1234', 'info@centro-central.com.ar', true),
  ('CENTRO-002', 'Clínica San Roque', 'Calle Mitre 567, La Plata', '+54-221-555-6789', 'contacto@sanroque.com.ar', true),
  ('CENTRO-003', 'Hospital Italiano', 'Gascón 450, CABA', '+54-11-4959-0000', 'info@hospitalitaliano.org.ar', true)
ON CONFLICT (codigo) DO NOTHING;

-- Test Services
INSERT INTO sch_agenda.servicio (centro_id, codigo, nombre, descripcion, activo)
SELECT id, 'SRV-CARDIO', 'Cardiología', 'Servicio de Cardiología', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-001'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.servicio (centro_id, codigo, nombre, descripcion, activo)
SELECT id, 'SRV-CLING', 'Clínica General', 'Servicio de Clínica General', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-001'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.servicio (centro_id, codigo, nombre, descripcion, activo)
SELECT id, 'SRV-DERM', 'Dermatología', 'Servicio de Dermatología', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-002'
ON CONFLICT DO NOTHING;

-- Test Places
INSERT INTO sch_agenda.lugar_atencion (centro_id, codigo, nombre, tipo, activo)
SELECT id, 'LUG-001', 'Consultorio 1', 'consultorio', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-001'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.lugar_atencion (centro_id, codigo, nombre, tipo, activo)
SELECT id, 'LUG-002', 'Consultorio 2', 'consultorio', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-001'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.lugar_atencion (centro_id, codigo, nombre, tipo, activo)
SELECT id, 'LUG-003', 'Sala de Espera', 'sala-espera', true 
FROM sch_agenda.centro WHERE codigo = 'CENTRO-001'
ON CONFLICT DO NOTHING;

-- Test Practitioners
INSERT INTO sch_agenda.efector (centro_id, servicio_id, codigo, nombre, tipo_efector, licencia_numero, activo)
SELECT c.id, s.id, 'PROF-001', 'Dr. Juan Pérez', 'PROFESIONAL', '12345678', true
FROM sch_agenda.centro c, sch_agenda.servicio s 
WHERE c.codigo = 'CENTRO-001' AND s.codigo = 'SRV-CARDIO'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.efector (centro_id, servicio_id, codigo, nombre, tipo_efector, licencia_numero, activo)
SELECT c.id, s.id, 'PROF-002', 'Dra. María García', 'PROFESIONAL', '87654321', true
FROM sch_agenda.centro c, sch_agenda.servicio s 
WHERE c.codigo = 'CENTRO-001' AND s.codigo = 'SRV-CLING'
ON CONFLICT DO NOTHING;

-- Test Schedules (Agendas)
INSERT INTO sch_agenda.agenda (centro_id, servicio_id, efector_id, codigo, nombre, estado, tipo_agenda, fecha_desde, fecha_hasta, visible_contact_center)
SELECT c.id, s.id, e.id, 'AGENDA-001', 'Cardiología - Dr. Pérez Junio', 'ACTIVA', 'PROGRAMADA', 
       CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', true
FROM sch_agenda.centro c, sch_agenda.servicio s, sch_agenda.efector e
WHERE c.codigo = 'CENTRO-001' AND s.codigo = 'SRV-CARDIO' AND e.codigo = 'PROF-001'
ON CONFLICT (codigo) DO NOTHING;

-- Test Programming Blocks
INSERT INTO sch_agenda.bloque_programacion (agenda_id, lugar_atencion_id, fecha, hora_inicio, hora_fin, intervalo_minutos, duracion_turno_minutos, sobreturnos)
SELECT a.id, l.id, CURRENT_DATE, '08:00'::time, '12:00'::time, 30, 30, 2
FROM sch_agenda.agenda a, sch_agenda.lugar_atencion l
WHERE a.codigo = 'AGENDA-001' AND l.codigo = 'LUG-001'
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.bloque_programacion (agenda_id, lugar_atencion_id, fecha, hora_inicio, hora_fin, intervalo_minutos, duracion_turno_minutos, sobreturnos)
SELECT a.id, l.id, CURRENT_DATE, '14:00'::time, '18:00'::time, 30, 30, 2
FROM sch_agenda.agenda a, sch_agenda.lugar_atencion l
WHERE a.codigo = 'AGENDA-001' AND l.codigo = 'LUG-002'
ON CONFLICT DO NOTHING;

-- Test Slots for today (will auto-populate from block logic in real app)
-- For now, manually insert a few slots for demo
INSERT INTO sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
SELECT b.id, 
       (CURRENT_DATE || ' 08:00:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       (CURRENT_DATE || ' 08:30:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       'libre', 1, false
FROM sch_agenda.bloque_programacion b
WHERE b.fecha = CURRENT_DATE AND b.hora_inicio = '08:00'::time
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
SELECT b.id, 
       (CURRENT_DATE || ' 08:30:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       (CURRENT_DATE || ' 09:00:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       'libre', 1, false
FROM sch_agenda.bloque_programacion b
WHERE b.fecha = CURRENT_DATE AND b.hora_inicio = '08:00'::time
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
SELECT b.id, 
       (CURRENT_DATE || ' 09:00:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       (CURRENT_DATE || ' 09:30:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       'libre', 1, false
FROM sch_agenda.bloque_programacion b
WHERE b.fecha = CURRENT_DATE AND b.hora_inicio = '08:00'::time
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
SELECT b.id, 
       (CURRENT_DATE || ' 14:00:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       (CURRENT_DATE || ' 14:30:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       'libre', 1, false
FROM sch_agenda.bloque_programacion b
WHERE b.fecha = CURRENT_DATE AND b.hora_inicio = '14:00'::time
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO sch_agenda.cupo (bloque_id, hora_inicio, hora_fin, estado, capacidad, overbooking_permitido)
SELECT b.id, 
       (CURRENT_DATE || ' 14:30:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       (CURRENT_DATE || ' 15:00:00')::timestamptz AT TIME ZONE 'America/Argentina/Buenos_Aires',
       'libre', 1, false
FROM sch_agenda.bloque_programacion b
WHERE b.fecha = CURRENT_DATE AND b.hora_inicio = '14:00'::time
LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify data loaded
SELECT 'Centers' as entity, COUNT(*) as count FROM sch_agenda.centro
UNION ALL
SELECT 'Services', COUNT(*) FROM sch_agenda.servicio
UNION ALL
SELECT 'Places', COUNT(*) FROM sch_agenda.lugar_atencion
UNION ALL
SELECT 'Practitioners', COUNT(*) FROM sch_agenda.efector
UNION ALL
SELECT 'Schedules', COUNT(*) FROM sch_agenda.agenda
UNION ALL
SELECT 'Slots', COUNT(*) FROM sch_agenda.cupo;
