# HU 7009 - Agregar un bloqueo

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7009/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: bloquear horarios en la agenda del profesional. Para: que no estén disponibles para ser asignados y si están asignados, se anulen. 

 
 Descripción y comportamiento: Desde el marco Bloque de Programación, 
 se podrá generar un bloqueo a una programación horaria de la agenda, este bloqueo podrá realizarse en un rango de fecha (mes(es), semana(s), incluso día(s) y hora(s)). 
 Al iniciar el proceso de Generar Bloqueo, se abrirá un primer modal donde se visualizará el nombre de la agenda a bloquear, la información de los bloques de programación activos de la agenda y se deben indicarse los siguientes datos para continuar con el bloqueo: 
 
 Datos que deben indicarse en el bloqueo: - Fecha desde: Elemento vacío. Formato tipo (date) (dd/mm/aaaa) * ? 
- Fecha hasta: Elemento vacío. Formato tipo (date) (dd/mm/aaaa) * ? 
 
- Horarios desde: Elemento vacío. Formato tipo (time) (08:00) * ? 
 
- Horarios hasta: Elemento vacío. Formato tipo (time) (18:00) * ? 
- ?<Motivó: (select) (Cargar listas de motivos, ejemplo: Ausencia de profesional, Falla de equipos médicos, etc) ? * ? 
 
 *Campos de carácter obligatorio ? 
 Una vez indicada las fechas y horas a bloquear se debe seleccionar un motivo del bloqueo. Todos estos datos son obligatorios para continuar con el proceso como se indica en la siguiente 
 
 
 En este proceso se debe tener la opción de Cancelar o Continuar el proceso. 

 La acción Cancelar, cierra el modal y te devuelve la acción al bloque de programación de la agenda. 
 De lo contrario, si la opción es Continuar se debe generar una nueva acción que actualizará al modal, donde se visualizará nuevamente los horarios (slots), se mostrará los campos fecha desde, fecha hasta, hora desde, hora hasta y el motivo, todos inhabilitados (griseados). Debajo de la información de la agenda, se mostrará un marco tipo alerta, donde debe indicarse cuantos slots serán bloqueados y la cantidad de turnos que están asignados a ese total de slots, información que debe generarse en el instante que se acciona el Continuar. Seguido de esta información se tendrá las opciones de Cancelar y Confirmar Bloqueo 
 Si confirma la acción de Bloqueo, se debe bloquear los slot de los bloques y de existir turnos comprometidos se cancelaran, dejándolos en estado "Cancelado por bloqueo" en los bloques de programación afectados. Seguido se mostrará un modal con la confirmación del éxito del bloqueo y con la opción de descargar un archivo definido en la HU(Product Backlog Item 7831: Listado de turnos cancelados por un bloqueo) Si el bloque que se acaba de configurar se superpone con alguno hecho anteriormente se debe mostrar el siguiente mensaje. 
 Al terminar el proceso se redireccionará a la pantalla de Historial de Bloqueos. Si en el proceso de bloqueo de slot y cancelación de turnos sufre algún error, se deberá mostrar un mensaje de advertencia. 
 https://xd.adobe.com/view/b179d366-7599-4125-a525-fcbfb2509c17-e42a/

## Azure Criterios de Aceptacion
- Los horarios bloqueados no estarán disponibles(lots) en la agenda para ser asignados a un paciente. 
- Al bloquear los horarios, si tenían turnos asignados, se cancelaran y se guardará el listado de pacientes afectados para una futura gestión y reasignación.

## Azure Tasks
- Bug 23194: QA - Turnos cancelados por bloqueo no se informan correctamente | Estado: Removed
 - Asignado a: Sebastian Mario Baudracco
- Task 17469: FE - Componente Semana | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17467: FE - Integrar verificar bloqueo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17521: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 23188: QA - Corregir texto en campo de hora desde/hasta | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 22832: FE - Agregar al componente - app-i18n-timer-picker-control que se pueda dehabilitar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17468: FE - Integrar bloquear | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17466: FE Integrar selector motivo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17696: BE - Chequeo de Creacion de bloqueo | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 17465: FE - Maquetado Modal + Formulario Validaciones | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11575: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 23237: QA - Corregir titulo horario desde hasta | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15467: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 13579: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 17520: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 22644: Modal Descargar Excel + Corroborar si hay turnos cancelados para visualizar el modal | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23120: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 23195: QA - Leyenda de superposición no coincide con mockup | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16678: Diseño técnico | Estado: In Progress
 - Asignado a: Marco Alex Brusa
- Task 17072: BD - Creación de tablas | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 11574: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 13762: Revision de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 17697: BE - Creacion de bloqueo | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 22974: FE - Testear | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23782: BD - campo file_id a los bloqueos de agendas. | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 17695: BE - Selector de Motivos | Estado: Done
 - Asignado a: Brian Ezequiel Agüero



