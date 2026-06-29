# HU 11750 - Etiquetado de evoluciones profesionales con problemas de salud

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11698_EVOLUCIONES
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11750/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: profesional asistencial Quiero: etiquetar evoluciones con problemas de salud Para: asociar y contextualizar una evolución con un problema de salud del paciente 
 
 Descripción y comportamiento: 
 Desde el botón "Agregar evolución" se abrirá un modal (Product Backlog Item 11751: Creación de evolución individual) que nos permitirá agregar tags de problemas de salud a un encuentro. 
 
 
 Las etiquetas de problemas clínicos se buscarán mediante un campo de búsqueda que será autocomplete. Tal como se muestra en la siguiente imagen, se podrán ir buscando y agregando distintos problemas (tags). 
 
 
 De esta manera se visualizarán los problemas agregados a la evolución del paciente: 
 
 
 Los problemas se buscarán en una tabla de problemas/tags (citar historia) 
https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/7e50ec19-4447-4492-93e4-6b1dfa46cec0/

## Azure Criterios de Aceptacion
- Se requiere la carga de al menos un problema para que se habilite el botón guardar. 
- Se podrán agregar "n" cantidad de problemas.

## Azure Tasks
- Task 16320: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16292: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16162: FE - Integracion - etiquetas evoluciones | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Bug 17329: QA - Etiquetado de evoluciones profesionales con problemas de salud - El campo "Problemas" no admite más problemas (cantidad 4) de los que ya se han ingresado | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16291: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14531: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 16216: FE - Agregar autocomplete Evoluciones | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 16161: FE - Maquetado etiquetas evoluciones | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 14517: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



