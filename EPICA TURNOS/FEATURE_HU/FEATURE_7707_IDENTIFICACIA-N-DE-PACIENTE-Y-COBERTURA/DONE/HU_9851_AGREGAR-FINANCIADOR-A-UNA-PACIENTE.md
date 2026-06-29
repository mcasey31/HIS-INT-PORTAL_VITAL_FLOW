# HU 9851 - Agregar financiador a una paciente

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7707_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/9851/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turno Quiero: vincular un financiador a un paciente Para: dar el turno al paciente con la cobertura correcta Descripción Al realizar el proceso de registración o de edición de paciente (HU:Product Backlog Item 9741: Identificación de Paciente). Se podrá seleccionar el botón de "AGREGAR FINANCIADOR" para hacer la carga de un nuevo financiador al paciente, se solicitará la carga de 3 campos necesarios: - Financiador (Combo desplegable que tomará todos los financiadores) 
- Plan (combo desplegable con búsqueda que tomará los planes que se tienen asociados al financiador seleccionado) 
- Nro. de afiliado (hasta 18 dígitos numéricos) 
 
 Al completar todos los datos obligatorios, se activará el botón de "Guardar". 
 Al finalizar nos llevará a un resumen, con la selección del financiador cargado 
 Cada financiador tendrá a su derecha un botón de "Finalizar vigencia" que al ser presionado, establecerá la fecha actual como la fecha de vigencia del registro una vez confirmada la acción por medio de un modal de reconformación. 
El único financiador que no contendrá esta funcionalidad será el Privado/Particular. 
Si se pone fin de vigencia de un registro se debe dejar seleccionado el financiador que tenga vigencia más próxima. 
 
 
 
 Pantallas: 
https://xd.adobe.com/view/20dc889e-1938-4d28-863f-9bc2c6cb61e1-758f/screen/9d1efdbc-408c-4e0a-a56f-642aeb09e4df/

## Azure Criterios de Aceptacion
- Al seleccionar el botón se despliega la carga de los campos
 
- Al seleccionar el plan deberá venir filtrado los planes del financiador elegido antes
 
- El número de afiliado debe ser hasta 18 dígitos numéricos, no puede ser null 
- Una vez seleccionado un financiador aparecerá activado el botón para proceder a la búsqueda del turno 
- No se debe poder dejar agregar un financiador - plan con el que ya cuente en vigencia 
- Al seleccionar el icono de validar persona nos redirige al paso anterior donde se muestran los datos del paciente.

## Azure Tasks
- Task 13785: Diseño interfaces | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 14098: FE- integración EP agregarFinaciadorPaciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 14021: QA - Validación de número de afiliado | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 14555: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13918: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Test Case 14024: QA - Finalizar vigencia de un financiador | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13883: BE - Endpoint agregarFinanciadorPaciente/adm-c-pacfinplan | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 13763: BE - FE - Inicializacion de proyecto ADMINISTRACION | Estado: To Do
 - Asignado a: Sebastian Mario Baudracco
- Task 13919: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14485: BE - Agregar EP para crear paciente | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14110: FE- Maquetado modal finalizar vigencia | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14100: FE- integración EP autocomplete plan | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 12936: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 11616: Análisis funcional | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Test Case 14019: QA - Visualización del formulario de carga de financiador | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 13909: FE- Maquetado Formulario agregar financiador | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 14023: QA - Evitar duplicación de financiador vigente | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 14483: BE - Obtener financiadores | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 11617: Escritura de HU | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Bug 15197: QA - Al llegar a la cantidad máxima en el numero en afiliado modifica lo ingresado | Estado: New
 - Asignado a: Sebastian Mario Baudracco
- Task 14694: BE - Agregar Alias a respuesta d BE | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 14020: QA - Carga de financiador y plan válidos | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 14482: BE - Selector planes | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 14022: QA - Filtro de planes según financiador | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 14369: BE - Endpoint finalizar vigencia | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14214: BD - Agregar campo nro afiliado | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14331: FE - Integración EP finalizar vigencia | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 14025: QA - Validación de botón de búsqueda de turno | Estado: Ready
 - Asignado a: Danieyse Egeria Berroteran Bernal
- Task 14101: FE- Integración EP autocomplete financiadores | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio



