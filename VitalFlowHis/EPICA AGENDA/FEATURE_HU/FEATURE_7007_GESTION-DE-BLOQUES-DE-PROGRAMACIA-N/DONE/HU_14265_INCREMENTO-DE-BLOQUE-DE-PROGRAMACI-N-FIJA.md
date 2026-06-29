# HU 14265 - Incremento de Bloque de programación fija

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14265/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: gestor de agendas Quiero: controlar la superposición de bloques y vinculación de procedimiento de generación de slot Para: incrementar controles y vinculación de procesos 
 
 Descripción y comportamiento Dado que ya se implementó la HU Product Backlog Item 7027: Agregar Bloques de programación fija, se debe reforzar la validación al configurar nuevos bloques. Específicamente, debe evitarse la duplicidad de horarios en bloques asignados al mismo equipo, grupo de profesionales o profesionales con agendas activas.

Para lograrlo, el sistema debe comparar todos los bloques activos existentes del efector y asegurarse de que no haya solapamientos en días y horarios teniendo en cuenta el rango de fecha del bloque de programación y el centro. Esta validación debe aplicarse tanto en la creación como en la edición de bloques, para mantener la integridad de la planificación. 

Una vez comprobada la duplicidad saldrá el mensaje y no dejara continuar con el proceso de generación de slot. 

 Por último, esta historia de usuario también incorpora la vinculación del procedimiento de generación de slots con la configuración de bloques de programación fija ya desarrollada en la HU Product Backlog Item 7027: Agregar Bloques de programación fija.

Con esta integración, la configuración realizada desde el front deberá generar automáticamente la disponibilidad horaria (slots libres) correspondiente, para su posterior gestión.

## Azure Criterios de Aceptacion
- No se debe generar dos bloques de programación en horarios y días donde el profesional, grupo de profesionales y/o equipos tengan agendas con bloques activos. 
- Al configurar un bloque de programación, poder generar la disponibilidad horaria configurada

## Azure Tasks
- Task 15581: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17404: QA - Incremento de BPF - Error al intentar grabar un Bloque de Programación que fue Editado | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 15655: QA - Edición Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Dispositivo con con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17479: QA - Incremento de BPF - Edicion BP - Error | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 23656: DEV -Edicion de Bloque de Programacion - NO se ejecuta SP de Edicion en forma automatica | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 17478: QA - Incremento de BPF - Edicion -TE Profesional - Error No sale Notificación "Ya existe un bloque Activo ..." | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17561: QA - Crear Bloque Programación - Fecha Hasta de la Agenda esta como obligatorio | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 15651: QA - Creacion Agenda - Agregar Bloques de programación fija | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17437: QA - Incremento de BPF - Error al Verificar la Dispo Horaria en Turnos | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 14269: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 15656: QA - Edición Agenda - Agregar Bloques de programación fija | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 14268: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 15649: QA - Creacion Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Grupo con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 15653: QA - Edición Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Profesional con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17428: QA - Incremento de BPF - Efector Dispositvo - Error Validación Feha/Horario | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17416: QA - Incremento de BPF - Efector Grupo - Error No sale Notificación "Ya existe un bloque Activo ..." | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17393: QA - Incremento de BPF - Error Validación Feha/Horario | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 15535: BE - Modificar EP bloque de programacion fija | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 15586: BE - Ejecución SP generación slots | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 15583: FE - Agregar mensaje de traduccion | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 23655: QA - Verificar la conversion de la zona horaria al Mostrar Slot de Turnos | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 15658: QA - CR - Al configurar un bloque de programación, poder generar la disponibilidad horaria configurada | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17744: QA - Editar BPF - Error al agregar nueva Practica | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17390: QA - Incremento de BPF - Lugar de Atención - Error No sale Notificación "Ya existe un bloque Activo ..." | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 17406: QA - Incremento de BPF - El Listado gral muestra un horario Diferente al Bloque Programado | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 14271: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15580: QA -Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 15654: QA - Edición Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Grupo con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 15650: QA - Creacion Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Dispositivo con con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 15647: QA - Verificar acceso a Creación de Agenda - Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17417: QA - Incremento de BPF - Efector Grupo - Error al intentar grabar un Bloque de Programación que fue Editado | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 15657: QA - CR - No se debe generar dos bloques de programación en horarios y días donde el profesional, grupo de profesionales y/o equipos tengan agendas con bloques activos. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 15648: QA - Creacion Agenda - Verificar la NO duplicidad de Horarios en Bloques asignados al mismo Profesional con agendas Activas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 15652: QA - Verificar acceso a Edición de Agenda - Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 20378: QA - Edicion de BPF - Error al mostrar los Turnos | Estado: Done
 - Asignado a: Eduardo Ynoub



