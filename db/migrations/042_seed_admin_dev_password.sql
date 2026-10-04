-- 042 - Password conocida de dev para el usuario admin
--
-- Contexto: la migracion 014 creo el usuario admin con un hash PBKDF2 de salt
-- real, pero el plaintext nunca quedo documentado en el repo. Sin el no se puede
-- autenticar ni developmentar. Esta migracion fija una password conocida para
-- entornos locales, manteniendo el estado DEBE_CAMBIAR_PASSWORD para que la UI
-- obligue a cambiarla en el primer login.
--
-- Algoritmo: PBKDF2-SHA256, 100000 iteraciones, salt 16 bytes, hash 32 bytes.
-- Debe coincidir con Pbkdf2PasswordHasher (back/src/VitalFlow.His.Api/Security/
-- Pbkdf2PasswordHasher.cs).
--
-- password de dev: VitalFlow2026!
--
-- NO usar estas credenciales fuera de desarrollo.

update sch_seguridad.usuario_sistema
set password_hash = 'pbkdf2-sha256$100000$GIQIXLYi8g9PVkU8/PCFPw==$5Q3lUio26AYW9w4DmaZ/MprTMUdW7jxyahGS1n9JZao=',
    estado = 'DEBE_CAMBIAR_PASSWORD'
where lower(username) = 'admin';