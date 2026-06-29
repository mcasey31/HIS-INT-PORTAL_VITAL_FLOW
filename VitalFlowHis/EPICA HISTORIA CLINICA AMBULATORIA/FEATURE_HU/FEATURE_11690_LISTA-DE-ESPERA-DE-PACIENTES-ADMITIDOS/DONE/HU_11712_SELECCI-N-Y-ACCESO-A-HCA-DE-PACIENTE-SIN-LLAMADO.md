# HU 11712 - Selección y acceso a HCA de paciente (sin llamador)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11712/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como profesional asistencial, 

Quiero seleccionar un paciente de la lista, 

Para acceder a su historia clínica y eventualmente atenderlo y registrar información clínica 

 Descripcion: Esta HU proviene de lo explicado en la HU ITEM 11709 donde el profesional de la salud al acceder al modulo de Historia Clinica (HC) puede visualizar los pacientes asignados a su agenda. 
 
 
 El profesional podrá seleccionar cualquier paciente asignado a su listado, en cualquier estado y por medio de la funcionalidad de HC (icono tipo ficha) podrá acceder a la Historia Clínica del paciente seleccionado, accediendo de esta forma a la landing de HC explicada en la HU15122 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/2c5ac027-298a-4405-8e60-00753d30816a/

## Azure Criterios de Aceptacion
- El profesional de la salud podrá acceder a la HC de cualquier paciente que exista en su listado, independientemente su estado. 
- Ingresar a la HC de un paciente desde la funcionalidad (icono ficha) no determinará que este sea llamado a pasar al consultorio o lugar de atención.

## Azure Tasks
- Task 15882: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16215: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 14124: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 17333: QA - Validar que en cualquier estado se pueda acceder a la "Historia Clínica" del paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16217: FE - Agregar botón y funcionalidad HCA | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 16214: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17335: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14723: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Test Case 17332: QA - Validar tooltip del ícono "Historia Clínica" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17331: QA - Validar el ícono "Historia Clínica" en el listado de paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17334: QA - Validar al clickear el ícono "Historia Clínica" el profesional no llame al listado de paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14722: AF | Estado: Done
 - Asignado a: Martin Casey



