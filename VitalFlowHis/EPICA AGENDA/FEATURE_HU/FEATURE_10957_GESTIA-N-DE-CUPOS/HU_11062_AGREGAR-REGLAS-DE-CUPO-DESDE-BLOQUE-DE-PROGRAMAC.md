# HU 11062 - Agregar reglas de cupo desde bloque de programación.

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_10957_GESTIA-N-DE-CUPOS
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11062/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Gestionar los cupos del bloque de programación Para: Administrar la asignación de turnos por cupos 

 

Descripción y comportamiento: Desde la gestión de agendas, específicamente en
el bloque de programación, se debe tener la opción para administrar las restricciones de cupos
según el financiador y plan, así como la condición que identifica el tipo de restrincion, esta te puede habilitar ese plan para dar turnos exclusivos en ese bloque., o inhabilitarlo para que no se otrogue turnos con ese plan. 

Esta
gestión se puede realizar tanto al momento de programar o crear un nuevo bloque
de programación, o desde el editar un bloque ya existente 

 

Al acceder al modal de la configuración de cupos desde el
bloque de programación, se debe visualizar el nombre de la agenda, centro, servicio,
profesional/grupo/equipo y nombre del bloque de programación, para que el usuario tenga identificado a quien se aplicara la ragla de cupo. 

 

 

Para configurar la regla cupo se debe seleccionar los siguientes campos: 

 

- Financiador (*) - Autocomplete 
- Plan (Filtrar al seleccionar financiador ) (*) - Select 
- Condición (No habilitado o Solo habilitado). (*) - Select 
- Mensaje (Select) (*) - Select (en esta fase, mensaje fijado en "Cupo restringido") 
 La duración de la gestión del cupo estará vinculada a la vigencia del bloque de programación y/o de la agenda. Cuando uno de estos elementos caduque o deje de estar vigente, también caducará la gestión del cupo correspondiente. 
 
 Para cada bloque de programación se podrán configurar las reglas y/o condiciones necesarias para gestionar los cupos tantas como se requieran.

El comportamiento de los bloques de programación sin cupos es la siguiente: atienden todos los planes de todos los financiadores. 
En el caso que se configure una regla que inhabilite un plan o financiador, el resto seguirán habilitados. Se pueden inhabilitar varios fianciadores y/o planes en un mismo bloque. 
En el caso que se configure una regla que "Solo habilitado" a un plan o financiador, inhabilitará todo el resto de los planes o financiadores. Esta opción se prioriza ese plan para ese bloque. 
 Se pueden agregar más reglas pero solo como "Solo habilitado", en este caso si hay dos reglas solo habilitados por ejemplo, esos financiadores y planes configurados, son los que podran tener prioridad en los cupos para asignar turnos. 
 Igualmente pasa con las reglas "No habilitado", se podrá agregar mas reglas con esata misma condición. 
 En resumen, no podrán convivir dos tipos de reglas con condiciones distintas (No habilitado y Solo habilitado) 
 Ver mensaje de alertas en los mockup. 
 
 Nota: (*) datos de carácter obligatorio
 
 
 https://xd.adobe.com/view/b69c17ff-e9e6-4d65-8d88-07c6bdb1f2bd-e3cf/

## Azure Criterios de Aceptacion
- Para crear una gestión de cupo, debe conformarse el bloque de programación. 
- Se podrá crear más de una regla o condición de gestión de cupos por bloque de programación. En el caso que se habilite una opción de "Solo habilitado", se podrá agrgar nuevas reglas, pero solo con la opción "Solo habilitado", ya que por lógica inhabilita al resto de los financiadorres y planes. 
- Si el bloque de programación no tiene asociado una gestión de cupos, los financiadores asociados tendrán disponibilidad habilitada de acuerdo a la configuración de la agenda y del bloque. 
- Se debe definir un finacioador y un plan por regla.

## Azure Tasks
- Test Case 24102: QA - Verificar Modal Agregar Configuracion de Cupo - Campo Condición | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11570: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11565: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23649: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23909: QA - Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Alfonso Oscar Koike
- Task 23937: FE - obtenerMensajesSelector/age-s-cuposmens | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 24108: QA - Verificar BP - Se pueden inhabilitar varios fianciadores y/o planes en un mismo bloque. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15428: Ajuste HU | Estado: Done
 - Asignado a: Martin Miguel Diaz Maffini
- Task 24248: DT - Nueva interface financiador plan | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23935: FE - Modal Agregar Cupo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 24093: QA - Verificar Seccion Gestion de Cupos - Al crear Nuevo Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24098: QA - Verificar Modal Agregar Configuracion de Cupo - Profesional/Grupo/Equipo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24094: QA - Verificar Seccion Gestion de Cupos - Al Editar Bloque de Programación Existente | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24107: QA - Verificar BP - Configurar una regla que inhabilite un plan o financiador - Verificar el resto de los planes | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23718: BD - Crear tablas | Estado: To Do
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 24109: QA - Verificar BP - Configurar una regla "Solo habilitado" a un plan/financiador | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23939: FE - Integrar obtenerFinanciadoresAutocompletado/fspres | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 24097: QA - Verificar Modal Agregar Configuracion de Cupo - Servicio | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23908: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 24104: QA - Verificar La duración de la gestión del cupo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24112: QA - CR - Se podrá crear más de una regla o condición de gestión de cupos por bloque de programación. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23944: FE - Revisar en QA | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Test Case 24114: QA - CR - Si el bloque de programación no tiene asociado una gestión de cupos, los financiadores asociados tendrán disponibilidad habilitada de acuerdo a la configuración de la agenda y del bloque. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 24526: BD - Crear tabla mensaje cupos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 24096: QA - Verificar Modal Agregar Configuracion de Cupo - Centro | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 24202: BD - Crear tabla sch_agendas.tm_condiciones_cupos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 24059: Endpoint obtenerCondicionesSelector/age-s-cuposcond | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 24092: QA - Verificar Seccion Gestion de Cupos - Al crear una agenda | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23936: FE - Integracion obtenerCondicionesSelector/age-s-cuposcond | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 24113: QA - CR - En el caso que se habilite una opción de "Solo habilitado", se podrá agregar nuevas reglas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24099: QA - Verificar Modal Agregar Configuracion de Cupo - Nombre del BP | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 24060: Endpoint obtenerMensajesSelector/age-s-cuposmens | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Test Case 24110: QA - Verificar BP - No podrán convivir dos tipos de reglas con condiciones distintas (No habilitado y Solo habilitado) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24106: QA - Verificar BP - Sin cupos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24095: QA - Verificar Modal Agregar Configuracion de Cupo - Nombre de la Agenda | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23941: FE - Logica Editar Configuración Cupo | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 24105: QA - Verificar los cupos en ls BP | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23832: BD - Crear tabla de cupos | Estado: To Do
 - Asignado a: Eduardo Ynoub
- Test Case 24101: QA - Verificar Modal Agregar Configuracion de Cupo - Campo Plan | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24100: QA - Verificar Modal Agregar Configuracion de Cupo - Campo Financiador | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 24103: QA - Verificar Modal Agregar Configuracion de Cupo - Campo Mensaje | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23940: FE - Actualizar POST/PUT endpoint Bloque de programación | Estado: To Do
 - Asignado a: Romina Daiana Luzzi
- Test Case 24111: QA - CR - Para crear una gestión de cupo, debe conformarse el bloque de programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 23938: FE - Integrar obtenerFinanciadoresAutocompletado/age-a-fina | Estado: In Progress
 - Asignado a: Rodrigo Nicolas Bertin
- Task 24293: BE - Fix import en selector | Estado: Done
 - Asignado a: Sebastian Mario Baudracco
- Task 15427: Ajuste HU | Estado: Done
 - Asignado a: Martin Miguel Diaz Maffini



