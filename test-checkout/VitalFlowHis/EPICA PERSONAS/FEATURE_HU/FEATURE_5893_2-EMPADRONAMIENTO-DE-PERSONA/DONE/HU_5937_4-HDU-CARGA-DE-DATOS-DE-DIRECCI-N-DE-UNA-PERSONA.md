# HU 5937 - 4. HdU- Carga de datos de dirección de una persona

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5937/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de ODI 

 Quiero: Carga de datos de dirección postal de una persona. 

 Para: Registral la ubicación geográfica de la persona a empadronar. 

 

 Descripción y comportamiento: Desde el proceso de empadronamiento, una vez transcrito los datos personales y de contacto, se procede a transcribir los datos ubicación geográfica ?odirección ? (pantalla 1), donde se detallarán los campos en relación con el lugar residencial de la persona a empadronar. Cabe mencionar que el marco de dirección, debe ajustarse al nuevo componente de direcciones (pantalla 2) 

 Esta historia de usuario viene en el feature luego de estas otras tres: 

 Marco de encabezado: (ver HdU) 

 
Empadronar persona:(ver HdU) 

 
Datos de contacto: (ver HdU) 

 
 En el registro de ubicación geográfica se debe considerar los siguientes campos: 

 Marco de Dirección: 

 País (select) ?" Por default Argentina. * 

 
Provincia (select autocomplete) - Por default provincia donde se encuentra la institución. * 

 
Localidad (Partido) (select autocomplete) ?" Filtrada de acuerdo con la provincia seleccionada. * 
 

 
Barrio (campo de texto libre) 

 
Calle (campo de texto libre) * 

 
Número (campo numérico) * 

 
Código postal (alfanumérico) 

 
Piso (campo de texto libre) 

 
Departamento (campo de texto libre) 

 
Comentario (campo de texto libre) limitado a 140 caracteres. 

 
 En este feature sigue en la siguiente historia de usuario: 

 Persona de contacto:(ver HdU) 

 
 

 Link de pantallas: 

 pantalla 1 Formulario de empadronamiento 

pantalla 2 Componente de direcciones.

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 El campo de país debe venir por default Argentina y provincia por default de acuerdo donde se encuentra la institución (Ambas editables) 

 
El campo de localidad debe filtrarse según la provincia seleccionada. Campo autocomplete.

## Azure Tasks
- Test Case 6730: QA-Verificar campos no obligatorios en el marco "Dirección" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6630: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7587: QA-Verificar campos obligatorios en la card "Dirección" -Falta Desplegable al campo Localidad- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6736: QA-Verificar campos a seleccionar en el marco "Dirección" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6754: QA-Botón "CANCELAR" al cargar en Datos de contacto | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 6629: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7583: QA-Verificar campos obligatorios en la card "Dirección" -Espacio entre Dirección y Pais- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 7193: FE - Implementación componente direcciones | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 6732: QA-Verificar campos por defaut en el marco "Dirección" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Bug 7582: QA-Verificar campos obligatorios en la card "Dirección -Falta campo Localidad (Partido)*- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6729: QA-Verificar campos obligatorios en la card "Dirección" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6752: QA-Botón "GUARDAR" al cargar Datos de contacto | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez



