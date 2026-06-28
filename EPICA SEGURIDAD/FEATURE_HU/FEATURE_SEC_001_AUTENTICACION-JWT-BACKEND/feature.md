# FEATURE_SEC_001 - Autenticacion JWT Backend

## Objetivo
Implementar autenticacion basada en JWT en el backend .NET 8 para que todos los endpoints requieran un token valido.

## Referencia de analisis
- Hallazgo critico #1: Sin autenticacion ni autorizacion
- Recomendacion Prioridad 1, item #1: Implementar autenticacion JWT

## HU incluidas
- HU SEC-001: Configuracion de servicio JWT en backend
- HU SEC-002: Endpoint de login
- HU SEC-003: Endpoint de refresh token
- HU SEC-004: Endpoint de logout

## Archivos impactados (estimado)
- `back/src/VitalFlow.His.Api/Program.cs` (configuracion de auth)
- Nuevo: `back/src/VitalFlow.His.Api/Controllers/AuthController.cs`
- Nuevo: `back/src/VitalFlow.His.Api/Application/Auth/JwtService.cs`
- Nuevo: `back/src/VitalFlow.His.Api/Application/Auth/Contracts/`

## Dependencias
- FEATURE_SEC_006 (Modelo de datos): necesita tabla `usuario_sistema` para validar credenciales.
