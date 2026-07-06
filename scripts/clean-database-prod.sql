-- Script para limpiar BBDD dejando solo estructura + admin/admin + roles
-- Usado para preparar ambiente LIMPIO para Vercel BETA

-- 1. Limpiar datos de turnos
TRUNCATE TABLE sch_turno.turno_paciente CASCADE;

-- 2. Limpiar datos de agenda
TRUNCATE TABLE sch_agenda.cupo CASCADE;
TRUNCATE TABLE sch_agenda.bloque_programacion CASCADE;
TRUNCATE TABLE sch_agenda.agenda CASCADE;
TRUNCATE TABLE sch_agenda.lugar_atencion CASCADE;
TRUNCATE TABLE sch_agenda.servicio CASCADE;
TRUNCATE TABLE sch_agenda.centro CASCADE;
TRUNCATE TABLE sch_agenda.efector CASCADE;

-- 3. Limpiar logs de integración FHIR
TRUNCATE TABLE sch_fhir.integration_audit CASCADE;

-- 4. Limpiar logs de sesión (mantener usuario_sistema y rol)
TRUNCATE TABLE sch_seguridad.sesion_log CASCADE;

-- 5. Limpiar refresh tokens
TRUNCATE TABLE sch_seguridad.refresh_token CASCADE;

-- 6. MANTENER: admin usuario y roles asignados
-- Los usuarios_sistema y roles se mantienen intactos
-- Solo se limpia la relación usuario_rol y luego se recrea para admin

-- Re-crear relación admin -> Administrador role
INSERT INTO sch_seguridad.usuario_rol (usuario_id, rol_id)
SELECT 
    (SELECT id FROM sch_seguridad.usuario_sistema WHERE username = 'admin'),
    (SELECT id FROM sch_seguridad.rol WHERE nombre = 'Administrador')
WHERE NOT EXISTS (
    SELECT 1 FROM sch_seguridad.usuario_rol 
    WHERE usuario_id = (SELECT id FROM sch_seguridad.usuario_sistema WHERE username = 'admin')
    AND rol_id = (SELECT id FROM sch_seguridad.rol WHERE nombre = 'Administrador')
);

-- Verificación final
SELECT 'BBDD LIMPIADA - ESTADO FINAL:' as status;
SELECT 'Usuarios Sistema:' as section;
SELECT COUNT(*) as total FROM sch_seguridad.usuario_sistema;
SELECT 'Roles:' as section;
SELECT COUNT(*) as total FROM sch_seguridad.rol;
SELECT 'Usuario-Rol Links:' as section;
SELECT COUNT(*) as total FROM sch_seguridad.usuario_rol;
