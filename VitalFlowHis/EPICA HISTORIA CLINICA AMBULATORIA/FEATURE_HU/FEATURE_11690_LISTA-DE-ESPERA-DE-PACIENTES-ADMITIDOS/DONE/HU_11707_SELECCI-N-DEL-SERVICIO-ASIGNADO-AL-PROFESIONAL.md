# HU 11707 - Selección del servicio asignado al profesional

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11707/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como Profesional Asistencial 

Quiero Seleccionar el servicio de atención para cargar las agendas asignadas por día. 

Para Poder llamar a los pacientes asignados a las agendas y poder realizar su atención. 

 

 Descripción y comportamiento:
 Una vez seleccionado el centro, puede elegir el servicio correspondiente y si el usuario tiene por rol asignado uno o más de un servicio, deberá seleccionar el servicio de atención que corresponda. 
 
 Detalle: - Si por rol de usuario, tiene asignado solo un servicio, el sistema no preguntará el servicio a seleccionar y se accederá directamente al modulo de HC. 
- En caso de que el usuario tenga asignado, por rol, más de 1 servicio, el usuario deberá ingresar al servicio correspondiente donde desarrollará la atención. 
 
 
 
 Para volver a la pantalla anterior, deberá optar por el botón cancelar y en caso de seleccionar el servicio, se activara el botón
ingresar. 

 
 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/

## Azure Criterios de Aceptacion
- Al momento de ingresar, puede mostrar uno o varios servicios. 
- El profesional debe seleccionar el servicio de atención según tenga asignado por rol de usuario 
- En caso de contar con un solo servicio, accederá directamente al modulo de HC. 
- Si selecciona el botón cancelar, debe regresar a (home screen).

## Azure Tasks
- Test Case 16188: QA - Validar que al seleccionar servicio, se muestre uno o varios servicios | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16182: QA - Validar el modal "Seleccionar servicio" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16322: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16184: QA - Validar el botón "CANCELAR" del modal "Seleccionar servicio" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14290: AF | Estado: In Progress
 - Asignado a: Martin Casey
- Test Case 16183: QA - Validar el campo "Seleccionar servicio" del modal "Seleccionar servicio" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16187: QA - Validar el comportamiento del sistema cuando el rol de usuario está asignado a más de un servicio | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15745: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 17012: QA-Viene seleccionado por default un servicio | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 15980: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16185: QA - Validar el botón "INGRESAR" del modal "Seleccionar servicio" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17175: FE - Add cancel event | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16186: QA - Validar el comportamiento del sistema cuando el rol de usuario está asignado a un único servicio | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16225: FE - (Integracion) Selección de servicios | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 14509: Escritura Funcional | Estado: In Progress
 - Asignado a: Manuel Rolando Alvarez
- Task 15744: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 14122: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Bug 16916: QA-Pantalla pensando luego de "CANCELAR" el modal de Seleccionar servicio | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15626: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 14507: Análisis y diseño Funcional | Estado: To Do
 - Asignado a: Manuel Rolando Alvarez
- Task 16716: FE - Acceso agenda Home | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 16189: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15720: FE - Maquetado selección de servicios del profesional | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin



