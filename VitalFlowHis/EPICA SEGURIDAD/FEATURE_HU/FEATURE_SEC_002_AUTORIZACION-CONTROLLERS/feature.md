# FEATURE_SEC_002 - Autorizacion en Controllers

## Objetivo
Agregar `[Authorize]` a todos los controllers existentes del backend para que ningun endpoint sea accesible sin autenticacion.

## Referencia de analisis
- Hallazgo critico #1: Cualquier persona puede acceder a todos los endpoints y datos clinicos
- Recomendacion Prioridad 1, item #2: Agregar [Authorize] a todos los controllers

## HU incluidas
- HU SEC-005: Proteger AgendaController (22 endpoints)
- HU SEC-006: Proteger PersonasController (5 endpoints)
- HU SEC-007: Proteger TurnosController (7 endpoints)
- HU SEC-008: Proteger AdmisionController (6 endpoints)
- HU SEC-009: Proteger HCA y Recetas Controllers (6 endpoints)
- HU SEC-010: Proteger FHIR y ABMs Controllers

## Archivos impactados
- `back/src/VitalFlow.His.Api/Controllers/AgendaController.cs`
- `back/src/VitalFlow.His.Api/Controllers/PersonasController.cs`
- `back/src/VitalFlow.His.Api/Controllers/TurnosController.cs`
- `back/src/VitalFlow.His.Api/Controllers/AdmisionController.cs`
- `back/src/VitalFlow.His.Api/Controllers/HistoriaClinicaController.cs`
- `back/src/VitalFlow.His.Api/Controllers/RecetasController.cs`
- `back/src/VitalFlow.His.Api/Controllers/FhirController.cs`
- `back/src/VitalFlow.His.Api/Controllers/EstructuraInternaController.cs`

## Dependencias
- FEATURE_SEC_001: requiere que JWT este configurado antes de agregar [Authorize].
