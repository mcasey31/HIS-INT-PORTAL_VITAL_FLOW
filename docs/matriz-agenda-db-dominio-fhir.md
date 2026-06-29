# Matriz AGENDA - DB <-> Dominio <-> FHIR (R4)

## Objetivo
Definir el mapeo inicial de la epica AGENDA entre:
- Modelo relacional (DB)
- Modelo de dominio (BACK)
- Recursos HL7 FHIR R4 (Interoperabilidad)

Esta matriz sera la base para migraciones, contratos API y validaciones por HU.

## Alcance AGENDA cubierto
- HU 7005: Gestion de Agenda
- HU 7007: Gestion de Bloques de Programacion
- HU 7006: Gestion de practicas en bloque de programacion
- HU 10957: Gestion de cupos
- HU 11214: Gestion de bloqueos de agenda
- HU 11198: Gestion de grupo de profesionales
- HU 11216: Gestion de dispositivos
- HU 12758: Gestion de calendario

## Recursos FHIR objetivo
- Schedule
- Slot
- Practitioner
- PractitionerRole
- HealthcareService
- Location

Nota: Device y Group pueden incorporarse si se decide exponer dispositivos y grupos de profesionales via FHIR en una segunda iteracion.

## Entidades de dominio y tablas DB

### 1) Agenda
- Dominio: Agenda
- Tabla: sch_agenda.agenda
- FHIR principal: Schedule

Campos clave:
- agenda.id (uuid, PK) <-> AgendaId <-> Schedule.id
- agenda.codigo (varchar) <-> CodigoAgenda <-> Schedule.identifier.value
- agenda.nombre (varchar) <-> NombreAgenda <-> Schedule.serviceType.text / extension
- agenda.estado (varchar) <-> EstadoAgenda <-> Schedule.active
- agenda.fecha_desde (date) <-> VigenciaDesde <-> Schedule.planningHorizon.start
- agenda.fecha_hasta (date) <-> VigenciaHasta <-> Schedule.planningHorizon.end
- agenda.location_id (uuid, FK) <-> SedeId <-> Schedule.actor(Location)
- agenda.practitioner_role_id (uuid, FK) <-> RolProfesionalId <-> Schedule.actor(PractitionerRole)

### 2) Bloque de Programacion
- Dominio: BloqueProgramacion
- Tabla: sch_agenda.bloque_programacion
- FHIR principal: Slot (serie de slots)

Campos clave:
- bloque_programacion.id (uuid, PK) <-> BloqueId <-> Slot.extension(bloqueId)
- bloque_programacion.agenda_id (uuid, FK) <-> AgendaId <-> Slot.schedule.reference
- bloque_programacion.fecha (date) <-> Fecha <-> Slot.start/end
- bloque_programacion.hora_inicio (time) <-> HoraInicio <-> Slot.start
- bloque_programacion.hora_fin (time) <-> HoraFin <-> Slot.end
- bloque_programacion.intervalo_minutos (int) <-> IntervaloMinutos <-> Slot.duration(extension)
- bloque_programacion.estado (varchar) <-> EstadoBloque <-> Slot.status (free | busy | busy-unavailable)

### 3) Cupo
- Dominio: Cupo
- Tabla: sch_agenda.cupo
- FHIR principal: Slot

Campos clave:
- cupo.id (uuid, PK) <-> CupoId <-> Slot.id
- cupo.bloque_id (uuid, FK) <-> BloqueId <-> Slot.extension(bloqueId)
- cupo.hora_inicio (timestamp) <-> Inicio <-> Slot.start
- cupo.hora_fin (timestamp) <-> Fin <-> Slot.end
- cupo.estado (varchar) <-> EstadoCupo <-> Slot.status
- cupo.overbooking_permitido (bool) <-> OverbookingPermitido <-> Slot.extension(overbook)
- cupo.capacidad (int) <-> Capacidad <-> Slot.extension(capacity)

### 4) Bloqueo de Agenda
- Dominio: BloqueoAgenda
- Tabla: sch_agenda.bloqueo_agenda
- FHIR principal: Slot (estado no disponible)

Campos clave:
- bloqueo_agenda.id (uuid, PK) <-> BloqueoId <-> Slot.extension(bloqueoId)
- bloqueo_agenda.agenda_id (uuid, FK) <-> AgendaId <-> Slot.schedule.reference
- bloqueo_agenda.inicio (timestamp) <-> InicioBloqueo <-> Slot.start
- bloqueo_agenda.fin (timestamp) <-> FinBloqueo <-> Slot.end
- bloqueo_agenda.motivo_codigo (varchar) <-> MotivoCodigo <-> Slot.comment / extension(CodeableConcept)
- bloqueo_agenda.tipo (varchar) <-> TipoBloqueo <-> Slot.status = busy-unavailable

### 5) Calendario/Feriados
- Dominio: Calendario
- Tabla: sch_agenda.calendario_excepcion
- FHIR principal: Slot (impacto en disponibilidad)

Campos clave:
- calendario_excepcion.id (uuid, PK) <-> ExcepcionId <-> Slot.extension(excepcionId)
- calendario_excepcion.fecha (date) <-> Fecha <-> Slot.start/end
- calendario_excepcion.es_feriado (bool) <-> EsFeriado <-> Slot.status = busy-unavailable
- calendario_excepcion.descripcion (varchar) <-> Descripcion <-> Slot.comment
- calendario_excepcion.ambito (varchar) <-> Ambito (local/global) <-> extension

### 6) Grupo de Profesionales
- Dominio: GrupoProfesionales
- Tabla: sch_agenda.grupo_profesional, sch_agenda.grupo_profesional_miembro
- FHIR principal: PractitionerRole / Group (opcional fase 2)

Campos clave:
- grupo_profesional.id (uuid, PK) <-> GrupoId <-> Group.id (si se adopta)
- grupo_profesional.nombre (varchar) <-> NombreGrupo <-> Group.name
- grupo_profesional_miembro.practitioner_id (uuid) <-> ProfesionalId <-> Practitioner.id

### 7) Dispositivo
- Dominio: DispositivoAgenda
- Tabla: sch_agenda.dispositivo
- FHIR principal: Location o Device (segun decision)

Campos clave:
- dispositivo.id (uuid, PK) <-> DispositivoId <-> Device.id (fase 2)
- dispositivo.codigo (varchar) <-> CodigoDispositivo <-> Device.identifier.value
- dispositivo.nombre (varchar) <-> NombreDispositivo <-> Device.deviceName
- dispositivo.estado (varchar) <-> EstadoDispositivo <-> Device.status
- dispositivo.location_id (uuid, FK) <-> UbicacionId <-> Device.location(Location)

## Reglas de mapeo obligatorias
1. Toda tabla principal debe incluir:
- created_at
- updated_at
- created_by
- updated_by
- tenant_id (si aplica multi-sede)
- source_system
- source_id
- fhir_profile

2. No perder semantica de estado:
- Estados internos deben mapearse de forma deterministica a valores FHIR.
- Definir tablas de equivalencia de estados (status_map).

3. Terminologias:
- serviceType, specialty, motivos y practicas deben usar codigos estandar cuando existan.
- Documentar sistema de codificacion (SNOMED CT/LOINC/local) por campo.

## Esquema SQL inicial propuesto (alto nivel)
- sch_agenda.agenda
- sch_agenda.bloque_programacion
- sch_agenda.cupo
- sch_agenda.bloqueo_agenda
- sch_agenda.calendario_excepcion
- sch_agenda.grupo_profesional
- sch_agenda.grupo_profesional_miembro
- sch_agenda.dispositivo
- sch_agenda.status_map

## Contratos BACK recomendados para AGENDA
API interna:
- GET /api/v1/agendas
- POST /api/v1/agendas
- POST /api/v1/agendas/{agendaId}/bloques
- POST /api/v1/agendas/{agendaId}/bloqueos
- POST /api/v1/agendas/{agendaId}/cupos/recalcular
- GET /api/v1/agendas/{agendaId}/disponibilidad

API FHIR facade:
- GET /fhir/Schedule
- GET /fhir/Schedule/{id}
- GET /fhir/Slot?schedule={id}&start=...&end=...

## Criterios de aceptacion de esta matriz
1. Cada HU de AGENDA referencia al menos una entidad de dominio y una tabla DB.
2. Cada entidad de dominio tiene recurso FHIR objetivo definido.
3. Estados y codigos tienen estrategia de mapeo formal.
4. Se puede derivar de esta matriz una primera migracion DB y contratos API.

## Proximo paso tecnico
1. Crear migracion SQL v1 para sch_agenda.*
2. Crear modulo back Agenda con entidades y repositorios.
3. Exponer endpoints internos y fachada FHIR de lectura.
4. Implementar UI de administracion de Agenda consumiendo API interna.