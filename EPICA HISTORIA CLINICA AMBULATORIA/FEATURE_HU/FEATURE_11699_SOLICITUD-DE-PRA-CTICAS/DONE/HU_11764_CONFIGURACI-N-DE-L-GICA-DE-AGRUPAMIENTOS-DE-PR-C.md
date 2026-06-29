# HU 11764 - Configuración de lógica de agrupamientos de prácticas

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11699_SOLICITUD-DE-PRA-CTICAS
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11764/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Medico solicitante Quiero: Que las practicas medicas a indicar se agrupen por servicio medico Para: Facilitar la indicación de las mismas 
 Descripción y comportamiento: Al seleccionar las practicas a agregar en una orden médica, las mismas deberán ser agrupadas de manera automática según servicio "Efector" al que pertenecen, ej: 
 Practica/Servicio 
 Hemograma/Laboratorio Glucemia/Laboratorio Uremia/Laboratorio 
 Rx de hombro/Radiología Rx de tórax/Radiología 
 
 
 Una vez generadas, y agrupadas por servicio, el profesional podrá imprimirlas, o bien enviárselas al paciente por distintas vías (ITEM 11760). A su vez, al paciente le permitirá presentarlas de manera individual en los distintos servicios que las vayan a realizar. 
 La información del servicio al que pertenece cada practica debe estar previamente asociado.

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Task 15746: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



