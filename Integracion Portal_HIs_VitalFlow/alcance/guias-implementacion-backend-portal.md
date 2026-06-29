# Guias de Implementacion - Backend HIS y Portal

## 1. Implementacion Backend HIS - Fachada FHIR

### 1.1 Stack recomendado
- Runtime: .NET 6+ o Node.js 18+
- Framework: NestJS (Node) o ASP.NET Core (C#)
- BD: PostgreSQL (ya existente sch_agenda.*)
- Cache: Redis para Slot availability
- Validacion FHIR: hl7-fhir-core library o equivalente

### 1.2 Estructura de carpetas
```
his-fhir-service/
├── src/
│   ├── fhir/
│   │   ├── controllers/
│   │   │   ├── schedule.controller.ts
│   │   │   ├── slot.controller.ts
│   │   │   ├── appointment.controller.ts
│   │   │   └── location.controller.ts
│   │   ├── services/
│   │   │   ├── schedule.service.ts
│   │   │   ├── slot.service.ts
│   │   │   ├── appointment.service.ts
│   │   │   └── location.service.ts
│   │   ├── mappers/
│   │   │   ├── schedule.mapper.ts (sch_agenda.agenda -> FHIR Schedule)
│   │   │   ├── slot.mapper.ts (sch_agenda.cupo -> FHIR Slot)
│   │   │   ├── appointment.mapper.ts (sch_turno.turno_paciente -> FHIR Appointment)
│   │   │   └── location.mapper.ts (sch_agenda.centro/lugar_atencion -> FHIR Location)
│   │   ├── repositories/
│   │   │   ├── schedule.repository.ts
│   │   │   ├── slot.repository.ts
│   │   │   ├── appointment.repository.ts
│   │   │   └── location.repository.ts
│   │   └── types/
│   │       └── fhir-models.ts (interfaces FHIR R4)
│   ├── auth/
│   │   ├── jwt.strategy.ts
│   │   ├── jwt.guard.ts
│   │   └── scopes.interceptor.ts
│   ├── middleware/
│   │   ├── correlation-id.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   └── logger.middleware.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── cache.config.ts
│   └── app.module.ts
├── migrations/
│   ├── 025_fhir_audit_trail.sql
│   └── 026_idempotency_key_index.sql
├── tests/
│   ├── fhir.contract.test.ts
│   ├── fhir.concurrency.test.ts
│   └── fhir.performance.test.ts
└── docker-compose.yml
```

### 1.3 Tabla de auditoria para FHIR (nueva migracion)
```sql
create schema if not exists sch_fhir;

create table if not exists sch_fhir.integration_audit (
    id uuid primary key,
    correlation_id varchar(80) not null,
    idempotency_key varchar(80),
    operation_name varchar(100) not null,
    resource_type varchar(40),
    resource_id varchar(200),
    request_body text,
    response_code int,
    response_body text,
    request_timestamp timestamptz not null,
    response_timestamp timestamptz not null,
    source_system varchar(80),
    error_detail text,
    created_at timestamptz not null default now()
);

create index if not exists idx_correlation_id on sch_fhir.integration_audit(correlation_id);
create index if not exists idx_idempotency_key on sch_fhir.integration_audit(idempotency_key);
create index if not exists idx_resource on sch_fhir.integration_audit(resource_type, resource_id);
```

### 1.4 Endpoints a implementar (lista de trabajo)

#### GET /fhir/R4/Schedule
- [ ] Query builder para filtros (actor, service-type, date, location)
- [ ] Mapper de sch_agenda.agenda -> FHIR Schedule
- [ ] Paginacion con total count
- [ ] Filtro active basado en agenda.estado
- [ ] Cache en Redis por cache-key (hash de params)
- [ ] Invalidacion de cache en creacion de agenda

#### GET /fhir/R4/Slot
- [ ] Query Schedule para obtener agenda_id
- [ ] Consultar sch_agenda.cupo donde estado='libre'
- [ ] Mapper cupo -> FHIR Slot
- [ ] Incluir location_id en extension
- [ ] Validar que Slot.status=free solo si cupo no reservado
- [ ] Paginacion

#### POST /fhir/R4/Appointment
- [ ] Validar JWT y scope fhir.appointment.write
- [ ] Extraer Idempotency-Key header
- [ ] Buscar turno existente en integration_audit si idempotency_key existe
- [ ] Validar Slot disponible (transaccion atomica)
- [ ] Validar paciente (buscar en Patient/persona tabla)
- [ ] Insertar en sch_turno.turno_paciente
- [ ] Log en integration_audit
- [ ] Retornar 201 Created o 409 Conflict
- [ ] Mantener version/etag en response

#### GET /fhir/R4/Appointment/{id}
- [ ] Buscar en sch_turno.turno_paciente
- [ ] Mapper a FHIR Appointment
- [ ] Incluir participant completo (Patient, PractitionerRole, Location)
- [ ] Retornar 200 o 404

#### GET /fhir/R4/Location
- [ ] Unificar consulta de centro + lugar_atencion
- [ ] Mapper centro -> Location type=sede
- [ ] Mapper lugar_atencion -> Location type=consultorio
- [ ] Incluir partOf para jerarquia
- [ ] Filtros por type, name, status

### 1.5 Validaciones obligatorias en HIS
```typescript
// Pseudocodigo
async createAppointment(fhirAppointment: Appointment, idempotencyKey: string) {
  // 1. Validar idempotencia
  const existing = await checkIdempotencyKey(idempotencyKey);
  if (existing) return 200 + existing;

  // 2. Validar Slot
  const slot = await getSlot(fhirAppointment.slot[0].reference);
  if (!slot || slot.status !== 'free') throw new Conflict('Slot no disponible');

  // 3. Validar paciente
  const patient = await getPatient(fhirAppointment.participant[0].actor.reference);
  if (!patient) throw new NotFound('Paciente no existe');

  // 4. Validar no hay turno duplicado
  const duplicateApt = await getTurnoByPatientAndSlot(patient.id, slot.id);
  if (duplicateApt) throw new Conflict('Turno duplicado');

  // 5. Crear turno en transaccion
  await db.transaction(async (trx) => {
    // Bloquear slot para lectura exclusiva
    const lockedSlot = await trx('sch_agenda.cupo').forUpdate().where({id: slot.id});
    if (lockedSlot.estado !== 'libre') throw new Conflict();

    // Actualizar slot
    await trx('sch_agenda.cupo').update({estado: 'reservado'}).where({id: slot.id});

    // Crear turno
    const turnoId = generateTurnoId();
    await trx('sch_turno.turno_paciente').insert({
      id: turnoId,
      paciente_id: patient.id,
      fecha_hora: slot.start,
      estado: 'PROGRAMADO',
      // ... otros campos
    });

    // Log auditoria
    await trx('sch_fhir.integration_audit').insert({
      correlation_id: correlationId,
      idempotency_key: idempotencyKey,
      operation_name: 'POST_APPOINTMENT',
      resource_type: 'Appointment',
      resource_id: turnoId,
      response_code: 201,
      // ...
    });

    return turnoId;
  });

  return 201 + fhirAppointment (mapped);
}
```

---

## 2. Implementacion Frontend Portal

### 2.1 Stack recomendado
- Framework: Next.js 13+ (already in place)
- HTTP Client: axios o fetch + wrapper
- State: React Context o SWR/TanStack Query
- Tipado: TypeScript + tipos FHIR

### 2.2 Cambios en componentes existentes

#### AppointmentFlow.tsx (ya existe, requiere ajustes)
```typescript
// Cambios:
// 1. Usar endpoints FHIR reales en lugar de mock

async function searchAgendas(filters: {specialty, center, dateFrom, dateTo}) {
  const params = new URLSearchParams({
    'service-type': filters.specialty,
    'location': filters.center,
    'date': `ge${filters.dateFrom}&date=le${filters.dateTo}`,
  });
  
  const response = await hisClient.get(`/fhir/R4/Schedule?${params}`, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Correlation-Id': generateUUID(),
      'Accept': 'application/fhir+json'
    }
  });
  
  return response.data.entry?.map(e => e.resource) || [];
}

async function searchSlots(scheduleId: string, date: string) {
  const response = await hisClient.get(`/fhir/R4/Slot`, {
    params: {
      'schedule': scheduleId,
      'start': `ge${date}T00:00:00&start=lt${date}T23:59:59`,
      'status': 'free'
    },
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Correlation-Id': generateUUID(),
    }
  });
  
  return response.data.entry?.map(e => e.resource) || [];
}

async function reservarTurno(appointment: Appointment) {
  const idempotencyKey = generateUUID(); // Guardar para reintento
  
  const response = await hisClient.post(`/fhir/R4/Appointment`, appointment, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Correlation-Id': generateUUID(),
      'Idempotency-Key': idempotencyKey,
      'Content-Type': 'application/fhir+json'
    }
  });
  
  // Guardar response + idempotencyKey para reintento
  const hisRef = response.data.identifier?.[0]?.value;
  await db.appointment.create({
    ...appointment,
    hisRef,
    idempotencyKey
  });
  
  return response.data;
}
```

#### Middleware de JWT
```typescript
// lib/his-client.ts
import axios from 'axios';

const HIS_API_URL = process.env.NEXT_PUBLIC_HIS_API_URL;

export const hisClient = axios.create({
  baseURL: HIS_API_URL,
  timeout: 30000
});

// Interceptor para agrega JWT automaticamente
hisClient.interceptors.request.use(async (config) => {
  const token = await getJWTToken(); // Obtener del cache/sesion
  config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept'] = 'application/fhir+json';
  config.headers['Content-Type'] = 'application/fhir+json';
  return config;
});

// Interceptor para manejo de errores FHIR
hisClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.resourceType === 'OperationOutcome') {
      // Manejar OperationOutcome FHIR
      const issue = error.response.data.issue[0];
      console.error(`FHIR Error (${issue.code}): ${issue.diagnostics}`);
    }
    throw error;
  }
);
```

#### Retry logic
```typescript
// lib/his-retry.ts
export async function requestWithRetry(fn, maxRetries = 3) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (error.response?.status >= 500 || error.code === 'ECONNABORTED') {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error; // No retry en 4xx
      }
    }
  }
  throw lastError;
}
```

### 2.3 Nuevas variables de entorno
```env
# .env.local
NEXT_PUBLIC_HIS_API_URL=https://his.vitalflow.com.ar/api
HIS_JWT_ISSUER=https://his.vitalflow.com.ar
HIS_JWT_AUDIENCE=portal-vitalflow
HIS_JWT_SECRET_KEY=<private-key-for-signing>
```

### 2.4 Migracion Prisma (ajustes)
```prisma
// prisma/schema.prisma
model Appointment {
  // ... campos existentes
  hisRef      String?           // ID de turno en HIS
  hisStatus   String?           // Estado sincronizado desde HIS
  correlationId String?         // Para trazabilidad
  idempotencyKey String?        // Para reintentos seguros
  
  @@index([hisRef])
  @@index([correlationId])
}
```

---

## 3. Plan de rollout

### Fase 1: Desarrollo paralelo (Semana 1-2)
- [ ] HIS backend: endpoints Schedule, Slot, Location (solo lectura)
- [ ] Portal: integracion de lectura (GET Schedule/Slot/Location)
- [ ] Pruebas contract basicas

### Fase 2: Escritura y concurrencia (Semana 3)
- [ ] HIS backend: endpoint POST Appointment
- [ ] Manejo de Idempotency-Key y concurrencia
- [ ] Portal: flujo completo de reserva
- [ ] Pruebas de concurrencia

### Fase 3: Resiliencia (Semana 4)
- [ ] Retry logic con backoff
- [ ] Circuit breaker
- [ ] Sincronizacion y reconciliacion
- [ ] Pruebas de carga

### Fase 4: Production (Semana 5)
- [ ] Deployment a produccion
- [ ] Monitoreo activo (p95, errores, alertas)
- [ ] Documentacion actualizada
- [ ] Plan de rollback

---

## 4. Checklist de integracion

### Backend HIS
- [ ] Tablas FHIR audit creadas
- [ ] Endpoints FHIR implementados y testeados
- [ ] JWT validation activa
- [ ] Scope enforcement en cada endpoint
- [ ] Error handling FHIR OperationOutcome
- [ ] Logging con correlation-id
- [ ] Rate limiting configurado
- [ ] Cacheo estrategico

### Portal
- [ ] HTTP client setup con JWT
- [ ] Mapeo de componentes a nuevos endpoints
- [ ] Retry logic implementada
- [ ] Error handling e informacion al usuario
- [ ] Trazabilidad con correlation-id
- [ ] Tests de integracion pasando

### DevOps
- [ ] Credenciales JWT en vault
- [ ] Monitoreo de latencia p95/p99
- [ ] Alertas en tasa de error > 1%
- [ ] Backup + plan de recuperacion
- [ ] Documentacion en Confluence/Notion

---

## 5. Contactos y escalamiento

- **HIS Lead**: {TBD}
- **Portal Lead**: {TBD}
- **Integration Lead**: {TBD}
- **On-call**: {TBD}
- **Escalamiento**: Slack channel #integracion-fhir
