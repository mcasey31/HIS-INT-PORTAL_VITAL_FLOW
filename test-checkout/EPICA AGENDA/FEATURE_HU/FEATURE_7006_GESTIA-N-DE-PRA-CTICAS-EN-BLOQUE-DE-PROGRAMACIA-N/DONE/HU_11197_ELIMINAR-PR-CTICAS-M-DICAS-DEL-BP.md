# HU 11197 - Eliminar prácticas médicas del BP

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7006_GESTIA-N-DE-PRA-CTICAS-EN-BLOQUE-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11197/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de Agendas Quiero: Eliminar una práctica de un bloque de programación Para: Modificar el listado de las prácticas que se ofrecen en el bloque de programación que se encuentre activo. 
 Descripción y comportamiento Desde la edición de un bloque de programación, en el marco de Prácticas Médicas se debe tener la opción de eliminar una o más prácticas de dicho bloque, como se muestra a continuación. 
 
 
 Al eliminar una o más prácticas en un bloque de programación sea fijo, variable o demanda espontanea, se debe validar si existen turnos asignados con la(s) práctica(s) que se esta(n) eliminando. En el caso de encontrar turnos, se cancelaran esos turnos asignando a pacientes que estén pendiente por realizarse. 
 Al eliminar la práctica(s), se alertará de la acción a realizar. 
 
 
 
 
 Al finalizar la eliminación se debe dar un mensaje del proceso de ha realizado, como se indica a continuación. 
 
 
 
 Link de pantallas:Editar agendas

## Azure Criterios de Aceptacion
- Se debe alertar antes de eliminar una práctica médica del bloque de programación. 
- Si se elimina una práctica y esta tenias turnos médicos asignados pendientes, se deben cancelar los turnos.

## Azure Tasks
- Test Case 17094: QA - Verificar Notificación de Eliminación - Practicas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17085: QA - Verificar Boton de Eliminación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17039: BE - obtener turnos afectados | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 17038: BE - Eliminar practicas bloque de programacion eliminarPractica/age-d-bloqprogprac | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16953: FE - Modal Advertencia Turnos a Eliminar por practica | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 17090: QA - Verificar Notificación de Error de Eliminación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17097: QA - CR - Si se elimina una práctica y esta tenias turnos médicos asignados pendientes, se deben cancelar los turno | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17693: FE - Verificar eliminación listados de practica | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16955: FE - Manerar la eliminacion de practicas entre memoria y no | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17009: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16956: FE - Integrar el modal en el comportamiento de seleccion en el agregar practica | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11567: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 17088: QA - Verificar Modal de Eliminación - Si, Eliminar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16681: Diseño tecnico | Estado: To Do
 - Asignado a: German Facundo Skrobak
- Test Case 17096: QA - CR - Se debe alertar antes de eliminar una práctica médica del bloque de programación. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17089: QA - Verificar Notificación de Eliminación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17091: QA - Verificar Modal de Eliminación - Practicas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17714: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17010: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17084: QA - Verificar Icono de Eliminación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17092: QA - Verificar Modal de Eliminación - Practicas - Boton Cancelar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16954: FE - Integrar DELETE Practica | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 22560: QA - Al querer consultar para eliminar un turno no encuentra la practica | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23515: BE - Corrección listado de horarios disponibles | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 17125: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 17093: QA - Verificar Modal de Eliminación - Practicas - Si, Eliminar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17552: BD - Baja logica para bloques practica | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Bug 23097: QA - Eliminacion de una Practica en BP - No se actualiza en Turnos | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 11564: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16587: DB - Cambios base de datos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 17087: QA - Verificar Modal de Eliminación - Boton Cancelar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17086: QA - Verificar Modal de Eliminación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17095: QA - Verificar Notificación de Error de Eliminación - Practicas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



