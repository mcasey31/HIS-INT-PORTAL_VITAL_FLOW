# HU 11235 - Detalle de agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11235/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 12213: FE integracion endpoint detalle agenda.
- Task 12214: FE maquetado detalle agenda.
- Test Case 12668: Visualizacion de detalle de agenda.
- Test Case 12669: Visualizacion de detalle sin bloqueos activos.
- Bug 13321: Error en concatenacion del titulo del profesional en detalle.

## Pantalla objetivo para mock
- Pantalla: Detalle de Agenda.
- Componentes: cabecera de agenda, datos del profesional/servicio, bloques, bloqueos activos, observaciones, acciones rapidas.

## Azure Descripcion
Como: Gestor de agendas Quiero: Visualizar el detalle de una agenda Para: Obtener información completa de su configuración 
 
 Descripción y comportamiento Una vez identificada la agenda vamos a acceder a la funcionalidad de detalle de agenda (botón visualizar), mediante la cual se podrá visualizar un detalle ampliado de la configuración que se le realizó a la misma. (Pantalla 1) En esta sección se podrán ver todos los datos incluyendo los de los bloques de programación vigentes y los bloqueos activos (fecha fin mayor al día de hoy) registrados en la agenda. (Pantalla2) 
 La cabecera del detalle contendrá los siguientes datos: Efector (como título de la pantalla) Centro Estado (Creada, Activa, Inactiva, Finalizada) Nombre de agenda Un desplegable de detalle, que contendrá los datos de tipo de servicio, tipo de agenda, y las fechas desde y hasta. 
 En el apartado de Bloques de programación se podrán ver los bloques activos, resaltando en el titulo: Nombre del bloque, Dias y Horarios (desde-hasta). Al seleccionar el desplegable contaremos con la siguiente información: tipo de programación, fecha (desde-hasta), N° de sobreturnos, lugar de atención, frecuencia y duración del turno. 
 Y un último desplegable con los bloqueos activos que contendrá una grilla con las siguientes columnas: Fecha Hora Motivo 
 
 Contaremos con un menú contextual con las funcionalidades de editar (Product Backlog Item 8988: Edición de la Agenda), copiar (Product Backlog Item 11205: copiar agenda) e Historial de bloqueos (Product Backlog Item 7008: Listado de bloqueos). 
 Si la agenda se encuentra vacía de Bloques de programación, reglas de cupo o bloqueos realizados, ósea que la agenda solo cuenta con la estructura se deberá mostrar el mensaje de "No dispone Bloque de programación" o "No dispone de bloqueos activos"(Pantalla3) 
 Pantallas: Pantalla 1: Detalle de agenda 
 Pantalla2: Detalle de bloque de programación y de bloqueos 
 
 DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- Al presionar la funcionalidad de detalle se abrirá una pantalla con el detalle de la configuración de la agenda seleccionada. 
- Se marcará en color celeste la fila seleccionada (en el caso de acceder desde la grilla de agendas) 
- La ventana contendrá un menú contextual y una opción para cerrar dicha ventana. 
- Se mostraran los bloques de programación vigentes 
- Se detallara los bloqueos activos al dia que se esta viendo el detalle de la agenda.

## Azure Tasks
- Task 12217: BE - Pruebas unitarias | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Test Case 12669: Verificar Visualización de Detalle de Agenda sin Bloqueos Activos | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Bug 12418: DEV - Obtener detalle Agendas ver Servicios | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 22514: QA - Error al navegar por lista de agendas y querer editar una | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 11292: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 12218: BE - Code Review | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 12215: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 12668: Visualización de Detalle de Agenda | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12213: FE - Integración Endpoint Detalle agenda | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 13321: QA - Error en la Concatenación del Título del Profesional en el "Detalle de la Agenda". | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12216: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 12214: FE - Maquetado Detalle agenda | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12212: BE - Endpoint Detalle agenda | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 12443: DEV - Obtener detalle agenda falta visibilidad y formato fechas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11290: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 12219: FE - Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa



