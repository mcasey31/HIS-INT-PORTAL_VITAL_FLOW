# HU 12422 - Estados de Agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12422/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 13889: FE modificar grilla de listado de agendas.
- Task 13891: FE modificar detalle de agenda.
- Task 13892: FE modificar agregar/editar agenda con chip de estado.

## Pantalla objetivo para mock
- Pantallas: Listado, Detalle y Formulario con estado visual.
- Componentes: chip Activa/Inactiva, accion de cambio de estado y consistencia visual en todas las vistas.

## Azure Descripcion
Descripción de estados de una agenda La agenda contará con 4 estados. Los estados son los siguientes: - "Creada": son las agendas que se realizó el guardado de la estructura de la agenda y no se realizó la cargas de algún bloque de programación. 
- "Activa": son las agendas que tengan un bloque de programación activo definido. 
 - "Inactiva": son agendas que se encuentren en este estado es porque tienen bloque de programación definidos en estado inactivos. Los bloques de programación inactivos son los que al cumplir su fecha hasta dejan de tener disponibilidad horaria vigente y pasan a este estado. 
- "Finalizada": para este último caso va a darse cuando la agenda se encuentre con su vigencia cumplida. No tendra la opcion de poder editar la agenda.

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Task 12423: Análisis, diagrama y escritura | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 14274: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13915: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13898: BE - Modificar obtenerAgendas/age-l-agendas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 13903: BE - Modificar obtenerDetalleAgenda/age-byid-agenda | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 13888: FE - Modificar interfaces en Agenda | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 13891: FE - Modificar Detalle de Agenda | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 14394: QA - Difiere estado para una agenda que contenga misma fecha: desde y hasta | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13892: FE - Modificar Agregar/Editar Agenda el chip | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 13914: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13902: BE - Modificar editarAgenda/age-u-agenda | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 12977: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 13889: FE - Modificar Grilla de Listado de Agendas | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez



