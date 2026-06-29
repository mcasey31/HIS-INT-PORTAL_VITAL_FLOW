# HU 9743 - Búsqueda de Disponibilidad Horaria - según: Centro; Servicio y Práctica - Parte 1 - Componente / BE

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/9743/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos Quiero: Realizar una búsqueda de horarios disponibles Para: Asignar un turno a un paciente 
 Descripción y comportamiento: 
 Marco conceptual: Luego del proceso de identificación de un paciente (Product Backlog Item 9741: Identificación de Paciente), se inicia la búsqueda de horarios disponibles. Como datos de entrada, se utilizan la identificación del paciente y el financiador elegido. La búsqueda debe aplicar filtros obligatorios de centro(s), servicio y práctica, mientras que la selección del profesional médico es opcional. Con estos criterios, se genera un listado de horarios disponibles. 
 En el proceso de "BUSCAR TURNO", se utilizan cuatros filtros combinables para buscar disponibilidad de turnos: - Centro (Obligatorio): 
- Selector múltiple 
- Por defecto, la búsqueda se realizará en "Todos" los centros o el grupo de centros asociados al usuario 
- El usuario podrá seleccionar uno o más centros específicos si lo desea. 
 - Servicio (Obligatorio): 
- Autocomplete 
- Permite buscar horarios en función de un servicio específico. 
- Al elegir un servicio, solo se podrán seleccionar prácticas asociadas a ese servicio. 
- Funcionalmente es un filtro para prácticas 
 - Práctica (Obligatoria): 
- Autocomplete 
- Se debe especificar una práctica en la búsqueda. 
- Puede seleccionarse directamente o filtrarse a partir de un servicio y/o profesional. 
- El listado de prácticas disponibles se actualizará según el servicio y centro seleccionado. 
 - Profesional (Opcional): 
- Autocomplete 
- Permite filtrar por un profesional específico, pero no es obligatorio. 
- Si se deja en blanco, se mostrarán turnos con cualquier profesional disponible 
 En otras palabras son filtros de búsqueda interdependientes. 
 Enfoque de la búsqueda: 

 Generar un resultado amplio de horarios con todas las combinaciones posibles entre centros, servicios, prácticas y/o profesionales. Al ejecutar la búsqueda, se deben considerar todas las agendas que cumplan con estos criterios, validando que el bloque de programación correspondiente tenga asociada la práctica seleccionada en su configuración. 

 

La búsqueda utiliza filtros interdependientes, lo que permite una experiencia flexible y predictiva. Los campos Centro(s), Servicio y Práctica son obligatorios, mientras que el campo Profesional es opcional. El sistema permite iniciar la búsqueda desde cualquiera de estos filtros, actualizando automáticamente los demás en función de las asociaciones existentes: 

- Si el usuario selecciona una Práctica, el sistema autocompleta el Servicio asociado. 

 
- A partir del Servicio, se cargan automáticamente los Centros que ofrecen esa combinación. 

 
- El filtro de Profesional, si bien es opcional, también se autocompleta en base a los criterios seleccionados. 

 
 Este enfoque de búsqueda predictiva mejora la usabilidad, permitiendo una selección ágil y coherente entre los campos disponibles. 

 

En el proceso de búsqueda se debe evaluar existencia de reglas de cupos definidas. 

En esta búsqueda se pueden dar los siguientes casos: 

1) Existen horarios disponibles: Se pueden presentar 3 (tres) escenarios: 

 1.1 Horarios Disponibles Sin Cupo: Listará desde el primer horario disponible (slots libres) de acuerdo a los filtros aplicados. Se verá en la grilla identificando el profesional, servicio, práctica, centro y cada uno de los horarios en orden ascendente para ser seleccionados. A la izquierda de la grilla se visualizará un calendario para navegar por las distintas opciones horarias. (Ver pantalla 3) 

 1.2 Horarios Disponibles Con Cupos: Se espera obtener un listado de horarios no seleccionables por el usuario debido a la restricción de cupos de esos horarios según regla ( Product Backlog Item 11062: Agregar reglas de cupo desde bloque de programación). Esos horarios se mostrarán con un color distintivo dentro de la selección de horarios disponibles y se mostrará por pantalla la leyenda según el mensaje de la regla. 

 1.3 Horarios Sin Cobertura (Practica no convenida por financiador/plan). Se espera obtener un listado de horarios no seleccionables por el usuario. Estos horarios disponibles deberán mostrarse por pantalla con un color distintivo y una leyenda que mencione "practica no convenida por financiador/plan del paciente). Ver HU Practica Convenida ("asociar a la HU de convenio"). (Ver pantalla 5). 

Para una mejor visualización de los turnos disponibles (slots libres), se debe tener la opción de scrollear para poder navegar por los distintos turnos por profesional encontrados con horario libre. Para ello se considera agregar a la pantalla un spinner que muestre que se esta cargando la información y un botón flotante que aparece solamente cuando se estaba abajo( al hacer clic en el botón sube) (ver pantalla 6)
 

2) Sin Disponibilidad de Horarios: No se encuentran horarios disponibles con los criterios de búsquedas y filtros aplicados. Debe mostrarse un mensaje de no se encontraron resultados (Ver pantalla 4) 
 Nota: (*) campos obligatorios. 
 Pantallas: Pantalla 1: Pantalla de búsqueda de disponibilidad horaria para asignar turnos. Pantalla 2: Selección de filtros para la búsqueda. Pantalla 3: Resultados de turnos disponibles Pantalla 4: Pantalla de mensaje de no se encontraron resultados Pantalla 5: Resultado de disponibilidades. Pantalla 6: Resultados con scroll 
 DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Para iniciar la búsqueda de turnos disponibles, se debe tener identificado los datos del paciente y el financiador por el cual se le asignará el turno. 
- Para activar la búsqueda de disponibilidades horarias, se debe seleccionar los filtros de centro, servicio y prácticas como datos obligatorios. 
- Se debe mostrar el primer turnos disponible, seguido de los turnos consecutivos, teniendo en cuente que en los filtros de búsqueda no se encuentran fechas. 
- El calendario mostrará los turnos libres, realzando los días donde existen turnos disponibles. Al seleccionar el próximo u otro día resaltado, el listado visible de los turnos se actualizaran con los turnos disponibles para la fecha seleccionada. El listado debe ser scrolleable como se indica en la HU. 
- Se debe mostrar el mensaje de no se encontró resultados de turnos disponibles o de no se encontró turnos con el financiador elegido. Ver pantallas 4 y 5.

## Azure Tasks
- Task 13965: BE - Turnos buscador de fechas disponibles | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24531: QA - Turnos - Error al mostrar en el calendario la fecha en Azul ( No posee slot asignados) | Estado: New
 - Asignado a: Brian Ezequiel Agüero
- Bug 17748: QA - Al tener dos bloques de programación para una agenda se muestra en dos secciones diferentes | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 11863: Análisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 13712: BE - Endpoint modificación selector de centros (prestadores) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13585: Diseño - modificar selector de centros | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Test Case 14009: QA - Horarios disponibles sin cupo | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13713: BE - Endpoint modificación autocomplete de servicios (Unidades organizativas) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 14012: QA - Navegación por calendario y scroll de resultados | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 14008: QA - Búsqueda sin disponibilidad de horarios | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13715: BE - Endpoint autocomplete profesionales | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 14006: QA - Búsqueda exitosa con todos los filtros obligatorios | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13586: Diseño - modificar auto de servicios | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 13716: BE - Turnos buscador de horarios disponibles | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 14007: QA - Búsqueda con profesional seleccionado (filtro opcional) | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13587: Diseño - modificar auto de practicas | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 13282: Diseño técnico | Estado: To Do
 - Asignado a: German Facundo Skrobak
- Bug 16067: QA - Error al utilizar los filtros de turnos en cualquier orden | Estado: Done
 - Asignado a: Sebastian Mario Baudracco
- Task 13710: FE - Creación componente calendario | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13589: Diseño - buscador de turnos | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Test Case 14011: QA - Autocompletado de filtros interdependientes | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13714: BE - Enpoint modificacion de autocomplete de prácticas médicas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13588: Diseño - auto de profesionales | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Test Case 14010: QA - Horarios disponibles con práctica no convenida | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 14013: QA - Validación de campos obligatorios | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 11882: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



