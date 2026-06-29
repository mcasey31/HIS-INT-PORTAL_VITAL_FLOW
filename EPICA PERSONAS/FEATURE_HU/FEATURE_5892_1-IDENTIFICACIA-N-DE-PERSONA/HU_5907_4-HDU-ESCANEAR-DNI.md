# HU 5907 - 4. HdU- Escanear DNI

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5892_1-IDENTIFICACIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5907/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de ODI 

 Quiero: Escanear el DNI 

 Para: Capturar datos básicos de una Persona 

 

 Descripción y comportamiento: Desde el sistema ODI, en cualquier módulo del aplicativo que lo requiera, se necesita escanear el DNI de una persona para capturar el set de datos mínimos (Número de documento, Nombre, Apellido, Fecha de nacimiento, Sexo biológico) (pantalla 1) El sistema abrirá una ventana modal indicando mediante un dibujo cual es el código QR que debe ser escaneado (pantalla 2). El usuario procederá a realizar la lectura de este. Si la lectura es infructuosa, informa en pantalla que no se pudo realizar el escaneo y que intente nuevamente (pantalla 3). Si es exitosa informa ?oEscaneo completado ? (pantalla 4) y luego de 2 segundos vuelve a la pantalla de origen con los datos leídos impactados en los campos correspondientes (pantalla 5). 

 En esta pantalla de origen, ejecutará la búsqueda de candidatos si se tratara de la de Identificación de personas. 

 Si esta información fuera usada para empadronar una persona, el estado de esta al finalizar el empadronamiento será ?ovalidado ? . 

 Los datos del set de datos mínimos leídos de QR de DNI que serán impactados en los campos correspondientes son: 

 Número de documento 

 
Nombre(s) 

 
Apellido(s) 

 
Fecha de nacimiento 

 
Sexo biológico 

 
 

 Link de pantallas: 

 Pantalla 1. Botón de escanear DNI 

 
Pantalla 2. Dibujo de QR en el DNI 

 
Pantalla 3. Mensaje ?oNo se puede escanear ? 

 
Pantalla 4. Mensaje ?oEscaneo completado ? 

 
Pantalla 5. Pantalla de búsqueda con datos completados

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 Visualizar datos de la persona desde escaneo del código QR del DNI. 

 
Permitir realizar el proceso de escaneo tantas veces se requiera. 

 
Si el escaneo arroja datos, el sistema iniciará la búsqueda de candidatos.

## Azure Tasks
- Test Case 6196: QA - Verificar en Pantalla Modal Escaneo Completado" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7410: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI (2 Apellidos) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6362: QA - Escanear Codigo QR DNI Valido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6229: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI (2 Nombres) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6204: FE-Integración escáner | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6232: QA - Verificar despues del Escaneo la Busqueda de Candidatos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6230: QA - Verificar que los datos Obtenidos del Escaneo QR correspondan al DNI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6363: QA - Escanear Codigo QR DNI Invalido | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6194: QA - Verificar Pantalla Modal con el Codigo de Barras a Escanear | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6192: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6365: QA - Verificar el Estado Validado en la Grilla de Informacion | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7412: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI (Formato Nuevo) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6193: QA - Verificar en pantalla habilitación del Botón Escanear DNI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6191: QA - Ejecucion de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 7411: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI (Formato Viejo) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6203: FE-Maquetado | Estado: Done
 - Asignado a: Franco Bonaviri
- Task 6279: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6350: QA - Verificar Habilitacion de Boton CONSULTAR en Set de Datos Minimos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6353: QA - Verificar el impacto de los datos minimos leidos de QR del DNI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6197: QA - Verificar en la Grilla de Set de Datos Minimos los datos leídos impactados | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6231: QA - Verificar la ejecución del Escaneo las veces que se requiera | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6195: QA - Verificar en Pantalla Modal "No se puede Escanear ... " | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



