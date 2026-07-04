# HU 11741 - Asignar Problema del paciente

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11696_GESTIA-N-DE-LISTA-DE-PROBLEMAS
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11741/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como usuario efector medico Quiero poder asignar uno o más problemas desde el boton "Asignar Problema" Para actualizar la historia clinica del paciente. 
 Para agregar un problema se deberán seguir los siguientes pasos, desde el botón "Agregar Problema" se abre una ventana donde se debe completar : 

 

- Completar la categoria del problema. Estas pueden ser: Activo (por default) 
Antecedente familiar 
Crónico 
Procedimiento 
Resuelto 
 
- Luego indicar la fecha de inicio del mismo
 
- Se realiza búsqueda con texto
predictivo a partir del 3er carácter 
- Guardar los cambios

## Azure Criterios de Aceptacion
Los campos ?oCategoría ? , Fecha de Inicio ? y ?oProblema ? son obligatorios. 

La fecha por default es la fecha actual

## Azure Tasks
- Task 16526: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16694: AF - Analisis y escritura | Estado: To Do
 - Asignado a: Natalia Inés Thomas



