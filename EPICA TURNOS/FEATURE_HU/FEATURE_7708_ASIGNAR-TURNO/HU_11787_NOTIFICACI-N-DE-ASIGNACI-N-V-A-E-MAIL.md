# HU 11787 - Notificación de asignación vía e-mail

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11787/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos 

Quiero: Enviar notificación de turno asignado 

Para: Enviar comprobante al paciente 

 

Descripción y comportamiento: Una vez realizada la selección del turno, y confirmado el mismo (Product Backlog Item 9908: Selección y asignación de horario) se deberá enviar al paciente vía mail, el comprobante con el detalle del turno solicitado, los datos a incluir en el formulario se mostrarán de la siguiente manera: 

 

Detalle del turno: 

 

Mensaje de saludo con apellido y nombre del paciente 
 

Datos del paciente: 

 

Documento 
Financiador/plan 
 Datos del turno: Profesional (Apellido y nombre) 
Servicio 
Dia y hora del turno (mostrar datos como se indica en mockup) 
Dirección** 
Copago (asociar a HdeU de convenios) 
 
 Información:
 

Indicaciones previas (traerá el dato de la preparación que se indique para la práctica a realizar. 
Documentación a presentar (traer información de normas operativas) 
 

 

Al pie del formulario, mostrará un mensaje predeterminado con datos de contacto para solicitar o cancelar un turno 

 

 

 

**La dirección se tomará en base al modelo de datos sobre los lugares físicos. 

 

 

Comprobante: 

 

 

 
 https://xd.adobe.com/view/097a130e-5bfc-44d3-83bc-9d56c2d887b9-5c29/

## Azure Criterios de Aceptacion
- Una vez confirmado el turno, se enviará mail con detalle del turno asignado. 
- El comprobante del turno deberá enviarse según componente de mensajería. 
- En el asunto del mail se indicará el servicio, fecha, y hora del turno. 
 Nota: Para el mvp, si el paciente no cuenta con casilla de mail o al enviarse no puede ser recibido, se gestionará por proceso.

## Azure Tasks
- Task 24498: FE -Modificar FE para adaptar el envio de email | Estado: In Progress
 - Asignado a: Rodrigo Nicolas Bertin
- Task 23965: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 24478: BD - Agregar campo Time Zone a prestadores | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23912: BE - Envío de mail recordatorio de turno | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 13115: Esquema técnico | Estado: To Do
 - Asignado a: Eduardo Ynoub
- Task 12939: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 23966: QA - Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Cristian Fernando Alvarez
- Task 24412: BD - Script permisos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 24477: Diseño - Modificacion en crear turno | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 23903: FE - Maquetado template correo asignación | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 11974: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan



