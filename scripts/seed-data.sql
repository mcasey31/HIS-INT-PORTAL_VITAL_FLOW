-- ================================================
-- Seed Data - VitalFlow Test Data
-- Solo datos, asume tablas creadas por migrations
-- ================================================

-- Test Centers
INSERT INTO sch_agenda.centro (id, nombre, activo) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Centro Ambulatorio Central', true),
  ('00000000-0000-0000-0000-000000000002', 'Clinica San Roque', true),
  ('00000000-0000-0000-0000-000000000003', 'Hospital Italiano', true)
ON CONFLICT (id) DO NOTHING;

-- Test Services (solo centros 2 y 3; centro 1 ya tiene servicios de migraciones)
INSERT INTO sch_agenda.servicio (id, centro_id, nombre, activo) VALUES
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000002', 'Dermatologia', true),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000002', 'Traumatologia', true),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000003', 'Pediatria', true),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000003', 'Cirugia General', true)
ON CONFLICT (id) DO NOTHING;

-- Test Places (lugares de atencion)
INSERT INTO sch_agenda.lugar_atencion (id, nombre, activo) VALUES
  ('00000000-0000-0000-0000-000000000301', 'Consultorio 1', true),
  ('00000000-0000-0000-0000-000000000302', 'Consultorio 2', true),
  ('00000000-0000-0000-0000-000000000303', 'Sala de Espera', true)
ON CONFLICT (id) DO NOTHING;

-- Test Practitioners (efectores)
INSERT INTO sch_agenda.efector (id, centro_id, servicio_id, tipo_efector, nombre, activo) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'PROFESIONAL', 'Diaz, Ana - MP123', true),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000103', 'PROFESIONAL', 'Dr. Juan Perez', true),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000104', 'PROFESIONAL', 'Dra. Maria Garcia', true)
ON CONFLICT (id) DO NOTHING;

-- Test Users
INSERT INTO sch_seguridad.usuario_sistema (id, persona_id, username, password_hash, estado, matricula)
SELECT '50000000-0000-0000-0000-000000000101', id, 'jperez', 'pbkdf2-sha256$100000$Yk57Iz4FMFMlFAH+a9hg7g==$uLMrXCafnoSDWkRmwMKIzmVOqfG7sPi+2/3JIAsgD7Y=', 'ACTIVO', 'MP123'
FROM sch_persona.persona WHERE numero_documento = '12345678'
ON CONFLICT (id) DO NOTHING;

INSERT INTO sch_seguridad.usuario_rol (usuario_id, rol_id, centro_id)
SELECT '50000000-0000-0000-0000-000000000101', r.id, c.id
FROM sch_seguridad.rol r, sch_agenda.centro c
WHERE r.nombre = 'Medico'
ON CONFLICT DO NOTHING;

UPDATE sch_agenda.efector SET usuario_id = '50000000-0000-0000-0000-000000000101'
WHERE id = '00000000-0000-0000-0000-000000000202';

-- Admin user (created by migration 014, just set ACTIVO + known password)
UPDATE sch_seguridad.usuario_sistema
SET estado = 'ACTIVO',
    password_hash = 'pbkdf2-sha256$100000$ArnfFTgfD7bRCto5P2V5og==$tVFSVWOs9paN0rM3pcVa8kzkuldOPe7+tf+3/Bk+6r8=',
    updated_at = now()
WHERE username = 'admin';

-- Verify data loaded
SELECT 'Centers' as entity, COUNT(*) as count FROM sch_agenda.centro
UNION ALL
SELECT 'Services', COUNT(*) FROM sch_agenda.servicio
UNION ALL
SELECT 'Places', COUNT(*) FROM sch_agenda.lugar_atencion
UNION ALL
SELECT 'Practitioners', COUNT(*) FROM sch_agenda.efector;
