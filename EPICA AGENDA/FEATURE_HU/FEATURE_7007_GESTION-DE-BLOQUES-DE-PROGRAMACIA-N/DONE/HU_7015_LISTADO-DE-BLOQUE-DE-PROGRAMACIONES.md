# HU 7015 - Listado de Bloque de programaciones

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7015/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: listar los bloques de programación. Para: Visualizar las disponibilidades horarias de dichos bloques que se generaron por agenda. 

Descripción y comportamiento: Desde el marco de bloque de programación, en la pantalla de agregar agenda, se deben listar los bloques de programación creados por agenda (activos e inactivos). (Ver Pantalla 1) 

Si a la agenda no se le han configurado los bloques de programación, en esta grilla se visualizara un mensaje como indica el mockoup (ver pantalla 2). 

En la grilla de visualización deben indicarse por bloque de programación las siguientes columnas: Nombre de la programación, días, horarios, fecha desde y hasta(vigencia) y Estado, (ver pantalla 3). Al final de cada fila del bloque de programación, se visualizarán los íconos con las opciones de "visualizar", "editar" y un menú contextual con la opción de copiar (ver pantalla 4) (la opción editar estará habilitada para los bloques activos y la opción copiar para los bloques inactivos, esta dos opciones estará disponibles después de creada y configurada la agenda. 

 

Link de pantallas: 

Pantalla 1: Listado de bloque de programación de la agenda 

Pantalla 2: Listado de bloque de programación de la agenda vacío. 

Pantalla 3: Grilla de listado de bloque de programación 

Pantalla 4: Grilla de listado de bloque de programación (visualización de íconos visualizar, editar y menú contextual) 

 
 

DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Si a la agenda no se le han configurado los bloques de programación, en la grilla se visualizara un mensaje como indica el mockoup 
- Al "Guardar" en el alta de agenda, sólo quedarán activos los botones/íconos de ver detalle, editar o copiar según sea el caso, en la grilla de bloques de programación.

## Azure Tasks
- Task 11546: Estructura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 13408: QA - Verificar tooltips | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12548: FE - Maquetado de la grilla | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 13409: QA - Bloques de programación/ tooltip "Días" y distancia entre columnas | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 13267: QA - Estado de Agenda modo creado con bloques de programación activo | Estado: New
 - Asignado a: Sebastian Mario Baudracco
- Task 12595: QA - Creación de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 12588: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 11545: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 12596: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 12549: FE - Integración de grilla | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 12667: QA - Verificar orden de visualización por bloque | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12550: BE - Endpoint lista de bloques de programación | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12447: Diseño - Grilla de bloque de programación | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez



