# Indice de Documentación - Integracion Portal_HIs_VitalFlow (FHIR)

## Bienvenida
Proyecto de integración bidireccional **HIS <-> Portal de Pacientes** usando **HL7 FHIR R4** como marco técnico estándar. Scope 1: Agendas, Turnos y Centros (Portal Pacientes).

---

## Documentos entregados

### 📋 **Alcance y Planificación**

#### 1. [Brainstorming](brainstorming.md)
- Objetivo general del proyecto
- Recursos FHIR a usar (Schedule, Slot, Appointment, Location, PractitionerRole, HealthcareService)
- Hallazgos reales del HIS (tablas sch_agenda.*, sch_turno.*)
- Decisiones técnicas (facade FHIR, JWT OAuth2, idempotencia, correlation-id)
- Riesgos y preguntas de discovery
- **Leer primero**: Para entender el contexto completo

#### 2. [Product Brief](product-brief.md)
- Resumen ejecutivo (1 página)
- Objetivo de producto (MVP)
- Scope funcional (incluye/no incluye)
- Contrato FHIR recomendado (endpoints v1)
- Modelo de seguridad (OAuth2 + JWT + scopes)
- Requerimientos técnicos clave
- Criterios de aceptación
- **Leer segundo**: Para validar scope y objetivos

#### 3. [DER de Integracion FHIR-Relacional](der-integracion-agendas.md)
- Mapeo de entidades HIS -> FHIR R4
- Fuentes analizadas (HIS y Portal)
- Campos críticos para integración
- Reglas de integración
- **Diagrama Mermaid** con ER completo (CENTRO -> AGENDA -> CUPO -> TURNO)
- Endpoints facade sugeridos
- **Consultar**: Para entender estructura de datos

#### 4. [Matriz de Mapeo de Campos HIS/Portal/FHIR](mapeo-fhir-campos-his-portal.md)
- **Tabla 1**: sch_agenda.agenda -> FHIR Schedule (campos concretos)
- **Tabla 2**: sch_agenda.cupo -> FHIR Slot
- **Tabla 3**: sch_turno.turno_paciente -> FHIR Appointment
- **Tabla 4**: sch_agenda.centro/lugar_atencion -> FHIR Location
- **Tabla 5**: Ajustes en prisma Appointment/MedicalCenter
- **Tabla 6**: Normalizacion de estados HIS -> FHIR -> Portal
- Reglas de integración técnica
- Campos pendientes de cerrar
- **Referencia**: Para mapeo campo a campo en desarrollo

---

### 🔧 **Especificación Técnica Ejecutable**

#### 5. [Contrato FHIR v1 Ejecutable](contrato-fhir-v1-ejecutable.md)
- **Tabla de endpoints** (GET Schedule, GET Slot, POST Appointment, GET Appointment, GET Location)
- Autenticacion (JWT Bearer + claims minimos)
- Headers obligatorios (Authorization, Correlation-Id, Idempotency-Key, Content-Type)
- **5 secciones completas con ejemplos**:
  - GET /fhir/R4/Schedule (query params, request, response 200)
  - GET /fhir/R4/Slot (query params, request, response 200 con 8 slots)
  - POST /fhir/R4/Appointment (request body, response 201)
  - GET /fhir/R4/Appointment/{id} (request, response 200)
  - GET /fhir/R4/Location (request, response 200 con centros/lugares)
- **Matriz de errores** (401, 403, 404, 409, 422, 500 con OperationOutcome FHIR)
- Reglas de negocio y validaciones
- Rate limiting y timeout
- **Usar**: Para desarrollo backend HIS y cliente Portal

---

### ✅ **Plan de Pruebas y Validacion**

#### 6. [Plan de Pruebas y Validacion](plan-pruebas-validacion.md)
- **Pruebas de contrato** (autenticacion, lectura, escritura, errores)
- **Pruebas de concurrencia** (compra de slot, retry con idempotency-key, stock bajo presion)
- **Pruebas de desempeño** (SLA: p50/p95/p99 por operacion, carga, stress)
- **Pruebas de resiliencia** (circuit breaker, timeout, degradacion)
- **Pruebas de integridad** (consistency checks, reconciliacion, divergencias)
- **Pruebas de seguridad** (autenticacion, autorizacion, rate limiting, inyecciones)
- **Pruebas de negocio** (reglas de aplicacion, visibilidad de agendas)
- **Matriz de trazabilidad** (Correlation-ID, Idempotency-Key)
- **Casos de uso end-to-end** (happy path, retry, recuperacion)
- **Checklist de deployment**
- **Usar**: Para QA/testing y deployment

---

### 🛠️ **Guias de Implementacion**

#### 7. [Guias de Implementacion - Backend HIS y Portal](guias-implementacion-backend-portal.md)
- **Backend HIS**:
  - Stack recomendado (.NET 6+ o Node.js 18+)
  - Estructura de carpetas (controllers, services, mappers, repositories)
  - Nueva tabla sch_fhir.integration_audit (SQL)
  - **Lista de implementacion**: 5 endpoints (GET Schedule, GET Slot, POST Appointment, GET Appointment, GET Location)
  - Pseudocodigo del flujo crítico: createAppointment (validacion + transaccion + lock)
- **Frontend Portal**:
  - Stack recomendado (Next.js 13+)
  - Cambios en componentes (AppointmentFlow.tsx)
  - Middleware de JWT y retry logic
  - Nuevas variables de entorno
  - Migracion Prisma (campos hisRef, correlationId, idempotencyKey)
- **Plan de rollout** (4 fases, 5 semanas)
- **Checklist de integracion** (HIS, Portal, DevOps)
- **Contactos y escalamiento**
- **Usar**: Para developers antes de arrancar a codificar

---

### 🔧 **Especificación OpenAPI 3.0**

#### 8. [OpenAPI 3.0 - FHIR R4](openapi-3.0-fhir-r4.yaml)
- **Formato:** YAML estándar OpenAPI 3.0.3
- **Contenido**:
  - 5 endpoints FHIR completamente documentados
  - Schemas FHIR R4 (Schedule, Slot, Appointment, Location, OperationOutcome)
  - OAuth2 client_credentials security scheme
  - 5 scopes JWT (fhir.schedule.read, fhir.slot.read, fhir.appointment.write, fhir.appointment.read, fhir.location.read)
  - Query parameters con descripciones
  - Request/response ejemplos en JSON
  - Matriz de errores (401, 403, 404, 409, 422, 500)
  - Referencias correctas entre recursos FHIR
- **Validación:** Cumple spec OpenAPI 3.0.3 (validable con `swagger-cli validate`)
- **Generación de SDKs:** Soporta TypeScript, C#, Python, Go, Java
- **Uso**: Swagger UI, Postman, ReDoc, code generation, contract testing
- **Leer junto con**: [README-OPENAPI.md](#readme-openapi)

#### 9. [README-OPENAPI.md](README-OPENAPI.md)
- **Guía de uso** del archivo OpenAPI
- **Herramientas soportadas**:
  - Swagger UI (online, Docker, local)
  - Postman (importar spec)
  - ReDoc (documentación hermosa)
  - Code generators (NestJS, .NET, Python, Go)
  - Contract testing (Dredd, k6)
- **Generación de código** para 4 lenguajes
- **Validación** automática
- **CI/CD integration** (GitHub Actions, etc.)
- **Publicación** (APIs.guru, SwaggerHub, portal interno)
- **Troubleshooting** común
- **Usar**: Antes de consumir/generar código desde la spec

---

## Cómo navegar este proyecto

### 👤 Para **Project Manager / Stakeholder**
1. Lee [Product Brief](product-brief.md) (5 min)
2. Revisa diagrama en [DER de Integracion FHIR-Relacional](der-integracion-agendas.md) (3 min)
3. Consulta [Plan de rollout](guias-implementacion-backend-portal.md#3-plan-de-rollout) en guias (2 min)

### 👨‍💻 Para **Backend HIS Developer**
1. Lee [Brainstorming](brainstorming.md) para contexto (10 min)
2. Consulta [Contrato FHIR v1 Ejecutable](contrato-fhir-v1-ejecutable.md) para endpoints (15 min)
3. Sigue [Guias de Implementacion - Backend HIS](guias-implementacion-backend-portal.md#1-implementacion-backend-his---fachada-fhir) (20 min)
4. Usa [Matriz de Mapeo](mapeo-fhir-campos-his-portal.md) como referencia durante coding (constante)
5. Valida con [Plan de Pruebas](plan-pruebas-validacion.md) (10 min)

### 👨‍💻 Para **Portal Frontend/Backend Developer**
1. Lee [Product Brief](product-brief.md) (5 min)
2. Consulta [Contrato FHIR v1 Ejecutable](contrato-fhir-v1-ejecutable.md) - secciones de request/response (10 min)
3. Sigue [Guias de Implementacion - Portal](guias-implementacion-backend-portal.md#2-implementacion-frontend-portal) (20 min)
4. Implementa retry logic y error handling (10 min)
5. Valida tests de integracion en [Plan de Pruebas](plan-pruebas-validacion.md) (5 min)

### 🧪 Para **QA / Test Engineer**
1. Consulta [Plan de Pruebas y Validacion](plan-pruebas-validacion.md) (30 min)
2. Usa [Contrato FHIR v1 Ejecutable](contrato-fhir-v1-ejecutable.md) para ejemplos de request/response (15 min)
3. Diseña casos de test en paralelo a desarrollo

### 🚀 Para **DevOps / SRE**
1. Consulta "Checklist de deployment" en [Guias](guias-implementacion-backend-portal.md#5-contactos-y-escalamiento) (5 min)
2. Revisa [Plan de Pruebas - Resiliencia](plan-pruebas-validacion.md#4-pruebas-de-resiliencia) (10 min)
3. Setup JWT issuer, rate limiting, monitoreo (antes de go-live)

---

## Resumen ejecutivo de la entrega

| Aspecto | Estado | Detalle |
|---|---|---|
| **Framework** | ✅ Definido | HL7 FHIR R4 |
| **Endpoints** | ✅ Especificados | 5 endpoints con ejemplos concretos |
| **OpenAPI 3.0** | ✅ Generada | YAML con schemas, security, ejemplos completos |
| **Seguridad** | ✅ Diseñada | OAuth2 + JWT + scopes + Idempotency-Key |
| **Mapeo campos** | ✅ Mapeado | HIS sch_agenda.* -> FHIR Schedule/Slot/Appointment |
| **Centros** | ✅ Incluido | Location FHIR para sede + consultorio |
| **Concurrencia** | ✅ Solucionada | Lock optimista + transaccion atomica |
| **Pruebas** | ✅ Planificadas | Contract, concurrencia, carga, resiliencia |
| **Implementacion** | ✅ Guiada | Backend HIS + Portal con pseudocodigo |
| **Rollout** | ✅ Planeado | 4 fases en 5 semanas |
| **SDKs** | ✅ Generables | TypeScript, C#, Python, Go (desde OpenAPI) |

---

## Proximos pasos

### Para equipo Backend HIS
1. **Review** de [OpenAPI 3.0](openapi-3.0-fhir-r4.yaml) con arquitecto
2. **Generar SDK** en lenguaje backend (C# o Node.js):
   ```bash
   openapi-generator-cli generate -i openapi-3.0-fhir-r4.yaml -g {csharp|typescript-axios}
   ```
3. **Implementar** endpoints (Schedule → Slot → Appointment en paralelo)
4. **Validar** especificación contra implementación:
   ```bash
   swagger-cli validate openapi-3.0-fhir-r4.yaml
   ```
5. **Testing** con Postman collection (auto-generada de OpenAPI)

### Para equipo Portal
1. **Visualizar** spec con Swagger UI:
   - Online: copiar contenido en https://editor.swagger.io
   - Local: `docker run -p 80:8080 -e SWAGGER_JSON=/spec.yaml -v $(pwd)/openapi-3.0-fhir-r4.yaml:/spec.yaml swaggerapi/swagger-ui`
2. **Generar SDK** TypeScript:
   ```bash
   openapi-generator-cli generate -i openapi-3.0-fhir-r4.yaml -g typescript-axios -o ./generated/his-client
   ```
3. **Implementar** client wrapper con JWT + Correlation-Id
4. **Tests** con requests del [README-OPENAPI.md](README-OPENAPI.md)

### Para equipo QA
1. **Setup** Postman collection desde OpenAPI
2. **Contract testing** con Dredd (valida contra spec)
3. **Load testing** usando endpoints de spec
4. **Validar** OperationOutcome en todos los 6 escenarios de error

### Para equipo DevOps
1. **CI/CD pipeline** para validar OpenAPI en cada commit:
   ```yaml
   - npm install -g @apidevtools/swagger-cli
   - swagger-cli validate openapi-3.0-fhir-r4.yaml
   ```
2. **Generar documentación** automática (ReDoc bundle)
3. **Publicar** spec en portal interno o APIs.guru

---

## Versionado

- **Version**: 1.0 (MVP scope)
- **Fecha**: 2026-06-10
- **Marco**: HL7 FHIR R4
- **Status**: Listo para desarrollo
- **Próxima revisión**: Post-MVP (fase 2 con notificaciones, reconciliacion, etc.)

---

## Soporte y preguntas

Para dudas o clarificaciones, consultar:
- Documentos de referencia en esta carpeta (`/alcance/`)
- DER Mermaid para estructura de datos
- Matriz de mapeo para campos concretos
- Contrato FHIR para ejemplos de API

**¡Listo para arrancar desarrollo!** 🚀
