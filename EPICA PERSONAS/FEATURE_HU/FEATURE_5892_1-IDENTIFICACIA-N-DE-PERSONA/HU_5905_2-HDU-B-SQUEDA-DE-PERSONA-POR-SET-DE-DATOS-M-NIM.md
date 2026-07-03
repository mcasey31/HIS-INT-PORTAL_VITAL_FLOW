# HU 5905 - 2. HdU-Búsqueda de persona por set de datos mínimos

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5892_1-IDENTIFICACIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5905/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI 

 Quiero: Realizar búsqueda de candidatos 

 Para: Realizar selección o empadronamiento de personas 

 

 Descripción y comportamiento: Desde el módulo identificatorio de personas, luego de realizar búsqueda por tipo y numero de documento, si el sistema no arroja candidatos, o si selecciona el botón de ?oBúsqueda por set mínimo ? , el sistema desplegará campos para una búsqueda ampliada por ?oset de datos mínimos ? (pantalla 1). Se usarán TODOS los datos del set de datos mínimo para buscar los candidatos, es esencial comprender que estos datos no son excluyentes entre sí. En lugar de buscar coincidencias exactas para todos los datos simultáneamente, se calcularán porcentajes de coincidencia para cada dato individualmente. Esto permite una búsqueda más flexible y precisa, considerando diferentes grados de coincidencia para cada campo. 

 

 Set de datos mínimos: 

 Tipo de documento (select) (traer datos de búsqueda) 

 
Numero de documento (campo de texto libre) (traer datos de búsqueda) 

 
Nombre (campo de texto libre) 

 
Apellido (campo de texto libre) 

 
Fecha de nacimiento (date) (dd/mm/aaaa) 

 
Sexo biológico (select) (masculino-femenino) 

 
 Para la búsqueda por set de datos mínimos, todos los campos son de carácter obligatorios. 

 Los candidatos seleccionables serán presentados en una grilla que contiene los siguientes datos (pantalla 2): 

 Apellido (s) y nombre (s) 

 
Tipo de documento 

 
Numero de documento 

 
Fecha de nacimiento 

 
Sexo biológico 

 
Estado 

 
Porcentaje de coincidencia 

 
El cálculo de la coincidencia se realiza a través de los pesos ponderados para cada campo del set mínimo de datos. Valiendo el 100% del peso ponderado para cada dato si coincide o 0% si no lo hace. 

 
 https://docs.google.com/spreadsheets/d/1cCwue_lO4m1wqNaod3bRCqaIC6l6RX4cwXziMsHmxQU/edit?usp=sharing 

 Una vez arrojados los candidatos, la selección de este se realizará considerando el que tenga mayor peso porcentual de coincidencia. 

 De no arrojar candidatos que coincidan con nuestra búsqueda, o bien ninguno de los candidatos coincida mas del 95% con los datos de búsqueda, se activará botón para realizar empadronamiento (pantalla 3). 

Se contará también con los siguientes botones: 

"Búsqueda por documento" nos redirigirá a la pantalla de búsqueda por tipo y numero de documento. 

"Limpiar consulta" que al seleccionarlo borrará los datos ingresados en los campos N° de documento, Nombre, Apellido, Fecha de nacimiento, y Sexo biológico. De haber traído candidatos seleccionables, también borrará la grilla. 

 

 Link de pantallas: 

 (pantalla 1) Búsqueda por set de datos mínimos 

 
(pantalla 2) Grilla de candidatos 

 
(pantalla 3) Botón ?oEmpadronar persona ? 

 
 

 

 Buscar persona (adobe.com)

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 Si la búsqueda se realiza por set de datos mínimos, se cotejarán los datos con las personas empadronadas según el peso porcentual de coincidencia. 

 
La grilla de candidatos deberá mostrar set de datos mínimos. 

 
Si los candidatos están en estado ?oInactivo ? no debe traerlos en la búsqueda. 

 
Traer precargados tipo y numero de documento. 

 
 

 @Martin Miguel Diaz Maffini cálculo de diferencia entre strings

## Azure Tasks
- Task 6290: BE - Obtener tipos de sexo biológicos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 6169: QA-Verifica "box" para realizar el check de persona por porcentaje de coincidencia | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6200: FE-Integración | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6215: QA-Verificar Habilitación botón "LIMPIAR CONSULTA" en "tipo y número de documento" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6301: BE - Prueba Unitaria - Obtener sexo biologico | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 6164: QA-Búsqueda valida por "Set de datos mínimos" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7148: QA - Verificar los estados posibles en el Empadronamiento de Persona - Busqueda por Set Minimo - Inactivo - Error | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Test Case 6177: QA-Verificar faltante en un campo de (*)datos obligatorio en el - Set de datos mínimos - | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6166: QA-Verificar leyenda al no encontrar candidatos por "tipo y numero de documento" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6168: QA-Verificar Botón "+ EMPADRONAR PERSONA" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6297: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6379: QA-Búsqueda invalida por "Set de datos mínimos" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7134: QA-Verificar Habilitación botón "CONSULTA" -difiere el texto- | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6167: QA-Verificar campos de carácter obligatorios - Set de datos mínimos - | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6185: QA-Verificar Habilitación botón "CONSULTAR" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6276: BE-Pruebas unitarias nuevo parametro obtener persona | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Task 6296: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 6996: FE - Agregar Empadronar en base a Coindicencia | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6391: QA-Verificar Habilitación botón "LIMPIAR CONSULTA" en "Set de datos mínimos" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6275: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6165: QA-Grilla de candidatos seleccionar "Mayor porcentaje de coincidencia" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6199: FE-Maquetado | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Bug 7093: QA- Verificar color de campos búsqueda de "Set de datos mínimos" -Color celeste + diferencias- | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6291: BE - Agregar nuevos parametros al EP obtener personas | Estado: Done
 - Asignado a: Leandro Andres Anadon



