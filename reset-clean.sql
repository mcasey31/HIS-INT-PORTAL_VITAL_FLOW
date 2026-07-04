-- Recreate 7 roles
INSERT INTO sch_seguridad.rol (id, nombre, descripcion, activo, created_at, updated_at) VALUES
('10000000-0000-0000-0000-000000000001', 'Administrador', 'Administrador del sistema', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', 'Medico', 'Personal médico', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', 'Administrativo', 'Personal administrativo', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000004', 'Cajero', 'Personal de caja', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000005', 'Auditor', 'Personal de auditoría', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000006', 'Enrolamiento Persona', 'Personal de enrolamiento', true, NOW(), NOW()),
('10000000-0000-0000-0000-000000000007', 'Administrador Seguridad', 'Administrador de seguridad', true, NOW(), NOW());

-- Recreate admin user with password hash for "admin"
INSERT INTO sch_seguridad.usuario_sistema (id, persona_id, username, password_hash, estado, created_at, updated_at) VALUES
('50000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', 'admin', 'pbkdf2-sha256$100000$AAAAAAAAAAAAAAAAAAAAAA==$SKuMvgo1qvkaCrAitMDDT+SrfOPqgJS7cNPrf9dAW8s=', 'ACTIVO', NOW(), NOW());

-- Assign Administrador role to admin user
INSERT INTO sch_seguridad.usuario_rol (usuario_id, rol_id) VALUES
('50000000-0000-0000-0000-000000000100', '10000000-0000-0000-0000-000000000001');

SELECT 'Roles and admin user recreated successfully' AS status;
