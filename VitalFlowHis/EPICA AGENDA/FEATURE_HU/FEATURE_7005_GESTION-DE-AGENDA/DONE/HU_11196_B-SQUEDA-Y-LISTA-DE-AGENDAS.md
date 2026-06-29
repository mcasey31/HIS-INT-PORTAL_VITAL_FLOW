# HU 11196 - Búsqueda y lista de agendas

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11196/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 11310: Diseno servicios autocomplete.
- Task 11312: Diseno efector autocomplete.
- Task 11313: Diseno agendas autocomplete.
- Task 11314: Diseno listado de agendas.
- Task 11315: Diseno practica medica autocomplete.
- Task 11318: Diseno estado agendas selector.
- Task 11889: FE integracion autocomplete servicios.
- Task 12018: FE integracion autocomplete practicas medicas.

## Pantalla objetivo para mock
- Pantalla: Busqueda y Listado de Agendas.
- Componentes: filtros por agenda/servicio/efector/practica/estado + grilla de resultados con acciones.

## Azure Descripcion
Como: Gestor de agendas Quiero: buscar y visualizar las agendas Para: Gestionar acciones sobre ellas 
 Descripción y comportamiento 
 Al ingresar a la funcionalidad de Gestión de Agendas vamos a contar con 4 campos de búsqueda. El dato "Centro" estará acotado al rol que el usuario tenga asignado. (Pantalla1) Estos campos serán: - Centro (multiselector si el rol tiene asociado muchos centros) 
- Servicios (autocomplete) 
- Tipo de Efector (selector de Profesional, grupo de profesionales o dispositivos 
- Efector (autocomplete de Profesional, grupo de profesionales o dispositivos) 
 Contaremos con una búsqueda avanzada que nos solicitará completar los campos (Pantalla2):
- Práctica médica (autocomplete) 
- Tipo de Agenda (selector de Programada / demanda espontánea) 
- Nombre de la agenda (autocomplete)
 
- Estado de agenda (selector de activo / inactivo) 
 
 El resultado de la búsqueda que pueda realizar el usuario nos mostrará un listado de agendas, los campos que nos mostrará el listado serán igual a los campos de búsqueda básico más el tipo de agenda (orden: Agenda [Nombre de la agenda], centro, servicio efector Tipo de agenda[Dem. espontánea-Programada], fecha hasta, estado, icono detalle, icono edición, menú contextual) (pantalla3). Si no se selecciona una búsqueda por estado de la agenda el listado que resulta de la búsqueda estará ordenado primero por las agendas con estado activo y luego las agendas inactivas. 
Este listado contará con iconos de acciones sobre la agenda, como visualizar, editar y un menú contextual mostrará las funciones de copiar (solo para agendas en estado inactivos) y el Historial de bloqueos de la agenda seleccionada. 
 Pantallas 
 Pantalla1: Búsqueda básica de agenda 
 Pantalla2: Búsqueda avanzada de agenda Pantalla3: Grilla de resultados de búsqueda 
 
 
 
 DER https://dbdiagram.io/d/Agendas-67a69d0b263d6cf9a070191b

## Azure Criterios de Aceptacion
- Las opciones de centro deben ser las que el usuario tenga permisos a ver 
- La búsqueda por cada campo debe traernos todas las agendas cuyos datos coincidan con los criterios de búsquedas. 
- El listado de agendas vendrá ordenado alfabéticamente por Nombre de agenda teniendo en cuenta que se mostraran las agendas en estado creada, activa, inactiva y luego las agendas en estado finalizadas. 
- Si los filtros no devuelven resultados, le devolverá un mensaje "No se encontraron resultados. Verifica y realiza una nueva consulta". 
- Si el sistema no cuenta con agendas mostrará el siguiente mensaje "No dispone de ninguna agenda. Agrega agenda" 
- El usuario podrá pasar de pagina y también tendrá la posibilidad de listar 10, 20 o 50 filas.

## Azure Tasks
- Task 11312: Diseño - Efector autocomplete | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 11283: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 11889: FE - Integración Autocomplete Servicios | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 11284: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 11857: BE - Autocomplete Agendas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12406: BE - Fix Payload Grilla de Agenda | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11314: Diseño - Listado de agendas | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 11315: Diseño - Practica medica autocomplete | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 12606: QA - BE - Ordenamiento de Columna | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 11865: BE - Selector de estado de agendas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 12620: FE - Ordenamiento columna | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 11859: BE - Autocomplete Prácticas médicas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 12534: BE - DEV- Fix listarAgendas practicas asociadas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11867: BE - Grilla de agendas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11879: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 11886: FE - Integración Grilla Agenda | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 17392: QA - Error en Busqueda Filtro Nombre de Agenda | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 11877: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 11890: FE - Maquetado Grilla y filtros | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12367: BE - Pruebas Unitarias obtenerAgendas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11318: Diseño - Estado agendas selector | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 12677: QA - Verificar Alerta cuando el sistema no cuenta con agenda | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12591: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 12020: FE - Integración Selector de Centros | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 15723: QA - Gestion de Agendas - Error Limpiar Consulta | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 15702: QA - Gestion de Agendas - Error en busqueda por Nombre de Agenda | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 12019: FE - Integración Autocomplete Agenda | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12018: FE - Integración Autocomplete Practicas médicas | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 15598: QA - Listado de Agendas - Error Ordenamiento | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 11313: Diseño - agendas autocomplete | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 11310: Diseño - Servicios autocomplete | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 12405: FE - Modificación librería | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12399: BE - Fix Grilla de agendas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 12190: FE - Integracion Selector estados | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 11858: BE - Autocomplete Unidad Organizativa | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



