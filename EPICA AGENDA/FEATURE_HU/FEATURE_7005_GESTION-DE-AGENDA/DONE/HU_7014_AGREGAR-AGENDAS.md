# HU 7014 - Agregar agendas

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7014/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 11670: Diseno crear agenda.
- Task 11782: Diseno selector tipo de efectores.
- Task 11783: Diseno selector de servicios.
- Task 11870: FE integracion selector de prestadores.
- Task 11872: FE integracion selector servicios.
- Task 11874: FE integracion selector tipo efector.
- Task 11875: FE integracion autocomplete efector.
- Task 11876: FE integracion selector tipo de agenda.
- Task 11878: FE maquetado formulario.
- Task 11881: FE integracion crear agenda.
- Task 12098: FE componente checkbox con descripcion.
- Task 12279: FE agregar menu home agendas.

## Pantalla objetivo para mock
- Pantalla: Alta/Edicion de Agenda (formulario principal).
- Componentes: selectores (prestador, servicio, tipo efector, tipo agenda), checkbox con descripcion, observacion, acciones Guardar/Cancelar.

## Azure Descripcion
Como: Gestor de Agendas Quiero: Crear una agenda Para: Completar la configuración del centro 
 Descripción: Desde el botón "Agregar agenda" en el listado de agendas (Pantalla 1), se desplegará una pantalla con un formulario de carga (pantalla 2), donde se deberán completar los siguientes campos: - Centro (*) selector de los centros que tenga permisos para realizar la creación de agenda. 
- Servicio (*) selector de los servicios que se pueden realizar en el centro seleccionado. 
- Tipo Efector (*) selector de selección única entre (Profesional/ Grupo de profesionales /Dispositivo) 
- Efector (*) autocomplete de Profesional(Apellido nombre doc)/ Grupo de profesionales /Dispositivo dependiendo del tipo de efector que se seleccionó anteriormente. 
- Fecha desde (*) por default el día que se está creando la agenda (Fecha dd/mm/aaaa) 
- Fecha hasta (Fecha dd/mm/aaaa) 
- Tipo de agenda (*) selector entre Programada / Demanda espontánea 
- Nombre de agenda (*) (tipo texto de 70 caracteres)
 
- Visibilidad Contact Center: checkbox (seleccionado por default) 
- Observaciones (tipo texto de 140 caracteres) 
 Para el caso en el que el usuario tenga solo permiso de un Centro, el mismo vendrá cargado por defecto. Si no es así, vendrá un listado ordenado alfabéticamente de los centros que tenga permiso el usuario. 
 Todos los campos que contengan (*) serán de carácter obligatorio. 
 Al pie del formulario, contaremos con dos botones: (Pantalla3) 
 Cancelar: elimina los cambios y nos devuelve a la pantalla anterior (listado de agendas). Guardar: Guarda los datos almacenados hasta el momento con un estado "Creada" y se deshabilitarán la edición de los campos centro, servicio, tipo de efector, efector, fecha desde, fecha hasta y tipo de agenda. Luego los botones se deshabilitarán y se activará la configuración de bloques de programación con la HU Product Backlog Item 7027: Agregar Bloques de programación fija. 
 
 Pantallas: Pantalla 1: Agregar agendas pantalla 2: Definición de agenda
 Pantalla3: Activación de botones
 Pantalla4: Error por duplicidad de nombre
 
 DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Los datos del campo selector de "Centro" dependerá del usuario 
- Al seleccionar un centro vendrán filtrados los servicios que estén configurados para ese centro seleccionado. 
- Al seleccionar un centro y un servicio vendrán filtrados según el campo efector (profesional; grupo de profesionales; dispositivo) 
- Crear una definición de agenda para un profesional un equipo de profesionales o un dispositivos. 
- Validar que el nombre de la agenda sea único al guardar 
- Si Cancela los cambios debe reconfirmar 
- El check de visibilidad seleccionado permitirá que la agenda sea visible para el contact center 
- El check de visibilidad deseleccionado permitirá que la agenda no sea visible para el contact center
 
- Las agendas son visibles para los usuarios del centro 
- El campo Servicio estará deshabilitado hasta que el usuario seleccione un centro 
- El campo Efector estará deshabilitado hasta que el usuario seleccione un tipo de efector 
- Al crear la agenda y no crear bloque de programación la agenda quedará en estado "Creada" 
- Fecha desde por default debe ser el dia de creación, no se permite fechas del pasado. Solo se pueden crear a futuro o presente. 
- Al guardar se creará la agenda y activará el agregar bloque de programación dando los mensajes de éxito o de no éxito

## Azure Tasks
- Task 11855: BE - Endpoint Prestadores para selector | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 12536: QA - Difiere el texto de alerta al duplicar ?oNombre de agenda ? . | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12013: Diseño - Selector de centros | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 12098: FE- Componente checkbox con descripción | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 11783: Diseño selector de servicios | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 12012: Diseño - Selector tipo de agenda | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 11881: FE - Integración Crear Agenda | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11876: FE - Integración Selector Tipo de agenda | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11861: BE - Selector de tipo de agendas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11878: FE - Maquetado formulario | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 11869: BE - Selector de servicios (unidades organizativas) | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 12291: DEV - No se puede crear una agenda sin una observación | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11285: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 11782: Diseño selector tipo de efectores | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 12279: FE - Agregar en el menu de la home agendas | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11856: BE - Autocomplete de efectores | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 12539: QA - BD- El nombre debería ser ?oDemanda espontánea ? | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12590: FE - Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12283: Diseño - Modificar interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 12540: QA - Abreviación incorrecta de 'Demanda espontánea' en 'Tipo de agenda' | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 12535: QA - Los ?oCentros ? no vienen el orden alfabético. | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11874: FE - Integración Selector tipo efector | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11875: FE - Integración Autocomplete Efector | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11873: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12011: Diseño - autocompletado de efectores | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 11866: BE - Crear agenda | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11872: FE - Integración Selector Servicios | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11870: FE - Integración Selector de Prestadores | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 12521: QA - Errores en el campo "Efector". | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12290: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 11871: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 11860: BE - Selector de tipo de efectores | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11670: Diseño crear agenda | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 11286: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti



