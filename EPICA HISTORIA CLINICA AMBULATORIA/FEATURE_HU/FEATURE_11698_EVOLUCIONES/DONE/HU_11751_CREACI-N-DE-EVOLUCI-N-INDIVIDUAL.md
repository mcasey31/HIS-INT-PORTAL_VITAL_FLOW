# HU 11751 - Creación de evolución individual

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11698_EVOLUCIONES
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11751/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Profesional asistencial Quiero: crear una evolución en la historia clínica del paciente Para: registrar información clínica relevante en formato narrativo y etiquetarla con los problemas necesarios 
 Descripción y comportamiento: 
 Desde el apartado de evoluciones, se podrán visualizar aquellas que el paciente tenga registradas, y también ingresar una nueva. 
 
 
 Desde el botón "Agregar evolución" se abrirá un modal donde se registrará la información clínica del paciente. 
 
 
 El campo de evolución es de texto libre, y contará con la posibilidad de destacar algunos puntos en el texto, ya sea resaltándolo, con viñetas, cursivas, etc. (ITEM 11759). Contará también, con un apartado para agregar "Problemas" en forma de etiquetas Item 11750, y 
 El modal contará con dos botones: 
 Cancelar: Cerrará el modal y nos llevará a la pantalla resumen sin guardar los cambios que se hayan registrado. 
 Guardar: Se activará cuando se cumplan los criterios de contenido en la evolución (al menos 4 caractéres alfanuméricos no repetidos (no AAAA o 1111)) 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/1e1f6c55-ab43-4569-a30f-a17331f04087/

## Azure Criterios de Aceptacion
- Tanto la evolución como la carga de al menos una etiqueta de problemas son de carácter obligatorio. 
- El campo de evolución debe ser bpchar.

## Azure Tasks
- Test Case 16601: QA - Validar el botón "CANCELAR" del modal "Agregar evolución" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16603: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14515: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16284: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16710: BD - Creacion tabla federada encuentro | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 16602: QA - Validar el botón "GUARDAR" del modal "Agregar evolución" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16673: BD - Datos de problemas | Estado: Done
 - Asignado a: Martin Miguel Diaz Maffini
- Bug 16881: FE - Validar Id encuentro evolución | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 16589: BD - Crear tablas | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 17249: QA - Creación de evolución individual - No se visualizan las evoluciones que el paciente tiene registrada | Estado: Removed
 - Asignado a: Sebastian Mario Baudracco
- Test Case 16598: QA - Validar el modal "Agregar evolución" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17250: QA - Creación de evolución individual ?" En el listado de problemas, al ingresar una coincidencia de 3 letras, se muestra un checkbox que no corresponde según el diseño definido en el mockup | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16600: QA - Validar el campo "Escribir evolución" del modal "Agregar evolución" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16285: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16597: QA - Validar el botón "+ AGREGAR EVOLUCI "N" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16164: FE - Creacion de evolución individual | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 15978: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 16599: QA - Validar el campo "Problemas" del modal "Agregar evolución" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14529: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 16328: BE - Endpoint obtenerProblemasAutocompletado/hca-a-problemas | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16323: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 16865: FE - Fix seleccion de servicio | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Bug 17248: QA - Creación de evolución individual - Modal "Agregar evolución" - no valida la cantidad mínima de caracteres para habilitar el botón "GUARDAR" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16327: BE - Endpoint crearEvolucion/hca-c-evol | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 16596: QA - Verificar que se puedan visualizar las evoluciones que el paciente tenga registrada | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



