# HU 5940 - 7. HdU- Empadronamiento de personas (Eliminar personas contacto)

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5940/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de ODI ? 

 Quiero: Seleccionar una o más persona(s) en el marco de persona de contacto. ? 

 Para: Eliminar del marco de persona de contacto a un(os) contacto(s) seleccionado(s) antes de vincular. 

 ? 

 Descripción y comportamiento: Si existe al menos una persona de contacto seleccionada para ser vinculada en el proceso de empadronamiento, se podrá seleccionar cada una de ellas con el botón tipo check (Pantalla 1), Si se selecciona una o más personas en la grilla se habilita botón ?oEliminar ? , el cual permitirá la eliminación de esa fila del marco de personas de contacto. 

 

 Link de pantallas: ? 

 

 Pantalla 1 Marco de persona de contacto (check y botón eliminar)

## Azure Criterios de Aceptacion
Criterios de aceptación: ? 

 El marco de persona contacto contará con un botón de selección ?otipo check ? , en cada fila. 

 
Seleccionando una o más personas en el marco de persona de contacto, se habilita botón ?oEliminar ? , que permitirá eliminar la fila(s) seleccionada(s) antes de ser vinculada. 

 
Al seleccionar ?oEliminar ? aparecerá un mensaje de confirmación con el texto ?oDesea realmente eliminar a <persona de contacto> como persona de contacto de <Persona> ? 

 
Si se selecciona el botón eliminar esta persona de contacto desaparecerá de la grilla de ?oPersonas de contacto. 

 
Disminuir un 10% el cotnador de empadronamiento si no quedaran personas de contacto

## Azure Tasks
- Task 6721: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7928: QA- Verificar Alerta modal al "Eliminar persona de contacto" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7923: QA- Verificar Alerta toast "Nombre, ya se encuentra como persona de contacto"- al ingresar persona de contacto ya existente | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 6798: QA-Agregar "Persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7241: QA-Botón "ELIMINAR" al agregar persona de contacto | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7306: QA-Verificar Botones al "Buscar y agregar una persona de contacto" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7924: QA- Verificar porcentaje de empadronamiento cuando disminuye | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 8167: 7923: QA- Verificar Alerta toast "Nombre, ya se encuentra como persona de contacto" al ingresar persona de contacto ya existente -Error alerta toast- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7243: QA-Seleccionar 2 personas de contacto | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7231: QA-Verificar botón de selección ?otipo check ? , en el marco "Persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7245: QA-"ELIMINAR" Persona de contacto | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 8105: QA-"ELIMINAR" Persona de contacto -No se visualiza el check- | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7925: QA- Verificar Alerta toast al "eliminar persona de contacto" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 6720: QA - Diseño de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 7308: QA-Verificar datos obligatorios en "Buscar y agregar persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez
- Task 7574: FE-Implementación eliminar persona contacto | Estado: Done
 - Asignado a: Franco Bonaviri
- Test Case 7305: QA-Verificar campos al "Buscar y agregar una persona de contacto" | Estado: Design
 - Asignado a: Hernan Alexis Gutierrez



