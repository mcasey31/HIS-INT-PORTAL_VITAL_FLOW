# HU 12687 - Mensajes de advertencia de limitación de slot por bloques de programación

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12687/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas 

Quiero: Generar un mensaje de alerta en la creación de bloques de programación 

Para: Optimizar los recursos del sistema (ver) 

 

Descripción y comportamiento: 

Tanto en la creación ITEM 7027, como en la edición de un bloque de programación ITEM 11233 (fijo o programado) al momento de setear la "fecha hasta" en la configuración del mismo, si la fecha excede la cantidad de 6 meses, el sistema deberá alertar al usuario mediante un mensaje que lo indique. En caso de confirmar la acción, continuará con la configuración del bloque, si selecciona cancelar, se cerrará el modal y el sistema nos llevará nuevamente al campo "Fecha hasta". 

 

Configuración de fechas 

 
 
 Modal 
 
 
 
 Link de pantallas 
https://xd.adobe.com/view/80f530b6-03ff-4f97-b88b-fabdd6680480-d5a6/

## Azure Criterios de Aceptacion
- La validación se realizará al momento de seleccionar la fecha "hasta". 
- Si selecciona continuar, seguirá con la configuración del bloque, en caso de seleccionar "Volver" lo llevará nuevamente a fecha hasta.

## Azure Tasks
- Task 14438: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 13085: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 13227: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 14437: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 14131: Diseño | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 14466: FE - Validacion Fecha desde y hasta si supera el maximo de 6 meses | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez



