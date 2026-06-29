UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '4ce706cc-086b-43fa-a77e-a9dc02dfb1e8';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-003', 'a0000000-0000-0000-0000-000000000001', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 09:00:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-003', 'a0000000-0000-0000-0000-000000000001', 'Gomez, Carlos', 'DNI 30123456', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;
UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '242ce598-ad7f-4af1-93eb-a2f8a44f804e';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-004', 'a0000000-0000-0000-0000-000000000002', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 09:30:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-004', 'a0000000-0000-0000-0000-000000000002', 'Lopez, Maria', 'DNI 27111222', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;
UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = 'af5cebae-1046-4017-82a8-a0ed320feef6';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-005', 'a0000000-0000-0000-0000-000000000003', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 10:00:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-005', 'a0000000-0000-0000-0000-000000000003', 'Martinez, Jose', 'DNI 33445566', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;
UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '7143caf5-53ec-42ce-9489-071926505a24';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-006', '10000000-0000-0000-0000-000000000001', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 10:30:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-006', '10000000-0000-0000-0000-000000000001', 'Perez, Juan', 'DNI 12345678', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;
UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '986b2afa-9d18-4e1b-8544-aa3337a59c18';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-007', 'a0000000-0000-0000-0000-000000000005', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 11:00:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-007', 'a0000000-0000-0000-0000-000000000005', 'Fernandez, Luis', 'DNI 35777888', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;
UPDATE sch_agenda.cupo SET estado = 'ocupado' WHERE id = '20d93df8-3c0e-43fe-8724-cb2a96fd0e68';
INSERT INTO sch_turno.turno_paciente (id, paciente_id, profesional, servicio, centro, fecha_hora, estado, motivo)
VALUES ('TURNO-a4dc7a98-008', 'a0000000-0000-0000-0000-000000000006', 'Rodriguez, Maria Laura', 'Clinica Medica', 'Centro Ambulatorio Central', '2026-06-28 11:30:00-03', 'AGENDADO', 'consulta de rutina')
ON CONFLICT (id) DO NOTHING;
INSERT INTO sch_admision.turno_admision (turno_id, paciente_id, paciente_nombre, documento, financiador, estado)
VALUES ('TURNO-a4dc7a98-008', 'a0000000-0000-0000-0000-000000000006', 'Garcia, Laura', 'DNI 31666555', 'Sin Cobertura', 'PROGRAMADO')
ON CONFLICT (turno_id) DO NOTHING;