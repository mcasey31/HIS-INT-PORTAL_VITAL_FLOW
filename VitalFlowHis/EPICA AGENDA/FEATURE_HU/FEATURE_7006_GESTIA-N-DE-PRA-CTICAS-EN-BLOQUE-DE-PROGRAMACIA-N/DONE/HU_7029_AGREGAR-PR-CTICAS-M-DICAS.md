# HU 7029 - Agregar prácticas médicas

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7006_GESTIA-N-DE-PRA-CTICAS-EN-BLOQUE-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7029/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. 
 Quiero: Agregar las prácticas en un bloque de programación de una agenda. Para: Tener asociadas las prácticas médicas a los a horarios programados de la agenda. 

Descripción y comportamiento: Desde la pantalla "Agregar Bloque de Programación", se debe tener la opción de "Agregar Prácticas" como se muestra en la (pantalla 1), al presionarlo debe abrir un modal para agregar las prácticas médicas, ver (pantalla 2). 

El modal contará con dos marcos ubicados horizontalmente; en el marco de la izquierda vendrán por default las prácticas asociadas al servicio y centro médico; igualmente contará con un buscador (Elemento <input> de tipo text) que permitirá filtrar prácticas de este listado, en relación a los caracteres (min 3) que se vayan ingresando. Cada práctica (fila) debe tener un check para poder seleccionarla y con los íconos de desplazamiento (flechas centrales) se podrán pasar de un marco al otro. 

En el caso de que la búsqueda no arroje resultados, o sea, no se encuentren prácticas con los datos ingresados, se debe arrojar un mensaje informando que no se encontraron resultados como se indica en la (pantalla 3) 

En el marco de la derecha, que será el marco de selección final de las prácticas, también contará con un buscador (Elemento <input> de tipo text) que permitirá buscar entre las prácticas seleccionadas y filtrar por los caracteres que se vayan ingresando en el buscador(esta acción se usará solo de requerirse, no es obligatoria). En el caso de retirar alguna práctica del listado ya preseleccionado, se podrá seleccionar y con los íconos de desplazamiento (flechas centrales) devolver al marco inicial para no incorporarla a la programación de la agenda. 

Una vez definido las prácticas que se van asociar a la programación de la agenda, se procede a guardar (guardado en memoria), listando las prácticas médicas en la grilla de prácticas del bloque de programación horaria (asociar con la historia de Lista de prácticas médicas VER HdU), para ser almacenadas al guardar el bloque de programación. (pantalla 4) 

Cada bloque de programación horaria debe contar con su selección de prácticas médicas, y con su grilla de prácticas seleccionadas. 

Link de pantallas: 

 pantalla 1: Pantalla de agregar programación
 pantalla 2: Modal para agregar prácticas médicas. 
 pantalla 3: Mensaje de no hay resultados. 
 pantalla 4: Practicas seleccionadas. 
 DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- La lista de prácticas que viene por dafault en el marco de la izquierda, deben estar asociadas el servicio médico del centro. La lista debe ser scrollable hasta el final de la misma y ordenada alfabéticamente. 
- Las búsqueda de prácticas en el marco de la izquierda debe realizarse por práctica y por el servicio médico identificado en la creación de la agenda. 
- Las búsqueda de prácticas en el marco de la derecha debe realizarse solo en las prácticas listadas en el marco y filtradas por nombre. 
 
- El modal debe contar con el botón Cancelar por si se decide no realizar la asociación de las prácticas. 
- Se debe asignar una o más prácticas para cada bloque de programación 
- Se deben visualizar los mensajes identificados en el mockop, cuando no hay resultados en la búsqueda de prácticas, cuando no se dispone de una selección de práctica y cuando se agregan las prácticas al bloque de programación. Ver mockop

## Azure Tasks
- Task 13060: FE - Maquetado | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 11561: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11560: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 13062: FE - Integracion endpoint | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 13443: QA - Error al traer las prácticas | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13063: QA - Creación de casos de prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 12594: Diseño de interfaces | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 13038: BE - Endpoint obtenerPracticasMedicasAgendaAutocompletado | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 13488: QA-Revisar que la palabra Prácticas se encuentra sin acento. | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 13064: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Vilma Ines Sanchez
- Task 13039: BE - Endpoint agregarBloquesProgramacion | Estado: Done
 - Asignado a: Tomas Goncalves



