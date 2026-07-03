# HU 16066 - Turnos del paciente más visibles para el usuario

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7709_VISUALIZACIA-N-DE-TURNOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16066/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: más visibilidad de los turnos que tiene el paciente Para: realizar un control y posible gestión de los turnos 
 Descripción y comportamiento 
  Luego de seleccionar al paciente, se deberán mostrar tarjetas con los turnos en estado programado que tenga asignados en los próximos 3 meses o un máximo de 9 turnos. 

Cada tarjeta deberá incluir la siguiente información: mes, día, hora, servicio, profesional y centro. 

 
 
 En caso de que el paciente no tenga turnos asignados, se deberá mostrar: 
 
 
 https://xd.adobe.com/view/880d7d9d-92b2-4f33-aba0-7f17217737af-dd5e/

## Azure Criterios de Aceptacion
- Se visualizarán los turno del paciente apenas se seleccione el paciente 
- Si el paciente no cuenta con turnos tendrá un mensaje de "no se agendaron próximos turnos" 
- El listado de turno debe estar ordenado de los turnos mas próximos a mas lejanos (menor a mayor)

## Azure Tasks
- Test Case 23408: QA -  CR - Se visualizarán los turno del paciente apenas se seleccione el paciente | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 16428: Análisis funcional | Estado: Done
  - Asignado a: Natalia Gorriti
- Test Case 23402: QA - Verificar  en las Tarjetas  la informacion del dia | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23401: QA - Verificar  en las Tarjetas  la informacion del mes | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 23311: QA - Ejecución de Casos de Prueba | Estado: Done
  - Asignado a: Alfonso Oscar Koike
- Task 23310: QA - Diseño de Casos de Prueba | Estado: Done
  - Asignado a: Alfonso Oscar Koike
- Test Case 23405: QA - Verificar  en las Tarjetas  la informacion del profesional | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23407: QA - Verificar  Mensaje cuando el paciente No tenga turnos asignados | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 23582: Code Review | Estado: Done
  - Asignado a: Marco Alex Brusa
- Task 23386: BE - Agregar parametro  endpoint obtenerTurnosPaciente/age-l-turnos | Estado: Done
  - Asignado a: Tomas Goncalves
- Test Case 23409: QA - CR - Si el paciente no cuenta con turnos tendrá un mensaje de "no se agendaron próximos turnos" | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 16429: Escritura de HU | Estado: Done
  - Asignado a: Natalia Gorriti
- Test Case 23403: QA - Verificar  en las Tarjetas  la informacion del la hora | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 23629: FE - Fix cards | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Task 16244: UX - Diseño de mockup | Estado: Done
  - Asignado a: Melanie Garcia
- Task 23292: FE - Maquetado de Cards | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Test Case 23399: QA - Verificar En Turnos las Tarjetas del Paciente | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23404: QA - Verificar  en las Tarjetas  la informacion del servicio | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23406: QA - Verificar  en las Tarjetas  la informacion del centro | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23410: QA - CR - El listado de turno debe estar ordenado de los turnos mas próximos a mas lejanos (menor a mayor) | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Test Case 23400: QA - Verificar  en las Tarjetas, que los turnos correspondas a los proximos 3 meses | Estado: Ready
  - Asignado a: Alfonso Oscar Koike
- Task 23293: FE -  Integracion con Backend + Paginacion | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Test Case 23836: QA - Verificar  en las Tarjetas, que los turnos correspondas a un máximo de 9 turnos. | Estado: Ready
  - Asignado a: Alfonso Oscar Koike


