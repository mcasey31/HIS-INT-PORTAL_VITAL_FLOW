# FEATURE_SEC_003 - Login en Frontend

## Objetivo
Implementar pantalla de login y manejo de tokens JWT en el frontend React para que usuarios deban autenticarse antes de usar el sistema.

## Referencia de analisis
- Hallazgo critico #1: No hay login en frontend
- Recomendacion Prioridad 1, item #3: Implementar login en frontend con manejo de tokens

## HU incluidas
- HU SEC-011: Pantalla de login
- HU SEC-012: Manejo de token en frontend (shared HTTP client con interceptor)
- HU SEC-013: Proteccion de navegacion (guard)

## Archivos impactados
- `front/src/App.tsx` (logica de navegacion condicional)
- Nuevo: `front/src/auth/LoginPage.tsx`
- Nuevo: `front/src/auth/AuthContext.tsx`
- Nuevo: `front/src/auth/authApi.ts`
- Nuevo: `front/src/shared/httpClient.ts` (shared HTTP client - vinculado a hallazgo #13)
- `front/src/styles.css` (estilos de login)

## Dependencias
- FEATURE_SEC_001: requiere endpoint de login en backend.
- Vinculado a hallazgo importante #13 (Sin shared HTTP client en frontend).
