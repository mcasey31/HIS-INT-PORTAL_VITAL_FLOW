# HU 5900 - 1.HdU-Búsqueda de persona por tipo y número de documento

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5892_1-IDENTIFICACIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5900/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI (con permisos de búsqueda) 

 Quiero: Buscar personas 

 Para: Identificar una persona 

 

 Descripción y comportamiento: Al ingresar al módulo identificatorio de personas, contamos con un tipo de búsqueda manual por tipo y número de documento (pantalla 1). Una vez completados los campos, se habilitará el botón ?oConsultar ? (pantalla 2). De encontrar coincidencias, el sistema nos arrojará el o los candidatos a seleccionar mediante los parámetros de consulta ingresados, con las siguientes características: 

 Tipo de documento (select) (DNI-CUIT/CUIL-PASAPORTE-DNM-CIPL) 

 
Numero de documento (campo alfanumérico) 

 
 Si se encuentra una o dos coincidencias con un porcentaje alto debido a una diferencia de un dígito en M y F, se deben traer a la grilla de información los siguientes datos de la persona (pantalla 3): 

 Apellidos, Nombres 

 
Tipo de documento 
 

 
Número de Documento 

 
Fecha de Nacimiento 

 
Sexo biológico 

 
Estado 

 
Porcentaje de coincidencia 

 
 En caso de no arrojar candidatos por tipo y número de documento, se activarán los campos de búsqueda por ?oSet de datos mínimos ? (pantalla 4). Esta acción también se podrá llevar a cabo desde el botón "Búsqueda por set mínimo". 

Una vez ampliados los campos de búsqueda (tipo y numero de documento, más el set de datos mínimos) el botón "Búsqueda por set mínimo" pasará a ser "Búsqueda por documento", que nos redirige a la pantalla inicial donde se realizará la búsqueda por tipo y numero de documento. 

Se contará también con un botón de "Limpiar consulta" que al seleccionarlo borrará los datos ingresados en el campo "N° de documento" y de haber traído candidatos seleccionables, también borrará la grilla.
 

 

 

 Link de pantallas: 

 (pantalla 1) Búsqueda por tipo y numero de documento 

 
(pantalla 2) Activación de botón ?oConsultar ? 

 
(pantalla 3) Grilla con candidatos 

 
(pantalla 4) Campos de set de datos mínimos

## UX Referencia (Adobe XD)
- General: https://xd.adobe.com/view/b8af0d29-cf96-4eca-a665-2f27192aeb58-edfc/
- Pantalla 1: https://xd.adobe.com/view/b8af0d29-cf96-4eca-a665-2f27192aeb58-edfc/
- Pantalla 2: https://xd.adobe.com/view/b8af0d29-cf96-4eca-a665-2f27192aeb58-edfc/screen/1854cf89-574b-46f4-b695-28c0fd9d32fc
- Pantalla 3: https://xd.adobe.com/view/b8af0d29-cf96-4eca-a665-2f27192aeb58-edfc/screen/66b796a0-998d-4202-879d-15b1ec889b23
- Pantalla 4: https://xd.adobe.com/view/b8af0d29-cf96-4eca-a665-2f27192aeb58-edfc/screen/419cff06-194e-479f-853e-c5d82d17a113

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 El tipo de documento DNI debe venir preseleccionado y el foco del cursor debe estar en la caja de texto de Número 

 
La búsqueda debe ser exacta, no probabilística. Excepto en el caso de que los DNI comiencen con F o M en el cual debería devolver los dos resultados si el criterio de búsqueda es solo el número. 

 
De no encontrar candidato mostrará el mensaje ?oNo se encontraron candidatos para el DNI <Nro de DNI>. Verifique los datos ingresados o inicie búsqueda por set de datos mínimos ? 

 
Si los candidatos están en estado ?oInactivo ? no debe traerlos en la búsqueda.

## Azure Tasks
- Test Case 6179: QA - Verificar Habilitacion de Boton Consultar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 6912: QA - Buscar Persona por DNI con "F" | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6324: QA - Boton Limpiar Consulta - Grilla de Información | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7214: QA - Busqueda por Tipo de Documento - Error Tipos de Documento | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 6914: QA - Buscar Persona por DNI "M" | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6183: QA - Verificar Mensaje "No se encontraron Candidatos para el DNI ..." | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6120: QA - Busqueda por Numero de Documento Valido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 6920: QA - Posicionamiento de Casilla Numero de Documento | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 6917: QA - Consulta por DNI ("F" y "M") | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6180: QA - Verificar Grilla de Informacion los datos obtenidos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6087: FE-Integracion en endpoints | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6328: QA - Verificar Boton Búsqueda por set mínimo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6300: BE - Pruebas unitarias - Obtener tipo dni | Estado: Done
 - Asignado a: Maximiliano Ezequiel Rios
- Task 6086: FE-Maquetado front | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6302: QA - Verificar Pantalla con Set de Datos Minimos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7641: QA - Verificar el campo Fecha de Nacimiento en la busqueda de Set de Datos Minimos - Error Fecha Posterior a la Actual | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6227: QA - Verificar que la busqueda del DNI que comienzan con "M" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7318: DEV - FE - Revisar traducciones | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6119: QA - Busqueda por Tipo de Documento | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6274: BE-Pruebas unitarias resultado busqueda | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Bug 6928: QA - Falta Icono del Cesto de Basura | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6226: QA - Verificar que la busqueda del DNI sea Exacta | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6089: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 6918: QA - Busqueda de Candidatos - No devuelve resultados | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Bug 6882: QA - BUG La casilla de Tipo de Documento debe estar Preseleccionado en "DNI" | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Test Case 6915: QA - Verificar coincidencias de los candidatos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7683: QA - Verificar Boton Empadronar Persona | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6225: QA - Verificar el Foco del Cursor en Casilla "Nro de Documento" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6287: BE - SP obtener personas | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 6964: QA - Verificar Los Formatos en la Grilla de Información | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6084: BE-Endpoint get para tener resultados de la busqueda | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Test Case 6224: QA - Verificar en la casilla Tipo de Doc, la Preseleccion "DNI" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6228: QA - Verificar en la Grilla que no se vean los Candidatos en estado "Inactivo" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7640: QA - Verificar el campo Fecha de Nacimiento en la busqueda de Set de Datos Minimos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6345: QA - Verificar los Candidados a Seleccionar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6214: QA - Busqueda por Numero de Documento Invalido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 6946: QA - Verificar la ejecucion de diferentes consultas - Fallida | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Bug 6961: QA - Consulta por Busqueda por Documento - NO se Observa el Set de Datos Minimos | Estado: Done
- Task 6085: BE-Endpoit get tipo de documento | Estado: Done
 - Asignado a: Maximiliano Ezequiel Rios
- Test Case 6330: QA - Consuta por Búsqueda por documento | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6273: FE-Pruebas Unitarias | Estado: Done
 - Asignado a: Jaime Ricardo Gonzalez Montenegro
- Bug 7684: QA - Verificar Boton Empadronar Persona - Error al mostrar el Boton | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7076: QA - Verificar Formatos de los Campos - Sexo Biologico - Error | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 6289: BE - Configurar e informar datos ambiente de desarrollo | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 6323: QA - Boton Limpiar Consullta - Numero de Documento | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6088: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 6965: QA - Verificar los Formatos en la Grilla de Informacion - NO coinciden con los definidos en el Mockup - Fecha de Nac | Estado: Done



