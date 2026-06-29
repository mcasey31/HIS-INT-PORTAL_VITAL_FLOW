# Contratos API P1 - Convenios y Facturacion ODI

## Objetivo

Definir contratos tecnicos iniciales para endpoints P1 de la webapp: payload minimo, respuesta esperada, codigos HTTP, validaciones de negocio y trazabilidad de tablas.

Base funcional: matriz HU -> tablas -> endpoints
Referencia: docs/12_matriz_hu_tablas_endpoints.md

## Convenciones

- Formato: JSON.
- Fechas: ISO-8601 UTC.
- IDs: enteros positivos.
- Paginacion listados: page (>=1), pageSize (1..200).
- Error estandar:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Descripcion legible",
  "details": [
    { "field": "nombreCampo", "issue": "motivo" }
  ],
  "traceId": "uuid"
}
```

## 1) Convenios

### GET /api/v1/convenios

- HU: 6461
- Tablas: sch_convenios.t_convenios, sch_convenios.t_convenios_planes, sch_convenios.t_convenios_prestadores

Query params:

```json
{
  "page": 1,
  "pageSize": 20,
  "search": "texto",
  "estado": "ACTIVO",
  "idPrestador": 123,
  "idFinanciador": 45
}
```

Response 200:

```json
{
  "items": [
    {
      "id": 6459,
      "codigo": "CONV-001",
      "nombre": "Convenio Principal",
      "estado": "ACTIVO",
      "idFinanciador": 45,
      "cantidadPlanes": 3,
      "cantidadPrestadores": 12,
      "vigenciaDesde": "2026-01-01T00:00:00Z",
      "vigenciaHasta": null
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

Validaciones clave:

- page y pageSize obligatorios si se envian.
- estado en catalogo permitido.

### POST /api/v1/convenios

- HU: 6462
- Tablas: sch_convenios.t_convenios, sch_convenios.tm_tipos_convenios

Request:

```json
{
  "codigo": "CONV-002",
  "nombre": "Convenio Nuevo",
  "idTipoConvenio": 2,
  "idFinanciador": 45,
  "vigenciaDesde": "2026-07-01T00:00:00Z",
  "vigenciaHasta": null,
  "observaciones": "Texto opcional"
}
```

Response 201:

```json
{
  "id": 70001,
  "codigo": "CONV-002",
  "estado": "ACTIVO",
  "createdAt": "2026-06-06T18:00:00Z"
}
```

Validaciones clave:

- codigo unico.
- vigenciaHasta >= vigenciaDesde si viene informado.
- idTipoConvenio e idFinanciador existentes.

### PUT /api/v1/convenios/{id}

- HU: 6463

Request:

```json
{
  "nombre": "Convenio Actualizado",
  "idTipoConvenio": 2,
  "idFinanciador": 45,
  "vigenciaDesde": "2026-07-01T00:00:00Z",
  "vigenciaHasta": null,
  "observaciones": "Actualizacion"
}
```

Response 200:

```json
{
  "id": 70001,
  "updatedAt": "2026-06-06T18:10:00Z"
}
```

### PATCH /api/v1/convenios/{id}/estado

- HU: 6464

Request:

```json
{
  "estado": "INACTIVO",
  "motivo": "Baja operativa"
}
```

Response 200:

```json
{
  "id": 70001,
  "estado": "INACTIVO",
  "updatedAt": "2026-06-06T18:15:00Z"
}
```

Validaciones clave:

- transicion de estado valida.
- motivo obligatorio para INACTIVO.

## 2) Prestadores

### GET /api/v1/prestadores

- HU: 5917
- Tablas: sch_convenios.t_prestadores, sch_convenios.t_sociedades_prestadores

Response 200:

```json
{
  "items": [
    {
      "id": 101,
      "codigo": "PR-101",
      "razonSocial": "Prestador Uno",
      "estado": "ACTIVO",
      "cuit": "30701234567"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### POST /api/v1/prestadores

- HU: 5916

Request:

```json
{
  "codigo": "PR-102",
  "razonSocial": "Prestador Dos",
  "cuit": "30700000001",
  "idSociedad": 33,
  "domicilio": {
    "calle": "Siempre Viva",
    "numero": "123",
    "localidad": "CABA",
    "provincia": "Buenos Aires"
  }
}
```

Response 201:

```json
{
  "id": 102,
  "estado": "ACTIVO",
  "createdAt": "2026-06-06T18:20:00Z"
}
```

Validaciones clave:

- cuit formato y unicidad.
- idSociedad existente.

### PUT /api/v1/prestadores/{id}

- HU: 5919

Request:

```json
{
  "razonSocial": "Prestador Dos SA",
  "idSociedad": 34
}
```

Response 200:

```json
{
  "id": 102,
  "updatedAt": "2026-06-06T18:25:00Z"
}
```

### PATCH /api/v1/prestadores/{id}/estado

- HU: 5918

Request:

```json
{
  "estado": "INACTIVO",
  "motivo": "Baja administrativa"
}
```

Response 200:

```json
{
  "id": 102,
  "estado": "INACTIVO"
}
```

## 3) Tarifarios

### GET /api/v1/tarifarios

- HU: 6479
- Tablas: sch_convenios.t_tarifarios, sch_convenios.t_catalogos

Response 200:

```json
{
  "items": [
    {
      "id": 500,
      "nombre": "Tarifario Ambulatorio",
      "idCatalogo": 20,
      "estado": "ACTIVO",
      "vigenciaDesde": "2026-01-01T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### POST /api/v1/tarifarios

- HU: 6480

Request:

```json
{
  "nombre": "Tarifario Nuevo",
  "idCatalogo": 20,
  "vigenciaDesde": "2026-07-01T00:00:00Z"
}
```

Response 201:

```json
{
  "id": 501,
  "estado": "ACTIVO"
}
```

### PUT /api/v1/tarifarios/{id}

- HU: 6481

Request:

```json
{
  "nombre": "Tarifario Nuevo v2",
  "vigenciaHasta": "2026-12-31T00:00:00Z"
}
```

Response 200:

```json
{
  "id": 501,
  "updatedAt": "2026-06-06T18:30:00Z"
}
```

### GET /api/v1/tarifarios/{id}/prestaciones

- HU: 11206
- Tablas: sch_convenios.t_tarifarios_prestaciones_catalogos, sch_convenios.t_prestaciones_catalogos

Response 200:

```json
{
  "tarifarioId": 501,
  "items": [
    {
      "idPrestacionCatalogo": 9001,
      "codigoPrestacion": "ABC123",
      "descripcion": "Consulta",
      "valor": 12345.67,
      "vigenciaDesde": "2026-07-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

## 4) Prefacturas

### GET /api/v1/prefacturas

- HU: 6263, 6262
- Tablas: sch_facturador.t_prefacturas, sch_facturador.tm_prefacturas_estados

Response 200:

```json
{
  "items": [
    {
      "id": 8001,
      "estado": "PENDIENTE",
      "idConvenio": 70001,
      "idPrestador": 102,
      "periodo": "2026-06",
      "total": 456789.10
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### GET /api/v1/prefacturas/{id}

- HU: 6265
- Tablas: sch_facturador.t_prefacturas, sch_facturador.t_prefacturas_conceptos

Response 200:

```json
{
  "id": 8001,
  "estado": "PENDIENTE",
  "conceptos": [
    {
      "idConceptoFacturable": 300,
      "descripcion": "Practica A",
      "cantidad": 3,
      "monto": 1000.0
    }
  ]
}
```

### POST /api/v1/prefacturas/procesar

- HU: 6256
- Tablas: sch_facturador.t_episodios_procesados, sch_facturador.t_prefacturas, sch_facturador.t_procesamientos

Request:

```json
{
  "idEpisodio": 123456,
  "idConvenio": 70001,
  "idPrestador": 102,
  "periodo": "2026-06"
}
```

Response 202:

```json
{
  "jobId": 99001,
  "estado": "EN_PROCESO"
}
```

Validaciones clave:

- episodio existente y procesable.
- convenio/prestador compatibles.

### POST /api/v1/prefacturas/procesamientos

- HU: 8424

Request:

```json
{
  "idPrefactura": 8001,
  "accion": "REPROCESAR"
}
```

Response 202:

```json
{
  "jobId": 99002,
  "estado": "EN_PROCESO"
}
```

### PATCH /api/v1/prefacturas/{id}

- HU: 6445

Request:

```json
{
  "comentario": "Ajuste manual",
  "conceptos": [
    {
      "idConceptoFacturable": 300,
      "cantidad": 4,
      "monto": 1200.0
    }
  ]
}
```

Response 200:

```json
{
  "id": 8001,
  "updatedAt": "2026-06-06T18:40:00Z"
}
```

## 5) Facturas

### GET /api/v1/facturas

- HU: 6453, 6452
- Tablas: sch_facturador.t_facturas, sch_facturador.tm_estados_facturas

Response 200:

```json
{
  "items": [
    {
      "id": 9001,
      "numero": "F0001-00001234",
      "estado": "EMITIDA",
      "idPrestador": 102,
      "total": 789123.45,
      "fechaEmision": "2026-06-06T00:00:00Z"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

### POST /api/v1/facturas

- HU: 6447
- Tablas: sch_facturador.t_facturas, sch_facturador.t_facturas_prefacturas, sch_facturador.t_prefacturas

Request:

```json
{
  "idPrestador": 102,
  "idFinanciador": 45,
  "periodo": "2026-06",
  "prefacturas": [8001, 8002],
  "observaciones": "Generacion mensual"
}
```

Response 201:

```json
{
  "id": 9001,
  "numero": "F0001-00001234",
  "estado": "EMITIDA"
}
```

Validaciones clave:

- prefacturas en estado facturable.
- prefacturas del mismo prestador/financiador/periodo.

### GET /api/v1/facturas/{id}

- HU: 11251
- Tablas: sch_facturador.t_facturas, sch_facturador.t_detalle_factura, sch_facturador.t_facturas_estado_factura

Response 200:

```json
{
  "id": 9001,
  "numero": "F0001-00001234",
  "estadoActual": "EMITIDA",
  "historialEstados": [
    { "estado": "BORRADOR", "fecha": "2026-06-06T17:00:00Z" },
    { "estado": "EMITIDA", "fecha": "2026-06-06T18:00:00Z" }
  ],
  "detalles": [
    {
      "idConceptoFacturable": 300,
      "descripcion": "Practica A",
      "cantidad": 10,
      "monto": 10000.0
    }
  ]
}
```

### PATCH /api/v1/facturas/{id}

- HU: 7757

Request:

```json
{
  "observaciones": "Correccion cabecera"
}
```

Response 200:

```json
{
  "id": 9001,
  "updatedAt": "2026-06-06T18:50:00Z"
}
```

### POST /api/v1/facturas/{id}/anulacion

- HU: 6455

Request:

```json
{
  "motivo": "Error de composicion",
  "anuladaPor": "usuario"
}
```

Response 200:

```json
{
  "id": 9001,
  "estado": "ANULADA",
  "updatedAt": "2026-06-06T19:00:00Z"
}
```

Validaciones clave:

- no permitir anular factura cobrada.
- registrar historial de estado.

## Endpoint transversal obligatorio

### GET /api/v1/auditoria/eventos

- Tablas: sch_auditoria.*
- Uso: trazabilidad de mutaciones P1.

Response 200:

```json
{
  "items": [
    {
      "id": 1,
      "entidad": "factura",
      "entidadId": 9001,
      "accion": "ANULACION",
      "actor": "usuario",
      "fecha": "2026-06-06T19:00:00Z"
    }
  ],
  "total": 1
}
```

## Checklist tecnico de salida P1

1. Validaciones de integridad cruzada con convenio/prestador/estado.
2. Manejo de concurrencia optimista en mutaciones (version o updatedAt).
3. Auditoria de cada alta/edicion/cambio de estado.
4. Errores normalizados con traceId.
5. Tests de contrato por endpoint y pruebas de estados invalidos.
