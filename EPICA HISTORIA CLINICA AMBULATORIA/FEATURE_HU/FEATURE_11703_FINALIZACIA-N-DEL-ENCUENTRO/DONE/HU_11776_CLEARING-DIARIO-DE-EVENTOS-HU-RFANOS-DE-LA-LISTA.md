# HU 11776 - Clearing diario de eventos huérfanos de la lista de espera

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11703_FINALIZACIA-N-DEL-ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11776/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de Sistemas 

Quiero: Realizar
un Clearing diario de todos los estados huérfanos en el ciclo de pacientes del día. 

Para: Cambiar los estados correspondientes a cada evento según corresponda. 

Descripción y comportamiento: 

 Se necesita realizar un servicio que se pueda programar para su ejecución automática, el cual revise y gestione todos los estados del ciclo de atención del paciente para cambiarlos según corresponda. 

El proceso de clearing debe ejecutarse
automáticamente al finalizar el horario de atención programada de cada centro
médico, considerando los diferentes horarios operativos establecidos por cada centro, y asegurar que no queden eventos abiertos o sin resolución, el proceso debe
programarse con una ventana de tiempo posterior al cierre de cada centro. Por
ejemplo: 

 

- Si el Centro Médico 1 tiene un
horario de atención de 08:00 a 20:00 hs, el proceso de clearing deberá
ejecutarse a las 22:00
hs. 
- Si el Centro
Médico 2 tiene horario de atención de 07:00 a 21:00 hs, el clearing
deberá correrse a
las 23:00
hs. 
 
 Esta lógica debe
 ser configurable por centro de atención, permitiendo adaptar la ejecución
 del proceso a las particularidades de cada centro, garantizando así el
 cierre adecuado de todos los eventos del día según el centro de atención. 
 

Ej. de Eventos Huérfanos. 

 
Una vez realizado el clearing e identificado los eventos huérfanos, estos deben quedar como resueltos o cerrados. 
 
 
 Estado Final de eventos Huérfanos: 
 

 
 
 
 
 Estado Huérfano Inicial 
 Estado Huérfano Normalizado 
 Descripción 
 
 
 Programado 
 Ausente 
 Turno nunca iniciado, no pasó por
 admisión ni fue atendido. 
 
 
 En sala de espera 
 No atendido 
 El paciente fue llamado pero no se
 presentó a la consulta. 
 
 
 En observación 
 Atendido 
 Para estar en observación, se
 interpreta que ya fue evaluado clínicamente. 
 
 
 Pendiente de pago 
 No admitido 
 No ingresó al circuito asistencial,
 ya que no se realizo el pago. 
 
 
 

 

 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/2c5ac027-298a-4405-8e60-00753d30816a/

## Azure Criterios de Aceptacion
- Se debe realizar el
clearing y generar un registro que indique los eventos procesados 
- Debe informar la
fecha en la cual se realizó el proceso de clearing. 
- Debe permitir la ejecución del clearing, de forma manual.

## Azure Tasks
- Task 15922: Análisis y Diseño Funcional | Estado: To Do
 - Asignado a: Manuel Rolando Alvarez
- Task 15608: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15923: Escritura Funcional6 | Estado: To Do
 - Asignado a: Manuel Rolando Alvarez



