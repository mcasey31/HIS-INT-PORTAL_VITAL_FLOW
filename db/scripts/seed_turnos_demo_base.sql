BEGIN;

-- Seed demo base para flujo HIS Turnos/Admision.
-- Crea o normaliza una agenda visible para contact center con bloque vigente y practica compatible.

-- 1. Usuario/efector demo Dr. Juan Perez
INSERT INTO sch_persona.persona (
    id, apellido, nombre, tipo_documento_codigo, numero_documento, fecha_nacimiento, sexo_biologico, estado
)
VALUES (
    '10000000-0000-0000-0000-000000000004', 'Perez', 'Juan', 'DNI', '87654321', '1985-05-15', 'M', 'VIGENTE'
)
ON CONFLICT (id) DO UPDATE SET
    apellido = EXCLUDED.apellido,
    nombre = EXCLUDED.nombre,
    tipo_documento_codigo = EXCLUDED.tipo_documento_codigo,
    numero_documento = EXCLUDED.numero_documento,
    fecha_nacimiento = EXCLUDED.fecha_nacimiento,
    sexo_biologico = EXCLUDED.sexo_biologico,
    estado = EXCLUDED.estado;

INSERT INTO sch_seguridad.usuario_sistema (
    id, username, password_hash, estado, persona_id
)
VALUES (
    '10000000-0000-0000-0000-000000000003',
    'juan.perez.med',
    'pbkdf2-sha256$100000$EEjQivuxO/t9xi8GtN7Sig==$5PdkPlUAB2mFVItqLCRAL8jGqWgXxkRIf76GK67R95M=',
    'ACTIVO',
    '10000000-0000-0000-0000-000000000004'
)
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    password_hash = EXCLUDED.password_hash,
    estado = EXCLUDED.estado,
    persona_id = EXCLUDED.persona_id;

UPDATE sch_seguridad.usuario_sistema
SET estado = 'ACTIVO'
WHERE username = 'admin';

DELETE FROM sch_seguridad.usuario_rol
WHERE usuario_id = '10000000-0000-0000-0000-000000000003'
  AND rol_id = '50000000-0000-0000-0000-000000000002'
  AND centro_id = '00000000-0000-0000-0000-000000000001'
  AND servicio_id = '00000000-0000-0000-0000-000000000101';

INSERT INTO sch_seguridad.usuario_rol (
    usuario_id, rol_id, centro_id, servicio_id, created_at
)
VALUES (
    '10000000-0000-0000-0000-000000000003',
    '50000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    NOW()
);

INSERT INTO sch_agenda.efector (
    id, centro_id, servicio_id, tipo_efector, nombre, activo, usuario_id
)
VALUES (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    'PROFESIONAL',
    'Dr. Juan Perez',
    true,
    '10000000-0000-0000-0000-000000000003'
)
ON CONFLICT (id) DO UPDATE SET
    centro_id = EXCLUDED.centro_id,
    servicio_id = EXCLUDED.servicio_id,
    tipo_efector = EXCLUDED.tipo_efector,
    nombre = EXCLUDED.nombre,
    activo = EXCLUDED.activo,
    usuario_id = EXCLUDED.usuario_id;

-- 2. Agenda demo visible y activa
INSERT INTO sch_agenda.agenda (
    id, codigo, nombre, centro_id, servicio_id, efector_id, tipo_efector, tipo_agenda,
    fecha_desde, fecha_hasta, estado, visible_contact_center,
    created_at, updated_at, created_by, updated_by
)
VALUES (
    '4f5a715b-6245-42f2-a093-0cd8f153f4a1',
    'AG-JPMEDICA-2026',
    'Agenda Juan Perez - Clinica Medica',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000001',
    'PROFESIONAL',
    'MEDICO',
    '2026-07-12'::date,
    '2026-12-31'::date,
    'VIGENTE',
    true,
    NOW(), NOW(), 'admin', 'admin'
)
ON CONFLICT (id) DO UPDATE SET
    codigo = EXCLUDED.codigo,
    nombre = EXCLUDED.nombre,
    centro_id = EXCLUDED.centro_id,
    servicio_id = EXCLUDED.servicio_id,
    efector_id = EXCLUDED.efector_id,
    tipo_efector = EXCLUDED.tipo_efector,
    tipo_agenda = EXCLUDED.tipo_agenda,
    fecha_desde = EXCLUDED.fecha_desde,
    fecha_hasta = EXCLUDED.fecha_hasta,
    estado = EXCLUDED.estado,
    visible_contact_center = EXCLUDED.visible_contact_center,
    updated_at = NOW(),
    updated_by = 'admin';

-- 3. Bloque demo compatible con selectores/slots
INSERT INTO sch_agenda.bloque_programacion (
    id, agenda_id, fecha_desde, fecha_hasta, fecha,
    hora_inicio, hora_fin, intervalo_minutos, dias_semana, frecuencia, tipo_bloque,
    duracion_turno_minutos, sobreturnos, practicas_json, estado,
    created_at, updated_at, created_by, updated_by
)
VALUES (
    '9ebb9162-fc5e-4a3b-99ba-a704a6bb04ba',
    '4f5a715b-6245-42f2-a093-0cd8f153f4a1',
    '2026-07-12'::date,
    '2026-12-31'::date,
    '2026-07-12'::date,
    '08:00:00'::time,
    '23:00:00'::time,
    20,
    'L,X,V',
    'DIARIA',
    'RECURRENTE',
    20,
    3,
    json_build_array(json_build_object('Nombre', 'Consulta general', 'DuracionMinutos', 20))::text,
    'VIGENTE',
    NOW(), NOW(), 'admin', 'admin'
)
ON CONFLICT (id) DO UPDATE SET
    agenda_id = EXCLUDED.agenda_id,
    fecha_desde = EXCLUDED.fecha_desde,
    fecha_hasta = EXCLUDED.fecha_hasta,
    fecha = EXCLUDED.fecha,
    hora_inicio = EXCLUDED.hora_inicio,
    hora_fin = EXCLUDED.hora_fin,
    intervalo_minutos = EXCLUDED.intervalo_minutos,
    dias_semana = EXCLUDED.dias_semana,
    frecuencia = EXCLUDED.frecuencia,
    tipo_bloque = EXCLUDED.tipo_bloque,
    duracion_turno_minutos = EXCLUDED.duracion_turno_minutos,
    sobreturnos = EXCLUDED.sobreturnos,
    practicas_json = EXCLUDED.practicas_json,
    estado = EXCLUDED.estado,
    updated_at = NOW(),
    updated_by = 'admin';

COMMIT;

SELECT 'agenda' AS tipo, id, codigo AS referencia, estado
FROM sch_agenda.agenda
WHERE id = '4f5a715b-6245-42f2-a093-0cd8f153f4a1'
UNION ALL
SELECT 'bloque' AS tipo, id, dias_semana AS referencia, estado
FROM sch_agenda.bloque_programacion
WHERE id = '9ebb9162-fc5e-4a3b-99ba-a704a6bb04ba';
