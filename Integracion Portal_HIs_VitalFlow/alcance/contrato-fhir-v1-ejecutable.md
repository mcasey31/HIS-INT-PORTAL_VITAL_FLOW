# Contrato FHIR v1 Ejecutable - HIS <-> Portal (Agendas, Turnos, Centros)

## 1. Resumen de endpoints

| HTTP | Endpoint | Descripcion | Scope JWT requerido |
|---|---|---|---|
| GET | /fhir/R4/Schedule | Listar agendas por filtros | fhir.schedule.read |
| GET | /fhir/R4/Slot | Listar slots disponibles | fhir.slot.read |
| POST | /fhir/R4/Appointment | Crear turno (reserva) | fhir.appointment.write |
| GET | /fhir/R4/Appointment/{id} | Obtener estado turno | fhir.appointment.read |
| GET | /fhir/R4/Location | Listar centros/lugares | fhir.location.read |

## 2. Autenticacion y headers obligatorios

### 2.1 JWT Bearer Token (OAuth2 client_credentials)
```
Authorization: Bearer {jwt_token}
```

### Claims JWT minimos
```json
{
  "iss": "https://his.vitalflow.com.ar",
  "aud": "portal-vitalflow",
  "exp": 1718000000,
  "iat": 1717996400,
  "nbf": 1717996400,
  "sub": "portal-client-id",
  "scope": "fhir.schedule.read fhir.slot.read fhir.appointment.write fhir.appointment.read fhir.location.read",
  "jti": "unique-jwt-id-uuid"
}
```

### Headers obligatorios en toda request
```
Authorization: Bearer {jwt_token}
Content-Type: application/fhir+json
Correlation-Id: {uuid}
X-Request-Id: {uuid}
Accept: application/fhir+json
```

### Headers para operaciones de escritura (POST)
```
Idempotency-Key: {uuid}
```

## 3. GET /fhir/R4/Schedule - Listar agendas

### Query parameters
| Parametro | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| actor | reference | No | PractitionerRole/{id} o Practitioner/{id} |
| service-type | token | No | Codigo de servicio/especialidad |
| date | date | No | Fecha exacta o rango: ge{from}&date=le{to} |
| location | reference | No | Location/{id} para filtrar por centro |
| active | boolean | No | active=true (por defecto) |
| _count | integer | No | Elementos por pagina (default 20, max 100) |
| _page | integer | No | Numero de pagina (default 1) |

### Request ejemplo
```http
GET /fhir/R4/Schedule?service-type=cardiologia&date=ge2026-06-10&date=le2026-06-20&location=centro-central&active=true&_count=50
Authorization: Bearer eyJhbGc...
Correlation-Id: 550e8400-e29b-41d4-a716-446655440000
Accept: application/fhir+json
```

### Response 200 OK
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 2,
  "link": [
    {
      "relation": "self",
      "url": "/fhir/R4/Schedule?service-type=cardiologia&date=ge2026-06-10&date=le2026-06-20&_page=1"
    }
  ],
  "entry": [
    {
      "fullUrl": "/fhir/R4/Schedule/agenda-001",
      "resource": {
        "resourceType": "Schedule",
        "id": "agenda-001",
        "identifier": [
          {
            "system": "https://his.vitalflow.com.ar/identifier/agenda",
            "value": "AGENDA-CARDIO-2026-06"
          }
        ],
        "active": true,
        "serviceType": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "261662002",
                "display": "Cardiology"
              }
            ]
          }
        ],
        "actor": [
          {
            "reference": "PractitionerRole/rol-003",
            "display": "Dr. Juan Pérez - Cardiólogo"
          },
          {
            "reference": "Location/centro-central",
            "display": "Centro Ambulatorio Central"
          }
        ],
        "planningHorizon": {
          "start": "2026-06-10T00:00:00-03:00",
          "end": "2026-06-30T23:59:59-03:00"
        },
        "comment": "Agenda de Cardiología",
        "extension": [
          {
            "url": "https://his.vitalflow.com.ar/extension/tipoAgenda",
            "valueString": "PROGRAMADA"
          },
          {
            "url": "https://his.vitalflow.com.ar/extension/visibleContactCenter",
            "valueBoolean": true
          }
        ],
        "created": "2026-06-01T10:30:00Z"
      }
    }
  ]
}
```

## 4. GET /fhir/R4/Slot - Listar slots disponibles

### Query parameters
| Parametro | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| schedule | reference | Si | Schedule/{id} |
| status | token | No | free (default), busy, busy-unavailable |
| start | dateTime | No | Rango: ge{fromTs}&start=lt{toTs} |
| _count | integer | No | Por pagina (default 20, max 100) |

### Request ejemplo
```http
GET /fhir/R4/Slot?schedule=agenda-001&status=free&start=ge2026-06-10T08:00:00&start=lt2026-06-10T18:00:00&_count=50
Authorization: Bearer eyJhbGc...
Correlation-Id: 550e8400-e29b-41d4-a716-446655440001
Accept: application/fhir+json
```

### Response 200 OK
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 8,
  "entry": [
    {
      "fullUrl": "/fhir/R4/Slot/slot-001",
      "resource": {
        "resourceType": "Slot",
        "id": "slot-001",
        "identifier": [
          {
            "system": "https://his.vitalflow.com.ar/identifier/slot",
            "value": "SLOT-AGENDA001-20260610-0800"
          }
        ],
        "schedule": {
          "reference": "Schedule/agenda-001",
          "display": "Agenda Cardiología Dr. Pérez"
        },
        "status": "free",
        "start": "2026-06-10T08:00:00-03:00",
        "end": "2026-06-10T08:30:00-03:00",
        "overbooked": false,
        "extension": [
          {
            "url": "https://his.vitalflow.com.ar/extension/capacity",
            "valueInteger": 1
          },
          {
            "url": "https://his.vitalflow.com.ar/extension/location",
            "valueReference": {
              "reference": "Location/lugar-atencion-001",
              "display": "Consultorio 3"
            }
          }
        ]
      }
    },
    {
      "fullUrl": "/fhir/R4/Slot/slot-002",
      "resource": {
        "resourceType": "Slot",
        "id": "slot-002",
        "identifier": [
          {
            "system": "https://his.vitalflow.com.ar/identifier/slot",
            "value": "SLOT-AGENDA001-20260610-0830"
          }
        ],
        "schedule": {
          "reference": "Schedule/agenda-001"
        },
        "status": "free",
        "start": "2026-06-10T08:30:00-03:00",
        "end": "2026-06-10T09:00:00-03:00",
        "overbooked": false,
        "extension": [
          {
            "url": "https://his.vitalflow.com.ar/extension/capacity",
            "valueInteger": 1
          }
        ]
      }
    }
  ]
}
```

## 5. POST /fhir/R4/Appointment - Crear turno (reserva)

### Request headers
```
Authorization: Bearer {jwt_token}
Content-Type: application/fhir+json
Correlation-Id: {uuid}
Idempotency-Key: {uuid}
Accept: application/fhir+json
```

### Request body
```json
{
  "resourceType": "Appointment",
  "identifier": [
    {
      "system": "https://portal.vitalflow.com.ar/identifier/appointment-external",
      "value": "PORTAL-APT-2026-001234"
    }
  ],
  "status": "booked",
  "participant": [
    {
      "actor": {
        "reference": "Patient/paciente-001",
        "display": "Juan Doe"
      },
      "required": "required",
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "PractitionerRole/rol-003",
        "display": "Dr. Juan Pérez"
      },
      "required": "required",
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "Location/centro-central",
        "display": "Centro Ambulatorio Central"
      },
      "required": "required",
      "status": "accepted"
    }
  ],
  "slot": [
    {
      "reference": "Slot/slot-001"
    }
  ],
  "created": "2026-06-10T14:30:00-03:00",
  "start": "2026-06-10T08:00:00-03:00",
  "end": "2026-06-10T08:30:00-03:00",
  "reason": [
    {
      "text": "Control de tension arterial"
    }
  ],
  "extension": [
    {
      "url": "https://his.vitalflow.com.ar/extension/bookedFrom",
      "valueString": "portal"
    }
  ]
}
```

### Response 201 Created
```json
{
  "resourceType": "Appointment",
  "id": "apt-his-99887",
  "identifier": [
    {
      "system": "https://his.vitalflow.com.ar/identifier/appointment",
      "value": "TURNO-APT-20260610-001"
    },
    {
      "system": "https://portal.vitalflow.com.ar/identifier/appointment-external",
      "value": "PORTAL-APT-2026-001234"
    }
  ],
  "status": "booked",
  "participant": [
    {
      "actor": {
        "reference": "Patient/paciente-001",
        "display": "Juan Doe"
      },
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "PractitionerRole/rol-003",
        "display": "Dr. Juan Pérez"
      },
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "Location/centro-central",
        "display": "Centro Ambulatorio Central"
      },
      "status": "accepted"
    }
  ],
  "slot": [
    {
      "reference": "Slot/slot-001"
    }
  ],
  "created": "2026-06-10T14:30:15-03:00",
  "start": "2026-06-10T08:00:00-03:00",
  "end": "2026-06-10T08:30:00-03:00",
  "reason": [
    {
      "text": "Control de tension arterial"
    }
  ],
  "extension": [
    {
      "url": "https://his.vitalflow.com.ar/extension/bookedFrom",
      "valueString": "portal"
    }
  ],
  "meta": {
    "versionId": "1",
    "lastUpdated": "2026-06-10T17:30:15Z"
  }
}
```

## 6. GET /fhir/R4/Appointment/{id} - Consultar estado turno

### Request ejemplo
```http
GET /fhir/R4/Appointment/apt-his-99887
Authorization: Bearer eyJhbGc...
Correlation-Id: 550e8400-e29b-41d4-a716-446655440002
Accept: application/fhir+json
```

### Response 200 OK
```json
{
  "resourceType": "Appointment",
  "id": "apt-his-99887",
  "identifier": [
    {
      "system": "https://his.vitalflow.com.ar/identifier/appointment",
      "value": "TURNO-APT-20260610-001"
    }
  ],
  "status": "booked",
  "participant": [
    {
      "actor": {
        "reference": "Patient/paciente-001"
      },
      "status": "accepted"
    }
  ],
  "slot": [
    {
      "reference": "Slot/slot-001"
    }
  ],
  "start": "2026-06-10T08:00:00-03:00",
  "end": "2026-06-10T08:30:00-03:00",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2026-06-10T17:30:15Z"
  }
}
```

## 7. GET /fhir/R4/Location - Listar centros y lugares

### Query parameters
| Parametro | Tipo | Obligatorio | Descripcion |
|---|---|---|---|
| type | token | No | Tipo: sede, consultorio, lab, etc. |
| name | string | No | Busqueda por nombre parcial |
| status | token | No | active (default), inactive |
| _count | integer | No | Por pagina (default 20, max 100) |

### Request ejemplo
```http
GET /fhir/R4/Location?type=sede&status=active&_count=50
Authorization: Bearer eyJhbGc...
Correlation-Id: 550e8400-e29b-41d4-a716-446655440003
Accept: application/fhir+json
```

### Response 200 OK
```json
{
  "resourceType": "Bundle",
  "type": "searchset",
  "total": 3,
  "entry": [
    {
      "fullUrl": "/fhir/R4/Location/centro-central",
      "resource": {
        "resourceType": "Location",
        "id": "centro-central",
        "identifier": [
          {
            "system": "https://his.vitalflow.com.ar/identifier/centro",
            "value": "00000000-0000-0000-0000-000000000001"
          }
        ],
        "status": "active",
        "name": "Centro Ambulatorio Central",
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                "code": "CSC",
                "display": "Community Health Center"
              }
            ]
          }
        ],
        "address": {
          "line": ["Av. Rivadavia 1234"],
          "city": "Buenos Aires",
          "postalCode": "1002",
          "country": "AR"
        },
        "telecom": [
          {
            "system": "phone",
            "value": "+54-11-4543-1234",
            "use": "work"
          },
          {
            "system": "email",
            "value": "info@centro-central.com.ar",
            "use": "work"
          }
        ],
        "partOf": {
          "reference": "Organization/institucion-vitalflow"
        }
      }
    },
    {
      "fullUrl": "/fhir/R4/Location/lugar-atencion-001",
      "resource": {
        "resourceType": "Location",
        "id": "lugar-atencion-001",
        "identifier": [
          {
            "system": "https://his.vitalflow.com.ar/identifier/lugar-atencion",
            "value": "00000000-0000-0000-0000-000000000301"
          }
        ],
        "status": "active",
        "name": "Consultorio 3",
        "type": [
          {
            "coding": [
              {
                "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
                "code": "CONSULT",
                "display": "Consultation"
              }
            ]
          }
        ],
        "partOf": {
          "reference": "Location/centro-central"
        }
      }
    }
  ]
}
```

## 8. Matriz de errores - OperationOutcome

### 401 Unauthorized - Token invalido o vencido
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "forbidden",
      "diagnostics": "JWT token is expired or invalid",
      "details": {
        "text": "Provide a valid Bearer token with active expiration"
      }
    }
  ]
}
```

### 403 Forbidden - Scope insuficiente
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "forbidden",
      "diagnostics": "Insufficient permissions for this operation",
      "details": {
        "text": "Required scope: fhir.appointment.write; Current scopes: fhir.appointment.read"
      }
    }
  ]
}
```

### 404 Not Found - Recurso no existe
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "not-found",
      "diagnostics": "Schedule not found",
      "details": {
        "text": "Schedule with id 'invalid-id' does not exist in the system"
      }
    }
  ]
}
```

### 409 Conflict - Slot ocupado
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "conflict",
      "diagnostics": "Slot no longer available",
      "details": {
        "text": "The selected slot (id: slot-001) has been reserved or blocked by another request"
      }
    }
  ]
}
```

### 422 Unprocessable Entity - Validacion de negocio fallida
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "invalid",
      "diagnostics": "Business rule validation failed",
      "expression": "Appointment.reason",
      "details": {
        "text": "Patient already has an active appointment for the same date"
      }
    }
  ]
}
```

### 500 Internal Server Error - Error del servidor
```json
{
  "resourceType": "OperationOutcome",
  "issue": [
    {
      "severity": "error",
      "code": "exception",
      "diagnostics": "Internal server error",
      "details": {
        "text": "An unexpected error occurred. Correlation-Id: 550e8400-e29b-41d4-a716-446655440010"
      }
    }
  ]
}
```

## 9. Reglas de negocio y validaciones

### Creacion de Appointment (POST)
1. Slot debe existir y tener status=free.
2. Paciente no puede tener otro turno en el mismo horario.
3. Idempotency-Key es obligatorio; si se repite, retorna 200 con Appointment existente.
4. Debe incluir al menos: Patient, PractitionerRole, Location en participant.
5. start y end deben coincidir con inicio/fin del Slot.

### Estados permitidos en transiciones
| Estado actual | Estados permitidos | Trigger |
|---|---|---|
| booked | arrived, cancelled, fulfilled | Cambios del HIS |
| arrived | fulfilled, no-show | Cambios del HIS |
| cancelled | -- | Final, no vuelve atras |
| fulfilled | -- | Final |

## 10. Rate limiting
- Limite: 1000 requests por minuto por client_id.
- Header respuesta: X-RateLimit-Remaining

## 11. Timeout y reintentos
- Timeout minimo recomendado: 30 segundos.
- Reintentos solo en errores 5xx (no en 4xx).
- Backoff exponencial: 1s, 2s, 4s (max 3 reintentos).
