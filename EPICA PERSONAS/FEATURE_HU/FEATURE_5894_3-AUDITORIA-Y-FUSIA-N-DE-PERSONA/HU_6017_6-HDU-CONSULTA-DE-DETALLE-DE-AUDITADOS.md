# HU 6017 - 6. HdU- Consulta de detalle de auditados

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/6017/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU - Consulta de detalle de personas auditadas 

 Como: Auditor de empadronamiento. 

 Quiero: Visualizar las personas auditadas. 

 Para: Revertir acciones realizadas. 

 Descripción y comportamiento: Desde la pantalla de historial de auditoria (pantalla 1), al seleccionar el botón de "visualizar" se abrirá una pantalla que nos mostrará el detalle de las personas auditadas. Esta pantalla (pantalla 2) contendrá un encabezado que mostrará la información de la auditoría (usuario que notificó, usuario que auditó, fecha y hora de la auditoría) y las personas que fueron fusionadas. Seguido del encabezado se mostrará un marco con los datos de la persona fusionada (registro actual), el cual contará con los siguientes datos (Set de datos mínimos, datos de contactos, dirección y personas de contacto) 
 Luego se presentarán en dos marcos con los datos de las personas antes de la fusión, el cual contendrá los datos de: Set de datos mínimos (tipo y número de documento, apellidos, nombres, sexo, fecha de nacimiento), datos de tipo de contactos, dirección, personas de contacto y el estado de cada candidato. Ver (pantalla 2)
 
 La pantalla de consulta de detalle de auditados contará con un botón para "Revertir fusión". Al indicar el revertir la fusión se abrirá un modal de confirmación de la acción (pantalla 3)
 
 Link de Pantallas: pantalla 1: Pantalla de historia de auditoría. 
 pantalla 2: Pantalla de detalle de personas fusionadas. 
 pantalla 3: Modal de confirmación de la acción

## Azure Criterios de Aceptacion
Dado que se van a reevaluar los registros de cada candidato, se debe poder ver toda la información de cada persona. 
Desde la pantalla de detalle de auditados se debe contar con la opción de "Revertir Fusión" para personas previamente fusionadas.

## Azure Tasks
- Sin tasks hijas en Azure.



