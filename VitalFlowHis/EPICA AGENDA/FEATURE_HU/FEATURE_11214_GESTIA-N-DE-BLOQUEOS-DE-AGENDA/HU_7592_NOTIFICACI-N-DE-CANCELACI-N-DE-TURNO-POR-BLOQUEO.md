# HU 7592 - Notificación de cancelación de turno por bloqueo

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_11214_GESTIA-N-DE-BLOQUEOS-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7592/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Enviar un email de cancelación de turnos por bloqueos de programación Para: Notificar al paciente que se le canceló su turno agendado. 
 Descripción Cuando se bloquea un rango horario dentro de un bloque de programación (según lo definido en el ITEM 7009), y dicho bloque contiene turnos previamente asignados a pacientes, estos turnos deben ser cancelados automáticamente como parte del proceso. 
 Dado este escenario, se requiere implementar un mecanismo de notificación al paciente afectado, mediante el envío automático de un correo electrónico, informando sobre la cancelación de su turno. 
 El contenido del correo deberá incluir el siguiente texto:
 
 - TITULO: <Asunto de email- Servicio, fecha y hora> ver mock-up 
 - CUERPO DEL EMAIL: 
 "TURNO CANCELADO"
 Hola <apellido y nombre del paciente> el turno asignado ha sido cancelado. 
- DATOS DEL PACIENTE 
 - Documento DNI 26745192 Financiador-Plan OSDE 920
- DATOS DEL TURNO 
 -Profesional: <Nombre del Médico> -Servicio: <servicio o practica medica> -Día y Hora: <Fecha y horario del turno> -Dirección: <Ubicación del turno | Sanatorio -Sector - Calle y Nro- Consultorio > - INDICACIONES PARA EL TURNO 
 <Nota según lo indicado> - IMPORTANTE 
 -Para solicitar un turno nuevo, comuníquese: Lunes a Viernes de 8:00 a 20:00 al 0810-122-2424 o por whatsapp al 15-6179-6733
- PIE DE PÁGINA 
 -Email generado automáticamente, por favor no responder. 
 Ver modelo de correo electrónico. 
 
 
 
 Nota: la dirección del turno, se tomará en base al modelo de datos sobre los lugares físicos. 
 En caso de NO poder notificar al paciente por no tener email asociado o existe error de lectura del email, se debe registrar estos casos, para notificar de forma manual (gestión por procesos) 
 Para la notificación de los email, se debe usar las casillas de turnos@redbasa.com.ar: Esta opción debe ser configurable desde la administración del sistema, para realizar cambios de casilla en acciones futuras. 
 
 https://xd.adobe.com/view/097a130e-5bfc-44d3-83bc-9d56c2d887b9-5c29/screen/b5c8f6b6-fb0d-4682-bd58-325c56da8edd/

## Azure Criterios de Aceptacion
- Cuando existe un bloqueo de una agenda y se genere cancelaciones de turnos, se debe notificar al paciente mediante el envió de un correo electrónico de la anulación de su turno agendado. 
- Se debe registrar los pacientes que no se les pudo notificar por no tener email asociados o por error de email en los enviados.

## Azure Tasks
- Task 12943: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 12727: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 12928: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 13764: Escritura | Estado: Done
 - Asignado a: Martin Miguel Diaz Maffini



