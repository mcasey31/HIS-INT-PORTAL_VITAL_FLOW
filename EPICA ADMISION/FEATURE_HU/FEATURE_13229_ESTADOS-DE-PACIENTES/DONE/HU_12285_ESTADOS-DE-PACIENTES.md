# HU 12285 - Estados de Pacientes

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_13229_ESTADOS-DE-PACIENTES
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12285/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como ? : Personal de Admisión
Quiero ? : visualizar y actualizar el ? estado del paciente ? durante la admisión
Para ? : conocer con precisión en qué etapa de atención se encuentra el Paciente y actuar en consecuencia 

Descripción breve: Al gestionar la admisión, se necesita que el sistema muestre el estado actual del paciente y permita cambiarlo según su recorrido por el centro médico. Los estados posibles son: 

- Programado ?" turno asignado, aún sin presentarse. 

 
- En Sala de Espera ?" el paciente llegó y está aguardando su atención. Admisión confirmada. 

 
- En Atención - El paciente fue llamado por el profesional de la salud y esta siendo atendido 

 
- Atendido ?" Consulta médica finalizada satisfactoriamente en el sistema de HC. 

 
- Ausente ?" el paciente no se presentó al turno programado. 

 
- No admitido ?" El paciente se presentó al turno programado, pero no pudo ser recepcionado administrativamente en admisión (por falta de documentación, de pago, habilitación del financiador, etc). 

 
- No atendido ?" El paciente fue admitido con éxito en la administración, pero no pudo ser atendido por un médico (por cancelación interna, demora o ausencia del médico, etc.). 

 
- En Observación- El paciente que es admitido y se encuentre en atención, se puede pausar el encuentro para realizar otros estudios pasándolo a estado En Observación. 

 
- Pendiente de Pago - El paciente en el proceso de admision, tiene que abonar algun cargo a costas propia (privado). Hasta que el paciente no abona lo que corresponde y se registre en el sistema no se podra completar la admision

## Azure Criterios de Aceptacion
Escenario 1: Visualizar estado inicial
 Dado que existe un turno Programado para el paciente
 Cuando accedo al detalle de la admisión
 Entonces el sistema muestra el estado "Programado"
 
 Escenario 2: Registrar llegada del paciente
 Dado que el estado es "Programado"
 Cuando el paciente se presenta en recepción
 Entonces el sistema cambia su estado a "En sala de espera" una vez completado el proceso de admisión
 
 Escenario 3: Registrar comienzo de atención médica del paciente. El estado del paciente cambia a "En Atención" 
 Escenario 4: Marcar atención finalizada
 Dado que el paciente está "En sala de espera"
 Cuando finaliza la consulta médica
 Entonces el sistema actualiza el estado a "Atendido"
 
 Escenario 5: Registrar ausencia del paciente
 Dado que el estado es "Programado"
 Y se supera el tiempo de tolerancia de llegada
 Cuando el usuario confirma la ausencia
 Entonces el sistema cambia el estado a "Ausente"
 
 Escenario 6: Registrar paciente no admitido Dado que el paciente se presenta ("Programado") Pero no es posible generar la admsión Cuando el usuario registra la incidencia Entonces el sistema cambia el estado a "No admitido"
 
 Escenario 7: Registrar paciente no atendido
 Dado que el paciente se presenta ("En sala de espera")
 Pero la consulta se cancela por motivos operativos
 Cuando el usuario registra la incidencia
 Entonces el sistema cambia el estado a "No atendido"
 
 Escenario 8: Pausar el encuentro del paciente para realizar otros estudios. El paciente En observación debe venir del Estado En Atención El paciente En Observación se puede llamar nuevamente por el profesional 
 Escenario 9: El paciente tiene que abonar algun cargo como privado, en el ciclo ambulatorio, el pago se debe registrar en el sistema antes de cerrar el proceso de admision. En algunos centros, es posible que estos cobros se generen en otros lugares fisicos al de admisión (por ejemplo, caja central) desde donde al generarse el pago de parte del paciente se podra completar el proceso de admisión correspondiente y poder enviar al paciente a la sala de espera para que luego sea atendido por un profesional de la salud

## Azure Tasks
- Task 13221: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 13222: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Task 14953: BD - Insert nuevos estados del paciente en admision | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14172: Diseño interfaces | Estado: To Do
 - Asignado a: German Facundo Skrobak
- Task 14216: Crear tablas de admisión, estados de admisión e histórico de estado de admisión | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14547: BD - Carga datos en base | Estado: Done
 - Asignado a: Eduardo Ynoub



