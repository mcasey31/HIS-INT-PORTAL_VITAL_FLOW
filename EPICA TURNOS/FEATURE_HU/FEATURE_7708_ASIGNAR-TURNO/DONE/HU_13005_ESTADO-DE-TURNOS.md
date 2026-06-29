# HU 13005 - Estado de turnos

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13005/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como ? : Personal de gestión de turnos Quiero ? : visualizar el ? estado del turno ? Para ? : conocer los estados de los turnos 
 Descripción 
 Al registrar un turno este debe contar con estados que permitan darle seguimiento por lo que el turno puede tener los siguientes estados: - Programado: Cuando se registra y asigna un turno a un paciente, este queda en estado "Agendado". 
- Consumido: es el estado del turno una vez el paciente se admite para el turno al cual se presentó. Es el correspondiente al estado de admisión "En sala de espera" o "No atendido" HdU .
 
- Ausente: Si el paciente no se presenta en tiempo y forma, desde Admisión se cambia el estado del turno a "Ausente". 
- Cancelado: 
- Con motivo "agenda": Cuando un turno se cancela debido a una edición de la agenda. 
- Con motivo "bloqueo": Cuando se bloquea un horario y afecta a un turno ya asignado. 
- Con motivo "paciente": Cuando el paciente solicita la cancelación del turno, ya sea presencial o virtualmente.

## Azure Criterios de Aceptacion
- Poder visualizar todos los estados en diferentes turnos.

## Azure Tasks
- Task 14673: BD - crear trigger para gestion de cambios en turnos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14132: Diseño técnico | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 13225: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 14212: Agregar tabla histórica de estados | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 13224: Análisis Funcional | Estado: Done
 - Asignado a: Natalia Gorriti



