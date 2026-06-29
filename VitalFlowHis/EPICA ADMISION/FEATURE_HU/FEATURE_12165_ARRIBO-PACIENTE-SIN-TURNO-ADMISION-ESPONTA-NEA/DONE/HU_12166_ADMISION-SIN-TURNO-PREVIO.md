# HU 12166 - Admision Sin Turno Previo

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_12165_ARRIBO-PACIENTE-SIN-TURNO-ADMISION-ESPONTA-NEA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12166/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de Admision Quiero: Registrar a un paciente que se presenta Sin Turno Previo Para: Poder asignarlo a una atención ambulatoria disponible en el día, ya sea mediante una agenda espontánea a una agenda ya planificada de un profesional, equipo o dispostivo. Descripción y comportamiento Cuando un paciente se presenta en forma espontánea en la institución (sin un turno programado), el personal de admisión podrá iniciar un proceso de admisión excepcional, ver HU ITEM 12164 se identifica el paciente HU ITEM 12996 Al no contar con un turno programado, el admisionista iniciará el proceso de atención desde el boton +DEMANDA ESPONTANEA 
 
 
 En el caso de que al identificar el paciente y este ya cuente con Turnos, el boton de DEMANDA ESPONTANEA estará activo y POR PROCESO se debera identificar si corresponde generar una demanda espontanea aun con turnos programado. Por ejemplo, el paciente al identificarlo cuenta con turno programado para el servicio cardiologia, pero requiere una atención para Clinica Medica. 
 Al hacer clic en el botón indicado se abrirá el siguiente popup: 
 
 
 El usuario de admisión debe seleccionar el campo Servicio y/o Práctica para la cual el paciente solicita una atención espontanea. Si se selecciona el Servicio, el sistema completa automáticamente la Práctica asociada (ej. Servicio: Clínica Médica ?' Práctica: Consulta Clínica Médica). 
 Nota: Habrá que asociar desde el modelo de datos (para esta funcion) que prácticas son asociadas unicamente para la creación de una admision ambulatoria bajo la modalidad de Demanda Espontanea 
 El sistema filtra y muestra solo las agendas de la fecha actual que coincidan con la combinación de Servicio y Práctica seleccionada. Solo se permite seleccionar Prácticas habilitadas para demanda espontánea (por ejemplo, tipo Consulta). 
 Nota: Este campo Practica, solo deberá filtrar aquellas practicas que se puedan selecciónar para una atención ambulatoria (podria ser por modelo que en la tabla se asocie por customizing de practica). 
 Campo Servicio: Selector. Una vez seleccionado el servicio correspondiente se activa el campo Practica Campo Practica: Selector, en modalidad Demanda Espontanea se debe especificar SOLO Practicas del tipo consulta Campo Agenda: Selector. En base a la selección Servicio y Práctica se activara el campo Agenda, del cual se explica mas abajo los distintos modelos que se pueden seleccionar (Tipo Espontanea o Programada) Tipo Agenda: Grisado. Deviene de la seleccion del campo agenda Bloque: del tipo Selector. Pueden venir mas de 1 bloque de programación en base a la selección de agenda Tipo de Efector. Grisado. Deviene de la seleccion de Agenda. Puede ser Profesional; Dispositivo; Equipo. Si el campo Tipo Efector ES EQUIPO, el campo Efector se activa para seleccionar uno de los profesionales asignados a ese equipo 
 Campo Efector. Si el campo Tipo efector es Dispositivo o Profesional el campo Efector se grisa y toma el de la agenda. Campo Fecha: Es la fecha actual, debe ser campo grisado no seleccionable Campo Hora: Es la hora actual, debe ser campo grisado no seleccionable. 
 
 
 
 
 En base a esta selección inicial, se pueden dar 2 opciones de selección de tipo de Agendas: 
 Opción 1: Asignar el paciente a una agenda Espontánea Si para la combinacion de Servicio y/o Practicas en el dia actual hubiera agendas especialmente creadas del tipo espontaneas SOLO informará estas en el desplegable del campo Agenda. 

 
El sistema permite asociar al paciente a una agenda de tipo espontánea creada especialmente para casos sin turno previo. 

 
Estas agendas son previamente generadas por los gestores de agenda, disponibles solo para atención inmediata o de demanda espontánea. 

 
En el caso de seleccionar este tipo de agenda se debe crear una admisión del paciente asociada directamente a esta agenda, sin la asociacion de un turno. 

 
 Opción 2: Asignar a una agenda de un Efector del tipo Programada El sistema también permite buscar agendas del tipo programada activas para ese mismo día y las mostrará en caso de que no haya agendas del tipo espontanea para fecha como ya fue explicado 

 
Si se identifica disponibilidad en la agenda de un profesional del tipo programada, el paciente puede ser asociado directamente al bloque de Programación de esa agenda, siempre que se verifique la compatibilidad de especialidad y horario. 

 
En el caso de seleccionar este tipo de agenda, se pueden dar 2 casuísticas: 

 
 A) Seleccionar algun slot disponible: en base a la hora del sistema y de la agenda seleccionada, puede darse el caso que la agenda tenga aun disponibilidad y asociar al paciente a un turno programado para la fecha. En este caso se puede seleccionar alguno de los turnos disponibles que el sistema mostrará (como se muestra en el mockup). Con esta accion al seleccionar un turno se habilita el campo Dar Turno y NO se genera una admision, sino que se da un turno programado para el día. 
 Luego el proceso continua como el circuito con Turno programado 
 En caso de que el usuario de admision, no quiera dar alguno de los turnos (debido a que los disponibles no le sirviera al paciente), se podria no seleccionar ningun turno ofrecido por el sistema y se habilitará el boton "Continuar la Admision", y continuar el proceso como se explica en el punto B de esta hu. 
 
 B) Crear un nuevo SLOT del tipo DEP a la agenda (ver HU ITEM 15393): En este caso, la agenda seleccionada no tiene disponibilidad (slots libres) o los turnos disponibles no son una solución factible para el paciente, en este escenario, se puede crear un slot que se diferencia del "normal" que denominaremos del tipo DEP (demanda espontanea programada) de forma que pueda distinguirse del slot normal creado en la programacion original del bloque. 
 
 Una vez seleccionada la Agenda donde se va a crear la atención bajo la modalidad de Demanda Espontanea el usuario deberá elegir el Bloque de Programación ya que la agenda puede tener mas de 1. En caso de solo tener 1 bloque de programación este vendrá por default seleccionado. De la misma manera va a proceder para los campos tipo de efector y efector ya que vienen determinado por la agenda y el bloque. El campo fecha viene por default y no se podra cambiar, ya que debe ser la fecha actual del sistema. Idém para el campo Hora. 
 Al hacer clic en el boton Continuar, el sistema llevará al usuario al siguiente paso que es verificar las practicas seleccionadas Ver HU: ITEM 11913 y ITEM 11915 donde podrá corregir (quitando o agregando practicas). 
 
 luego de setear correctamente las practicas, al hacer clic en CONTINUAR, el proceso sera identico a como se explica en el proceso de atención con turno programado, las acciones del sistema son iguales en ambos procesos para finalizar la admision donde se debe llamar al servicio con el modulo de Convenios ver HU ITEM 11917 
 LINK UX: https://xd.adobe.com/view/4a79913e-5996-48d6-b3aa-2daac811a34b-1f2a/

## Azure Criterios de Aceptacion
- Se puede registrar una admisión sin turno programado desde el módulo de admisión. 
- El sistema permite elegir entre agenda espontánea o agenda programada ya existente para el mismo día. 
- En caso de existir para el dia actual agendas de demanda espontanea, el sistema solo mostrará las de este tipo en el campo agenda 
- Solo se puede generar una admision de demanda espontanea para la fecha actual del sistema 
 - Si no hay disponibilidad de agendas creadas para la fecha actual, el sistema lo informa claramente 
- En caso de seleccionar una agenda del tipo programada para generar una atención espontanea, primero el sistema mostrará si existen slots disponibles para poder primero ofrecer un turno programado para la fecha actual 
- El Usuario, si selecciona un agenda programada donde existan aun turnos disponibles para la fecha actual, podrá omitir el dar un turno programado y continuar con una demanda espontanea 
- Si crea una demanda espontanea en una agenda programada, se genera un slot del tipo DEP, con el objetivo de diferenciar un slot "normal" programado y ese slot creado nuevo sera asignado directamente al paciente seleccionado 
- En el caso de generar una atención espontanea asociada a una agenda del mismo tipo, no se generará slots ni turnos, directamente se genera una admision asociada a la estructura de la agenda 
- La admisión no debe interferir con otras ya iniciadas o activas para el mismo paciente.

## Azure Tasks
- Task 24161: BD - Agregar campos a la tabla sch_admision.t_paciente_admision | Estado: To Do
 - Asignado a: Eduardo Ynoub
- Task 23996: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 15928: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 15537: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15929: Escritura HU | Estado: Done
 - Asignado a: Martin Casey



