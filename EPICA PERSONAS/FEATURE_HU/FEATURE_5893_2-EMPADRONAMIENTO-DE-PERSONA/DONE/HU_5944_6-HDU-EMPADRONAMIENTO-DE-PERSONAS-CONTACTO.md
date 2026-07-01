# HU 5944 - 6. HdU- Empadronamiento de personas contacto.

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5944/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
HdU- Empadronamiento de personas contacto.
 

 

 

 

 

 

 

Como: Usuario de ODI 

 Quiero: Cargar el set de datos mínimo de una persona de contacto. 

 Para: Empadronar a una persona como contacto. 

 Descripción y comportamiento: Para empadronar una persona de contacto, desde el botón ?oEmpadronar personas de contacto ? mostrara la siguiente (pantalla 1). Desde este modal se completarán los campos necesarios para agregar a la persona contacto; los campos requeridos son los siguientes: 

 - Nombre (s) (autocomplete, arrastrar datos desde modal de búsqueda) (campo de texto libre) * 
 
- Apellido (s) (autocomplete, arrastrar ? ) (campo de texto libre) * 
- Tipo de documento (select) (autocomplete, arrastrar ? ) (DNI-CUIT/CUIL-PASAPORTE-DNM-CIPL) * 
- Número de documento (autocomplete, arrastrar ? ) (texto) * 
- ?<Fecha de nacimiento* 
- Sexo biológico (select) (autocomplete, arrastrar ? ) (Masculino-Femenino) * 
- Tipo (teléfono por default) ? 
- Teléfono (numérico) ? 
- Uso (select) (default Personal) 
- Tipo (correo electrónico por default) ? 
- Correo electrónico (campo alfanumérico) ? 
- Uso (select) (default Personal) 
 *Campos obligatorios 

 

 En los dos primeros tipos de contactos a visualizar, el campo ?oTipo ? vendrá cargado por defecto en teléfono y correo electrónico. En caso de agregar un nuevo contacto desde el botón ?o+ ? se completarán todos los campos según el dato que se quiera registrar. 

 
 La persona empadronada como contacto, debe quedar con un Estado temporal sea cual sea el método de carga de datos.
 
 Al volver del empadronamiento, se mostrará en el marco de ?oPersonas de contacto ? (pantalla 2) una grilla con los siguientes datos por cada persona de contacto: 
 

 

Tipo y Nro de documento 
 

 
Apellido(s) y nombre(s) separados por coma 

 
Sexo y edad entre paréntesis según formato ?oF(34) ? 

 
Teléfono principal y de haber otro en la misma columna debajo del principal 

 
Email 

 
 La(s) persona(s) agregada(s) a la lista de contacto se vincularán con la persona principal una vez presionado el botón Guardar. 
 Link de pantallas: 

 (pantalla 1) Modal de empadronamiento de persona de contacto. 

 (pantalla 2) Grilla con personas de contacto.

## Azure Criterios de Aceptacion
- Dado que, en los datos de contacto solo se agregan los números de teléfonos y email de forma predeterminada, por default se agregará a la base en tipo y uso de cada elemento, como se indica en la historia. 
- Si los datos se ingresan por escaneo de DNI, se autocompletará en el "set de datos mínimos" en el modal de empadronamiento.
 
- Cuando se completen los datos obligatorios se habilitará el botón "Guardar" 
- Al empadronar una persona de contacto será registrada siempre como Temporal independientemente del método de carga de datos.

## Azure Tasks
- Test Case 7338: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI en Modal Empadronar Persona de Contacto (2 Apellidos) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7315: QA - Verificar La persona empadronada como contacto - el Estado debe ser Temporal - Error no se grabaron los datos en la BD | Estado: Removed
- Test Case 6727: QA - Verificar Boton "+" para agregar Datos de Contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6635: Integración | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 7252: QA - Verificar La persona empadronada como contacto - el Estado debe ser Temporal | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7295: QA - Verificar campos en Modal "Empadronar Persona de Contacto" - Error Descripcion de Campo | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 6731: QA - Verificar Campos en Modal Persona de Contacto luego del volver del Empadronamiento | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6628: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 7336: QA - Verificar Boton "+" para agregar Datos de Contacto - Error | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 7695: QA - Verificar la persona de contacto el Estado debe ser Temporal | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6734: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI en Modal Empadronar Persona de Contacto (2 Nombres) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7329: QA - Verificar Campos en Modal Persona de Contacto luego del volver del Empadronamiento - error al mostrar datos | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6735: QA - Verificar la Habilitacion del Boton Guardar en Modal Empadronar Persona de Contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 6627: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 7704: QA - Verificar el Mensaje en el Toast de Informacion | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6705: QA - Verificar Boton "EMPADRONAR PERSONA DE CONTACTO" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6710: QA - Verificar campo Tipo de Telefono | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 7294: QA - Verificar campos en Modal "Empadronar Persona de Contacto - Error Modal | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 7319: QA - Falta botón para salir | Estado: Done
 - Asignado a: Dalmiro Zantleifer Ojeda
- Bug 7719: QA - Verificar Mensaje en el Toast de Informacion - Error en posicion y formato | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 6634: Maquetado | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 7355: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI en Modal Empadronar Persona de Contacto (DNI Formato viejo) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 7356: QA - Verificar el autocompletado del Set de Datos Minimos Luego del Escaneo del DNI en Modal Empadronar Persona de Contacto (DNI Formato Nuevo) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6711: QA - Verificar campo Tipo de Correo Electronico | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6706: QA - Verificar campos en Modal "Empadronar Persona de Contacto" | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 6733: QA - Verificar Boton de Escaneo de DNI en Modal Buscar y agregar persona de contacto | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



