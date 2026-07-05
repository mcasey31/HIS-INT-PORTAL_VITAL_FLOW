# Session Summary

## Goal
Fix all critical bugs in Agenda module (Fase 1), move hardcodeos to config (Fase 2), and centralize roles/catálogos (Fase 3).

## Constraints & Preferences
- No DB schema changes in this session — all changes are code-only (no new migrations needed)
- Use `IConfiguration` via `appsettings.json` for all configurable values
- Keep backward compatibility with existing API contracts (avoid frontend-breaking renames)
- **NUNCA hardcodear passwords ni SeedUsers en appsettings.json** — todo por DB (seed.sql con hashes correctos)
- **Password hashes deben generarse con Pbkdf2PasswordHasher (SHA-256)** — no usar SHA-1 default de .NET Framework

## Progress

### Verification (2026-07-04)
| Item | Estado |
|------|--------|
| **Fase 1.1** — `CantidadBloques`/`CantidadBloqueos` | ✅ `AgendaAggregate.cs:21-22` |
| **Fase 1.2** — `CopyAgenda` copia bloques | ✅ `AgendaService.cs:510-551` |
| **Fase 1.3** — `RegenerateCupos` en DB | ✅ `PostgresAgendaRepository.cs:1459-1544` |
| **Fase 1.4** — `GetTurnosByBloque` real | ✅ `PostgresAgendaRepository.cs:1532-1564` |
| **Fase 1.5** — `DuracionTurnoMinutos` fallback 30 | ✅ `PostgresAgendaRepository.cs:987` |
| **Fase 2** — Config en appsettings.json | ✅ `appsettings.json:39-48` |
| **Fase 3a** — Roles.cs + 11 controllers | ✅ `Roles.cs:1-20` |
| **Build** — docker compose build his_backend | ✅ healthy |

### Done (2026-07-04)
- **Bug ExtractPracticaNombre**: `Split('-', 3)` on `"prac-{uuid36}-{nombre}"` broke at UUID hyphens — `parts[2]` included partial UUID. Fixed with `practicaId[42..]` (skip 5+36+1 chars).
- **BuscarDisponibilidad verified working**: Returns real DB slots for today→2026-07-31, practice ABDOMEN, Centro Ambulatorio Central, Clinica Medica, Diaz Ana. All slots DISPONIBLE con sobreturnos ST.
- **Fase 1.1: GetAll() Guid.Empty contamination** — `PostgresAgendaRepository.GetAll()` already returned counts from SQL (cols 16/17) but added empty `BloqueProgramacion`/`BloqueoAgenda` objects with `Guid.Empty` to `agenda.Bloques`/`agenda.Bloqueos` so `MapSummary` could call `.Count`. Fixed: added `CantidadBloques`/`CantidadBloqueos` properties to `AgendaAggregate`, set them in `GetAll()` and `GetById()`, and changed `MapSummary` to use them instead of `.Count`.

- **Fase 1.2: CopyAgenda ignores blocks** — `CopyAgenda()` only copied header fields (codigo, nombre, fechas). Fixed: now iterates `source.Bloques` and `source.Bloqueos`, creates clones with new GUIDs, and persists via `repository.AddBloque()`/`AddBloqueo()`.

- **Fase 1.3: RecalcularCupos stub** — Was just a passthrough to `GetDisponibilidad()` (in-memory only). Fixed:
  - Added `RegenerateCupos(Guid agendaId)` to `IAgendaRepository` interface
  - Implemented in `PostgresAgendaRepository`: deletes only `estado = 'libre'` cupos, then regenerates all cupos by iterating each active block's date range × days × interval slots, using `ON CONFLICT DO NOTHING`
  - `RecalcularCupos()` now calls `repository.RegenerateCupos()` + `GetDisponibilidad()`

- **Fase 1.4: GetTurnosACancelarPorEdicionBloque empty** — Was returning `Array.Empty<TurnoACancelarResponse>()`. Fixed:
  - Added domain record `TurnoByBloqueRow` in `IAgendaRepository.cs`
  - Added `GetTurnosByBloque(Guid)` to interface + `PostgresAgendaRepository` (queries `turno_paciente` → `cupo` → `bloque_programacion` with `persona` name join)
  - Service now maps `TurnoByBloqueRow` → `TurnoACancelarResponse`

- **Fase 1.5: DuracionTurnoMinutos fallback bug** — `reader.IsDBNull(10) ? reader.GetInt32(11) : reader.GetInt32(10)` conflates `duracion_turno_minutos` (appointment length) with `intervalo_minutos` (slot spacing). Fixed fallback from `intervalo_minutos` to `30` (matching `SlotContext.DuracionTurnoMinutos` default).

- **Fase 2: Hardcodeos a appsettings.json**
  - Added `"Agenda"` section with: `CodigoPrefix`, `DefaultDuracionTurnoDemanda`, `DefaultDuracionTurnoVariable`, `DefaultDuracionPractica`, `BusinessTimeZone`, `TiposEfector[]`, `TiposAgenda[]`, `FrecuenciasBloque[]`
  - `AgendaService` converted from primary constructor to regular constructor, injects `IConfiguration`
  - `GenerateAgendaCodigo()` uses `codigoPrefix`
  - `ResolveBusinessTimeZone()` accepts timezone ID from config (fallback chain intact)
  - All duracion defaults + catálogos come from config

- **Fase 3a: Roles centralizados**
  - Created `Roles.cs` with 7 role constants + 6 composite strings (`FullAccess`, `ClinicalAccess`, `SecurityAccess`, `EnrolamientoAccess`, `AllRoles`, `FhirAccess`, `RecetaAccess`)
  - Updated all 11 controllers to use constants (zero hardcoded role strings)

- **Fase 3c: Catálogos desde config**
  - `TiposEfector`, `TiposAgenda`, `FrecuenciasBloque` moved from `static readonly` arrays to instance fields read from `IConfiguration`

- **Password hash fix**: Passwords generados con PowerShell usaban SHA-1 (default .NET Framework 4.x). Regenerados con el `Pbkdf2PasswordHasher` real del backend vía endpoint temporal `/api/v1/auth/seed-hash`. Hashes actualizados en DB para `jperez` y `diazana`. Endpoint temporal eliminado post-uso.
- **Agenda INACTIVA → ACTIVA**: Cambio de `estado` en DB vía `UPDATE sch_agenda.agenda SET estado = 'ACTIVA'` para que Escritorio Clínico pueda encontrar la agenda.
- **Bug timezone en matching turnos (Escritorio Clínico)**: `BuildTurnoProgramadoKey` y `BuildTurnoProgramadoKeySinProfesional` usaban `fechaHora.DateTime` (hora local según offset) → slot en UTC y turno en ART producían keys distintas (`13:08` vs `10:08`). Fix: cambiado a `fechaHora.UtcDateTime` para usar UTC consistente. `AdmisionService.cs:401,408,416`.

### In Progress
- *(none)*

### Blocked
- Fase 3b (naming cleanup) skipped — would break frontend JSON contract without coordinated change
- `personas/{id}/domicilio` PUT 500: FK `domicilio_localidad_id_fkey` (catch 23503 → 400, code-only fix aplicado)
- PR #27 VitalFlowHis 8 tablas — pending merge into ALL_IN_ONE_PRJ_VITALFLOW_V1

## Key Decisions
- `CantidadBloques`/`CantidadBloqueos` as explicit properties instead of polluting lists with empty placeholder objects
- `RegenerateCupos` deletes only "libre" cupos (preserving "reservado"/"ocupado" to avoid data loss)
- `DuracionTurnoMinutos` fallback uses 30 (not `intervalo_minutos`) as semantically distinct
- `Roles.cs` as compile-time constants to keep `[Authorize(Roles = ...)]` attribute working
- Config arrays (`TiposEfector`) over DB lookup for rarely-changing catalogs
- Fase 3b skipped to avoid frontend-breaking property renames

## Next Steps
1. Verify Escritorio Clínico ahora carga pacientes del día (diazana como Medico)
2. PR #27 VitalFlowHis 8 tablas — review/merge
3. Merge `feat/tablas-faltantes-local` into `ALL_IN_ONE_PRJ_VITALFLOW_V1`

## Critical Context
- **No DB schema changes in this session** — all changes are in C# code and `appsettings.json` only
- Backend container rebuilt: `vitalflow_his_backend` on `his-his_backend:latest` image
- `Roles.cs` accessible to all controllers via `using VitalFlow.His.Api;`
- `AgendaService` now depends on both `IAgendaRepository` + `IConfiguration` (DI auto-resolves)
- 47 migrations total (001-047) — no new migrations created in this session
- Current branch: `feat/tablas-faltantes-local`
- All containers running, backend healthy

## Relevant Files
- `back/src/VitalFlow.His.Api/Domain/Agenda/AgendaAggregate.cs`: added `CantidadBloques`/`CantidadBloqueos`
- `back/src/VitalFlow.His.Api/Domain/Agenda/IAgendaRepository.cs`: added `TurnoByBloqueRow`, `RegenerateCupos`, `GetTurnosByBloque`, `AgendaBloqueDisponibilidadRow`, `GetAllServicios`, `GetAllPracticasActivas`, `GetAllEfectoresActivos`, `GetAgendasConBloquesParaDisponibilidad`
- `back/src/VitalFlow.His.Api/Infrastructure/Agenda/PostgresAgendaRepository.cs`: Fase 1 fixes + `RegenerateCupos()` + `GetTurnosByBloque()` + `DuracionTurnoMinutos` fallback + `GetCentros()` + DB-driven queries for selectores/disponibilidad
- `back/src/VitalFlow.His.Api/Infrastructure/Agenda/InMemoryAgendaRepository.cs`: stubs for new methods
- `back/src/VitalFlow.His.Api/Application/Agenda/Services/AgendaService.cs`: Fase 1-3 fixes, `IConfiguration` injection
- `back/src/VitalFlow.His.Api/Application/Turnos/Services/TurnosService.cs`: `GetSelectoresDisponibilidad()` refactor (DB fallback), `BuscarDisponibilidad()` refactor (DB directa), helpers `ExtractPracticaNombre`/`ParsePracticas`/`ObtenerFechasDisponibles`(row overload)
- `back/src/VitalFlow.His.Api/Roles.cs`: role constants
- `back/src/VitalFlow.His.Api/appsettings.json`: `"Agenda"` section
- `back/src/VitalFlow.His.Api/Controllers/PersonasController.cs`: domicilio FK catch
- `front/src/auth/LoginPage.tsx`: 2-step login flow
- `front/src/login/Login.css`: centro selector styles
- `Controllers/*.cs`: 11 controllers updated to use `Roles.*` constants
