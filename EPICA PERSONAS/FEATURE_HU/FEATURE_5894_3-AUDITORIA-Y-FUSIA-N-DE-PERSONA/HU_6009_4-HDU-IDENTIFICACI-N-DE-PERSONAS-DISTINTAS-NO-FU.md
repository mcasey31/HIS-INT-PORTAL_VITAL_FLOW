# HU 6009 - 4. HdU- Identificación de personas distintas (no fusión)

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/6009/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU - Identificación de personas distintas (no fusión) 

 

Como: Auditor
del Sistema ODI. 

Quiero: Indicar que los registros de personas son diferentes. 

Para: Quitarlas del listado de notificaciones. 

 

Descripción y comportamiento: Desde la pantalla de detalle de duplicados, en el botón de "Personas Diferentes" (pantalla 1), se indica que los candidatos notificados son distintas. Desde esta acción se cambiará el estado a ambas personas en las notificaciones de auditoría de "Pendientes" a "Diferenciado". 

 

 

Link de pantallas: 

pantalla 1: Detalle de duplicados. 
 

pantalla 2: Mensaje de Personas diferentes.

## Azure Criterios de Aceptacion
- Dado que, se identifico que las personas son diferentes, se debe cambiar el estado de "Pendientes" a "Diferenciado" para excluirlos del listado de notificados. 
- Se notificará mediante un tooltip que: Se diferenció a las personas: Persona 1 y Persona 2 (igual que en la fusión, ver pantalla 2)

## Azure Tasks
- Sin tasks hijas en Azure.



