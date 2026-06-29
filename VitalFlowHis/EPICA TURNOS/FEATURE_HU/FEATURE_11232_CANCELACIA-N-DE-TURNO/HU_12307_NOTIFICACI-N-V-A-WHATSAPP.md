# HU 12307 - Notificación vía whatsApp

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_11232_CANCELACIA-N-DE-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12307/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: Notificar al paciente por medio de WhatApp Para: Dar aviso del estado del turno 
 Descripción y comportamiento: Desde las distintas gestiones del sistema ODI, donde se requiera una notificación al paciente, se requiere incorporar mediente parametrizaciones de tamplate, las notificaciones por medio del canal de whatApp. 
 Una vez que se tenga configurado el canal para envío de mensajes por whatApp, se debe aplicar la notificación por medio de este canal, en las asignaciones, cancelación y recordatorio de un turno al paciente. 
 Como se mencionó anteriormente, se plantearan 3 escenarios de notificación al paciente en el proceso de gestión de un turno: 
 
 En todos los escenarios se debe parametrizar mediante configuración para el envío del mensaje por el canal de whatApp los siguientes puntos: - Título: Motivo del mensaje 
- Saludos, nombre receptor y mensaje: 
- Profesional, Especialidad, fecha y hora del turno 
- Nombre del centro y dirección del lugar de la consulta. 
- Información y contactos. 
 
 Para la configuración se requiere que se considere la siguiente información: - Identificar la plantilla a utilizar (ID) 
- Configurar el canal de envío. (WS)
 
- Mapear datos de los destinatarios 
- Identificar los posibles estados de mensajes (pendiente, enviado, 
error) 
 
 Ver ejemplos en cada uno de los escenarios. 
 Primer escenario: Al confirmar la asignación del turno, se debe disparar un mensaje de confirmación del turno por el canal de whatsapp al numero de celular personal del paciente. El mensaje que se debe ser tipificado de la siguiente manera: Ver mockup. 
 
 
 Segundo escenario: Al momento de cancelar algún turno del paciente, ya sea porque el turno es cancelado por algún bloqueo de la agenda, alguna edición que recorte slot o el paciente, se requiere que el gestor de turno notifique al paciente como se muestra a continuación: 
 
 
 
 Tercer escenario: se debe realizar un envió de mensaje de recordatorio que debe ser configurado para se efectué el envió en 24hs , 72hs o 168hs antes del turno.

## Azure Criterios de Aceptacion
- En la gestión turnos al paciente, si este tiene teléfono personal identificado, también se debe notificar por whatApp en la asignación, cancelación y recordatorios de un turno. 
- La notificación por recordatorio debe ser con figurable la horas de notificación previa a la cita. 
- La configuración de ma mensajeria debe ser auditables por mensajes que fueron enviados, cuándo y cómo.

## Azure Tasks
- Task 16245: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16260: Analisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 22773: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



