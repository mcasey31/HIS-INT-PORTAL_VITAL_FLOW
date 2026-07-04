# HU 7027 - Agregar Bloques de programación fija

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7027/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. 

Quiero: Crear programación horaria 

Para: Generar disponibilidad horaria 

 

 

Definición y comportamiento: 

Desde la pantalla de Crear/Editar agendas, en la sección de bloque de programación, contaremos con un botón que indique ?o+Agregar bloque de programación ? (pantalla1). Al seleccionarlo, en el caso de tratarse de una agenda de tipo programada nos llevará a la pantalla de configuración de bloque de programación programada que cuenta con los siguientes datos (pantalla2). 

 

Nombre de bloque de programación* (campo de texto, 70 caracteres) 

Selección Tipo de bloque de Programación *: Con un radio button con las opciones de: "Programación Fija" o "Programación Variable" (en esta HU describiremos el comportamiento de la pantalla en el caso de haber seleccionado la opción duración fija.) El proceso de creación de los slot 

Esto nos permitirá generar slots con una duración igual y fija. 

Fecha desde* (para indicar el inicio de la vigencia dd/mm/aaaa) 

Fecha hasta* (para indicar el fin de la vigencia, dd/mm/aaaa) 

¿Atiende feriados?* (Si No por default viene en false (No))
 

 Y los siguientes campos configuraran lo que será un slot fijo: 

Seleccionar días * (L, M, M, J,V, S,D botones de selección) 

Horario desde * (Horario en el que empezará el primer slot, HH:MM) 

Horario hasta * (Horario en el que terminará el último slot, HH:MM) 

Duración del turno * (Min que va a durar el slot, desplegable de 5,10,15,20,25,30,35,40,45,50,55,60 minutos)
 

Lugar de atención* (consultorios, box, area-sector información que va a venir, auto-complete) 

Frecuencia * 

 

- semanal: Al seleccionar esta opción la configuración se repetirá todas las semanas que el bloque tenga vigencia 
- quincenal: la configuración será de semanas alternas iniciando la semana que tenga la fecha desde del bloque 
- Dia de la semana por orden en el mes (Orden mensual): seleccionar el día de la semana por orden en el mes (Ej.: primer y tercer jueves del mes)(Pantalla3) 
 

Nº Sobre turnos (integer con cantidad de sobreturnos que aceptara cada día la programación que se está configurando) 

 Debajo de la configuración del bloque de programación se encontrará la sección de gestión de prácticas (*) (Product Backlog Item 7029: Agregar prácticas médicas) y luego tendremos la gestión de cupo para el bloque de programación (Product Backlog Item 11062: Agregar reglas de cupo desde bloque de programación.). 

(*) datos de carácter obligatorio
 

Al final habrá dos botones: 

Cancelar: cancela la acción y vuelve a la pantalla de la agenda que se está creando/editando 

Guardar: se activará una vez completados todos los campos obligatorios, una vez seleccionado, se deberá mostrar un modal de confirmación (Pantalla4) al seleccionar "SI, GUARDAR" se guardará y generará la disponibilidad horaria configurada sino "VOLVER" nos llevará a la configuración del bloque de programación. 

Pantallas 

pantalla1 Estructura de agenda pantalla2 Agregar programación Pantalla3 Agregar programación con frecuencia de orden mensual Pantalla4 Modal de confirmación 

 

DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Fecha inicio no puede ser previa a la fecha de vigencia de la agenda ni posterior a la fecha hasta de la vigencia de la agenda. 
- Fecha hasta no puede ser previa a la fecha inicio ni posterior a la fecha hasta de la vigencia de la agenda. 
- Validar que el rango de fecha y hora inicio con la fecha y hora hasta deben ser mayor o igual a la duración del slot. 
- Al dar guardar se guardará la configuración del bloque de programación y se generarán los slot en la agenda. Generando los slot fijos que se configuraron en el bloque. Dando como mensaje de confirmación de éxito "Se agregó bloque de programación (Nombre de la agenda)". 
- Si no hay éxito en la creación/edición dará el mensaje "No se pudo guardar. Verifique e intente mas tarde" 
- Por default al crear un bloque de programación este debe quedar en estado activo. 
- Al seleccionar Orden mensual se desplegará un selector con 4 opciones Primera, segunda, tercera y cuarta. Solo se permitirá la selección de hasta dos opciones.

## Azure Tasks
- Task 11293: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 12849: Crear Bloque de Programación con Frecuencia Quincenal | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13292: QA - El campo "frecuencia" en "orden semanal" rompe el diseño de la pantalla | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12666: BE - EP frecuencia | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 13420: QA - Al cargar un bloque con fecha desde a futura viene en estado INACTIVO | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13752: BD - Rediseño modelo de datos | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 12586: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Bug 13445: QA - Al ingresar a crear Bloque aparece un chip de Activo | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12598: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13291: QA - Superposición de la hora en los campos "Hora desde" y "Hora hasta" | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12551: FE - Maquetado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13103: FE - Integracion de Endpoint Dias | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 13416: QA - campos de "Fecha desde" y "Fecha hasta" | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 12850: Crear Bloque de Programación con Frecuencia Mensual | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13289: QA - El campo ?otipo de programación ? difiere del mockup. | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13290: QA - El nombre del campo "Seleccionar tipo de programación" no coincide con el mockup. | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12552: FE - Integración maqueta | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 12853: Modificar Bloque de Programación Existente | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12597: QA - Creación casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13003: Error tabla t_frecuencias | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 13415: QA - campo de "frecuencia" en "Orden Mensual | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 12854: Eliminar Bloque de Programación | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13351: QA - Error al cargar Selector de semana no esta guardando | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12623: DIseño interfaz Lugares de atencion | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 12873: FE - Modal confirmacion de guardado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 12626: Backend - EP lugares | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 13552: QA - Error en la Validación del Campo Obligatorio al Cambiar de "Frecuencia Semanal" a "Orden Mensual". | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13288: QA - Textos en campos obligatorios. | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12665: FE - Ingregracion de autocomplete lugares de atencion | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12554: BE - Bloque de programacion | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12757: FE - Intergrar EP semana | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 12851: Validación de Campos Obligatorios | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13471: BD - Desarrollo SP generación slots | Estado: In Progress
 - Asignado a: Eduardo Ynoub
- Bug 23240: QA - Edicion de BPF - Error No Valida Fecha/Hora programacion Pasada | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 12903: FE - Fix hora | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13127: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 13417: QA - Duración del turno y mensaje de error | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13607: QA - Error en la Visualización y Edición Manual de Fechas en Bloques de Programación | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12664: FE - Integracion de selector frecuencia | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 13608: QA -Permite crear bloque de programación en el pasado. | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12553: FE - Componente selector semanal | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 12900: BE - Endpoint de Semana | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12585: Diseño de interfaces | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 12587: FE - Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 13656: QA - Botón 'Cancelar' al agregar bloque de programación (falta acento) | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 13359: QA - Error en la Validación del Selector de Semana en Orden Mensual | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12888: DISE 'O - Agregar interfaces de Semana (multicheckbox) y agregar semana al post de Bloques | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 13114: BD - Creación SP para generación de Slots fijos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 13083: FE - Ajustar validacion componente dias | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11294: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 13418: QA - Campo repetido en la selección de hora. | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 12852: Crear Bloque de Programación con Duración Variable | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal



