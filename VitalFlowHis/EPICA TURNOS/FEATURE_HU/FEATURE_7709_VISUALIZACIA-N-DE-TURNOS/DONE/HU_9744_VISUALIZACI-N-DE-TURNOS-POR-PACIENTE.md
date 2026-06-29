# HU 9744 - Visualización de turnos por paciente

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7709_VISUALIZACIA-N-DE-TURNOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/9744/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos Quiero: Ver turnos asignados al paciente Para: Listar los turnos que haya tomado el paciente Descripción y comportamiento: Una vez realizada la selección del turno y confirmado el mismo (ITEM 9908) desde la solapa "Turnos del paciente" se podrá ver una grilla con los turnos que tenga ya asignados. Dicha grilla contendrá los siguientes datos: - Profesional 
- Servicio 
- Centro 
- Fecha-Hora 
- Estado ITEM 13005 
 
 
 
 
 
 La página nos mostrará por defecto 10 turnos según componente estándar. 
 En caso de no contar con ningún turno para mostrar, la grilla contendrá un msj que lo indique. 
 Cada fila, al final de la misma, contará con un menú contextual que permitirá imprimir el comprobante, o cancelar el turno. En caso de seleccionar la cancelación, abrirá un modal de confirmación.
 
 
 
 
 
 Asimismo, el botón "Historial de turnos" mostrará la misma información de los turnos ya vencidos con su estado.

 
 
 
 
 
 
 
 Impresión de comprobante de turno 
 
 
 
 Pantallas: https://xd.adobe.com/view/869c9bc5-1210-405b-b9c2-641f66c4aa9e-d3cf/screen/0aaf25bd-c9b7-494f-91c8-034d355417ec/

## Azure Criterios de Aceptacion
- La grilla mostrará 10 turnos por defecto. 
- Si se cancela un turno el mismo se actualizará en la grilla con estado "Cancelado". (En otra HU) 
- Orden default. 
- Las fechas de turnos deberán mostrarse desde la más próxima a la más lejana. 
- Los tres estados a visualizar son: Agendado, Cancelado por agenda, y Cancelado por paciente.

## Azure Tasks
- Task 13885: FE - Maquetado Listado de Turnos | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14083: BD - insert datos en relacion paciente-financiador-plan / insert datos en turnos | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 23187: QA - Error en resource obtenerTurnosPaciente | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 22717: QA - Consulta de Turnos Del Paciente - Error al mostrar Información del Paciente | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 13917: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Bug 14823: QA-Diferencia en el campo "Centro". | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Bug 14544: QA- No se registra menú contextual (tres puntos) | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 13887: FE - Integracion Listado al endpoint | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 22741: QA - Consulta de Estado en Solapa Turnos del Paciente - Diferencia con el Mockup - No muestra los colores | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 14360: BE - Cambios query | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14371: FE - Cambiar id de hardcodeo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12938: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14276: BE - Ajustar Ordenamiento Listado | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14105: BD - Agregar datos en tipo de turnos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 13916: QA-Diseños de casos de Prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 13963: BE - Obtener turnos por paciente | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14104: BD - Agregar campos a tabla estados | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 13786: Diseño tecnico | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 14524: BD - Carga de datos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 11849: Analisis funcional | Estado: In Progress
 - Asignado a: Sebastian Hernandez Garandan
- Task 14231: BE - Revisar Fomato de fecha y devolver colores en los estados | Estado: Done
 - Asignado a: Brian Ezequiel Agüero



