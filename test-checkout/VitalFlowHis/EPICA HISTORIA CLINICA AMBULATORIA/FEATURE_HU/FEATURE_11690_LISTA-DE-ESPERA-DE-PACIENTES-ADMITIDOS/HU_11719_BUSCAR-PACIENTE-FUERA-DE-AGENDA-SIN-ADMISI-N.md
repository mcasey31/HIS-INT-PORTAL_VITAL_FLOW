# HU 11719 - Buscar paciente fuera de agenda (sin admisión)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11719/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como profesional asistencial 

Quiero buscar un paciente fuera de mi agenda asistencial según los criterios de acceso establecidos por configuración 

Para acceder a su historia clínica y eventualmente atenderlo y registrar información clínica 

Descripción y comportamiento 
 Al acceder a la agenda asistencial, tanto si el profesional tiene agenda asignada para ese día como si no, se debe mostrar siempre el botón ?oBUSCAR PACIENTE ? . 

En el escenario en que el profesional tenga agenda, se visualizará la pantalla correspondiente. 

 En el caso en que no tenga agenda, también se mostrará el botón en la pantalla. 

 
 
 Al acceder a este botón se nos abrirá un modal con el buscador de la identificación de la persona. Primero con la busqueda de tipo y número de documento. 
 
 
 Si la persona no se encuentra tendrá la opción de realizar la búsqueda por set mínimo. 
 
 
 Existen dos resultados posibles: - Identificamos a la persona a la cual queremos ver su Historia Clínica y la seleccionamos Una vez seleccionada la persona nos dirigirá a la pantalla de Historia clinica. 
- No se encuentra en el padrón la persona y se nos mostrará un mensaje "No se encontraron candidatos para el "-tipo y nro de documento-". Verifique los datos ingresados o contáctese con responsable de empadronamiento" 
 El botón "volver" cerrará el modal y nos llevará de nuevo a la landing de agendas del profesional.

## Azure Criterios de Aceptacion
- Poder buscar una persona si el profesional tiene agenda 
- Poder buscar una persona si el profesional no tiene agenda
 
- Identificar la persona y poder acceder a su HC

## Azure Tasks
- Task 15933: Escritura de HU | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Task 15153: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



