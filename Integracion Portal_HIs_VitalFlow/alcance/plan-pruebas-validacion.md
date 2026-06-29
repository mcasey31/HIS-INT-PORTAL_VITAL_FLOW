# Plan de Pruebas y Validacion - Integracion FHIR v1

## 1. Pruebas de Contrato (Contract Testing)

### 1.1 Escenarios de autenticacion
- [ ] Solicitud sin token -> 401
- [ ] Token vencido -> 401
- [ ] Token con firma invalida -> 401
- [ ] Token sin scope requerido (ej. fhir.appointment.write) -> 403
- [ ] Token valido y scope completo -> 200

### 1.2 Escenarios de lectura (GET Schedule/Slot/Location)
- [ ] Listar Schedule sin filtros -> 200 con resultado completo
- [ ] Listar Schedule por fecha rango valido -> 200 con resultados filtrados
- [ ] Listar Schedule por fecha rango invalido -> 200 con resultado vacio
- [ ] Listar Schedule por centro inexistente -> 200 con resultado vacio (no error)
- [ ] Listar Slot disponibles de Schedule -> 200 solo con status=free
- [ ] Listar Location por tipo=sede -> 200 con Location tipo sede
- [ ] Paginacion: _count=20 y verificar total correcto
- [ ] Paginacion: navegar paginas y verificar no hay duplicados

### 1.3 Escenarios de creacion (POST Appointment)
- [ ] Crear turno con Idempotency-Key nuevas -> 201 Created con id HIS
- [ ] Reintento con misma Idempotency-Key -> 200 OK retorna Appointment existente
- [ ] Slot ocupado por otro turno -> 409 Conflict con OperationOutcome
- [ ] Slot no existe -> 422 Unprocessable Entity
- [ ] Paciente sin identificador -> 422 Validation error
- [ ] Participant sin PractitionerRole -> 422 Validation error
- [ ] start/end no coinciden con Slot -> 422 Validation error
- [ ] Turno exitoso -> correlacion ID HIS y Portal valida

### 1.4 Escenarios de consulta (GET Appointment/{id})
- [ ] Obtener Appointment creado -> 200 con status=booked
- [ ] Obtener Appointment inexistente -> 404 Not Found
- [ ] Correlacion-Id persistida en respuesta

## 2. Pruebas de Concurrencia

### 2.1 Escenario: Dos pacientes compiten por mismo slot
```
Paso 1: Portal-A y Portal-B obtienen mismo Slot (status=free)
Paso 2: Ambos lanzan POST Appointment simultaneamente para el mismo slot
Resultado esperado: 
  - Uno de los dos recibe 201 Created
  - El otro recibe 409 Conflict con mensaje "Slot no disponible"
```

Comando simular:
```bash
# Terminal 1
curl -X POST /fhir/R4/Appointment \
  -H "Authorization: Bearer {token_a}" \
  -H "Idempotency-Key: idempotency-key-uuid-1" \
  -d '{...appointment_payload_a...}'

# Terminal 2 (simultaneamente)
curl -X POST /fhir/R4/Appointment \
  -H "Authorization: Bearer {token_b}" \
  -H "Idempotency-Key: idempotency-key-uuid-2" \
  -d '{...appointment_payload_b...}'
```

### 2.2 Escenario: Retry de Portal con Idempotency-Key
```
Paso 1: Portal envia POST Appointment con Idempotency-Key=X -> 201 Created
Paso 2: Portal no recibe respuesta (timeout simulado)
Paso 3: Portal retenta con misma Idempotency-Key=X -> 200 OK (no duplica)
```

### 2.3 Escenario: Stock de slots bajo presion
```
Slot disponibles: 5
Requests simultaneas: 10
Resultado esperado:
  - 5 solicitudes -> 201 Created
  - 5 solicitudes -> 409 Conflict
```

## 3. Pruebas de desempeño (Performance)

### 3.1 SLA objetivos
| Operacion | p50 | p95 | p99 |
|---|---|---|---|
| GET Schedule (sin filtros) | 100ms | 300ms | 500ms |
| GET Schedule (con filtros) | 150ms | 400ms | 700ms |
| GET Slot (schedule con 100 slots) | 200ms | 500ms | 1000ms |
| POST Appointment (creacion) | 300ms | 800ms | 1500ms |
| GET Appointment (lectura) | 100ms | 250ms | 400ms |
| GET Location (lista) | 150ms | 350ms | 600ms |

### 3.2 Carga de prueba
- Ramp-up: 0 -> 100 usuarios en 2 minutos
- Duracion: 10 minutos
- Ramp-down: 100 -> 0 usuarios en 2 minutos

### 3.3 Escenarios de carga
1. Lectura dominante (80% GET, 20% POST)
2. Balanceado (50% GET, 50% POST)
3. Escritura dominante (20% GET, 80% POST)

## 4. Pruebas de resiliencia

### 4.1 Circuit breaker
- Falla de BD durante 30s -> Endpoint retorna 503 Service Unavailable
- Recuperacion automatica después -> Vuelve a responder 200

### 4.2 Timeout e intentos
- Timeout de BD > 5s -> Endpoint retorna 504 Gateway Timeout
- Portal retenta con backoff exponencial (1s, 2s, 4s)
- Maximo 3 reintentos

### 4.3 Degradacion de servicio
- Si BD lenta pero disponible -> Retorna 200 pero con latencia mayor
- Portal debe tener timeout local (ej. 30s) para no quedar colgado

## 5. Pruebas de integridad de datos

### 5.1 Consistency checks
- [ ] Appointment creado en Portal coincide con turno en HIS
- [ ] Estado de Appointment sincronizado entre sistemas
- [ ] Slot reservado tiene capacity/overbooking consistente
- [ ] Location/centro accesible desde Appointment.participant

### 5.2 Reconciliacion periodica
- Job diario: comparar Appointment Portal vs HIS
- Reportar divergencias por correlation-id
- Alertar si > 1% divergencia

## 6. Pruebas de seguridad

### 6.1 Autenticacion y autorizacion
- [ ] Token JWT manipulado -> 401
- [ ] Token de otro issuer -> 401
- [ ] Token para otra audiencia (aud) -> 401
- [ ] Scope faltante -> 403
- [ ] Scope no es una cadena valida -> 403

### 6.2 Rate limiting
- [ ] 1001 requests en 60s -> Request 1001 retorna 429 Too Many Requests
- [ ] Después 60s, contador reset -> Request nuevamente aceptado

### 6.3 SQL injection / XSS
- [ ] Query parameter con payload malicioso -> Sanitizado, no afecta logica
- [ ] Request JSON con payloads XSS -> Escapado o rechazado

### 6.4 Sensitive data
- [ ] Logs nunca contienen token JWT completo
- [ ] Error messages no exponen detalles internos de BD
- [ ] Correlation-Id + timestamps suficientes para auditoria

## 7. Pruebas de negocio

### 7.1 Reglas de aplicacion
- [ ] Paciente con turno activo no puede reservar otro en mismo horario
- [ ] Especialidad/servicio obligatorio en Schedule
- [ ] Centro/location obligatorio en Appointment
- [ ] Razon del turno es recomendado pero no obligatorio

### 7.2 Visibilidad de agendas
- [ ] Agenda con visible_contact_center=false no aparece en GET Schedule
- [ ] Agenda con visible_contact_center=true aparece

## 8. Matriz de trazabilidad

### 8.1 Correlation-ID
- [ ] Correlation-ID se propaga de Portal -> HIS -> BD
- [ ] Correlation-ID presente en logs y respuestas
- [ ] Portal puede usar Correlation-ID para debugging

### 8.2 Idempotency-Key
- [ ] Almacenado en DB para el turno creado
- [ ] Permite reintento seguro sin duplicacion
- [ ] Expiracion: 24 horas (por defecto)

## 9. Casos de uso end-to-end

### 9.1 Paciente reserva turno desde Portal (Happy path)
1. Portal obtiene Schedules disponibles (GET Schedule) ✓
2. Portal obtiene Slots libres (GET Slot) ✓
3. Portal obtiene informacion de Centro (GET Location) ✓
4. Paciente selecciona Slot y reserva (POST Appointment) ✓
5. Portal recibe confirmacion con ID HIS ✓
6. Portal consulta estado turno (GET Appointment) ✓
7. Turno es visible en HIS ✓

### 9.2 Paciente retenta reserva (Slot ya ocupado)
1. Portal intenta POST Appointment -> 409 Conflict ✓
2. Portal recarga Slots disponibles (GET Slot) ✓
3. Paciente selecciona otro Slot ✓
4. Portal POST Appointment nuevamente -> 201 Created ✓

### 9.3 Sistema se recupera de timeout
1. Portal POST Appointment -> timeout ✓
2. Portal retenta con Idempotency-Key -> 200 OK ✓
3. No se crea turno duplicado ✓

## 10. Checklist de deployment

- [ ] JWT issuer configurado y keys rotadas
- [ ] Rate limiting activado
- [ ] Logs estructurados con correlation-id
- [ ] Monitoreo de latencia p95/p99
- [ ] Alertas en 4xx/5xx > 1%
- [ ] Backup de BD cada hora
- [ ] Plan de rollback en < 5 min
- [ ] Documentacion de endpoints en prod accesible
- [ ] Test de recuperacion ante fallos ejecutado
