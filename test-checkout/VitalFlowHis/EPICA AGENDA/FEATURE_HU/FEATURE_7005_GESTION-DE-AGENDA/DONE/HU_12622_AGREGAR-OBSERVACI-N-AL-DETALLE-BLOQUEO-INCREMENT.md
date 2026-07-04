# HU 12622 - Agregar observación al detalle + bloqueo (incremento)

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12622/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: gestor de agendas Quiero: Incrementar datos en el detalle de una agenda Para: contar con la información más fácilmente

 
 Descripción y comportamiento 
 Luego de desarrollar la HU ((Product Backlog Item 7009: Agregar un bloqueo), se debe incrementar el detalle de la agenda mostrando los bloqueos registrados. Para ello, se incluirá un bloque con el título 'Bloqueos activos', que mostrará una grilla con la fecha, hora y motivo del bloqueo. Un bloqueo se considera activo hasta que finaliza el último día del rango definido. 
 
 
 El segundo incremento consiste en agregar el texto de observación en el detalle de la agenda, tal como se muestra en pantalla. 
 
 
 Si no hay observaciones en la agenda deberá mostrarse así. 
 
 
 Link de pantalla https://xd.adobe.com/view/a8c0c344-a210-46b1-add1-5cb4732b8f81-fd93/screen/f0a10fe2-e80e-4cea-9822-9688e773c3b6

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Task 22527: BE - Agregar parametro activo endpoint listado de bloques | Estado: Done
  - Asignado a: Brian Ezequiel Agüero
- Task 17553: BE - Endpoint listarBloqueos/age-l-bloqueos | Estado: Done
  - Asignado a: Brian Ezequiel Agüero
- Task 15373: Analisis funcional | Estado: Done
  - Asignado a: Natalia Gorriti
- Bug 22845: DEV - Fix paginado | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Task 17514: QA - Diseño de Casos de Prueba | Estado: Done
  - Asignado a: Cristian Fernando Alvarez
- Task 15374: Escritura de HU | Estado: Done
  - Asignado a: Natalia Gorriti
- Task 17508: FE - Maquetado Incremento Bloqueo + Agregar Obs. | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Task 20348: Code Review | Estado: Done
  - Asignado a: Marco Alex Brusa
- Task 15379: UX - Corrección mockup | Estado: Done
  - Asignado a: Julieta Victoria Viscarra
- Task 17515: QA - Ejecución de Casos de Prueba | Estado: Done
  - Asignado a: Cristian Fernando Alvarez
- Bug 23218: QA - Error al mostrar las fecha de un bloqueo activo | Estado: Done
  - Asignado a: Alfonso Oscar Koike
- Task 16679: Diseño tecnico | Estado: To Do
  - Asignado a: Marco Alex Brusa
- Bug 23750: QA - Se muestran los bloqueos que ya no estarían activos | Estado: Done
  - Asignado a: Cristian Fernando Alvarez
- Bug 23851: QA - Error en fecha y horario en bloqueo | Estado: Done
  - Asignado a: Cristian Fernando Alvarez
- Task 17509: FE - Integracion Endpoint | Estado: Done
  - Asignado a: Romina Daiana Luzzi
- Task 15203: UX - Diseño de mockup | Estado: In Progress
  - Asignado a: Melanie Garcia


