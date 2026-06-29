# HU 8988 - Edición de la Agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/8988/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Test Case 12661: Verificar cantidad de caracteres en observaciones.
- Test Case 12662: Editar Agenda a futuro (fecha desde).
- Bug 23197: Icono Home no vuelve a Home ODI.

## Pantalla objetivo para mock
- Pantalla: Edicion de Agenda desde detalle.
- Componentes: campos editables, validacion de observaciones, control de fechas, navegacion de regreso a Home.

## Azure Descripcion
Como: gestor de agendas. Quiero: editar la agenda de un profesional/grupo profesionales/dispositivo Para: modificar los datos básicos de la agenda. 

Descripción y comportamiento: 

 
 Una vez identificada la agenda vamos a acceder a la funcionalidad de edición de la agenda. Se accederá a la pantalla de edición que contendrá los datos precargados de la agenda seleccionada (Pantalla1). Los campos que se habilitarán para modificar serán: 
 Fecha desde. (Se puede editar, si la fecha a editar es mayor a la fecha del día de la edición, osea se creo la agenda a futuro y no ha sido puesta en actividad)
 Fecha hasta: se podrá editar teniendo como referencia la vigencia de los bloques de programación creados (dd/mm/aaaa) Nombre de agenda (*): Texto libre, no puede ser nulo ni repetirse. (70 caracteres) Observaciones: Texto libre (140 caracteres) Bloques de programación: HU (Product Backlog Item 11233: Edición de bloque de programación fija) Product Backlog Item 11234: Edición de bloque de programación de demanda espontanea. Product Backlog Item 7021: Edición de bloques de programación variable 
 Si la edición de le fecha hasta es extender la fecha de vigencia de la agenda, esta no afectará a la vigencia de los bloques de programación y solo se generará la extensión de la estructura de la agenda. La fecha hasta no podrá ser menor a la máxima fecha de vigencia de los bloques de programación de dicha agenda, activando un mensaje informativo de que se deberá modificar cada fecha hasta de cada bloque de programación y luego realizar el cambio en la fecha hasta de la agenda. La fecha hasta ya no afecta a ningún bloque de programación, se podrá modificar hasta el dia de la fecha de la edición. 
 Al realizar la edición se visualizará un mensaje indicando que se editó con éxito la agenda. (Pantalla2) 
 
 Nota: -El hecho de ampliar la vigencia de la agenda no garantiza la ampliación de la programación horaria, esta es una acción que debe realizarse desde la edición del bloque de programación. -No se podrá editar una agenda con fecha de inactivación previa al día de la fecha.
-En el caso de requerirse que la fecha hasta sea menor a la fecha de vigencia de un bloque de programación se mostrará un mensaje informativo del porque no se puede realizar dicha acción.
 -Una agenda pasa a estado Inactivo una vez que el dia de la fecha sea mayor a la Fecha Hasta de la agenda. -Si el nombre es igual se mostrará el siguiente mensaje "Ya existe programación activa con un nombre de agenda similar. Verifique y cambie el nombre" 
 Link de pantalla Pantalla1: Ventana de detalle
 Pantalla2: Mensaje de confirmación
 
 DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Solo se permite en la edición de la agenda, la modificación de los campos nombres de agenda, fecha hasta, observaciones y bloques de programación, el resto de los campos debe estar griseados (inhabilitados) 
- Al editar la fecha hasta de la agenda, esta puede ser nula 
- La fecha hasta no podrá ser menor a la máxima fecha de vigencia de los bloques de programación de dicha agenda. Se mostrará el siguiente mensaje "La fecha de hasta de agenda no puede ser menor a la fecha hasta de los bloques de programación. Verifique o cambie las fechas de bloques." 
Validar que el nombre de la agenda sea único. 
No se podrán editar agendas que se encuentren en estado "Inactivo". 
Una agenda pasa a estado Inactivo una vez que el día de la fecha sea mayor a la Fecha Hasta de la agenda. 
Si por algún error no se puede realizar el guardado de la edición saldrá el siguiente mensaje "No se pudo guardar. Verifique e intente más tarde" 
La Fecha desde se puede editar, si la fecha a editar es mayor a la fecha del día de la edición, osea se creo la agenda a futuro y no ha sido puesta en actividad.

## Azure Tasks
- Task 12226: FE - Validaciones | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12227: FE - Agregar botón edición | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12220: BE - Endpoint para Edición Agenda | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 12222: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Test Case 12661: QA - Verificar cantidad de caracteres en el campo Observaciones | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12230: QA - Ejecución Casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 12228: FE - Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 11289: Analisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 12611: QA-Alerta al editar una agenda | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12221: BE - Pruebas unitarias | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 12593: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 12384: BE - Pruebas Unitarias editarAgenda/age-u-agenda | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 12224: FE - Integración de agenda by ID | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12225: FE - Integración del PUT | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 12501: DEV - No puedo modificar campos si no cambio de nombre | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11291: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Bug 12520: QA - Si trato de guardar una agenda editada cuya fecha desde es menor a hoy no me deja | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 12229: QA - Creación casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 12610: QA - Si trato de guardar una agenda editada cuya fecha desde es menor a hoy no me deja | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 12662: QA - Editar Agenda a futuro "Fecha desde" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23197: QA - Icono Home - No vuelve al Home de ODI | Estado: Done
 - Asignado a: Alfonso Oscar Koike



