# HU 15131 - Visualización del detalle del paciente en admisión

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_13275_LANDING-SOLAPA-ADMISION
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15131/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista
 

 

 

 

 

 

 

 

 

 

Quiero: Poder visualizar el detalle
completo de un paciente asociado a un turno
Para: Consultar la información y las
prácticas asociadas sin salir de la pantalla principal de turnos. 

 Descripción y comportamiento: Desde la grilla de la pantalla de Admisión, ícono ( ojo) donde se puede visualiza los paciente admitidos.

Cada turno incluye un ícono ( ojo) para acceder y visualizar los datos del turno asignado. 

 

Al hacer clic sobre este ícono, se abrirá una ventana lateral con el detalle del
paciente seleccionado y se resalta en celeste la fila correspondiente en la
grilla con los siguientes datos: 

- Nombre completo y edad del paciente 
- Día y hora del turno 
- Servicio: (Traumatología / Ortopedia) 
- Profesional asignado 
- Estado actual del turno 
- Datos personales (documento, fecha de nacimiento, género,
teléfono, correo, dirección) 
- Número de afiliado
 
- Financiador y plan 
- Comentarios asociados 
- Listado de prácticas vinculadas al turno 
 
 - 
 
 
 https://xd.adobe.com/view/2720da24-c3b0-4302-acda-04720fd8b252-7273/

## Azure Criterios de Aceptacion
- La pantalla debe poder cerrarse con el botón "Cerrar" en la parte superior derecha, volviendo la vista al estado inicial. 
- Al quedar la pantalla lateral abierta, el turno seleccionado debe permanecer resaltado en color celeste 
- Al hacer clic en la fila de otro turno, la pantalla se actualiza con la información de un nuevo paciente.

## Azure Tasks
- Test Case 24604: QA - Validar que el turno seleccionado en la grilla permanezca resaltado en color celeste mientras la ventana lateral esté abierta | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24602: QA - Validar la columna "Prácticas" del Listado de prácticas vinculadas al turno, ubicado en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24051: FE - Integración EP obtenerDetalleAdmision | Estado: In Progress
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 24589: QA - Validar el Profesional asignado, "Efector" en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24594: QA - Validar el "Género percibido" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24597: QA - Validar el "Ubicación" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24595: QA - Validar el "Teléfono" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24598: QA - Validar el "Dirección" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24264: BE - Obtener detalles de turno en admision | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 24315: FE - Integración cambio EP obtenerTurnosAdmision (calcular edad con F.nacimiento) | Estado: In Progress
 - Asignado a: Rodrigo Nicolas Bertin
- Task 23952: QA - Ejecución casos de prueba | Estado: To Do
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24600: QA - Validar el "Financiador-Plan" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24603: QA - Validar el botón "X" (Cerrar), ubicado en la esquina superior derecha de la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24591: QA - Validar el "Documento" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24586: QA - Validar el ícono (ojo) de visualización | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23653: DT - Interfaces | Estado: To Do
 - Asignado a: Marco Alex Brusa
- Task 22795: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 24605: QA - Validar que al seleccionar una fila correspondiente a otro turno, la ventana lateral se refresque con los datos del paciente asociado al nuevo turno seleccionado | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24593: QA - Validar el "Género biológico" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23951: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24596: QA - Validar el "Correo electrónico" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24592: QA - Validar la "Fec. nacimiento" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24606: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24599: QA - Validar el "N° de afiliado" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24590: QA - Validar el "Estado" actual del turno en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24587: QA - Validar el "Nombre completo y (edad)" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24601: QA - Validar el "Comentarios" del paciente en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24049: FE - Maquetado detalle paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 24263: BE - Obtener practicas de un turno | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24588: QA - Validar el "Día - Hora" del turno en la ventana lateral | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24528: Cargar turno por BD en dev | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 22776: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Manuel Rolando Alvarez



