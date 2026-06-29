# Priorizacion de Desarrollos - VitalFlow HIS

## Objetivo
Definir el orden de implementacion funcional para maximizar valor temprano y reducir bloqueos entre modulos.

## Orden de prioridad acordado
1. AGENDA
2. TURNOS
3. ADMISION
4. HISTORIA CLINICA AMBULATORIA

## Criterios de priorizacion
- Dependencias funcionales: agenda habilita la oferta operativa para turnos.
- Impacto operativo temprano: turnos y admision reducen friccion en front desk.
- Riesgo de integracion: avanzar en capas para validar datos maestros y reglas.
- Escalabilidad de flujo asistencial: HCA se apoya en procesos previos estables.
- Estandarizacion: los modelos se disenan alineados a HL7 FHIR R4 desde la primera fase.

## Ruta de ejecucion por epica
### Fase 1 - AGENDA
Carpeta base: [EPICA AGENDA](../EPICA%20AGENDA)

Alcance inicial recomendado:
- Gestion de agenda.
- Gestion de bloques de programacion.
- Gestion de practicas en bloque.
- Gestion de cupos y bloqueos.
- Gestion de grupo de profesionales.
- Gestion de dispositivos.
- Gestion de calendario.

Entregables de la fase:
- Refinamiento funcional de todas las HU de AGENDA.
- Criterios de aceptacion Gherkin validados con negocio.
- Definicion de APIs/servicios y modelo de datos minimo.
- Plan de pruebas funcionales y de regresion para agenda.
- Mapeo FHIR de AGENDA (Schedule, Slot, Practitioner, PractitionerRole, HealthcareService, Location).

Definition of Ready para desarrollo AGENDA:
- HU con alcance cerrado y reglas de negocio sin ambiguedad.
- Dependencias tecnicas identificadas y aprobadas.
- Datos de prueba definidos.
- Criterios de aceptacion firmados por funcional/negocio.
- Recurso FHIR y perfil objetivo definidos por HU.

### Fase 2 - TURNOS
Carpeta base: [EPICA TURNOS](../EPICA%20TURNOS)

Objetivo:
- Consumir configuracion de AGENDA para asignacion, visualizacion y cancelacion de turnos.

### Fase 3 - ADMISION
Carpeta base: [EPICA ADMISION](../EPICA%20ADMISION)

Objetivo:
- Integrar arribo de pacientes con y sin turno, estados y validaciones de cobertura.

### Fase 4 - HISTORIA CLINICA AMBULATORIA
Carpeta base: [EPICA HISTORIA CLINICA AMBULATORIA](../EPICA%20HISTORIA%20CLINICA%20AMBULATORIA)

Objetivo:
- Habilitar el flujo clinico completo una vez estabilizados agenda, turnos y admision.

## Arranque inmediato: AGENDA
Plan de inicio (semana 1):
1. Revisar y completar HU de [EPICA AGENDA](../EPICA%20AGENDA) con negocio.
2. Definir mapa de entidades: agenda, bloque, cupo, bloqueo, profesional, dispositivo, calendario.
3. Secuenciar build por HU critica (agenda -> bloques -> cupos -> bloqueos).
4. Preparar pruebas E2E del flujo minimo de publicacion de disponibilidad.
5. Definir matriz de mapeo DB <-> Dominio <-> FHIR para AGENDA.

## Dependencias cruzadas a monitorear
- Parametros y datos maestros comunes.
- Politicas de permisos por rol.
- Auditoria de cambios para trazabilidad.
- Integraciones externas de calendario y/o interoperabilidad si aplica.
- Gobernanza de terminologias y perfiles FHIR.

## Criterio de salida de AGENDA
La fase AGENDA se considera completada cuando:
- Las HU de AGENDA estan implementadas y validadas en QA.
- TURNOS puede consumir disponibilidad sin workarounds.
- No hay bloqueantes criticos abiertos de datos o permisos.