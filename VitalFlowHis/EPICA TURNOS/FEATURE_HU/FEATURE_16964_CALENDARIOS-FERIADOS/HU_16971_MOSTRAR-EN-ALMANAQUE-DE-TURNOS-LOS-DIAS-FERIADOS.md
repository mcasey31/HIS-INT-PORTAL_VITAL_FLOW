# HU 16971 - Mostrar en almanaque de Turnos los dias feriados con otro color

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_16964_CALENDARIOS-FERIADOS
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16971/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: que los días feriados y no laborables se marquen de forma distinta en el calendario. Para: poder identificarlos fácilmente y evitar la asignación involuntaria de turnos en esas fechas. 

 
 
 Descripción y comportamiento: Se requiere una funcionalidad que permita resaltar de forma diferenciada los días feriados y no laborables en el calendario de turnos, de acuerdo a lo días cargados mediante la HU Item 16967 a fin de facilitar su identificación por parte del gestor al momento de asignar el turno al paciente. 
 De acuerdo a la configuración del bloque de programación de la agenda, se puede presentar dos escenarios para visualizar los días feriados en el calendario y validar la asignación de turnos en estos días feriados y/o no laborables: 
 Primer escenarios: Cuando el profesional/grupo de profesionales o equipo atiende en días feriados. 
 En el caso de que la agenda este configurada para atender en días feriados, se debe mostrar en el almanaque el día diferenciado a los días corrientes e indicar que es feriado (subrayado del número de color distinto al resto). Ver mockup 
 
 
 Si se selecciona un día feriado, se debe diferenciar el color del circulo que sombrea al día, y se debe visualizar los turnos disponibles para ese día. 
 
 
 
 Si se toma un turno para asignarlo al paciente, se debe alertar al gestor para que le indique al paciente que esta tomando un turno en un día feriado. Ver mockup
 
 
 
 
 Segundo escenarios: Profesional/Grupo de profesionales o equipo NO atiende en días feriados. 
 
 En el caso de que la agenda este configurada como NO atiende en días feriados, por regla no se generan slot (turnos) para los días feriados, por ende no afecta al almanaque, ese día queda sin identificación de subrayado o sombreado, como el caso de los días que no tienen turnos por estar fuera de rango de facha de los bloques. 
 https://xd.adobe.com/view/91476dc6-c962-47d2-a7a8-85128b943097-c414/

## Azure Criterios de Aceptacion
- Se debe tomar en cuenta la configuración del bloque de programación, para ver si atiende los días feriados o no. 
- Los días feriados debe estar subrayados en el calendario con un color distintos a los días corrientes. 
- Si día activo en el calendario es feriado, debe estar sombreado con un circulo de color distintos a los días comunes. 
- Si se selecciona un turno un día feriado se debe alertar en el modal de confirmación para indicarle al paciente.

## Azure Tasks
- Task 17031: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 17272: AF - Análisis y escritura | Estado: In Progress
 - Asignado a: Geroan Antonio Cadenas Alvarez



