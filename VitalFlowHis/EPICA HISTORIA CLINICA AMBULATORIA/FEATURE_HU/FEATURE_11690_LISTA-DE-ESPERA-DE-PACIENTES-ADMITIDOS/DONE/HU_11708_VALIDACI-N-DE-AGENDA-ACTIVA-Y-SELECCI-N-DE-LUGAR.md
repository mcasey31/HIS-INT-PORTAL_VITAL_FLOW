# HU 11708 - Validación de agenda activa y selección de lugar de atención

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11708/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como profesional asistencial, 

Quiero validar que el profesional, la fecha y hora y el lugar corresponden a una agenda activa y seleccionar un lugar de atención 

Para mostrar el listado de pacientes asignado con sus estados 

Descripción Luego de ingresar al servicio en la HU (Product Backlog Item 11707: Selección de servicio), se debe buscar y validar la información correspondiente al profesional, el centro, el servicio, la fecha y hora actual. Si la búsqueda no encuentra un resultado deberá mostrar la siguiente pantalla. 
 
 
 Luego de cerrar el modal el profesional podrá acceder a la agenda asistencial con el siguiente mensaje. 
 
 
 Si, hay un resultado de la búsqueda, se obtiene la configuración del bloque de programación y su lugar de atención asociado. Se mostrará un botón con el lugar de atención configurado en el bloque de programación (viene por default), que permitirá al profesional cuando corresponda modificarlo para el día de hoy. Al hacer clic, se desplegará un popup para seleccionar un nuevo consultorio. 

 

 
 

Este cambio solo aplica para la fecha actual y no modifica la configuración original del bloque de programación. 

 

 
 
 
Al presionar "SI, CAMBIAR" nos saldrá un mensaje de éxito. 
 A partir del cambio del consultorio, se debe tener en cuenta que al llamar al paciente se debe tener en cuenta el consultorio que se acaba de guardar. 
 
 
Si se produjo algún error el mensaje será el siguiente.
 
 
 
 Luego, se debe mostrar una cabecera con la siguiente información: 

- Fecha (con flechas para desplazarse a fechas anteriores o posteriores) 

 
- Nombre de la agenda 

 
- Lugar de atención (Consultorio configurado en el bloque de programación) 

 
- Servicio 

 
- Profesional o equipo asignado 

 
- Horario configurado en el bloque 

 
 
 
 Por último, aparecerá el listado de pacientes que esta desarrollado en la HU (Product Backlog Item 11709: Visualización de pacientes asignados y sus estados) 

 
 
 
 Link de Pantallas: https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/a8885410-991f-4d82-aaad-1d6f9e17a841/

## Azure Criterios de Aceptacion
- El sistema debe encontrar los pacientes con los estados del bloque de programación activo correspondiente al profesional, centro, servicio y fecha actual. 
- El sistema debe permitir cambiar el lugar de atención del profesional para el día actual. 

 
- Si el cambio se realiza con éxito, debe mostrarse un mensaje de confirmación. 

 
- Si el cambio falla, debe mostrarse un mensaje de error indicando el motivo. 

 
- El cambio de lugar de atención debe aplicarse únicamente por el día actual y no debe modificar la configuración original del bloque de programación.

## Azure Tasks
- Task 14566: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 16623: QA - Verificar el lugar de atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16639: QA - CR - Si el cambio falla, debe mostrarse un mensaje de error indicando el motivo. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16627: QA - Verificar Selección del Consultorio | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16624: QA - Verificar existencia - Botón de lugar de atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16625: QA - Verificar Botón de lugar de atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16819: DEV - BE - Ajuste logica de fechas de BP obtenerDetalleAgenda/hca-l-age | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 16638: QA - CR - Si el cambio se realiza con éxito, debe mostrarse un mensaje de confirmación. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16238: FE - Integrar Endpoint agendaActiva | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 16333: DT - modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 17477: QA - Validación de agenda activa y selección de lugar de atención - No se visualiza la etiqueta ?o(*) Datos obligatorios ? al final del modal "¿Deseas cambiar el lugar de atención por el día de hoy?", en el margen derecho | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16619: QA - Verificar Botón Entendido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16618: QA - Validar Busqueda Fallida de la Informacion del Profesional | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16631: QA - Verificar Notificación Errónea | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16636: QA - CR - El sistema debe encontrar los pacientes con los estados del bloque de programación activo correspondiente al profesional, centro, servicio y fecha actual | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16640: QA - CR - El cambio de lugar de atención debe aplicarse únicamente por el día actual y no debe modificar la configuración original del bloque de programación. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15792: FE - Crear modal de selección de lugar de atención | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 16237: FE - Integrar Endpoint modificar lugar de atencion | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Test Case 16626: QA - Verificar Campo Lugar de atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16330: BE - Modificacion Endpoint obtenerDetalleAgenda/age-l-ageprof | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 15302: UX - Corrección mockups | Estado: Done
 - Asignado a: Julieta Victoria Viscarra
- Task 15884: BE - Endpoint obtenerLugarAtencionSelector/dat-s-lugaten | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 15885: BE - Endpoint obtenerDetalleAgenda/hca-l-age | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 17321: QA - Validación de agenda activa y selección de lugar de atención - El cambio del lugar de atención lo hace correctamente desde el front, pero desde el back no actualiza el nuevo lugar, lo que genera inconsistencias en el registro de la información | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16628: QA - Verificar Botón Cancelar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15886: BE - Endpoint cambiarLugarFisicoProfesional/adm-u-proflugfis | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16286: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16620: QA - Verificar Funcionamiento de Botón Entendido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16321: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14567: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 14982: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16287: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16524: BD - Creacion tabla | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 16914: QA - El Boton debe decir Cancelar | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16504: DT - Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 16634: QA - Verificar columnas de la Cabecera del Listado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15794: FE - Crear header de listado de pacientes | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 15801: FE - Crear modal de "no dispone de ninguna agenda" | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Test Case 16635: QA - Verificar columnas del Listado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15979: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16633: QA - Verificar la aplicación del cambio - no modifica la configuración original del bloque de programación. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16632: QA - Verificar la aplicación del cambio - solo afecta a la fecha actual | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16629: QA - Verificar Botón Si, Cambiar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16622: QA - Verificar el Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16637: QA - CR - El sistema debe permitir cambiar el lugar de atención del profesional para el día actual. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16918: QA - Cambio de lugar de atención - Error en la Notificacion | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 15703: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 17011: QA-El formato del modal no es igual al del mock up | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15357: Corrección de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 17431: DT - modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 16936: QA - Cambio de Consultorio - Error al avanzar y retroceder de fecha | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16621: QA - Verificar Mensaje que se muestra al profesional | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16630: QA - Verificar Notificación del cambio de Consultorio | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16915: QA - traducción del mensaje del toast al cambiar lugar de At | Estado: Done
 - Asignado a: Mariam Stanziola Davila
- Task 15921: FE - Integrar endpoint obtenerLugarAtencionSelect | Estado: Done
 - Asignado a: Federico Gastón Godoy



