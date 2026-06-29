# HU 7021 - Edición de bloques de programación variable

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7021/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Implementacion realizada
- API: endpoint de edicion de bloque variable `PUT /api/v1/agendas/{agendaId}/bloques/{bloqueId}`.
- Reglas: valida intervalo mayor a cero y hora fin mayor a hora inicio.
- Persistencia: actualizacion de bloque en repositorio Postgres e InMemory.
- Front: formulario de edicion de bloques en detalle de agenda.

## Azure Descripcion
Como: Gestor de agendas. Quiero: Editar una programación horaria Para: Modificar la configuración de un bloque de programación. 
 Descripción y comportamiento: Desde la edición de la agenda, tendrá la opción en el marco de bloque programación, para editarlo ingresando desde el menú contextual o de la ventana de detalle, siempre y cuando el bloque este activo. 
 
 Para editar algunas configuraciones de dicho bloque, se limitara algunos datos que no podrán ser afectados en el proceso de la modificación. A los que se les permitirá la edición, se mencionan a continuación: 
 Datos no permitidos editar: - Tipo de bloque de programación 
- Fecha desde. (No permite, si la fecha a editar es menor o igual a la fecha del día de la edición) 
 Datos que se permitirán la editar:
 - Nombre de la programación. 
- Fecha hasta (Ver nota de casos posibles) 
- Fecha desde. (Se puede editar, si la fecha a editar es mayor a la fecha del día de la edición, osea se creo la agenda a futuro y no ha sido puesta en actividad)
 
- Seleccionar Días de asignación de turnos.
 
- Hora desde 
- Hora Hasta 
- Lugar de atención 
- Frecuencia 
- Turnos secuenciales 
- Prácticas médicas. Se podrán eliminar o agregar prácticas al bloque, considerando al menos una práctica para poder guardar. 
- Gestión de cupos. 
 
 
 
 En el caso de prácticas y gestión de cupos, se podrán agregar o quitar de la programación las prácticas ya definidas y quitar reglas de cupos ya configurados y/o crear nuevas reglas. 
 
 
 Nota de casos posibles en la modificación datos que afecten a los turnos agendados: 1) Extensión de la fecha, hora, días, frecuencia del bloque, a una fecha futura. En este primer caso, el flujo no genera ningún inconveniente ni validación con respecto a los slots que se encuentren activos, se permite la extensión del bloque hasta la fecha que se indique, hasta la fecha indicada, se crearán nuevos slot de acuerdo a los días establecidos en el bloque. 2) Reducción de la fecha hasta, hora desde, hora hasta, frecuencia a una fecha hasta mayor a la actual. En el caso de reducción de la vigencia del bloque, se debe validar las siguientes condiciones: si el bloque tenía slots activos y asignados a turnos, se cancelarán los turnos de los pacientes pasándolas a un estado por reasignar y los slot ocupados quedarán en estado de bloqueados. En el caso de que los slot estén activos y libres serán bloqueados para que no queden disponibles para ser asignado. 3) Reducción de la fecha hasta, a una fecha menor a la actual. En el caso de que la fecha hasta sea menor a la fecha actual, no se permitirá la edición de la misma. Resumen: al momento de realizar cualquier cambio en la configuración del bloque de programación que afecte a la definición de un slot, los mismos deben ser revisados en cuanto a si tienen asociado un turno y eventualmente reprogramarlo. 
 https://xd.adobe.com/view/7281821b-7083-4c60-8728-bf3dcde84523-27d2/screen/800a2ca4-fcae-440a-b611-7c8544b6ca3a/

## Azure Criterios de Aceptacion
- Se debe respetar las condiciones de datos permitidos y no permitidos a la hora de editar el bloque de programación. Se debe considerar las reglas explicadas para el campo fecha desde. 
- Se debe alertar antes de eliminar algunas practica médica, Ver pantalla 3 
- En el caso de cortar la vigencia del bloque, se debe validar si los slot afectados han sido asignados, de ser así se deben cancelar los turnos al pacientes, y cambiar el estado tanto de los turnos como del slot como se indica en la HU 
- No debe permitir guardar la edición de la configuración si esta no cuenta con al menos una practica medica asociada.
 
- Al editar dar el mensaje de éxito

## Azure Tasks
- Task 15354: Ajuste de HU | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 16615: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 11459: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11456: Análisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



