# HU 11233 - Edición de bloque de programación fija

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11233/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Editar un bloque de programación horaria fija Para: Modificar la configuración de un bloque de programación. Descripción y comportamiento: Desde la edición de la agenda, se tendrá la opción en el marco de bloque programación (pantalla1), para editar algunas configuraciones de dicho bloque. Desde la edición del bloque, estarán limitados e incluso inhabilitados algunos datos que no podrán ser afectados en el proceso de la modificación y otros el cual si se les permitirá la edición, (pantalla 2) estos datos se mencionan a continuación. Datos no permitidos editar: Tipo de bloque de programación 
Duración de slot 
 Datos que se permitirán la editar: Nombre de la programación. 
Seleccionar Días 
Fecha hasta (Ver nota de casos posibles) 
Fecha desde. (Se puede editar, si la fecha a editar es mayor a la fecha del día de la edición, ósea se creó la agenda a futuro y no ha sido puesta en actividad)
 
Atiende feriados 
Hora desde 
Hora hasta 
Lugar de atención 
Frecuencia 
Semana (si se selección de orden mensual en la frecuencia) 
Nº de sobreturnos 
Prácticas médicas. Se podrán agregar prácticas al bloque, considerando al menos una práctica para poder guardar. 
Gestión de cupos. 
 En el caso de prácticas médicas y gestión de cupos, se podrán agregar a la programación las prácticas ya definidas y quitar reglas de cupos ya configurados y/o crear nuevas reglas.(Pantalla3) Nota de casos posibles en la modificación datos que afecten a los turnos agendados: 1) Extensión del bloque programación. En este primer caso, el flujo no genera ningún inconveniente ni validación con respecto a los slots que se encuentren activos, se permite la extensión del bloque hasta la fecha que se indique, hasta la fecha indicada, se crearán nuevos slots de acuerdo a los días establecidos en el bloque. 2) Reducción del bloque de programación. En el caso de reducción de la vigencia del bloque, se debe validar las siguientes condiciones: 
 a) si el bloque tenía slots activos y asignados a turnos, se cancelarán los turnos de los pacientes pasándolas a un estado "cancelado por agenda" para reasignar y los slot ocupados deberán ser eliminados. 
 b) en el caso de que los slot estén activos y libres serán eliminados directamente. 3) Reducción de la fecha hasta, a una fecha menor a la actual. En el caso de que la fecha hasta sea menor a la fecha actual, no se permitirá la edición de la misma. En resumen, al momento de realizar cualquier cambio en la configuración del bloque de programación que afecte a la definición de un slot, los mismos deben ser revisados en cuanto a si tienen asociado un turno y cambiar a un estado de reasignar. Pantallas: pantalla1: Edición de agendas (Marco de bloque programación) pantalla 2: Edición del bloque de programación. Pantalla3: Alerta de eliminación de prácticas médicas. DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Se debe respetar las condiciones de datos permitidos y no permitidos a la hora de editar el bloque de programación. Se debe considerar las reglas explicadas para el campo fecha desde. 
- Se debe alertar antes de eliminar algunas práctica médica, Ver pantalla 3 
 
- En el caso de cortar la vigencia del bloque, se debe validar si los slot afectados han sido asignados, de ser así se deben cancelar los turnos al pacientes, y cambiar el estado tanto de los turnos como del slot como se indica en la HU
 
- No debe permitir guardar la configuración si esta no cuenta con al menos una práctica médica asociada.
 
- Al editar dar el mensaje de éxito
 
- Si la modificación de la fecha hasta no es mayor a la fecha actual deberá salir un mensaje "La fecha hasta debe ser mayor a la fecha actual. Verifique e intente nuevamente" 
-

## Azure Tasks
- Task 13268: FE - Agregar enlace de editar en el listado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 13252: QA - Editar Hora Desde y Hora Hasta | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13253: QA - Editar Lugar de Atención | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 16528: QA - No se debe poder cambiar 'Duración del Turno' | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 13045: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13454: QA -Alerta antes de eliminar prácticas médicas. | Estado: New
 - Asignado a: Natalia Gorriti
- Task 13042: QA - Creación de casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13255: QA - Editar Número de Sobreturnos | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13249: QA - Seleccionar Días | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 17106: QA - Error al editar un bloque de programación | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 13256: QA - Editar Prácticas Médicas | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13129: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13946: BD - nuevos estados de turnos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 13254: QA - Editar Frecuencia y Semana | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13250: QA - Editar Fecha Desde | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13258: QA - Validación de Fecha Hasta Menor a la Actual | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 13251: QA - Editar Fecha Hasta | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13365: FE - Integrarar el listado de practicas y verificar si las practicas medicas aparecen en el editar bloque | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13048: BE - Endpoint actualizar bloque | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11457: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 13257: QA -Alerta antes de eliminar prácticas médicas | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13043: FE- Logica edición Bloque programación | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13804: BD - Stored Procedure Edición de Bloque de Programación | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 13248: QA - Editar Nombre de la Programación | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13051: BE - Endpoint obtenerFrecuenciaSelector | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13061: FE- Integración EP actualizar Bloque | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12923: Diseño - Edicion bloque programación fija | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 11458: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti



