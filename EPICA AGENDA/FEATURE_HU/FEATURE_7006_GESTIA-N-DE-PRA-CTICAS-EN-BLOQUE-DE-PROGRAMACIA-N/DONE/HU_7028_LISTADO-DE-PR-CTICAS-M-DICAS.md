# HU 7028 - Listado de prácticas médicas

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7006_GESTIA-N-DE-PRA-CTICAS-EN-BLOQUE-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7028/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. 
 Quiero: Listar las prácticas de una agenda. Para: Visualizar las prácticas de una agenda programada. 

 

Descripción y comportamiento: Después de definir el bloque de programación horaria de una agenda, se debe listar las prácticas médicas que se seleccionó en el Modal de agregar prácticas Ver HdU, en una grilla de prácticas médicas por cada bloque de programación horaria, como se muestra en la siguiente (pantalla 1). 

La lista de practicas médicas tendrá las siguientes columnas en la grilla: 

Práctica médica, duración y cesto de eliminación. 

La grilla debe contar con las funcionalidades de eliminar prácticas. En este caso contará en la columna de eliminación con el cesto de basura (esta eliminación tendrá la función de sacar de la lista las práctica que de último momento no se requiera incluir en la programación, borrado físico). Si se desea eliminar una práctica se debe alertar mediante un modal como se muestra a continuación.(pantalla 2) y al eliminar se debe mostrar el mensaje de la notificación de la eliminación ver (pantalla 3). 

En esta grilla de prácticas no se contará con los botones de exportar ni el botón columnas; si su paginación al final de cada grilla. 
 

 

 

 

Link de pantallas: 

pantalla 1: Pantalla de agregar programación. 
 

pantalla 2: Modal de alerta de eliminación de prácticas médicas. 
 

pantalla 3: Mensaje de eliminación. 
 

 

DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- La grilla debe contar con las funcionalidades de eliminación de prácticas médicas. 
 
- Cada bloque de programación horaria debe contar con su grilla de prácticas médicas. 
- La duración de la práctica se debe tomar del AMB de prácticas, en caso de no se definida en el bloque de programación.

## Azure Tasks
- Bug 13584: QA- No se visualiza el modal con la confirmación o negación si deseo eliminar o no una PM | Estado: New
 - Asignado a: Marco Alex Brusa
- Task 12558: BE - Endpoint listado de prácticas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12599: QA - Creación de casos de prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 12555: FE - Maquetado de la grilla | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 13401: QA-No permite seleccionar bloque de programación | Estado: New
 - Asignado a: Vilma Ines Sanchez
- Task 11563: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 12435: Diseño - Grilla practicas medicas | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 12621: Revisión de tablas para prácticas | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 12600: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 11562: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



