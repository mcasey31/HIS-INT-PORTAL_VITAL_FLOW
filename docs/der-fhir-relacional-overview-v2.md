# DER v2 - Overview Integral Basado en HL7 FHIR (R4)

## Estado
- Estado: Provisorio / Evolutivo
- Fecha: 2026-05-30
- Autor: Equipo VitalFlow HIS
- Base: DER integral compartido + esquema operativo del repositorio

## Decision de modelado
Se toma HL7 FHIR R4 como marco semantico canonico para interoperabilidad.
El modelo relacional local se define como persistencia operativa alineada a recursos FHIR (no como reemplazo del estandar).

## Principio rector
- Recurso FHIR (semantica) -> Dominio (regla de negocio) -> Tabla relacional (persistencia)

## Mapa FHIR -> Relacional (estado actual)

### 1) Schedule (FHIR)
- Objetivo funcional: Agenda asistencial
- Tabla principal: sch_agenda.agenda
- Estado implementacion: Parcial operativo
- Cobertura:
  - id -> agenda.id
  - identifier -> agenda.codigo
  - active -> agenda.estado (ACTIVA/INACTIVA)
  - planningHorizon -> agenda.fecha_desde / agenda.fecha_hasta
- Gap:
  - actor(Location/PractitionerRole/HealthcareService) todavia no normalizado en llaves FHIR dedicadas

### 2) Slot (FHIR)
- Objetivo funcional: Bloques y cupos de disponibilidad
- Tabla principal: sch_agenda.bloque_programacion
- Tabla derivada: sch_agenda.cupo
- Estado implementacion: Operativo incremental
- Cobertura:
  - estado de disponibilidad por bloque/cupo
  - rango horario y vigencia
  - tipo de bloque (FIJA / VARIABLE / DEMANDA_ESPONTANEA)
  - reglas de solapamiento (efector/lugar)
- Gap:
  - serializacion estandar de status FHIR aun no expuesta via facade FHIR de escritura

### 3) Slot con bloqueo (FHIR)
- Objetivo funcional: indisponibilidad planificada
- Tabla principal: sch_agenda.bloqueo_agenda
- Estado implementacion: Operativo
- Cobertura:
  - inicio/fin/tipo para marcar no disponibilidad
- Gap:
  - codificacion estandar de motivo (CodeableConcept) pendiente

### 4) Location (FHIR)
- Objetivo funcional: lugar fisico de atencion
- Tabla principal: sch_agenda.lugar_atencion
- Estado implementacion: Operativo
- Cobertura:
  - catalogo de lugares + referencia en bloque_programacion
- Gap:
  - mapeo completo a recurso Location (identifier/address/managingOrganization) pendiente

### 5) Practitioner / PractitionerRole (FHIR)
- Objetivo funcional: efector profesional y rol asistencial
- Tablas actuales relacionadas: sch_agenda.efector (lookup operativo), referencias en agenda
- Estado implementacion: Parcial operativo
- Gap:
  - separacion formal Practitioner vs PractitionerRole y API FHIR dedicada pendiente

### 6) HealthcareService (FHIR)
- Objetivo funcional: servicio prestacional
- Tabla actual relacionada: sch_agenda.servicio
- Estado implementacion: Parcial operativo
- Gap:
  - exposicion FHIR y codificacion estandar de serviceType/specialty pendiente

## Relacion por HU (estado)

### HU 7027 - Bloques de programacion fija
- Impacto relacional:
  - extension de sch_agenda.bloque_programacion
  - alta de sch_agenda.lugar_atencion
- Alineacion FHIR:
  - Schedule/Slot/Location
- Estado: Implementado

### HU 8989 - Programacion variable
- Impacto relacional:
  - practicas_json en sch_agenda.bloque_programacion
- Alineacion FHIR:
  - Slot con metadatos de practica (extension operativa)
- Estado: Implementado con validaciones
- Gap:
  - normalizar practicas en tablas propias y terminologia clinica

### HU 8990 - Demanda espontanea
- Impacto relacional:
  - tipo_bloque DEMANDA_ESPONTANEA en bloque_programacion
- Alineacion FHIR:
  - Slot orientado a cola de espera/admision
- Estado: En ajuste continuo de UX/reglas

### HU 11199 - Crear grupo de profesionales
- Impacto relacional:
  - nuevas tablas `sch_agenda.grupo_profesional` y `sch_agenda.grupo_profesional_miembro`
  - integridad por trigger para admitir solo miembros de tipo `PROFESIONAL`
  - validacion de pertenencia de miembros al mismo centro/servicio del grupo
- Alineacion FHIR:
  - base para `Group` (fase 2) y/o composicion de `PractitionerRole`
- Estado: Modelo relacional base implementado (migracion SQL)

## Gaps transversales priorizados
1. Tabla de mapeo formal de estados internos <-> status FHIR.
2. Normalizacion de practicas (tabla propia) en lugar de JSON en bloque.
3. Facade FHIR de lectura/escritura consistente para Schedule/Slot.
4. Codificaciones clinicas (SNOMED/LOINC/local) para practicas/motivos/servicios.

## Convenciones de evolucion del modelo
Cada cambio debe registrar:
1. HU/Feature origen.
2. Migracion SQL asociada.
3. Cambio de contratos API.
4. Impacto FHIR (recurso/campo/extension).
5. Compatibilidad hacia atras.

## Registro de version
- v2 (2026-05-30): consolidado integral FHIR -> Relacional con estado actual y gaps.
