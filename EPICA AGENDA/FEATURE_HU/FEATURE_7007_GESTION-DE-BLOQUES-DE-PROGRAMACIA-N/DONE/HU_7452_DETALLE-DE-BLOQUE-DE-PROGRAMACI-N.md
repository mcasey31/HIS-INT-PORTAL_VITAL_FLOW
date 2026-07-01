# HU 7452 - Detalle de bloque de programación

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/7452/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Poder visualizar el detalle de una programación Para: Disponer de toda la información antes de tomar alguna acción 
 DESCRIPCION Desde la pantalla de edición de la agenda. (Pantalla 1) visualizamos la definición de la agenda y una grilla con las programaciones que esta tiene configuradas. Esta grilla contendrá las opciones de ver el detalle, poder editar y un menú contextual. 

Al seleccionar el icono del ojo (ícono de ver detalle) se nos desplegará una ventana que contará con un encabezado en la parte superior, donde se reflejarán los datos principales del registro de la fila seleccionada (HU1). Product Backlog Item 6795: HdU - Maqueta del componente genérico ventana de detalle 

En la ventada de detalle se mostrara el título (nombre del bloque de programación), la vigencia del mismo, el estado y el tipo de programación. Luego un resumen del horario que se configuró(por default este marco debe venir desplegado), seguido en los marcos inferiores tendrán las prácticas médicas asociadas y las gestiones de cupos que se le definieron para cada horario, ambos marcos colapsados. Al desplegarse se mostrará como vemos en la (Pantalla 2) 

 

PANTALLAS 

 

Pantalla 1: Definición de agenda
Pantalla 2: Pantalla de detalle de bloque de programación fija
Pantalla 3: Pantalla de detalle de bloque de programación variable
Pantalla 4: Pantalla de detalle de bloque de programación de demanda espontanea 
 

DER Diagrama de agendas - dbdiagram.io

## Azure Criterios de Aceptacion
- visualizar toda la descripción del bloque de programación. 
- Al presionar el botón de visualizar se abrirá el detalle del bloque de programación.

## Azure Tasks
- Task 11579: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 13052: QA - Ejecución de casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 13704: QA - Menú contextual en la grilla | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12674: Creación de tablas | Estado: In Progress
 - Asignado a: Gustavo Cesar Tejerina
- Task 13044: QA - Creación casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 13124: QA-Verificar marco "Gestión de cupos" desplegable colapsado | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 11580: Escritura de HU | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 13556: Modificar EPs con modificacion en BD atributo "duracion" | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13046: BE - EP - Detalle de bloque de programacion | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 13723: QA - Distancia entre columnas y separaciones | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 13722: QA - Título "Duración de turno" falta preposición | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13128: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 13122: QA-Verificar marco "Detalle" desplegable | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 13050: FE - Maquetado | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 13718: QA - Contenido de la columna "Días" palabra minúscula | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 13711: QA - Diseño | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 13121: QA-Seleccinar icono de "Ver detalle" ojo | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 13055: FE - Integracion endpoint listado practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 13123: QA-Verificar marco "Prácticas" desplegable colapsado | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 13054: FE - Integracion endpoint detalle | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 13120: QA-Grilla de programaciones | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 12675: Revisión de proceso ODI | Estado: To Do
 - Asignado a: Gustavo Cesar Tejerina
- Task 13047: BE - EP - Detalle de bloque practicas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



