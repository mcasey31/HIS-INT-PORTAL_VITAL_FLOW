# Matriz de Mapeo de Campos - HIS/Portal/FHIR (Agendas, Turnos, Centros)

## 1) Agendas (HIS sch_agenda.agenda -> FHIR Schedule)
| HIS tabla.campo | FHIR recurso.campo | Portal destino sugerido | Observacion |
|---|---|---|---|
| agenda.id | Schedule.identifier.value / Schedule.id (facade) | agendaId externo | Mantener id HIS como identificador tecnico |
| agenda.codigo | Schedule.identifier.value (system=codigo-agenda) | code | Codigo funcional de agenda |
| agenda.nombre | Schedule.comment o extension | displayName | FHIR no tiene name nativo en Schedule |
| agenda.estado | Schedule.active (bool) + extension status | status | Mapear ACTIVA/INACTIVA |
| agenda.fecha_desde | Schedule.planningHorizon.start | fromDate | |
| agenda.fecha_hasta | Schedule.planningHorizon.end | toDate | |
| agenda.centro_id | Schedule.actor -> Location/{centroId} | centerId | Centro obligatorio |
| agenda.servicio_id | Schedule.serviceType | specialty/service | Codificar por catalogo |
| agenda.efector_id | Schedule.actor -> PractitionerRole/{efectorId} | professionalId | |
| agenda.tipo_agenda | Schedule.extension(tipoAgenda) | agendaType | PROGRAMADA, etc. |
| agenda.visible_contact_center | Schedule.extension(visibleContactCenter) | visibleInPortal | Reglas de visibilidad |

## 2) Slots (HIS sch_agenda.cupo -> FHIR Slot)
| HIS tabla.campo | FHIR recurso.campo | Portal destino sugerido | Observacion |
|---|---|---|---|
| cupo.id | Slot.identifier.value / Slot.id | slotId | |
| cupo.bloque_id | Slot.schedule | scheduleId | Resolver via bloque->agenda |
| cupo.hora_inicio | Slot.start | startDateTime | UTC/offset consistente |
| cupo.hora_fin | Slot.end | endDateTime | |
| cupo.estado | Slot.status | slotStatus | free, busy, busy-unavailable |
| cupo.capacidad | Slot.extension(capacity) | capacity | FHIR base no trae capacidad |
| cupo.overbooking_permitido | Slot.overbooked o extension(overbookingAllowed) | overbookingAllowed | Definir semantica definitiva |

## 3) Turnos (HIS sch_turno.turno_paciente -> FHIR Appointment)
| HIS tabla.campo | FHIR recurso.campo | Portal destino sugerido | Observacion |
|---|---|---|---|
| turno_paciente.id | Appointment.identifier.value / Appointment.id | hisRef | Identificador principal HIS |
| turno_paciente.paciente_id | Appointment.participant.actor -> Patient/{id} | patientHisId | |
| turno_paciente.profesional | Appointment.participant.actor display | doctorName | Si no hay Practitioner id, usar display |
| turno_paciente.servicio | Appointment.serviceType.text | specialty | Ideal migrar a codificacion |
| turno_paciente.centro | Appointment.participant.actor -> Location display | centerName | Ideal: referencia Location/{id} |
| turno_paciente.fecha_hora | Appointment.start (y end calculado) | date | end desde duracion slot |
| turno_paciente.estado | Appointment.status | status | booked/cancelled/fulfilled/pending |
| turno_paciente.motivo | Appointment.reasonCode.text | reason | |

## 4) Centros y Lugares (HIS -> FHIR Location/Organization)
### 4.1 Centro (sch_agenda.centro)
| HIS tabla.campo | FHIR recurso.campo | Observacion |
|---|---|---|
| centro.id | Location.identifier.value (system=his-centro-id) | ID tecnico |
| centro.nombre | Location.name | |
| centro.direccion | Location.address.text | |
| centro.telefono | Location.telecom[phone] | |
| centro.mail | Location.telecom[email] | |
| centro.activo | Location.status | active/inactive |

### 4.2 Lugar de atencion (sch_agenda.lugar_atencion)
| HIS tabla.campo | FHIR recurso.campo | Observacion |
|---|---|---|
| lugar_atencion.id | Location.identifier.value (system=his-lugar-id) | |
| lugar_atencion.nombre | Location.name | Consultorio/sala |
| lugar_atencion.activo | Location.status | |

## 5) Portal actual y ajustes recomendados
### Prisma Appointment (Portal)
- id -> interno portal
- hisRef -> mapear Appointment.identifier/value HIS
- date -> mapear Appointment.start
- status -> mapear Appointment.status normalizado
- centerId -> mapear Location.id/identifier
- specialty -> mapear Appointment.serviceType
- doctorName -> mapear participant.actor.display

### Prisma MedicalCenter (Portal)
- id/name/address/phone -> mapear desde FHIR Location
- institutionId -> tenancy local portal

## 6) Normalizacion de estados sugerida
| HIS estado | FHIR Appointment.status | Portal status |
|---|---|---|
| PROGRAMADO | booked | confirmed |
| CONFIRMADO | booked | confirmed |
| CANCELADO | cancelled | cancelled |
| EN_ATENCION | arrived/checked-in (extension) | checked-in |
| FINALIZADO | fulfilled | completed |

## 7) Reglas de integracion tecnica
1. HIS es la verdad de Appointment y Slot.
2. Portal reserva con POST Appointment + Idempotency-Key.
3. Si slot ocupado: HTTP 409 con OperationOutcome FHIR.
4. Toda respuesta incluye Correlation-Id (header).
5. JWT con scopes de lectura/escritura FHIR.

## 8) Campos pendientes de cerrar
- Duracion final para Appointment.end (bloque.duracion_turno_minutos vs logica cupo).
- Semantica exacta de overbooking_permitido en Slot.overbooked/extension.
- Definicion definitiva de codigos para servicio/especialidad en CodeableConcept.
