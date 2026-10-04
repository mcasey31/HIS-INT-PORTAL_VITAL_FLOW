-- 043 - Rol Recepcion y usuario de mostrador para la app movil
--
-- Contexto: la app movil de recepcion (turnos, recetas, sala de espera) no
-- tenia un rol propio. Los roles existentes son Administrador, Medico,
-- Administrativo, Cajero, Auditor, Enrolamiento Persona y Administrador
-- Seguridad. Ninguno modela "recepcion de mostrador": Administrativo arrastra
-- permisos de admision de pacientes y Cajero esta orientado a cobro.
--
-- Este rol es deliberadamente estrecho:
--   - lectura de tableros de admision y de turnos
--   - check-in (arribo), llamado y cambio de estado de sala de espera
--   - lectura de recetas y anulacion de recetas
-- NO incluye creacion de recetas (acto medico, ver 044) ni alta de personas.
--
-- Los permisos se aplican con [Authorize(Roles = ...)] en los controllers.
-- sch_seguridad.rol_feature_permiso queda vacio a proposito: la autorizacion
-- es por rol, no por feature, que es como funciona hoy el resto del backend.
--
-- password de dev: VitalFlow2026!
-- NO usar estas credenciales fuera de desarrollo.

begin;

-- ---------------------------------------------------------------------------
-- Rol
-- ---------------------------------------------------------------------------
insert into sch_seguridad.rol (id, nombre, descripcion, es_predefinido)
values (
    '50000000-0000-0000-0000-000000000008',
    'Recepcion',
    'Recepcion de mostrador: agendas, check-in, sala de espera y consulta/anulacion de recetas',
    true
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Persona de respaldo del usuario (usuario_sistema.persona_id es FK NOT NULL)
-- ---------------------------------------------------------------------------
insert into sch_persona.persona (
    id, nombre, apellido, tipo_documento_codigo, numero_documento,
    fecha_nacimiento, sexo_biologico, estado
)
values (
    'a0000000-0000-0000-0000-0000000000a0',
    'Recepcion',
    'Mostrador',
    'DNI',
    '99000001',
    date '1990-01-01',
    'X',
    'ACTIVO'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Usuario
-- ---------------------------------------------------------------------------
-- PBKDF2-SHA256, 100000 iteraciones, salt 16 bytes, hash 32 bytes.
-- Debe coincidir con Pbkdf2PasswordHasher
-- (back/src/VitalFlow.His.Api/Security/Pbkdf2PasswordHasher.cs).
insert into sch_seguridad.usuario_sistema (
    id, persona_id, username, password_hash, estado
)
values (
    'b0000000-0000-0000-0000-0000000000a0',
    'a0000000-0000-0000-0000-0000000000a0',
    'recepcion',
    'pbkdf2-sha256$100000$GIQIXLYi8g9PVkU8/PCFPw==$5Q3lUio26AYW9w4DmaZ/MprTMUdW7jxyahGS1n9JZao=',
    'DEBE_CAMBIAR_PASSWORD'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Asignacion de rol
-- ---------------------------------------------------------------------------
-- usuario_rol es clave (usuario_id, rol_id, centro_id, servicio_id).
-- Se asigna al centro por defecto para que el claim centroId del JWT quede
-- poblado desde el login.
insert into sch_seguridad.usuario_rol (usuario_id, rol_id, centro_id)
select
    'b0000000-0000-0000-0000-0000000000a0',
    '50000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001'
where not exists (
    select 1
    from sch_seguridad.usuario_rol
    where usuario_id = 'b0000000-0000-0000-0000-0000000000a0'
      and rol_id     = '50000000-0000-0000-0000-000000000008'
);

commit;