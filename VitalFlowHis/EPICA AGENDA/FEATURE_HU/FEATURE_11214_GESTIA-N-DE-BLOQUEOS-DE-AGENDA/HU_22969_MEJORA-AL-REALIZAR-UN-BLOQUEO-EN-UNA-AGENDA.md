# HU 22969 - Mejora al realizar un bloqueo en una agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/22969/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas Quiero: Realizar un bloqueo de agenda Para: Visualizar y gestionar de forma más clara el bloqueo que estoy por realizar Descripción y comportamiento 
 Se deberá optimizar el proceso de selección de los slots a bloquear. 

 - Se incorporará un botón ?oGENERAR BLOQUEO ? que redirigirá a una pantalla con los siguientes campos obligatorios: 

- Bloque de programación (bloques activos en la agenda, filtro que al seleccionarlo los horarios semanales que se cargarán serán los configurados en esa selección) 

 
- Fecha desde (Límite inferior del rango de bloqueo que se puede cargar manualmente o seleccionando los check) 

 
- Fecha hasta (Límite superior del rango de bloqueo que se puede cargar manualmente o seleccionando los check) 

 
- Hora desde (Límite inferior del rango de bloqueo que se puede cargar manualmente o seleccionando los check) 

 
- Hora hasta (Límite superior del rango de bloqueo que se puede cargar manualmente o seleccionando los check) 

 
- Motivo (Motivos por lo cual se bloquearan los slot) 

 
 
- Una vez completados los campos, se mostrarán los slots que se encuentren dentro del rango definido. Si primero se seleccionan los slots se deberá completar los campos obligatorios antes mencionados. 

 
- En la configuración semanal, cada slot se mostrará con su estado correspondiente y un color distintivo: 

- Programado 

 
- Libre 

 
- Bloqueado 

 
 
- Cada slot tendrá un check para poder seleccionarlo, excepto aquellos que ya estén en estado bloqueado, los cuales no deberán ser seleccionables.

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Task 23045: Escritura de HU | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Task 23074: UX - Diseño de mockup | Estado: In Progress
 - Asignado a: Melanie Garcia
- Task 23044: Análisis funcional | Estado: In Progress
 - Asignado a: Natalia Gorriti



