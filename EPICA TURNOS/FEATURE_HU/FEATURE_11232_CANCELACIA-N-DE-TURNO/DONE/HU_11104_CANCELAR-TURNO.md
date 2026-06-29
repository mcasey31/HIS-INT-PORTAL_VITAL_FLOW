# HU 11104 - Cancelar turno

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_11232_CANCELACIA-N-DE-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11104/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos Quiero: Cancelar un turno a un paciente Para: Eliminar un turno por solicitud de un paciente y poder liberar una disponibilidad horaria 
 Descripción y comportamiento El gestor de turnos accede a la opción de cancelar un turno desde el menú contextual del "Turno del paciente" (HU: Product Backlog Item 9744: Visualización de turnos). 
 Desde la solapa de Turnos del Paciente, se podrán visualizar todos los turnos que el paciente seleccionado tenga generados. Aquellos turnos con el estado Programado, se podrán seleccionar para procesar su eliminación del sistema desde la opción Cancelar Turno. 
 Al cancelar turno, el sistema informará mediante un pop up los datos del turno a eliminar: 
 
 Al confirmar la cancelación, el turno se actualiza a un estado de "Cancelado" en el sistema, liberando de forma automática el slot correspondiente, permitiendo de esta manera que el hueco de esa agenda quede disponible para poder asignarse a otro paciente. 
 Al momento de cancelar el turno pueden darse 2 resultados: 
 1- Exito de Cancelación: Si la cancelación se realiza correctamente, se presenta un mensaje de confirmación, indicando que el turno ha sido cancelado. Mostrando por pantalla el nuevo estado del turno para ese paciente (Cancelado). 2- Error en la Cancelación del Turno: Si la cancelación falla, se muestra un mensaje de error informando al usuario del problema para que vuelva a intentar cancelar el turno.
 
 
 
 https://xd.adobe.com/view/869c9bc5-1210-405b-b9c2-641f66c4aa9e-d3cf/screen/0aaf25bd-c9b7-494f-91c8-034d355417ec/

## Azure Criterios de Aceptacion
- Solo se pueden cancelar turnos si el estado es "Programado". No permitiendo cancelar turnos que estén en un estado diferente 
- El slot asociado al turno cancelado debe liberarse correctamente tras la cancelación, es decir debe quedar en estado Disponible. 
- El estado del turno debe reflejar "Cancelado" en el sistema cuando el proceso de cancelación finalice correctamente.

## Azure Tasks
- Task 22628: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 23230: QA - Datos de Cancelación de un Turno - Diferencia con Mockup | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16641: DT - interfaz | Estado: In Progress
 - Asignado a: Marco Alex Brusa
- Test Case 22875: QA - Verificar Estado Cancelado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11848: Análisis, escritura y diagramas | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 23119: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 23027: BE - agregar practicas en obtenerTurnosPaciente/age-l-turnos | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 22765: BE - Endpoint cancelarTurno/age-u-canceltur | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 22881: QA - CR - El estado del turno debe reflejar "Cancelado" en el sistema cuando el proceso de cancelación finalice correctamente. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22871: QA - Verificar Cancelar Turno | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22880: QA - CR - El slot asociado al turno cancelado debe liberarse correctamente tras la cancelación, es decir debe quedar en estado Disponible. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22874: QA - Verificar Boton Si, Cancelar Turno | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 23319: QA - Cancelar Turno - Notificacion de Error | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 22627: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 22723: FE - Cancelar Turno (integración) | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 22877: QA - Verificar Notificación de Cancelación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22872: QA - Verificar los Datos de Cancelación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22870: QA - Verificar Menu Contextual Cancelar Turno | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22873: QA - Verificar Boton Volver | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 22624: FE - Cancelar turno | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 22879: QA - CR - Solo se pueden cancelar turnos si el estado es "Programado". No permitiendo cancelar turnos que estén en un estado diferente | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22876: QA - Verificar el slot | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 22878: QA - Verificar Notificación de Cancelación - Erronea | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



