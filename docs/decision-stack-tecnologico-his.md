# Decision de Stack Tecnologico - HIS

## Objetivo
Documentar la decision tecnica de lenguajes y base de datos para el desarrollo del HIS, alineado con separacion FRONT/BACK/DB y estandar HL7 FHIR R4.

## Decision final recomendada
1. BACK: C# con .NET 8 Web API
2. FRONT: React + TypeScript
3. DB: PostgreSQL
4. Cache/cola opcional: Redis (complementario, no reemplaza la DB principal)

## Justificacion por capa

### BACK - C#/.NET 8
- Tipado fuerte para dominio clinico y reglas complejas.
- Buen rendimiento para flujos transaccionales (agenda, turnos, admision, caja).
- Ecosistema maduro para APIs empresariales, seguridad y observabilidad.
- Muy buen fit para arquitectura modular por dominios.
- Buena adopcion en organizaciones de salud y entornos regulados.

### FRONT - React + TypeScript
- Escalable para aplicaciones modulares grandes.
- TypeScript mejora calidad de contratos con el backend.
- Adecuado para formularios complejos y pantallas operativas intensivas.
- Buen ecosistema para manejo de estado de datos remotos y validacion.

Stack sugerido en FRONT:
- React + TypeScript
- TanStack Query
- React Hook Form
- Zod

### DB - PostgreSQL
- Excelente para integridad relacional y consistencia transaccional.
- Soporte robusto de indices, constraints y consultas complejas.
- JSONB util para extensiones controladas.
- Escalable para analitica operacional con buen modelado.

## Alineacion con HL7 FHIR R4
- Modelo de dominio relacional normalizado como fuente de verdad.
- Mapeo explicito DB <-> Dominio <-> FHIR por cada HU/modulo.
- No usar recursos FHIR JSON como unica persistencia core.
- BACK expone:
  - APIs internas de aplicacion (/api/v1/...)
  - Fachada FHIR para interoperabilidad externa (/fhir/{resourceType})

## Mapeo inicial por modulo
- AGENDA: Schedule, Slot, Practitioner, PractitionerRole, HealthcareService, Location.
- TURNOS: Appointment, AppointmentResponse, Slot, ServiceRequest.
- ADMISION: Encounter, Patient, Coverage, EpisodeOfCare.
- HCA: Observation, Condition, MedicationRequest, Procedure, Immunization, DiagnosticReport, DocumentReference.

## Principios de separacion para no mezclar desarrollo
1. FRONT nunca accede directo a DB.
2. Reglas de negocio viven en BACK.
3. DB no contiene logica de flujo funcional.
4. PRs separados por capa: FRONT, BACK y DB.
5. Cada HU debe declarar impacto por capa y recurso FHIR asociado.

## Estrategia de implementacion recomendada
1. Definir contrato API y alcance HU.
2. Implementar DB (migraciones + modelo).
3. Implementar BACK (casos de uso + APIs + tests).
4. Implementar FRONT (pantallas + integracion).
5. Validar E2E y trazabilidad FHIR.

## Riesgos y mitigaciones
- Riesgo: acoplar FRONT con modelo FHIR crudo.
  - Mitigacion: usar DTOs de aplicacion y mappers en BACK.
- Riesgo: inconsistencia entre modelo relacional y FHIR.
  - Mitigacion: matriz de mapeo versionada por modulo.
- Riesgo: deriva de reglas de negocio en varias capas.
  - Mitigacion: centralizar reglas en casos de uso BACK.

## Conclusión
Para este HIS, el stack C#/.NET 8 + React/TypeScript + PostgreSQL es la combinacion mas robusta para velocidad de entrega, mantenibilidad, escalabilidad funcional y cumplimiento de estandares de interoperabilidad en salud.