# HU 5938 - 5. HdU- Selección de personas contacto.

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5938/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de ODI ? 

 Quiero: Seleccionar persona(s) ? de contacto ? 

 Para: Vincular persona(s) de contacto(s) a la persona a empadronar. 

 ? 

 Descripción y comportamiento: Desde el marco de persona de contacto (pantalla 1), en el botón ?oAgregar Persona de Contacto ? , se debe abrir el modal de consulta de identificación de personas (pantalla 2), para buscar posibles candidatos por tipo y número de documento, set de datos mínimos y/o escaneo de DNI (pantalla 3); para ser asociado como contacto a la persona a empadronar. ? 

 

 Si la búsqueda arroja resultados positivos (pantalla 4), se selecciona el candidato elegible y se agrega la persona al marco ?opersona de contacto ? . En caso de no arrojar resultados se habilita botón de ?oEmpadronar persona de contacto ? (pantalla 5). 

 

 

Una vez seleccionada(s) todas personas elegidas como contacto, para terminar de empadronar la persona principal, se procede a presionar el Botón "Guardar", y se a vinculara la(s) persona(s) de contactos con la persona principal. 
 
 Marco de encabezado: (ver HdU) 

 Set de datos mínimos:(ver HdU) 

 Datos de contacto: (ver HdU) 
 

 Dirección:(ver HdU) 
 

 

 Link de pantallas: ? 

 pantalla 1 Marco de persona de contacto 

 pantalla 2 Consulta de identificación de personas 

 pantalla 3 Consulta set de datos mínimos y/o escaneo de DNI 

 pantalla 4 Selecciona de candidato elegible 

 pantalla 5 Botón de ?oEmpadronar persona de contacto ? 

## Azure Criterios de Aceptacion
Criterios de aceptación: ? 

 Una vez seleccionada la persona de contacto, los datos se enviarán al marco ?oPersona de contacto ? . ? 

 
Se pueden agregar más de una persona de contacto a la grilla. 

 
Se notificará al usuario un mensaje: ?oSe agregó a <Nombre y apellido> como persona de contacto. ? 

## Azure Tasks
- Task 6633: FE - Integración | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6785: QA-Empadronar persona de contacto | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7222: QA-Empadronar persona de contacto -Diferencias de diseños- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6760: QA-Verificar Botón "+AGREGAR PERSONA DE CONTACTO" en el marco Persona de contacto | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6776: QA-Verificar "Set de datos mínimos" dentro del modal "Buscar y agregar persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7517: QA-Dentro de "Empadronar persona de contacto/ card Datos de contacto" -El botón + no está centrado- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6794: QA-Empadronar persona de contacto por "ESCANEO DNI" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6631: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7516: QA-Dentro de "Empadronar persona de contacto/ card Datos de contacto" -texto en minúscula- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6793: QA-Verificar Botón "LIMPIAR CONSULTA" dentro del modal "Buscar y agregar persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6636: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7518: QA-Dentro de "Empadronar persona de contacto/ card Datos de contacto" -Cesto de basura no existe- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 7316: UX - Agregar boton volver en modal buscar y empadronar persona de contacto | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 6775: QA-Verificar campos "Tipo y número de documento" dentro del modal "Buscar y agregar persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6632: FE - Maquetado | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6780: QA-Verificar Botón "ESCANEAR DNI" dentro del modal "Buscar y agregar persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez



