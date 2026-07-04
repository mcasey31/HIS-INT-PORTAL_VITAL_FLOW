# HU 8990 - Agregar bloques de demanda espontanea

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/8990/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Crear programación horaria de demanda espontánea Para: Generar una disponibilidad horaria de demanda espontánea para una agenda Descripción Desde la funcionalidad de agregar agenda, después de configurar una estructura con el tipo de agenda de demanda espontánea podremos generar uno o varios bloques de programación de demanda espontánea. 
 
 
 
 
 Al generar un bloque de programación, nos llevará a la configuración de programación de demanda espontánea que cuenta con los siguientes datos
 
 
 
 
 
 
 Titulo "Agregar bloque de programación (Demanda espontánea)" 
Descripción del camino que se hizo previo a esta configuración ( Agenda: centro-Servicio-Profesional ) 
- Nombre de programación* (texto libre de 70 caracteres) 
- Fecha desde* (para indicar la vigencia de esta formato dd/mm/aaaa) 
- Fecha hasta* (para indicar la vigencia de esta formato dd/mm/aaaa) 
- Selección de días * (L, M,M,J,V,S,D botones de selección ) 
- Horario desde* (Horario en el que empezara la disponibilidad formato hh:mm) 
- Horario hasta * (Horario en el que finalizara la disponibilidad formato hh:mm) 
- Lugar de atención* (autocomplete de los lugares que se configuren como atención) 
 Al final de la línea de datos, se podrá configurar las prácticas y la gestión de cupo asociados al bloque de programación que estamos configurando. Lo que esta configuración de bloque de programación efectúa es una agenda que será tratada como una cola de espera de pacientes de manera que al momento de la admisión de los pacientes que se vayan presentando, se irán generando turnos (appointment) instantáneamente. 
La cantidad de pacientes que ingresen en la cola será administrada por el admisionista según su criterio. 
 
 DER Diagrama de agendas - dbdiagram.io
 
 https://xd.adobe.com/view/c6b4bd51-b7a1-47fd-867a-11473a8eb518-93e7/

## Azure Criterios de Aceptacion
- Debe Completar todos los campos obligatorios antes de habilitar el botón guardar. 
- El horario desde y hasta deben ser uno menor al otro respectivamente 
- La fecha desde del bloque de programación debe estar comprendida entre la fecha desde y hasta de la definición de la agenda. 
- Por default al crear un bloque de programación este debe quedar en estado activo.

## Azure Tasks
- Task 11484: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 23235: QA - Al querer crear un bloque de programación de demanda espontanea da error | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 17004: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 23220: QA - Corregir texto de campo hora desde/hasta en bloque de programación | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 22968: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15458: AF - Revision de HU | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 17187: DT - Modificar Interface - Bloques | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 17124: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 23504: QA - Error al generar nuevos bloques de programación con fecha a futuro | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 17273: DT - Modificacion de interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 22703: BE - Al editar un bloque programado no guarda las practicas por ende despues el bloque de programacion vuelve vacio | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16952: FE - Verificar Comportamiento de Creación de Bloques | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 22544: BE - Fix - Parametros y Payload agregarBloqueProgramacion | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 22705: BE - Al crear un bloque de demanda espontanea arroja un error de validacion de duracionTurnos | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11485: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 17003: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 17274: BD - Modificar campo id_frecuencia, duracion_fija | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 17037: BE - agregar bloque demanda espontanea | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 22919: BE - llamado a SP para creacion de slots en agenda programada | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16591: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16951: FE - Modificar Componente Formulario. | Estado: Done
 - Asignado a: Romina Daiana Luzzi



