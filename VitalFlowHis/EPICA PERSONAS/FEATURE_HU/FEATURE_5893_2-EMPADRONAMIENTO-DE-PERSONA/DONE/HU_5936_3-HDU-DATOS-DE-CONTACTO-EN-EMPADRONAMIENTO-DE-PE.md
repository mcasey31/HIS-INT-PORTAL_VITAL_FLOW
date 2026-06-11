# HU 5936 - 3. HdU- Datos de contacto en empadronamiento de personas

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5936/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI 

 Quiero: Cargar formas de contacto 

 Para: Completar empadronamiento de personas 

 

 Descripción y comportamiento: 

 Desde el proceso de empadronamiento de personas, contamos con los siguientes marcos de datos a completar: 

 

 Marco de encabezado: (ver HdU) 

 Carga de set de datos mínimo: (ver HdU) 

 

 Datos de contacto: ? 

 Tipo (teléfono por default) ? 

 
Teléfono (numérico) ? 

 
Uso (select) (Personal, Laboral, Otro) 

 
Tipo (correo electrónico por default) ? 

 
Correo electrónico (campo alfanumérico) ? 

 
Uso (select) (Personal, Laboral, Otro) 

 
 

 En los dos primeros tipos de contactos a visualizar, el campo ?oTipo ? vendrá cargado por defecto en teléfono y correo electrónico. En caso de agregar un nuevo contacto desde el botón ?o+ ? se completarán todos los campos según el dato que se quiera registrar. 

 A pesar de no ser obligatorios, los datos de teléfono y correo electrónico de contacto son de gran importancia para el empadronamiento de pacientes. Por lo tanto, si bien no traba el flujo de trabajo, de no estar cargados alguno de los dos al momento de confirmar el empadronamiento, deberá aparecer un mensaje en pantalla en una ventana modal que diga ?oPor favor considere agregar un correo electrónico o número de teléfono. 
¡No es obligatorio, pero sería muy útil!
Por favor hágalo. 
Este dato será auditado (pantalla) ? 

 

 Este feature sigue en las siguientes historias de usuario 

 Dirección: ? (ver HdU) 

 
Persona de contacto: ? (ver HdU) 

 
 

 Link de pantallas: 

 (pantalla)

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 -En el marco ?oDatos de contacto ? al seleccionar botón + se agregará una nueva fila de campos de contacto en blanco. 

 -Los primeros dos ?oTipo ? en contacto vendrán seleccionados por defecto en teléfono y correo electrónico.

## Azure Tasks
- Test Case 7633: QA- Verificar en la card "Datos de contacto" campo Correo electrónico sea Alfanumérico | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 6547: BE - UnitTest obtener uso datos contacto | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Bug 7386: QA-Verificar campos por default en Datos de contacto botón "+"" -Texto Correo electrónico- | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7514: QA-Verificar campos en Datos de contacto para un nuevo contacto "Botón +" -EL cesto y el botón + deben estar centrados- | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Task 6493: QA - Ejecucion de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 6546: BE - obtener uso datos contacto | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Task 6545: BE - UnitTest obtener tipos dato contacto | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 7513: QA-Verificar campos en la card "Datos de contacto" -Campos Teléfono y USO no deben ser obligatorios- | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7110: QA-Verificar campos en el marco de "Datos de contacto" -No existe el marco Datos de contacto- | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6513: QA-Verificar campos por default en Datos de contacto botón "+" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6726: QA- Confirmación de leyenda al no cargar datos en correo electrónico o teléfono" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7688: QA- Confirmación de leyenda al no cargar datos en correo electrónico o teléfono - No se muestra la Leyenda | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 6211: FE - Maquetado formulario | Estado: Done
 - Asignado a: Franco Bonaviri
- Task 6626: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 6285: FE-Pruebas unitarias | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6622: QA-Verificar botón "+" en la card "Datos de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7634: QA- Verificar el desplegable en la card "Datos de contacto" campo Uso* | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6512: QA-En el marco Datos de contacto "ELIMINAR Datos cargados" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7512: QA-Verificar botón "+" en la card "Datos de contacto" -Texto en minúscula- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7691: QA- Verificar el desplegable en la card "Datos de contacto" campo Uso* -Default Personal- | Estado: Removed
 - Asignado a: Sebastian Hernandez Garandan
- Bug 7646: QA- Verificar el desplegable en la card "Datos de contacto" campo Tipo* -Desplegable diferencias- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7515: QA-Verificar campos en el marco de "Datos de contacto" -No se visualiza el cesto de basura- | Estado: Done
 - Asignado a: Mariam Stanziola Davila
- Test Case 6514: QA-Verificar campos en la card "Datos de contacto" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6510: QA-Verificar campos en el marco de "Datos de contacto" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6511: QA-Verificar campos en Datos de contacto para un nuevo contacto "Botón +" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 6212: FE-Integración combos | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6515: QA- Verificar botón GUARDAR en el empadronamiento | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7819: QA-En la card "Datos de contacto" no se aprecian los tildes | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7637: QA- Verificar el desplegable en la card "Datos de contacto" campo Uso* -Desplegable incompleto- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7632: QA- Verificar en la card "Datos de contacto" campo Teléfono sea Numérico | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7642: QA- Verificar el desplegable en la card "Datos de contacto" campo Tipo* | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 6544: BE - obtener tipo datos contacto | Estado: Done
 - Asignado a: Eduardo Ynoub



