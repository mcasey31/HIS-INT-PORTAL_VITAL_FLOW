# HU 16697 - Turnos cancelados desde Modulo Agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16697/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 23294: FE maquetado pantalla completa + filtros.
- Task 23297: FE integracion listado con backend.
- Task 23564: FE integracion selector motivo de cancelacion.

## Pantalla objetivo para mock
- Pantalla: Turnos cancelados desde Agenda.
- Componentes: filtros, listado, selector de motivo, acciones de consulta y navegacion al detalle.

## Azure Descripcion
Como: Gestor de agendas Quiero: Poder acceder a un listado de los turnos cancelados Para: realizar la posterior gestión del turno 
 
 Descripción y comportamiento 
 Desde el menú contextual del listado de agendas o desde el menú contextual del detalle deberá existir una opción de "Turnos cancelados" 
 
 
 
 Esta opción nos llevará a una grilla con todos los turnos cancelados para esa agenda. Teniendo 3 filtros: - Paciente 
- Motivo de cancelacion 
- Fecha 
 El listado contará con las siguientes columnas: - icono (por default será gris, que podrá seleccionarse y cambiar de gris a verde para marcar si el turno fue gestionado y reasignado) 
- Turno (Dia del turno) 
- Hora (Hora del turno) 
- Paciente (Apellido(s) y Nombre(s)) 
- Teléfono 
- Correo electrónico 
- Motivo (motivo por la que el turno se canceló si tiene motivo de bloqueo debe mostrar ese) 
 
 
 Si se selecciona en el campo motivo de cancelación la opción "Bloqueo" se habilitará un campo llamado "Motivo de bloqueo" que nos traerá los motivos de bloqueo por los que se cancelaron los turnos. 
 
 
 Solo deben incluirse en el listado de turnos cancelados aquellos que hayan sido anulados por una edición o un bloqueo de agenda, excluyendo los cancelados por el paciente.
 
 https://xd.adobe.com/view/44095b47-c762-47e5-b642-fada4371550e-115a/

## Azure Criterios de Aceptacion
- Poder ver el listado de turnos cancelados por una edición o bloqueo de la agenda 
- Poder marcar si un turno ya fue gestionado 
- Poder realizar búsqueda de turnos por paciente, fecha y motivo

## Azure Tasks
- Task 23722: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16698: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 23297: FE - Integracion Listado con Backend | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23314: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23564: FE - Integracion endpoint Selector Motivo Cancelacion | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23661: BE - Fix Filtros obtenerTurnosCancelados | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 23969: QA - Se cambio la referencia en la columna motivo | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23385: BE - Endpoint turnosCancelados/age-tur-canc | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 23499: BD - actualizacion estados | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 16783: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 23630: BD - Campo reasignado en el turno | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 23431: BE - Endpoint obtenerPacientesAutocompletado/age-a-pacientes | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 23827: QA - Columna 'Motivo' no tiene tooltip | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23296: FE - Integracion con Endpoint Motivos bloqueo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16742: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 23683: BE - Crear endpoint reasignarTurno/age-tur-reasignar | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 23313: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23271: DG - Diseño Interfaces | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 23295: FE - Integracion con endpoint Paciente | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 23840: QA - Corregir titulo 'Fecha' | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23682: FE - Integrar endpoint marcarreasignar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23294: FE - Maquetado pantalla completa + Filtros | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23509: BE - Endpoint obtenerMotivosCancSelector/age-s-motivocanc | Estado: Done
 - Asignado a: Tomas Goncalves



