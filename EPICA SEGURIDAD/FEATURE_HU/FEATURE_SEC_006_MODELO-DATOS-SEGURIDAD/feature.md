# FEATURE_SEC_006 - Modelo de Datos de Seguridad

## Objetivo
Crear el schema y tablas de seguridad en PostgreSQL para soportar autenticacion, roles y log de sesiones.

## Referencia de analisis
- Soporta implementacion de hallazgo critico #1 (requiere modelo de datos para usuarios/roles)

## HU incluidas
- HU SEC-018: Migracion SQL para schema de seguridad
- HU SEC-019: Seed de datos iniciales de seguridad

## Archivos impactados
- Nuevo: `db/migrations/014_feature_seguridad_auth.sql`
- Tablas:
  - `sch_seguridad.usuario_sistema`
  - `sch_seguridad.rol`
  - `sch_seguridad.usuario_rol`
  - `sch_seguridad.sesion_log`
- Seeds:
  - Roles predefinidos: Administrador, Medico, Administrativo, Cajero, Auditor
  - Usuario admin inicial

## Dependencias
- Debe ejecutarse PRIMERO. FEATURE_SEC_001 depende de estas tablas.
