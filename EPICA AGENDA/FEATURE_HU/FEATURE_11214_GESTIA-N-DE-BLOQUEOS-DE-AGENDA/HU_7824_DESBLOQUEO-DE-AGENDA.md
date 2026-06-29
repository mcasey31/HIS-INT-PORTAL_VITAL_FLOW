# HU 7824 - Desbloqueo de agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7824/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Como administrador de gestión de agendas. Quiero: Desbloquear horarios en la agenda del profesional. Para: Habilitar la agenda para la asignación de turnos a pacientes. 

 
 Descripción y comportamiento: Como gestor de agendas quiero habilitar una agenda bloqueada para que se pueda asignar turnos a un paciente. Ingresando a la opción "Desbloquear", debe mostrarse un mensaje donde se indique que la acción a realizar liberarán los horarios bloqueados y que estarán disponibles para asignar nuevos turnos, se debe visualizar las fechas fechas inicio y fin, así como los horarios desde y hasta. Al confirmar la acción de desbloqueo se mostrará un mensaje que indique que la agenda se le desbloquearon los horarios, como se muestra en la siguiente. 
 
 
 
 DER: https://dbdiagram.io/d/DIagrama-de-agendas-677d7ebf0231eca72973a439 
 
 LINK https://xd.adobe.com/view/b179d366-7599-4125-a525-fcbfb2509c17-e42a/screen/7af27687-60f1-4033-b1c2-5a3437c6477b/specs/

## Azure Criterios de Aceptacion
- La acción de desbloqueo de la agenda, debe dejar los slot del bloque de programación libres (habilitados) para la asignación de turnos. 
- Para habilitar los horarios de una agenda, esta debe estar con fecha vigente de la misma al momento de la acción de desbloqueo.

## Azure Tasks
- Task 15470: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 11584: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 23648: UX - Diseño de mockup | Estado: In Progress
 - Asignado a: Melanie Garcia
- Task 11583: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti



