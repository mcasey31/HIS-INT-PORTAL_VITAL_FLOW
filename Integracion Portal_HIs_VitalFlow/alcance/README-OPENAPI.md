# OpenAPI 3.0 - Guía de Uso

## Archivo: `openapi-3.0-fhir-r4.yaml`

Especificación **OpenAPI 3.0** completa de la API FHIR R4 para integración HIS <-> Portal.

---

## Cómo usar este archivo

### 1. Con Swagger UI (Interactivo)

#### Opción A: Online en Swagger Editor
```
https://editor.swagger.io
```
- Copiar contenido de `openapi-3.0-fhir-r4.yaml` en el editor left panel
- Ver documentación + ejemplos en real-time en el right panel

#### Opción B: Swagger UI local con Docker
```bash
docker run -p 80:8080 \
  -e SWAGGER_JSON=/fhir-spec.yaml \
  -v $(pwd)/openapi-3.0-fhir-r4.yaml:/fhir-spec.yaml \
  swaggerapi/swagger-ui
```
Acceder a: `http://localhost:80`

#### Opción C: Node.js
```bash
npm install -g swagger-ui-express
npm start  # sirve en http://localhost:3000
```

---

### 2. Con Postman

#### Importar especificación
1. Abrir Postman
2. Collections → Import → Link
3. Pegar URL o subir archivo `openapi-3.0-fhir-r4.yaml`
4. Auto-genera colección de requests con parámetros

---

### 3. Con ReDoc (Documentación hermosa)

#### Online
```bash
npm install -g redoc-cli
redoc-serve openapi-3.0-fhir-r4.yaml
```
Acceder a: `http://localhost:8081`

---

### 4. Code Generation (Backend/SDK)

#### TypeScript (NestJS/Express)
```bash
npm install -g @openapitools/openapi-generator-cli

openapi-generator-cli generate \
  -i openapi-3.0-fhir-r4.yaml \
  -g typescript-axios \
  -o ./generated/typescript-client
```

#### C# (.NET)
```bash
openapi-generator-cli generate \
  -i openapi-3.0-fhir-r4.yaml \
  -g csharp \
  -o ./generated/csharp-client
```

#### Python (FastAPI)
```bash
openapi-generator-cli generate \
  -i openapi-3.0-fhir-r4.yaml \
  -g python-fastapi \
  -o ./generated/python-server
```

#### Go
```bash
openapi-generator-cli generate \
  -i openapi-3.0-fhir-r4.yaml \
  -g go-server \
  -o ./generated/go-server
```

---

## Contenido de la especificación

### 📌 Endpoints definidos

| HTTP | Endpoint | Scopes | Estado |
|------|----------|--------|--------|
| GET | `/fhir/R4/Schedule` | `fhir.schedule.read` | ✅ Completo |
| GET | `/fhir/R4/Slot` | `fhir.slot.read` | ✅ Completo |
| POST | `/fhir/R4/Appointment` | `fhir.appointment.write` | ✅ Completo |
| GET | `/fhir/R4/Appointment/{id}` | `fhir.appointment.read` | ✅ Completo |
| GET | `/fhir/R4/Location` | `fhir.location.read` | ✅ Completo |

### 🔐 Autenticación

**Tipo:** OAuth2 client_credentials con JWT Bearer

**Headers requeridos:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/fhir+json
Correlation-Id: {uuid}
Idempotency-Key: {uuid}  # Solo para POST
Accept: application/fhir+json
```

**Scopes disponibles:**
- `fhir.schedule.read` - Lectura agendas
- `fhir.slot.read` - Lectura cupos
- `fhir.appointment.write` - Crear turnos
- `fhir.appointment.read` - Leer turnos
- `fhir.location.read` - Leer centros/lugares

### 📊 Esquemas FHIR R4 incluidos

- **Bundle** (searchset con paginación)
- **Schedule** (agendas con planningHorizon)
- **Slot** (cupos con status: free/busy/busy-unavailable)
- **Appointment** (turnos con 3+ participantes: patient + practitioner + location)
- **Location** (centros con hierarchy via partOf)
- **OperationOutcome** (error standard FHIR)
- **Identifier, Reference, CodeableConcept, Period, Extension** (core FHIR types)

### 🚨 Códigos de error

| HTTP | Caso | OperationOutcome.code |
|------|------|---|
| 401 | Token expirado/inválido | `forbidden` |
| 403 | Scope insuficiente | `forbidden` |
| 404 | Recurso no encontrado | `not-found` |
| 409 | Slot ocupado (concurrencia) | `conflict` |
| 422 | Validación de negocio fallida | `invalid` |
| 500 | Error interno | `exception` |

---

## Validación de la especificación

### Herramienta: Swagger CLI
```bash
npm install -g @apidevtools/swagger-cli

swagger-cli validate openapi-3.0-fhir-r4.yaml
```

**Output esperado:**
```
✓ Valid!
```

---

## Integración con VCS/CI-CD

### GitHub Actions (validar en cada commit)
```yaml
# .github/workflows/validate-openapi.yml
name: Validate OpenAPI

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate OpenAPI
        run: |
          npm install -g @apidevtools/swagger-cli
          swagger-cli validate alcance/openapi-3.0-fhir-r4.yaml
```

### Generate docs on build
```bash
# Dentro de CI/CD pipeline
redoc-cli bundle openapi-3.0-fhir-r4.yaml -o docs/api-reference.html
```

---

## Publicar especificación

### Opción 1: Archivo estático en docs
```
docs/
├── api-reference.html  (ReDoc bundle)
├── api-swagger-ui.html (Swagger UI bundle)
└── openapi-3.0-fhir-r4.yaml (raw spec)
```

### Opción 2: Portal de API (APIs.guru, SwaggerHub, etc.)
1. Ir a https://app.swaggerhub.com/
2. Create new API
3. Importar `openapi-3.0-fhir-r4.yaml`
4. Compartir URL pública

### Opción 3: Servidor OpenAPI dedicado
```bash
npm install -g @asyncapi/studio
# o
docker run -p 3000:3000 stoplight/prism:latest mock openapi-3.0-fhir-r4.yaml
```

---

## Testing con la especificación

### 1. Contract Testing (Dredd)
```bash
npm install -g dredd

dredd openapi-3.0-fhir-r4.yaml \
  http://localhost:3000/api \
  --server http://localhost:3000/api
```

### 2. Load Testing (k6)
```javascript
// load-test-fhir.js
import http from 'k6/http';

export default function() {
  // Usar endpoints definidos en spec
  http.get('http://his.local/api/fhir/R4/Schedule?_count=50');
}
```

```bash
k6 run load-test-fhir.js
```

### 3. Postman Collections (auto-generated tests)
```bash
npm install -g postman-cli

postman-cli run openapi-3.0-fhir-r4.yaml \
  --environment production.postman_environment.json
```

---

## Versioning y mantenimiento

### Cuando actualizar
- Nueva versión HIS backend
- Cambio en modelo FHIR
- Nuevo endpoint
- Cambio en scope de seguridad
- Actualización a OpenAPI 3.1

### Proceso de actualización
1. Editar `openapi-3.0-fhir-r4.yaml`
2. Validar con `swagger-cli validate`
3. Generar changelog (diff de endpoints/schemas)
4. Publicar nueva versión (versionado semántico)
5. Regenerar SDKs/documentación

### Versionado de API
```yaml
info:
  title: VitalFlow HIS - FHIR R4 Integration API
  version: 1.0.0  # MAJOR.MINOR.PATCH
  
servers:
  - url: https://his.vitalflow.com.ar/api/v1
    description: Production v1
  - url: https://his.vitalflow.com.ar/api/v2
    description: Production v2 (upcoming)
```

---

## Troubleshooting

### Error: "Schema is invalid"
```
Solución: Ejecutar `swagger-cli validate` para encontrar línea exacta del error
```

### Error: "Invalid reference"
```
Solución: Verificar que $ref apunta a componentes existentes bajo #/components/schemas
```

### Error: "Security scheme not found"
```
Solución: Verificar securitySchemes bajo components y que security[] referencia nombres correctos
```

---

## Próximos pasos

1. **Implementar backend HIS** usando esta spec
2. **Generar SDK** para Portal en TypeScript
3. **Publicar documentación** en portal interno
4. **Configurar mocking** con Prism para testing paralelo
5. **Setup CI/CD** para validación automática

---

## Referencias

- **OpenAPI 3.0 Spec:** https://spec.openapis.org/oas/v3.0.3
- **FHIR R4 Spec:** https://www.hl7.org/fhir/R4/
- **Swagger Tools:** https://swagger.io/tools
- **API Design Best Practices:** https://swagger.io/resources/articles/best-practices-in-api-design

---

**Archivo:** `openapi-3.0-fhir-r4.yaml`  
**Version:** 1.0.0  
**Last Updated:** 2026-06-10  
**Status:** Production Ready ✅
