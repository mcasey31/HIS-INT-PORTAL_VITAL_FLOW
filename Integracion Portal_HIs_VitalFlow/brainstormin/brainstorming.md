# Brainstorming - Integracion Portal_HIs_VitalFlow (FHIR-first)

## Marco tecnico obligatorio
- Estandar: HL7 FHIR R4.
- Dominio inicial: Portal de Pacientes (solo pacientes).
- Fuente de verdad: HIS para agendas, slots y estado clinico del turno.

## Objetivo del scope 1
- Exponer disponibilidad de agendas del HIS al Portal mediante recursos FHIR.
- Permitir reserva de turno desde Portal con impacto inmediato en HIS.
- Incluir Centros dentro del modelo de integracion (Location/Organization/HealthcareService).

## Recursos FHIR a usar en MVP
- Schedule: agenda profesional/servicio/centro.
- Slot: disponibilidad temporal consumible.
- Appointment: turno reservado por paciente.
- Location: centro y lugar de atencion.
- Practitioner / PractitionerRole: profesional y rol asistencial.
- HealthcareService: servicio asistencial.
- Patient: referencia del paciente.

## Hallazgos reales (HIS)
- Agenda base en sch_agenda.agenda + sch_agenda.bloque_programacion + sch_agenda.cupo.
- Turno paciente en sch_turno.turno_paciente.
- Centros en sch_agenda.centro y servicios en sch_agenda.servicio.
- Lugar de atencion en sch_agenda.lugar_atencion.

## Decisiones tecnicas
1. Publicar facade FHIR en HIS y consumirla desde Portal.
2. Mantener IDs tecnicos de HIS como identifier en FHIR.
3. Usar JWT OAuth2 client_credentials para integracion server-to-server.
4. Idempotencia obligatoria en creacion de Appointment.
5. Correlation-Id obligatorio en cada request.

## Riesgos y mitigacion
- Doble reserva por concurrencia: validacion atomica sobre slot/turno en HIS.
- Divergencia Portal-HIS: reconciliacion periodica y trazabilidad por correlation_id.
- Semantica de centros incompleta: mapear centro + servicio + lugar_atencion a recursos FHIR separados.

## Preguntas para cierre de discovery
1. Se habilita endpoint FHIR nativo o facade FHIR sobre APIs actuales?
2. Que campos de sch_turno.turno_paciente pasan a Appointment.participant y Appointment.reason?
3. Centro se representa como Organization + Location o solo Location en MVP?
4. Se requiere busqueda por geolocalizacion de centros en fase 1?
