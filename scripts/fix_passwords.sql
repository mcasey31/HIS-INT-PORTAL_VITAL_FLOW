-- All users: password = Admin12345!
-- Generado con Pbkdf2PasswordHasher (SHA-256, 100000 iteraciones)

UPDATE sch_seguridad.usuario_sistema
SET password_hash = 'pbkdf2-sha256$100000$Dev1mXGhL696DAHlSqG52g==$ovQfIFLgKTRkusqvU+J8lgVUToMQgZ1d2bw6EULxOiw=',
    estado = 'ACTIVO'
WHERE username = 'admin';

UPDATE sch_seguridad.usuario_sistema
SET password_hash = 'pbkdf2-sha256$100000$1jkd/ZXJrv2kFZoHyoIq9A==$m8fJF7ocg0ZB0+TCOF5ogwSwz0GfCss8aAqJoDlK2FY=',
    estado = 'ACTIVO'
WHERE username = 'diazana';

UPDATE sch_seguridad.usuario_sistema
SET password_hash = 'pbkdf2-sha256$100000$uCeVODB9BWHCH8qPpsA64A==$2WjrmDAUsV7EczE1eix1YSU+Buwkv+2vnjCBQW9zjYg=',
    estado = 'ACTIVO'
WHERE username = 'jperez';
