# FEATURE_SEC_005 - Middleware Global de Errores

## Objetivo
Implementar middleware centralizado de excepciones en el backend para evitar leaks de informacion y estandarizar respuestas de error.

## Referencia de analisis
- Hallazgo importante #9: Sin middleware de errores — cada controller maneja excepciones individualmente con try/catch
- Recomendacion Prioridad 1, item #5: Agregar middleware global de errores para evitar leaks de informacion

## HU incluidas
- HU SEC-016: Middleware de excepciones global
- HU SEC-017: Respuestas de error estandarizadas (ProblemDetails RFC 7807)

## Archivos impactados
- `back/src/VitalFlow.His.Api/Program.cs` (registrar middleware)
- Nuevo: `back/src/VitalFlow.His.Api/Middleware/ExceptionHandlingMiddleware.cs`
- Todos los controllers existentes (remover try/catch genericos gradualmente)

## Dependencias
- Ninguna (puede ejecutarse en paralelo con otras features).
