# HU 11720 - Visualización de problemas crónicos

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11691_PANORA-MICA-LANDING
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11720/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como Profesional
asistencial 

 

Quiero Visualizar todos los
problemas crónicos del paciente con fecha de creación y cantidad de evoluciones
asociadas 

Para Obtener una
visualización de esta información 

 Descripción y comportamiento: 
 El sistema debe permitir visualizar una lista completa de los problemas crónicos registrados para un paciente específico, mostrando cada problema en detalle. 
 
 La consulta de los problemas crónicos, puede generar dos posible escenarios. 

 Escenario 1: Respuesta satisfactoria, se mostrará una lista completa de los problemas crónicos, por fecha de alta y cantidad de evoluciones como se muestra en el siguiente mockup 

 
 Escenario 2: No dispone de datos en la consulta, como se muestra en el siguiente mockup. 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/362de866-82ad-4c54-bca9-3b7b4b4832ec/

## Azure Criterios de Aceptacion
La visualización debe
 mostrar los problemas crónicos del paciente seleccionado 

 Para cada problema crónico,
 se debe mostrar, descripción del problema, fecha de creación y número de evoluciones asociadas. 

 La información debe estar
 ordenada por fecha de creación, del más reciente al más antiguo.

## Azure Tasks
- Test Case 17366: QA - Validar el listado de problemas crónicos esté ordenado por fecha de creación en orden descendente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17062: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 15931: Análisis y Diseño Funcional | Estado: To Do
 - Asignado a: Manuel Rolando Alvarez
- Test Case 17365: QA - Validar la cantidad de evoluciones asociadas a los problemas crónicos del paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15604: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 17362: QA - Validar la card "PROBLEMAS CR "NICOS" cuando el paciente tenga problemas crónicos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17367: QA - Validar el scroll dentro de la card "PROBLEMAS CR "NICOS" cuando el paciente tenga un volumen de problemas crónicos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17209: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 17368: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17429: QA - Visualización de problemas crónicos - Difiere del mock up el tamaño de la fecha y el detalle del problema crónico. Se ve con tamaño 12px y debería ser 11px | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 17063: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16994: FE - Integrar Endpoint P.Cronicos | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 17029: BE - Endpoint obtenerProblemasCronicos/hca-l-cronpers | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16995: FE - Maquetar Listado P. Cronicos | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Test Case 17363: QA - Validar la card "PROBLEMAS CR "NICOS" cuando el paciente no tenga problemas crónicos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15932: Escritura Funcional | Estado: To Do
 - Asignado a: Manuel Rolando Alvarez
- Test Case 17364: QA - Validar la fecha de alta de los problemas crónicos del paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



