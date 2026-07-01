# HU 11092 - Listado de reglas de cupos del bloque de programación

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_10957_GESTIA-N-DE-CUPOS
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11092/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Listar las gestiones de cupos del bloque de programación Para: Visualizar en una grilla las reglas establecidas en la gestión de cupos 

 

Descripción y comportamiento: Desde el bloque de programación, se debe listar las reglas generadas por la gestión de cupos del bloque de programación. 

La consulta de reglas de cupos de un bloque de programación, puede generar dos posible escenarios: 

 

1) Bloque sin reglas establecidas. De no poseer reglas establecidas se debe mostrar un mensaje como se indica en el mockoup. 

Grilla vacía de gestión cupos en el bloques de programación
 

 

 
 
 2) Bloque con regla establecidas.
 
 En la grilla de reglas de cupos dentro del bloque de programación, se debe visualizar las siguientes columnas: Financiador, Plan, Condición, Mensaje, al final de cada fila se visualizarán las opciones de "editar" HU ITEM 11089 y "eliminar" HU ITEM 11093 , esto en el caso de querer modificar o eliminar una regla establecida por gestión de cupo. 
 Grilla con lista de reglas de cupos por bloque de programación.
 
 
 
 https://xd.adobe.com/view/b69c17ff-e9e6-4d65-8d88-07c6bdb1f2bd-e3cf/

## Azure Criterios de Aceptacion
- De no poseer reglas establecidas en la gestión de cupo, se visualizarán el siguiente mensaje en la grilla "No gestiono cupos en el bloques de programación".
 
- Desde la grilla de gestión de cupos se debe permitir editar o eliminar las reglas configuradas en el bloque de programación.

## Azure Tasks
- Task 23946: FE - Modificar Obtener Detalle de Bloques de Programacion | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Task 24261: BE - Listado de reglas | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 23942: FE - Maquetar listado de configuracion de cupos | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15412: Ajuste de HU | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 11571: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11566: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23910: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 23911: QA - Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Alfonso Oscar Koike
- Task 23945: FE - Revisar en QA | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Task 23943: FE - Logica de Eliminar Configuración | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23643: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez



