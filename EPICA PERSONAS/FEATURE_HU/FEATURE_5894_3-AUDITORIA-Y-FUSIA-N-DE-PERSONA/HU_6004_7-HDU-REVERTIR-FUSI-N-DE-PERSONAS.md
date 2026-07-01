# HU 6004 - 7. HdU- Revertir fusión de personas

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/6004/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU - Revertir fusión de personas 

 

Como: Auditor
de empadronamiento. 

Quiero: Revertir fusión de personas. 

Para: Desvincular registros fusionados. 

 

Descripción y comportamiento: Desde la pantalla de detalle de personas fusionadas, se podrán revertir la fusión mediante el botón "Revertir fusión" (pantalla 1). Esta acción, en primera instancia desvinculará a la persona que quedo en estado inactivo respecto de la activa, activándola nuevamente en el sistema. 

 

En una segunda instancia, se procede a revertir los datos fusionados de la persona que quedó activa. Los datos del set mínimo no sufrirán cambios ya que se toma el mismo set de datos de la persona que quedo activa al momento de la fusión. Para los marcos que contengan los datos de tipo de contacto, dirección, y persona de contacto, se tomara la vigencia de los registros ( "fecha desde" y "fecha hasta"), inactivando los que tengan fecha registrada al momento de la fusión, y dándole vigencia los que fueron desactivados en esta misma fecha. 

 

 Link de pantallas: 

pantalla 1 Detalle de fusionados

## Azure Criterios de Aceptacion
- Dado que se revierte la fusión entre dos personas, ambas quedarán desvinculadas en el sistema y en estado activo en el padrón. Debe ubicarse en el mismo estado en que se encontraba antes de la fusión, ya sea temporal, validado o permanente. 
- Cuando se realice esta acción se actualizará el estado de las notificaciones de auditoría de ambas personas de "Fusionado" a "Revertido".

## Azure Tasks
- Sin tasks hijas en Azure.



