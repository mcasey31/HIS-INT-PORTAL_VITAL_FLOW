# HU 11721 - Acceso de solo lectura a HC previa (Sistemas Clinicos)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11691_PANORA-MICA-LANDING
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11721/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como profesional asistencial 

Quiero acceder a la historia clínica en versión previa (SC) directamente con el paciente seleccionado, en modo solo lectura y en una solapa aparte 

Para obtener de un vistazo información volcada en la version anterior de HC 

Descripción y comportamiento: 
 Cuando el profesional ingresa a la Historia Clínica en el sistema ODI, dispondrá de un conjunto de funcionalidades accesibles desde la barra de enlaces (linkbar). Entre ellas, se incluirá la opción ?oSist. Clínicos ? , que permite acceder a la historia clínica registrada en el sistema anterior (SC). - Al hacer clic en esta opción, se mostrará un pop-up de advertencia, indicando que se está a punto de acceder a un sistema externo a ODI. 

 
 
 - Si el usuario confirma la acción seleccionando ?oSí, ingresar ? , se abrirá automáticamente una nueva pestaña del navegador. 

 
 
 
 - La apertura del sistema externo se realiza con el paciente ya previamente seleccionado en ODI, lo que permite ingresar directamente a su historia clínica en modo solo lectura dentro de Sistemas Clínicos (SC). 

 
 Acceso HC SC

## Azure Criterios de Aceptacion
Consideraciones Técnicas: - El acceso se limita a modo lectura, sin posibilidad de edición en la HC de Sistemas Clinicos. 
- La nueva pestaña permite mantener abierta la sesión actual en ODI, facilitando la comparación o consulta paralela de datos. 
 - La funcionalidad solo estará disponible si hay un paciente seleccionado en el sistema ODI. 
- Temas de Seguridad: Se debera especificar una comunicación entre Sistemas Clinicos y ODI, para que el servicio expuesto que accede a las Historias Clinicas con un DNI, no pueda ser accedido desde otro lugar o por fuera de la red de la compañia. Analizar tecnicamente un token de seguridad para acceder a SC (ver con staff de SC y ODI)

## Azure Tasks
- Task 14308: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14299: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 14900: Escritura HU | Estado: Done
 - Asignado a: Martin Casey



