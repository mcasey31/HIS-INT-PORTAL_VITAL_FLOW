# HU 11736 - (Cabecera de paciente) Apellido(s) y Nombre(s), (Edad), Fecha de nacimiento, Cobertura

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11694_CABECERA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11736/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: profesional asistencial Quiero: visualizar la información del paciente Para: obtener datos relevantes que me permitan conocer su información 
 Descripción y comportamiento 
 Luego de seleccionar un paciente para visualizar su historia clínica (Product Backlog Item 11709: Visualización de pacientes asignados y sus estados), se accede a una pantalla donde se presenta una cabecera con la información del paciente. Esta cabecera debe seguir lo definido en el componente desarrollado en la historia de usuario Product Backlog Item 14034: Cabecera de paciente. Los datos que se visualizaran son: - Nombres y apellidos (edad) e icono de sexo biológico 
- tipo y número de documento 
- Fecha de nacimiento 
- Financiador Plan 
 
 
 Se tendrá un botón con ícono de flecha que, al ser presionado, desplegará información adicional del paciente.
 
 
 
 Los datos que mostrará el desplegable serán: - Genero autopercibido 
- teléfono 
- correo electrónico 
- ubicación 
- dirección 
- Financiador plan 
- Nro de afiliado 
 Estos últimos son los que tiene seleccionados desde que fue admisionado. 
 Existen dos botones uno sera el "LLAMAR" que será explicado en otra HU (Product Backlog Item 11713: Comunicación con llamador de sala de espera) y el "SALIR" que esta explicado en HU (Product Backlog Item 11775: Validación de registro mínimo de información asociada al cierre del encuentro). 
 Link de pantalla https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/f0a4e568-a82c-4c21-8053-20904dc1fa26/

## Azure Criterios de Aceptacion
- Ver la información del paciente colapsado 
- Ver la información del paciente desplegable

## Azure Tasks
- Test Case 16490: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16487: QA - Validar el campo "Nro de afiliado" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16480: QA - Verificar el funcionamiento del ícono de flecha que permite desplegar la información adicional del paciente | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16479: QA - Validar el campo "Financiador Plan" de la cabecera | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16477: QA - Validar el campo "tipo y número de documento" de la cabecera | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16489: QA - Validar el botón "LLAMAR" desde la cabecera del encuentro | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15982: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14568: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 16485: QA - Validar el campo "dirección" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15907: FE - Maquetacion cabecera | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 17276: QA - Cabecera de paciente - El plan del financiador no se muestra en la cabecera ni en la información desplegable del paciente | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16478: QA - Validar el campo "Fecha de nacimiento" de la cabecera | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16135: FE - Correccion de metodos | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16483: QA - Validar el campo "correo electrónico" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16289: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16486: QA - Validar el campo "Financiador plan" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14569: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Test Case 16481: QA - Validar el campo "Genero autopercibido" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16476: QA - Validar el campo "Nombres y apellidos (edad) e icono de sexo biológico" de la cabecera | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16336: FE - Agregar icono de llamada | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16482: QA - Validar el campo "teléfono" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16319: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16290: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 15842: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 16484: QA - Validar el campo "ubicación" del desplegable | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16488: QA - Validar el botón "SALIR" desde la cabecera del encuentro | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14528: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



