# HU 9741 - Identificación de Paciente - Parte 1 Componente y BE

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7707_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/9741/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos Quiero: Identificar a una persona Para: Dar un turno al paciente 
 Descripción Al ingresar al módulo de Turnos, dentro de la funcionalidad de Asignación de Turnos, el proceso se inicia con la identificación de la persona a la cual se le desea asignar un turno. 

- Identificación de persona

Se mostrará un campo de tipo que es un desplegable y un campo texto para el nro de documento y un botón de búsqueda. Al ingresar los datos (por ejemplo, tipo y número de documento) y presionar el botón CONSULTAR, se realizará la búsqueda del paciente invocando al componente de Identificación de Personas. De tal búsqueda podremos obtener 2 resultados posibles 

- Si encuentra un solo resultado con el número de documento seguirá el curso del proceso, donde tendremos un modal con la información de la persona identificada y un botón "Datos incorrectos". Que al seleccionarlo permitirá dirigir a identificar persona donde podrá solucionar qué datos están incorrectos de la persona. 

 
- Si la búsqueda arroja más de un resultado o no trae un candidato posible, se deberá hacer la llamada al módulo de identificación de personas por medio de un texto informativo y un botón que nos redireccionará componente de Identificación de Personas. Para obtener la persona que será identificada como paciente. 

 
 
 - Validación/registro como paciente

Una vez identificada la persona: 

- Primero: Se validará si la persona encontrada es la correcta, ya que no cuenta con registración previa como paciente. 

 
- Si no la tiene, se procederá a dar continuar donde se realizará el alta automática como paciente, asignándole por defecto el financiador Privado/Particular. 
- Si ya está registrado como paciente, se mostrarán los financiadores y planes en vigencia asociados a él. 
- Para poder realizar la carga de un nuevo financiador o la edición de uno. (Product Backlog Item 11788: Edición de datos de financiador/plan de un paciente) 

 
- El usuario podrá agregar financiadores por medio del botón "AGREGAR FINANCIADOR". (Product Backlog Item 9851: Agregar financiador a una persona) 

 
 
 
 DER Diagrama de agendas - dbdiagram.io
Pantallas: https://xd.adobe.com/view/20dc889e-1938-4d28-863f-9bc2c6cb61e1-758f/ 
https://xd.adobe.com/view/20dc889e-1938-4d28-863f-9bc2c6cb61e1-758f/ https://xd.adobe.com/view/20dc889e-1938-4d28-863f-9bc2c6cb61e1-758f/ https://xd.adobe.com/view/20dc889e-1938-4d28-863f-9bc2c6cb61e1-758f/

## Azure Criterios de Aceptacion
- Seleccionar el módulo de turnos, la funcionalidad de Asignar turno, cuando realicemos la búsqueda si este tiene un solo resultado será seleccionado. 
- Si al buscar una persona obtenemos varios resultados o ninguno, deberá redireccionar al módulo de persona 
- Si la persona no está registrada como paciente automáticamente se registra con el financiador privado particular. 
- Si la persona encontrada por tipo y número de documento no es la correcta deberá seleccionar el botón "DATOS INCORRECTOS". Redireccionando a una nueva búsqueda de paciente. 
- Se debe ser paciente para poder asignar un turno

## Azure Tasks
- Task 14054: BD - Crear tabla sch_administracion.t_paciente_financiador_plan | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 11594: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 13403: Análisis y reescritura de HU | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Task 13778: FE - Tipar Clases Faltates en IDP | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13223: Diseño de interfaz | Estado: To Do
 - Asignado a: Brian Ezequiel Agüero
- Task 14275: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 12929: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14215: FE - Fix PKG Controls | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13727: FE - Maquetado Buscar persona por tipo de documento | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 13728: FE - Alerta para 0 o mas resueltados de persona | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 13706: FE - Creación del componente IDP | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13402: UX - Correccción de mockup | Estado: In Progress
 - Asignado a: Melanie Garcia
- Task 11593: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 13726: FE - Maquetado de Modal Paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio



