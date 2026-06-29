# HU 13017 - Incremento de Detalle de agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13017/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Bug 17185: Corregir formato de letra en textos de detalle bloque.
- Bug 17618: No figura la hora en detalle de bloques.
- Bug 23821: Detalle no trae todos los bloques activos.

## Pantalla objetivo para mock
- Pantalla: Detalle de Agenda (incremento).
- Componentes: tabla/lista de bloques con hora visible, tipografia consistente y estado correcto.

## Azure Descripcion
Como: Gestor de agenda Quiero: Ver el detalle de la agenda Para: Obtener información completa de su configuración 
 Descripción y comportamiento Como ya se desarrolló en la HU Product Backlog Item 11235: Detalle de agenda por medio del botón visualizar se puede mostrar un detalle de la configuración que se realizó de la agenda. Lo desarrollado fue: - La cabecera del detalle contendrá los siguientes datos: 
 
- Efector (como título de la pantalla)
 
- Centro
 
- Estado (Creada, Activa, Inactiva, Finalizada)
 
- Nombre de agenda 
 - Un desplegable de detalle, que contendrá los datos de tipo de servicio, tipo de agenda, y las fechas desde y hasta. 
 El incremento que se realizar en esta HU será: - En el apartado de Bloques de programación se podrán ver los bloques activos, resaltando en el título: 
- Cabecera (título): 
- Nombre del bloque, 
- Dias 
- Horarios (desde-hasta). 
 - Al seleccionar el desplegable contaremos con la siguiente información: 
- tipo de programación, 
- fecha (desde-hasta), 
- N° de sobreturnos, 
- lugar de atención, 
- frecuencia 
- duración del turno
 
 
 A continuación, se listará los diferentes variantes de detalles de agenda. - Para el caso de que la agenda esté en un estado "creada", el detalle deberá mostrarse con el título de "Bloques de programación" y un mensaje de "No dispone de bloques de programación" 
- Si la agenda no contiene bloques de programación activos el mensaje que debe mostrarse será "No dispone de bloques de programación activos" 
 https://xd.adobe.com/view/7138b68b-67f0-47e2-950f-b6128cd4680a-246b/screen/90be9fda-1476-4c2e-b447-9625e4b63675/

## Azure Criterios de Aceptacion
- Se deben mostrar el listado de las cabeceras de los bloques de programación 
- Poder desplegar la información de cada bloque de programación. 
- Mostrar los diferentes mensajes dependiendo de la configuración de la agenda

## Azure Tasks
- Bug 16517: QA - Discrepancias de Estados entre Detalle de agenda y listdo de Bloques PARTE 2 | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14130: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 17618: QA - No figura la hora en el detalle de bloques de programacion | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 15993: DEV - Diferencias de Estados entre Detalle de Agenda y Listado de Bloques de Programación. | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 23821: QA - El detalle de agenda no trae todos los bloques de programación activos | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 17161: QA - No aparece tooltip del nombre en bloque de programación | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14192: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15544: FE - Maquetado Bloques de Programación | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 17185: QA - Corregir formato de letra en los texto de detalle bloque de programación | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15545: FE - Revisar y Modificar integracion endpoint | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15534: BE - Agregar bloques de programacion - modificar EP | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14129: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 15434: Diseño interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 15539: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16423: BE - Agregar parametro para filtrar por bloques activos | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 15972: BE - Corregir endpoint detalleAgenda | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 16424: FE - Enviar paramatro para filtrar por bloques activ os | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 22543: BD - Drop campo activo | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 15538: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15615: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa



