# HU 6003 - 5. HdU- Historial de Auditoría

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/6003/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU - Historial de Auditoría 

 

Como: Auditor
del Sistema ODI. 

Quiero: Listar el historial de las personas auditadas. 

Para: Visualizar el histórico de acciones realizadas por auditoría. 

 

 

Descripción y comportamiento: Desde el menú contextual del Auditor, se debe contar con una pestaña de historial (pantalla 1), donde se debe listar el historial de las personas auditadas, mostrando únicamente las personas que estén en estado de fusionado, revertido y diferenciado. En la grilla de consulta debe mostrarse los siguientes datos: Personas auditadas ("Persona 1" | "Persona 2"), Persona que notifico, Persona que audito, fecha de auditoría y estado de la auditoría. 

 

Esta pantalla debe contar con los siguientes filtros de búsqueda: Por persona auditada, usuario que notifica, estado y fecha de auditoría. La búsqueda por persona debe traer los candidatos asociados a esa notificación. 

 

Se debe contar con un botón de búsqueda, un botón para limpiar consulta y en cada fila un botón de visualización que llevará a un modal para ver el detalle de personas auditadas (Ver HdU de auditados), esta acción solo se verá en los registros de personas "Fusionadas" 

 

 
 

Link de pantallas: 

pantalla 1: Pantalla de historial de auditoría.

## Azure Criterios de Aceptacion
- Dado que es un listado de personas auditadas, solo debe mostrar las personas en estado de fusionado, revertido y diferenciado. 
- Cuando el registro (fila de la grilla) este en estado de "Fusionado", se mostrará un botón de visualización para poder ver el detalle de la fusión y poder revertir la fusión.

## Azure Tasks
- Sin tasks hijas en Azure.



