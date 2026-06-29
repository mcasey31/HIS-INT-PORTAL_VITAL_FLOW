# Product Brief - Integracion Portal_HIs_VitalFlow (FHIR)

## 1. Resumen ejecutivo
Se define una integracion bidireccional HIS <-> Portal de Pacientes con marco HL7 FHIR R4 para disponibilizar agendas y crear turnos de forma segura.

## 2. Objetivo de producto (MVP)
- Consultar agendas/slots desde HIS usando FHIR.
- Reservar turnos desde Portal creando Appointment en HIS.
- Integrar Centros (sedes) y Lugares de Atencion dentro del contrato.

## 3. Scope funcional
### Incluye
- Consulta de Schedule por filtros (centro, servicio, profesional, rango fecha).
- Consulta de Slot disponibles asociados a Schedule.
- Alta de Appointment desde Portal.
- Consulta de Appointment por id.
- Seguridad JWT + autorizacion por scope.

### No incluye
- Reprogramacion compleja y reglas masivas.
- Notificaciones omnicanal completas.
- Cobertura total de todos los modulos no pacientes.

## 4. Contrato FHIR recomendado (R4)
- GET /fhir/R4/Schedule?actor=PractitionerRole/{id}&service-type={id}&date=ge{from}&date=le{to}
- GET /fhir/R4/Slot?schedule=Schedule/{id}&start=ge{fromTs}&start=lt{toTs}&status=free
- POST /fhir/R4/Appointment
- GET /fhir/R4/Appointment/{id}
- GET /fhir/R4/Location?identifier={centroOrLugarId}

## 5. Modelo de seguridad
- OAuth2 client_credentials con JWT bearer.
- Scopes minimos:
  - fhir.schedule.read
  - fhir.slot.read
  - fhir.appointment.write
  - fhir.appointment.read
  - fhir.location.read
- Validaciones: iss, aud, exp, nbf, jti.

## 6. Requerimientos tecnicos clave
1. HIS mantiene verdad de estado de Appointment.
2. Portal no persiste agenda oficial, solo cache transitoria.
3. Idempotencia por header Idempotency-Key en POST Appointment.
4. Correlation-Id propagado de punta a punta.
5. Manejo de conflictos con HTTP 409 cuando slot ya no esta disponible.

## 7. Criterios de aceptacion
1. Portal lista Slot status=free de agendas validas del HIS.
2. Portal crea Appointment y recibe id HIS + status booked/pending.
3. Centro y lugar de atencion se devuelven como referencias FHIR resolubles.
4. Token invalido o vencido retorna 401/403.
5. Reintento con misma Idempotency-Key no duplica turnos.

## 8. Dependencias
- Alineacion final de mapeo de campos HIS -> FHIR.
- Definicion de codificaciones (servicios, especialidades, estados).
- Ambiente de integracion con issuer JWT confiable.

## 9. Entregables
- DER de integracion FHIR-Relacional.
- Matriz de mapeo de campos HIS/Portal/FHIR.
- OpenAPI/FHIR examples para Schedule/Slot/Appointment/Location.
- Plan de pruebas de contrato y concurrencia.
