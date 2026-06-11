# HU 7831 - Turnos cancelados por un bloqueo

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7831/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Listar los pacientes con turnos que fueron cancelados por el bloqueo de una programación. Para: Reasignar nuevos turnos a los pacientes. 

 

Descripción y comportamiento: Una vez ejecutado el proceso de bloqueo de un bloque de programación en la agenda (según lo definido en la HU: Item 7009: Agregar un bloqueo), el sistema debe permitir obtener la lista de turnos cancelados como resultado de dicho proceso, para gestionar distintas acciones; como por ejemplo exportar el listado, mostrar en pantalla, reasignaciones, entre otros. 

 
 En este proceso, el listado debe estar disponible mediante las siguientes opciones:
 
 1) Desde el modal de finalización del bloqueo: Al concluir el proceso de bloqueo, debe mostrarse una opción para descargar el listado de turnos afectados. Viene de la HU Product Backlog Item 7009 
 
 
 2) Desde el menú contextual de cada agenda:
 Desde el menú contextual de la agenda, el usuario podrá acceder al historial de bloqueos realizados. Dentro de esta sección, se habilitará la opción "Descargar turnos a reasignar", que permitirá exportar en un archivo los turnos cancelados correspondientes a cada bloqueo registrado. 
 
 Archivo a exportar:
 El sistema deberá permitir la exportación del archivo en formato Excel. Este archivo incluirá el detalle de todos los turnos cancelados como consecuencia del bloqueo realizado. 
 La información estará organizada de la siguiente manera: 
 ° Encabezado general del archivo: - Centro Médico 
- Especialidad 
- Profesional 
 ° Listado de pacientes afectados: 
- Apellidos del Paciente 
- Nombres del Paciente 
- Tipo de documento 
- Número de documento 
- Teléfono 
- Correo Electrónico 
- Fecha y Hora del turno. 
 
 Una vez descargada la información de los turnos cancelados, el archivo debe identificarse con un nombre (turnos_a_reasignar.xlsx) y luego visualizarse en un mensaje tipo tooltips con la notificación de descarga exitosa, como se muestra a continuación: 
 
 
 
 
 En el,caso de que la descarga genere un error, se dene mostrar un mensaje notificando del fallo en la descarga. 
 
 
 https://xd.adobe.com/view/b179d366-7599-4125-a525-fcbfb2509c17-e42a/screen/e1a670ff-57fb-46fd-bf5f-5c4bdb3b2daf/

## Azure Criterios de Aceptacion
- De existir cancelación de turnos. el listado debe estar disponible al finalizar el proceso de bloqueo del bloque de programación y en futuras ocasiones que requiera el usuario (historial de bloqueos). 
- El archivo a exportar (Excel) debe listar solo los pacientes que fueron afectados por el bloqueo con turnos cancelados en el rango de fecha y hora indicada en el proceso. 
- Se archivo descargado se debe identificar con un nombre y este se debe visualizar en el mensaje de notificación de descarga exitosa o en el del fallido en la descarga.

## Azure Tasks
- Bug 23914: QA - Repetición de información en columna consultorio | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 22625: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 12832: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 22962: BD - Agregar campo file_id en la tabla t_agendas_bloqueos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Bug 24318: QA - Falta encabezado en exportación de excel | Estado: Removed
 - Asignado a: Diego Alejandro Nuñez
- Task 22626: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23516: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12726: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23025: BE - Endpoint descargarTurnosCanceladosBloqueo/age-byid-descturncanc | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 23338: BE - Agregar file_id en el endpoint de Crear Bloqueo | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 16685: Diseño tecnico | Estado: To Do
 - Asignado a: Marco Alex Brusa
- Task 15468: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 12930: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 22643: FE - Integracion Backend | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 22906: Diseño | Estado: Done
 - Asignado a: Diego Alejandro Nuñez



