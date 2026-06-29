-- 025 - Forzar credencial por defecto admin/admin en desarrollo

update sch_seguridad.usuario_sistema
set password_hash = 'pbkdf2-sha256$100000$AAAAAAAAAAAAAAAAAAAAAA==$SKuMvgo1qvkaCrAitMDDT+SrfOPqgJS7cNPrf9dAW8s=',
    estado = 'ACTIVO',
    updated_at = now()
where lower(username) = 'admin';
