# Plan de Reestructuración MVC + Seguridad — VitalFlow HIS

> Fecha: 2026-06-27
> Alcance: VitalFlowHis (back/.NET 8 + front/React) y VitalFlowPortal (Next.js)

---

## Diagnóstico Actual

### Backend — Fortalezas
- Controladores con `[ApiController]`, rutas versionadas (`/api/v1/...`)
- Inyección de dependencias consistente en `Program.cs`
- JWT + PBKDF2 implementados correctamente
- Middleware de excepciones con supresión de stack trace en producción

### Backend — Problemas detectados
- Lógica de negocio inline en controladores (`FhirController`, `PersonasController`, `AdmisionController`)
- Validaciones y construcción de DTOs dentro de controladores
- `Domain/` solo tiene entidades para Agenda (los demás módulos carecen de capa de dominio)
- Repositorios con ADO.NET crudo → boilerplate excesivo
- Sin global authorization filter
- `EstructuraInternaController` acepta `string` en vez de `Guid`

### Frontend — Problemas detectados
- Hooks monolíticos: `useAgenda.tsx` (1105 líneas), `useAdmision.tsx` (1240), `useEscritorioClinico.tsx` (1898), `usePersonas.ts` (1146), `useTurnos.tsx` (798)
- Catálogos duplicados (`CATALOGO_FINANCIADORES` en 2 módulos)
- Datos mock hardcodeados en `useEscritorioClinico.tsx`
- Sin tienda de estado global estructurada

### Seguridad — Riesgos identificados
- `Jwt:SigningKey` sin validación de longitud mínima en startup
- `appsettings.json` con `"AllowedHosts": "*"`
- Refresh token sin rate limiting ni blacklist
- No hay filtro de autorización global
- Sin rate limiting en endpoints críticos (`/auth/login`, `/auth/refresh`)
- Sin HTTPS redirection ni HSTS
- Sin CSRF protection para cookies de refresh token

---

## FASE 1 — Backend: Arquitectura MVC Limpia (Prioridad: 🔴 Alta)

### 1.1 Separar responsabilidades Controller/Service/Repository

**Estado actual:** Controladores mezclan routing, validación, y lógica de negocio.

| Archivo | Líneas | Problema | Solución |
|---|---|---|---|
| `FhirController.cs` | 27-126 | Filtrado/paginación inline | Mover a `FhirService` |
| `PersonasController.cs` | 147-191 | `ParseSetMinimoRequest` estático | Mover a `PersonasService` |
| `AdmisionController.cs` | 25-52 | `BuildScope()` leyendo claims | Mover a `AdmisionService` con `IHttpContextAccessor` |
| `EstructuraInternaController.cs` | 42-70 | `string nodoId` sin validación | Cambiar a `Guid` |

**Estructura target por módulo:**

```
VitalFlow.His.Api/
├── Controllers/
│   ├── AgendaController.cs           ← Solo routing, binding, status codes
│   ├── TurnosController.cs
│   ├── AdmisionController.cs
│   ├── PersonasController.cs
│   ├── HistoriaClinicaController.cs
│   ├── AuthController.cs
│   ├── EstructuraInternaController.cs
│   ├── RecetasController.cs
│   ├── GruposProfesionalesController.cs
│   └── FhirController.cs
├── Application/
│   ├── Agenda/
│   │   ├── Services/         ← Casos de uso puros
│   │   ├── Contracts/        ← DTOs request/response
│   │   └── Validators/       ← FluentValidation
│   ├── Turnos/
│   ├── Admision/
│   ├── Personas/
│   ├── HistoriaClinica/
│   ├── Auth/
│   ├── EstructuraInterna/
│   └── Shared/
│       ├── Behaviors/        ← Pipeline behaviors (logging, validation)
│       └── Mappings/         ← AutoMapper o mappers manuales
├── Domain/
│   ├── Agenda/               ← Ya existe ✓
│   ├── Turnos/
│   ├── Admision/
│   ├── Personas/
│   ├── HistoriaClinica/
│   ├── Seguridad/
│   └── Shared/
│       ├── ValueObjects/     ← Email, DNI, FechaRango, etc.
│       └── Abstractions/     ← BaseEntity, IAggregateRoot, IRepository
├── Infrastructure/
│   ├── Agenda/
│   ├── Turnos/
│   ├── Admision/
│   ├── Personas/
│   ├── HistoriaClinica/
│   ├── Auth/
│   └── Shared/
│       ├── DbConnectionFactory.cs
│       └── UnitOfWork.cs
├── Middleware/
├── Filters/
└── Security/
```

### 1.2 Reglas estrictas por capa

```
Controller
  └── Solo recibe request, llama a Service, retorna IActionResult
  └── NO lógica de negocio, NO validación compleja, NO acceso a repositorios

Service (Application)
  └── Orquesta casos de uso, llama a repositorios, aplica reglas de negocio
  └── NO depende de HTTP (no HttpContext, no Request)
  └── Recibe DTOs, retorna DTOs o Result<T>

Domain
  └── Entidades con invariantes, Value Objects, interfaces de repositorio
  └── SIN dependencias de infraestructura
  └── Reglas de negocio puras (métodos de dominio)

Infrastructure
  └── Implementaciones concretas de repositorios
  └── Acceso a DB, cache, servicios externos
```

### 1.3 Implementar Repositorios con Dapper

**Problema:** ADO.NET crudo con `NpgsqlCommand` → mucho boilerplate.

**Opción recomendada:** Migrar a **Dapper** para reducir ~60% del código.

```csharp
// Antes (ADO.NET puro)
using var cmd = new NpgsqlCommand("SELECT * FROM sch_agenda.agenda WHERE id = @id", conn);
cmd.Parameters.AddWithValue("@id", id);
using var reader = cmd.ExecuteReader();
while (reader.Read()) { /* mapeo manual */ }

// Después (Dapper)
var agenda = await conn.QueryFirstOrDefaultAsync<AgendaEntity>(
    "SELECT * FROM sch_agenda.agenda WHERE id = @Id", new { Id = id });
```

### 1.4 Pipeline de validación con FluentValidation

```csharp
// Application/{Modulo}/Validators/CreateAgendaValidator.cs
public class CreateAgendaValidator : AbstractValidator<CreateAgendaRequest>
{
    public CreateAgendaValidator()
    {
        RuleFor(x => x.ProfesionalId).NotEmpty();
        RuleFor(x => x.Fecha).GreaterThan(DateTime.UtcNow);
        RuleFor(x => x.HoraInicio).LessThan(x => x.HoraFin);
    }
}
```

Registrar como pipeline behavior en `Program.cs`:
```csharp
builder.Services.AddValidatorsFromAssemblyContaining<CreateAgendaValidator>();
```

---

## FASE 2 — Frontend: View-Controller Separation (Prioridad: 🔴 Alta)

### 2.1 Refactorizar hooks monolíticos

**Problema crítico:** 5 hooks con 798-1898 líneas cada uno. Violan SRP.

**Estrategia — Patrón MVC en Frontend:**

```
src/{modulo}/
├── components/           ← Vistas puras (solo render, sin estado global)
│   ├── AgendaCalendar.tsx
│   ├── AgendaForm.tsx
│   ├── AgendaTable.tsx
│   └── ...
├── pages/
│   └── AgendaPage.tsx    ← Orquesta Controller + Views
├── AgendaController.ts   ← Maneja estado, efectos, llama a API (máx 200 líneas)
├── agendaApi.ts          ← Capa HTTP (fetch, tipos, transformación)
├── agendaStore.ts        ← Estado global (Zustand) si se comparte entre módulos
└── agendaTypes.ts        ← Interfaces/DTOs del módulo
```

**Reglas:**
- **Controller** → llama a `agendaApi`, maneja `useState`/`useReducer`, expone handlers
- **Components** → reciben `props` (datos + callbacks), NO llaman APIs directamente
- **Page** → instancia Controller y pasa props a Components
- Máximo **200 líneas** por Controller
- Máximo **150 líneas** por Component

**Ejemplo de Controller refactorizado:**

```tsx
// AgendaController.ts — máximo 200 líneas
export function useAgendaController() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgendas = useCallback(async (filtro: AgendaFiltro) => {
    setLoading(true);
    setError(null);
    try {
      const data = await agendaApi.listar(filtro);
      setAgendas(data);
    } catch (e) {
      setError(parseApiError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const crearAgenda = useCallback(async (req: CreateAgendaRequest) => {
    const result = await agendaApi.crear(req);
    await loadAgendas({}); // refresh
    return result;
  }, [loadAgendas]);

  return { agendas, loading, error, loadAgendas, crearAgenda };
}
```

### 2.2 Centralizar catálogos

**Problema:** `CATALOGO_FINANCIADORES` hardcodeado en 2 módulos.

**Solución:**

1. Crear endpoint en backend: `GET /api/v1/catalogos/financiadores`
2. Crear hook compartido:

```tsx
// src/shared/hooks/useCatalogoFinanciadores.ts
export function useCatalogoFinanciadores() {
  return useQuery({
    queryKey: ['catalogos', 'financiadores'],
    queryFn: () => httpClient.get<Financiador[]>('/api/v1/catalogos/financiadores'),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}
```

3. Eliminar arrays hardcodeados de `useTurnos.tsx` y `useAdmision.tsx`

### 2.3 Eliminar mock data del frontend

**Problema:** `useEscritorioClinico.tsx` líneas 178-244 y 398-505 con datos clínicos hardcodeados.

**Solución:**
- Usar **MSW** (Mock Service Worker) para desarrollo
- O crear endpoint `/api/v1/mock/historia-clinica` solo en ambiente `Development`
- `#if DEBUG` en backend o feature flag

```tsx
// en desarrollo:
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  await worker.start();
}
```

### 2.4 Estado global con Zustand

Para estado compartido entre módulos (usuario actual, centro activo, permisos):

```tsx
// src/shared/stores/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  centroActivo: Centro | null;
  permisos: string[];
  setAuth: (user: User, permisos: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  centroActivo: null,
  permisos: [],
  setAuth: (user, permisos) => set({ user, permisos }),
  logout: () => set({ user: null, centroActivo: null, permisos: [] }),
}));
```

---

## FASE 3 — Seguridad (Prioridad: 🔴 Alta)

### 3.1 JWT Hardening

| Problema | Riesgo | Solución |
|---|---|---|
| `Jwt:SigningKey` sin validación | Firma débil → falsificación de tokens | Validar key >= 256 bits en startup |
| Sin global auth filter | Controller nuevo queda público | `AddAuthorization()` + default policy |
| Refresh token sin protección | Ataque de fuerza bruta | Rate limiting + rotation + blacklist |
| `AllowedHosts: "*"` | Sin restricción CORS | Especificar origins exactos |

**Validación de signing key en startup:**

```csharp
// Program.cs
var signingKey = builder.Configuration["Jwt:SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey is required.");
if (Encoding.UTF8.GetByteCount(signingKey) < 32)
    throw new InvalidOperationException("Jwt:SigningKey must be at least 256 bits (32 chars).");
```

**Global authorization filter:**

```csharp
// Program.cs
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ProblemDetailsResultFilter>();
    options.Filters.Add(new AuthorizeFilter()); // GLOBAL — todos requieren auth
});

// AuthController usa [AllowAnonymous] explícitamente
```

### 3.2 Rate Limiting

Implementar con `AspNetCoreRateLimit` o middleware propio:

```csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("Login", opt =>
    {
        opt.PermitLimit = 5;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueLimit = 0;
    });
    options.AddFixedWindowLimiter("Api", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
    });
});
```

Endpoints protegidos:
- `POST /api/v1/auth/login` → 5/min por IP
- `POST /api/v1/auth/refresh` → 10/min por IP
- `GET /api/v1/personas/buscar` → 30/min por usuario
- `GET /fhir/*` → 60/min por usuario

### 3.3 Refresh Token Rotation + Blacklist

**Problema:** `AuthController` permite anonymous refresh (líneas 39-52). Si un refresh token se filtra, puede usarse indefinidamente.

**Solución:**
```
Login:
  1. Generar access token (15 min)
  2. Generar refresh token (7 días)
  3. Guardar hash del refresh token en DB con DeviceId + IP
  4. Devolver ambos al cliente

Refresh:
  1. Validar refresh token
  2. Verificar que no esté en blacklist
  3. Rotar: invalidar el anterior, generar uno nuevo
  4. Si el mismo refresh se usa dos veces → sospecha de robo → invalidar TODOS los tokens del usuario

Logout:
  1. Agregar refresh token a blacklist (hasta expiración original)
```

### 3.4 CSRF Protection

Dado que usan JWT Bearer en `Authorization` header, CSRF no aplica para APIs REST. Pero si se almacena el refresh token en cookie:

```csharp
// Configurar cookie del refresh token
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // solo HTTPS
});
```

### 3.5 SQL Injection Hardening

**Regla obligatoria:** Todos los parámetros dinámicos deben usar `NpgsqlParameter` con nombre.

```csharp
// MAL — concatenación (prohibido)
var sql = $"SELECT * FROM personas WHERE nombre LIKE '%{busqueda}%'";

// BIEN — parámetros tipados
var sql = "SELECT * FROM personas WHERE nombre ILIKE @busqueda";
cmd.Parameters.AddWithValue("@busqueda", $"%{busqueda}%");
```

**Validación adicional en inputs de búsqueda:**

```csharp
public static class SqlInjectionGuard
{
    private static readonly Regex SqlInjectionPattern = new(
        @"[';]|(--)|(\b(OR|AND)\b\s+\d+\s*[=<>])|(\bUNION\b\s+\bSELECT\b)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public static void Validate(string input, string fieldName)
    {
        if (!string.IsNullOrEmpty(input) && SqlInjectionPattern.IsMatch(input))
            throw new SecurityException($"Posible SQL injection detectado en {fieldName}");
    }
}
```

### 3.6 HTTPS + Security Headers

```csharp
// Program.cs
if (!app.Environment.IsDevelopment())
{
    app.UseHsts(); // Strict-Transport-Security (default 30 días)
    app.UseHttpsRedirection();
}

// Middleware de seguridad
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "camera=(), microphone=()");
    await next();
});
```

### 3.7 Auditoría de seguridad

```csharp
// Infrastructure/Audit/AuditMiddleware.cs
public class AuditMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        var audit = new AuditEntry
        {
            UserId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            Ip = context.Connection.RemoteIpAddress?.ToString(),
            Path = context.Request.Path,
            Method = context.Request.Method,
            Timestamp = DateTime.UtcNow,
            UserAgent = context.Request.Headers["User-Agent"]
        };
        await _auditRepository.LogAsync(audit);
        await _next(context);
    }
}
```

---

## FASE 4 — Base de Datos (Prioridad: 🟡 Media)

### 4.1 Organizar migraciones por esquema

**Estado actual:** 24 migraciones secuenciales (`001_init_agenda.sql` → `024_...`).

**Estructura target:**

```
db/
├── migrations/               ← Migraciones actuales (histórico)
├── sch_agenda/
│   ├── V001__init.sql
│   └── V002__bloques_fijos.sql
├── sch_turnos/
│   ├── V001__init.sql
│   └── V002__financiadores.sql
├── sch_admision/
│   └── V001__init.sql
├── sch_personas/
│   ├── V001__init.sql
│   └── V002__contacto.sql
├── sch_hca/
│   ├── V001__evolucion.sql
│   └── V002__receta_digital.sql
├── sch_seguridad/
│   ├── V001__auth.sql
│   └── V002__roles_jerarquicos.sql
└── sch_auditoria/
    └── V001__init.sql
```

**Herramienta recomendada:** Flyway (gratuito, open-source) o DbUp (.NET nativo).

### 4.2 Índices recomendados

Basado en consultas identificadas en los controladores:

```sql
-- Agenda
CREATE INDEX idx_agenda_profesional_fecha ON sch_agenda.agenda(profesional_id, fecha);
CREATE INDEX idx_agenda_centro_fecha ON sch_agenda.agenda(centro_id, fecha);

-- Turnos
CREATE INDEX idx_turno_paciente ON sch_turnos.turno(paciente_id);
CREATE INDEX idx_turno_fecha_estado ON sch_turnos.turno(fecha, estado);
CREATE INDEX idx_turno_agenda ON sch_turnos.turno(agenda_id);

-- Personas
CREATE INDEX idx_persona_documento ON sch_personas.persona(tipo_documento, numero_documento);
CREATE INDEX idx_persona_apellido ON sch_personas.persona(apellido);

-- Historia Clínica
CREATE INDEX idx_evolucion_paciente_fecha ON sch_hca.evolucion(paciente_id, fecha DESC);
```

### 4.3 Convenciones

- Nombres de tablas en **singular** y **snake_case** (`turno`, `agenda`, `persona`)
- Esquemas con prefijo `sch_` (`sch_agenda`, `sch_turnos`)
- Primary key siempre `id UUID DEFAULT gen_random_uuid()`
- Columnas de auditoría: `created_at`, `updated_at`, `deleted_at` (soft delete)
- Columnas FHIR: `fhir_id`, `fhir_profile`, `last_sync_at`
- Constraints nombrados: `fk_turno_agenda`, `uq_persona_documento`

---

## FASE 5 — Portal (Next.js) - Prioridad: 🟡 Media

### 5.1 BFF Pattern (Backend For Frontend)

**Problema:** Portal usa tRPC + NextAuth, HIS usa REST + JWT. Comunicación directa sin capa de adaptación consistente.

**Solución:** Crear un **BFF** dentro del Portal que:
1. Actúa como proxy hacia las APIs REST del HIS
2. Traduce autenticación (NextAuth → JWT del HIS)
3. Centraliza errores y transformación de datos

```
Portal (Next.js)
├── Frontend (tRPC client) ──→ tRPC Router ──→ HIS Adapter ──→ HIS REST API (.NET)
                                    │
                                    └── Cache (Redis opcional)
```

### 5.2 HIS Adapter — Contratos claros

```typescript
// src/server/services/his-adapter.ts
export interface IHISAdapter {
  // Agenda
  getAgendas(filtro: AgendaFiltro): Promise<Agenda[]>;
  crearAgenda(req: CreateAgendaRequest): Promise<Agenda>;

  // Turnos
  getTurnos(pacienteId: string): Promise<Turno[]>;
  crearTurno(req: CreateTurnoRequest): Promise<Turno>;

  // Personas
  buscarPersonas(query: string): Promise<Persona[]>;

  // Auth
  login(credentials: LoginRequest): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthResponse>;
}

export class HISAdapter implements IHISAdapter {
  constructor(private readonly httpClient: HttpClient) {}

  async getAgendas(filtro: AgendaFiltro): Promise<Agenda[]> {
    return this.httpClient.get('/api/v1/agenda', { params: filtro });
  }
  // ...
}
```

### 5.3 Manejo de errores centralizado

```typescript
// src/server/api/trpc.ts
export const t = initTRPC
  .context<Context>()
  .create();

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const hisProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof HISApiError) {
      throw new TRPCError({
        code: mapHISStatusToTRPC(error.status),
        message: error.message,
      });
    }
    throw error;
  }
});
```

---

## Plan de Implementación — Roadmap

### Sprint 1 (Semana 1-2): Backend Foundation
- Mover lógica de `FhirController` a `FhirService`
- Mover `ParseSetMinimoRequest` a `PersonasService`
- Mover `BuildScope` a `AdmisionService`
- Crear `Domain/Shared/ValueObjects/` base
- Agregar global authorization filter

### Sprint 2 (Semana 3-4): Frontend Refactor
- Refactorizar `useTurnos.tsx` (el más pequeño, 798 líneas) como piloto
- Crear `AgendaController.ts` separado de `useAgenda.tsx`
- Centralizar `CATALOGO_FINANCIADORES` en API + hook compartido
- Migrar mock data a MSW

### Sprint 3 (Semana 5-6): Seguridad
- Rate limiting en login/refresh
- Refresh token rotation + blacklist
- Validación de signing key en startup
- Security headers middleware
- SQL injection guard en repositorios

### Sprint 4 (Semana 7-8): DB y Portal
- Reorganizar migraciones por esquema
- Agregar índices faltantes
- Implementar BFF pattern en Portal
- Documentar contratos HIS ↔ Portal en OpenAPI

---

## Métricas de Éxito

| Indicador | Estado Actual | Target |
|---|---|---|
| Líneas por controller (promedio) | ~120 | < 60 |
| Líneas por hook frontend (promedio) | ~1,038 | < 200 |
| Módulos con Domain entities | 1/7 | 7/7 |
| Catálogos duplicados | 2 | 0 |
| Endpoints sin rate limiting | Todos | 0 críticos |
| Migraciones por esquema | 0 | 7 esquemas |
| Cobertura de seguridad headers | 0% | 100% |
