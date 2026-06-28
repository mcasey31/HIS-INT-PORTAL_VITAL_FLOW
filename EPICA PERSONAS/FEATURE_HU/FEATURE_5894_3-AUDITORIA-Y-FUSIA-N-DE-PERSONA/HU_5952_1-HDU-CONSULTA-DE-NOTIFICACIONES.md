# HU 5952 - 1. HdU- Consulta de notificaciones

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5952/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU - Consulta de notificaciones 

 

 Como: Auditor del empadronamiento. 

 Quiero: Visualizar las notificaciones de posibles personas repetidas. 

 Para: Analizar los datos recibidos de los notificados. 

 

 Descripción y comportamiento: Desde el menú contextual del Auditor (pantalla 1), se debe listar las notificaciones enviadas por el identificador de persona con estado "Pendiente", para la evaluación de los datos y realizar una posible fusión (o no) de registros. En el listado de notificaciones debe mostrarse en cada fila los datos de las personas notificadas (persona 1 y persona 2) con datos de edad, tipo, y numero de documento concatenados. Persona que notifica (notificador), y fecha y hora de notificación. Cada línea de registros contará con un botón para visualizar la información detallada de cada persona, para poder analizar, comparar, y eventualmente definir fusión. 

 

 La pantalla contará con tres filtros: Prestador (tipo select) (vendrá cargado por defecto según lugar de trabajo), Notificador (texto libre de selección), y fecha de notificación (date). Al completar los campos de notificador y/o fecha, se activará el botón de "Limpiar consulta", mientras que el de "Consultar" permanecerá siempre activo. 

Se mostrarán al auditor, solo los registros que estén asociados al mismo prestador de la persona que notifica. Las notificaciones no provendrán únicamente por denuncias de los identificadores de personas, ya que el auditor podrá también correr un proceso de buscador de duplicados. Ver HdU
 

 
 

 

 

Link de pantallas: 
 

pantalla 1 Listado de notificaciones.

## Azure Criterios de Aceptacion
Listar las notificaciones con estado "Pendiente" hasta tanto el auditor defina la acción a tomar. 

 
Según rol asignado podrá filtrar distintos sanatorios.

## Azure Tasks
- Sin tasks hijas en Azure.



