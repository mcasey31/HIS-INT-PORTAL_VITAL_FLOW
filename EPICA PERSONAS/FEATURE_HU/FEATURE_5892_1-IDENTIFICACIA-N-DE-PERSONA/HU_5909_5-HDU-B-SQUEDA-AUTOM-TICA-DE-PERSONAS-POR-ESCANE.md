# HU 5909 - 5. HdU- Búsqueda automática de personas por escaneo de DNI

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5892_1-IDENTIFICACIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5909/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de ODI 

 Quiero: Descargar los datos del DNI 

 Para: Realizar la búsqueda de candidatos. 

 

 Descripción y comportamiento: Desde el modal de captura de datos mediante el escaneo del DNI (pantalla 1), se debe enviar los datos al formulario de búsqueda de personas para facilitar la transcripción y consultar de manera automática los posibles candidatos. Esta acción completará todos los campos del set de datos mínimos que se detallan a continuación (pantalla 2). 

 Número de documento 

 
Nombre 

 
Apellido 

 
Fecha de nacimiento 

 
Sexo biológico 

 
 

 Una vez completados los campos, la búsqueda se realizará por set de datos mínimos. 

 (Product Backlog Item 5905: 2. US-Búsqueda de persona por set de datos mínimos) 
 Se contará también con los siguientes botones:
"Búsqueda por documento" nos redirigirá a la pantalla de búsqueda por tipo y numero de documento. 
 "Limpiar consulta" que al seleccionarlo borrará los datos ingresados en los campos N° de documento, Nombre, Apellido, Fecha de nacimiento, y Sexo biológico. De haber traído candidatos seleccionables, también borrará la grilla. 

 
 

 
 

 

 Link de pantallas: 

 (pantalla 1) Escaneo de DNI 

 
(pantalla 2) Carga de campos de datos

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 La búsqueda arroja posibles candidatos del padrón activo de personas. 

 
La búsqueda no encuentra candidatos en el padrón activo de personas y muestra un mensaje de ?oNo se encontraron candidatos con los datos mínimos ingresados. Verifique y consulte nuevamente o empadrone a la persona ? 

## Azure Tasks
- Test Case 6190: QA-Botón "LIMPIAR CONSULTA" en "Escanear DNI" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6205: FE-Búsqueda automática | Estado: Done
 - Asignado a: Franco Bonaviri
- Task 6298: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6412: QA-Verificar (*)Datos obligatorios al realizar "ESCANEAR DNI" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6213: QA-Búsqueda "ESCANEAR DNI" válido | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6548: QA-Escanear DNI Formato viejo con doble apellido | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6189: QA-Verificar Botón "B sSQUEDA POR DOCUMENTO" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6181: QA-Búsqueda - ESCANEAR DNI -inválido | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6281: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6414: QA-Verificar los campos al Escanear un DNI válido | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6299: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6418: QA-Botón "VOLVER" al escanear un dni | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6415: QA-Botón "VOLVER" al escanear un dni inválido | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6182: QA-Botón "LIMPIAR CONSULTA" en "Tipo de documento" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6539: QA-Verificar al escanear DNI (*)Datos obligatorios en "Set de datos mínimos" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez



