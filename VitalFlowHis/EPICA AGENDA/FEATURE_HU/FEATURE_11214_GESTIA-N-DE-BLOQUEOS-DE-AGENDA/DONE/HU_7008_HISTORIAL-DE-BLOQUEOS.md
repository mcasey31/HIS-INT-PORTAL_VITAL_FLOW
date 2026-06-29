# HU 7008 - Historial de bloqueos

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7008/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Como administrador de gestión de agendas. Quiero: poder visualizar un listado de los bloqueos que se realizaron en una agenda Para: contar con una vista más clara de los bloqueos de una agenda 

 

Descripción y comportamiento: 

Desde el modulo de gestión de agenda, ingresando al menú contextual de la agenda 

o del detalle de la agenda, 

se debe tener la opción de "Historial de Bloqueos". Ingresando a esta acción debe abrir una pantalla que tendrá como encabezado el nombre de la agenda, el centro y el profesional; seguidamente debe contar con una grilla donde debe visualizarse por bloqueo las siguientes columnas: 

 

- Fecha de creación (Fecha y hora en que se creó el bloqueo) 
- Fecha desde - hasta. (Fecha desde y hasta) 
- Horario.(Hora desde y hasta) 
- Horario cancelados.(cantidad de slot cancelados) 
- Turnos cancelados. (cantidad de turnos cancelados) 
- Consultorio. 
- Motivo. 
- Menú contextual (con opción de exportar turnos a reasignar y desbloquear) 
 
 En la misma grilla también contará con un menú contextual que tendrá la opción de exportar turnos a reasignar(HU: Product Backlog Item 11657: Descarga de turnos a reasignar) y desbloquear (HU Product Backlog Item 7824: Desbloqueo de agenda)
 

Si la agenda no cuenta con bloqueos la grilla aparecerá con un mensaje de: 

"No dispone de horarios bloqueados" 

DER 

 https://dbdiagram.io/d/Agendas-67a69d0b263d6cf9a070191b
 
 https://xd.adobe.com/view/b179d366-7599-4125-a525-fcbfb2509c17-e42a/screen/280d99fc-bbe9-4348-b965-27e8583dccfa/

## Azure Criterios de Aceptacion
- Listar los bloqueos de la agenda seleccionada 
- Si no se realizaron bloqueos a una agenda mostrar mensaje definido

## Azure Tasks
- Task 17516: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 23108: QA - Verificar Modal Historial de Bloqueos - Grilla de Información | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11577: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 23419: QA - Historial de Bloqueos - NO se muestra Informacion | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 23262: QA - Historial de Bloqueos - Error en el Encabezado | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 23110: QA - Verificar Agenda sin Bloqueos - Mensaje | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16682: Diseño tecnico | Estado: To Do
 - Asignado a: Marco Alex Brusa
- Task 17461: FE - Maquetado Historial Bloqueo + Creacion page + Empty | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15469: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 17462: FE - Integracion Endpoint GET Listado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 23264: QA - Historial de Bloqueos - Error en Formato de Fecha en pantalla | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 23111: QA - CR - Listar los bloqueos de la agenda seleccionada | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11578: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 23104: QA - Verificar Menu Contextual - Historial de Bloqueos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 23112: QA - CR - Si no se realizaron bloqueos a una agenda mostrar mensaje definido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 23107: QA - Verificar Modal Historial de Bloqueos - Encabezado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 13578: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 23106: QA - Verificar Modal Historial de Bloqueos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 23109: QA - Verificar Modal Historial de Bloqueos - Menu Contextual | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17517: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 23105: QA - Verificar Detalle de Agenda - Historial de Bloqueos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



