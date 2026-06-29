# HU 12136 - Asignación de Sobre turnos

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12136/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de sobreturno Quiero: Asignar un sobreturno Para: realizar la registración del paciente en un sobreturno 
 Descripción y comportamiento 
 Luego de realizar la búsqueda de los horarios disponibles como en la HU(Product Backlog Item 9743: Búsqueda de Disponibilidad Horaria - según: Centro; Servicio y Práctica) y al ser un gestor de sobreturnos podrá asignar sobreturnos a las agendas configuradas. 
 
 La búsqueda también mostrará agendas que tengan slot de tipo "ST" si la agenda tienen sobreturnos configurados (mayores a cero), incluso si no tienen turnos disponibles. Si la el bloque tiene configurado sobreturnos pero no cuenta con disponibilidad para poder asignarle, se deberá mostrar el boton grisado. 

Si la agenda tiene configurado sobreturnos, se mostrará un botón correspondiente. 
 
 Al hacer clic, se solicitará un horario dentro de la agenda. Si el horario ingresado está fuera del rango de la agenda, se mostrará un mensaje que dirá "La hora no es válida dentro del rango horario". 
 
 
 
 
 
 Al confirmar, se generará un turno de tipo sobreturno asociado al slot de tipo "ST" correspondiente, descontando uno de los sobreturnos disponibles. 
 
 
 El sobreturno debe vincularse al slot creado para este caso, ya que dicho slot toma el horario recién cuando se asigna a un paciente. 
 https://xd.adobe.com/view/4ba165b5-06ab-43d8-89d3-50f3b686f746-1ef2/

## Azure Criterios de Aceptacion
- Si el usuario cuenta con la funcionalidad deberá poder ver el botón de sobreturno 
- Poder darle un sobreturno dentro de los horarios definidos de la agenda del día seleccionado 
- Una vez seleccionado el horario del sobreturno se deberá crear una pastilla con este. 
- Mermar la cantidad de sobreturnos al confirmar la asignación del sobreturno 
- El sobre turno es un tipo de turno "sobreturno" vinculado a un slot de tipo "ST" 
- Se debe dejar constancia para futura auditoría la información del usuario que realizar la asignación, el paciente al cual se le dio el turno, la fecha y hora del evento.

## Azure Tasks
- Task 23968: QA - Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Cristian Fernando Alvarez
- Task 24259: BE - Modificar Obtener listado de horarios disponibles de sobreturnos | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 23591: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23930: FE - Modificar Endpoint y pantalla Obtener turnos disponibles | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23931: FE - Modal Agregar hora de sobreturno | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13166: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 23967: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 13167: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 13493: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 23932: FE - Integrar obtener sobreturnos por bloques de programación | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Task 24258: BE - Creacion Obtener listado de horarios disponibles de sobreturnos | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 24260: BE - Creación Actualizar sobreturno | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 23934: FE - Revisar en QA | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Task 23933: FE - Integrar actualizar SobreTurno | Estado: To Do
 - Asignado a: Romina Daiana Luzzi



