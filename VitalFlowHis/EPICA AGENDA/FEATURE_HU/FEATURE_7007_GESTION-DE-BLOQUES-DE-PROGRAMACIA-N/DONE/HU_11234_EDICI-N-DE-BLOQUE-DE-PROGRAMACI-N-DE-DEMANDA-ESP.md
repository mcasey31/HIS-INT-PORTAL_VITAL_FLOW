# HU 11234 - Edición de bloque de programación de demanda espontanea

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11234/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Editar una programación horaria Para: Modificar la configuración de un bloque de programación. Descripción y comportamiento: Desde la edición de la agenda, se tendrá la opción en el marco de bloque programación, para editar algunas configuraciones de dicho bloque. Desde la edición del bloque, estarán limitadas e incluso inhabilitadas algunas datos que no podrán ser afectados en el proceso de la modificación y otros el cual si se les permitirá la edición, (pantalla 2) estos datos se mencionan a continuación. 
 
 
 
 
 Datos no permitidos editar: Fecha desde. (No permite, si la fecha a editar es menor o igual a la fecha del día de la edición) 
 Datos que se permitirán la editar: Nombre de la programación. 
Seleccionar Días 
Fecha hasta (Ver nota de casos posibles) 
 (Se puede editar, si la fecha a editar es mayor a la fecha del día de la edición, osea se creo la agenda a futuro y no ha sido puesta en actividad)
 
Hora desde 
Hora hasta 
Lugar de atención 
Prácticas médicas (Product Backlog Item 11197: Eliminar prácticas médicas del BP). Se podrán eliminar o agregar prácticas al bloque, considerando al menos una práctica para poder guardar. 
Gestión de cupos. 
 En el caso de prácticas médicas y gestión de cupos, se podrán agregar o quitar de la programación las prácticas ya definidas y quitar reglas de cupos ya configurados y/o crear nuevas reglas. Nota de casos posibles en la modificación datos que afecten a los turnos agendados: 1) Extensión de la fecha, hora, dias, frecuencia del bloque, a una fecha futura. En este primer caso, el flujo no genera ningún inconveniente ni validación, se permite la extensión del bloque hasta la fecha que se indique, hasta la fecha indicada, se crearán disponibilidad de acuerdo a los días establecidos en el bloque. 2) Reducción de la fecha hasta, hora desde, hora hasta, frecuencia a una fecha hasta mayor a la actual. En el caso de reducción de la vigencia del bloque, no se deberá realizar ninguna validación, solo realizar los cambios. 3) Reducción de la fecha hasta, a una fecha menor a la actual. En el caso de que la fecha hasta sea menor a la fecha actual, no se permitirá la edición de la misma. 
 
 DER Diagrama de agendas - dbdiagram.io 
https://xd.adobe.com/view/c6b4bd51-b7a1-47fd-867a-11473a8eb518-93e7/screen/6d728051-d21d-484d-b68e-afd91885c165/

## Azure Criterios de Aceptacion
- Se debe respetar las condiciones de datos permitidos y no permitidos a la hora de editar el bloque de programación. Se debe considerar las reglas explicadas para el campo fecha desde. 
- Se debe alertar antes de eliminar algunas práctica médica, Ver pantalla 3 
 
- Al editar dar el mensaje de éxito 
- No debe permitir guardar la configuración si esta no cuenta con al menos una practica medica asociada.

## Azure Tasks
- Test Case 17639: QA - Verificar Datos que se permitirán la editar - Seleccionar Días | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17646: QA - Verificar Datos que se permitirán la editar - Reducción de la fecha hasta, hora desde, hora hasta, frecuencia a una fecha hasta mayor a la actual | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17644: QA - Verificar Datos que se permitirán la editar - Prácticas médicas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17638: QA - Verificar Datos que se permitirán la editar - Nombre de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16593: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 17635: QA - Verificar Edicion en Editar Agenda | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17650: QA - CR - Al editar dar el mensaje de éxito | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17518: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17651: QA - CR - No debe permitir guardar la configuración si esta no cuenta con al menos una practica medica asociada. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17637: QA - Verificar Datos no permitidos editar - Fecha Desde | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17642: QA - Verificar Datos que se permitirán la editar - Hora hasta | Estado: Design
 - Asignado a: Alfonso Oscar Koike
- Bug 23445: QA - Edición de bloque de programación de demanda espontanea - Error Menu Contextual | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17643: QA - Verificar Datos que se permitirán la editar - Lugar de atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17647: QA - Verificar Datos que se permitirán la editar - Reducción de la fecha hasta, a una fecha menor a la actual | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17519: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17645: QA - Verificar Datos que se permitirán la editar - Extensión de la fecha, hora, dias, frecuencia del bloque, a una fecha futura | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11559: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 23210: QA - Reducción de Fecha Hasta a una fecha menor a la Actual - Error | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 23190: QA- Edicion de BP Extensión de Dias , Horas, Fecha Futura - NO se Actualiza en Turnos | Estado: Removed
 - Asignado a: Eduardo Ynoub
- Test Case 17640: QA - Verificar Datos que se permitirán la editar - Fecha hasta | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17463: FE - Verificar Comportamiento de Edicion de Bloques | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 17636: QA - Verificar Edicion en Editar Agenda | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23650: BD - FIX 2 sobre sp de edicion BPF | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 15466: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 22707: BE - Vericar editar bloque dem espontanea. sacar duracionTurnos requerido | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 23141: QA - Despues de Editar y agregar Practica Medica - No se habilita el boton Guardar | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17634: QA - Verificar Edicion en Gestion de Agendas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17648: QA - CR - Se debe respetar las condiciones de datos permitidos y no permitidos a la hora de editar el bloque de programación.  Se debe considerar las reglas explicadas para el campo fecha desde | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11558: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 17641: QA - Verificar Datos que se permitirán la editar - Hora desde | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17649: QA - CR - Se debe alertar antes de eliminar algunas práctica médica | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17464: FE - Verificar Comportamiento de Obtener de Bloques a Editar | Estado: Done
 - Asignado a: Romina Daiana Luzzi



