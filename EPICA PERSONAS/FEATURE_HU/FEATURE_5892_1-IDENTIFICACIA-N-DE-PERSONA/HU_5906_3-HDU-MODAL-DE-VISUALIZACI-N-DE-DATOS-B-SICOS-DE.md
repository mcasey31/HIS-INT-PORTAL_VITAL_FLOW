# HU 5906 - 3. HdU-Modal de visualización de datos básicos de candidato

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5892_1-IDENTIFICACIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5906/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI 

 Quiero: Visualizar datos 

 Para: Elegir candidato seleccionable 

 Descripción y comportamiento: 

 Desde el módulo identificatorio de personas, una vez realizada la búsqueda, ya sea por tipo y numero de documento, set de datos mínimos, o escaneo de DNI, el sistema arrojará una grilla con posibles candidatos a seleccionar (pantalla 1). Dicha grilla contendrá al final de cada línea un ?oIcono ocular ? para visualizar los datos ampliados de la persona en un modal (pantalla 2) que contendrá los siguientes datos: 

 

 Apellidos y nombres (edad) 

 
Documento (tipo y numero) 

 
Fecha de nacimiento (date) (dd/mm/aaaa) 

 
Sexo biológico (texto) 

 
Genero autopercibido (texto) 

 
Correo electrónico (email) 

 
Teléfono (numérico) 

 
Dirección (calle altura | torre bloque piso | código postal | barrio localidad partido provincia país) 

 
Foto (definir formato) 

 
 Dicho modal contendrá los datos de la (s) persona (s) de contacto (Tipo de relación, Apellido y Nombre, Tipo y N° de documento, Fecha de nac. Sexo biológico, Tel, Email). 

La grilla de persona de contacto no tendrá paginado, eventualmente la cantidad de fila sea mayor se podra scrollear por la grilla. 

 El modal contará con un botón de "Editar ? que nos llevará a la edición del padrón de una persona. 

 Link de pantallas: 

 Pantalla 1 Grilla con candidatos 

 
pantalla 2 Modal

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 -Los datos visualizados en el modal, deben coincidir con los del candidato seleccionado desde el botón visualizar. 

 -Al presionar el botón volver, o tecla ESC (escape) el sistema nos redirigirá a la grilla principal. 

 -Tanto los teléfonos, como correos electrónicos serán mostrados de manera encolumnada según el orden en que se hayan cargado

## Azure Tasks
- Test Case 6221: QA - Verificar funcionamiento de la tecla ESC | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6219: QA - Verificar Los datos visualizados en el Modal ( Deben ser el candidato Seleccionado) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6292: BE - Obtener datos básicos del candidato | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 6218: QA - Verificar existencia del Boton Editar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7377: QA - Verificar los datos del Modal Persona de Contacto Failed - Error en Consola-Network | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Bug 7132: QA - Verificar pantalla del Modal con la Informacion de Datos Ampliados - Error en Formato de pantalla del Modal | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 6990: QA - Verificar los datos del Modal Persona de Contacto - Error en Sexo Biologico | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 7089: BE - Quitar tipo de relación en persona de contacto | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Bug 7479: DEV - FE - Modal se rompe cuando genero autopercibido viene null | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6278: BE-Pruebas unitarias obtener datos basicos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 6187: QA - Verificar en Grilla de Informacion el simbolo del Icono ocular | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6188: QA - Verificar Modal con la Grilla de Informacion de Datos ampliados | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 6955: DEV - FE - Cambiar los ids harcodeados por variables de entorno | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 6934: DEV - FE - En el modal de la pantalla detalle de la persona al cargar muchos teléfonos o un texto largo en el campo comentario de domicilio hace que empuje el botón volver y deje de estar visible. | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7375: QA - Verificar los datos del Modal Persona de Contacto Failed - Error de Modal | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 7131: QA - Verificar pantalla del Modal con la Informacion de Datos Ampliados | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 6994: QA - Verificar la Grilla de Informacion con los Datos de Persona de Contacto - Falta campo Fecha de Nac y Sexo Biologico debe estar Completo | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6223: QA - Verificar en la Grilla el orden de los Correos Electronicos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6202: FE-Integración | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 7098: FE - Agregar traducciones para sexo biologico | Estado: In Progress
 - Asignado a: Edward Schmoll
- Task 6277: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 6967: QA - Verificar los datos del Modal Persona de Contacto - Error en Fecha de Nac | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7399: QA-Grilla vacia desde el ojo | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 7099: DB - Agregar traducciones para sexo biologico | Estado: To Do
- Test Case 6216: QA - Verificar en La grilla de persona de contacto No debe tener Paginado | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7000: DEV - FE - Aparecen teléfonos dónde deberían aparecer correos electrónicos | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Test Case 6316: QA - Verificar los datos del Modal Persona de Contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6220: QA - Verificar funcionamiento del Boton Volver | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6217: QA - Verificar el Scrolleo en la grilla de persona de contacto cuando la cantidad de Filas sea mayor | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6347: QA - Verificar los Datos Ampliados de la Persona de Contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6201: FE-Maquetado | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6184: QA - Ejecucion de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6993: QA - Verificar la Grilla de Informacion con los Datos de Persona de Contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6186: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6222: QA - Verificar en la Grilla el orden de los telefonos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



