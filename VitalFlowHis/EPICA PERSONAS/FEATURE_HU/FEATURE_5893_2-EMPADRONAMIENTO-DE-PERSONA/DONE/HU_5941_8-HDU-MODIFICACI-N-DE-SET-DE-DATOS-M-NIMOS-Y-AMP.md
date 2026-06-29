# HU 5941 - 8. HdU- Modificación de set de datos mínimos y ampliados de una persona

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5941/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario de sistema ODI (responsable del padrón ODI). 

 Quiero: Editar el set de datos mínimos y ampliados de una persona. 

 Para: Actualizar en sistema el padrón de una persona. 

 ? 

 

 

 Descripción y comportamiento: Desde el modal de visualización de detalle de una persona empadronada, ingresando al ?oBotón Editar ? (pantalla 1) se pueden modificar los datos del set mínimos y ampliados de una persona. Esta acción lleva a la pantalla de editar ?oEditar Persona ? (pantalla 2), siempre y cuando el usuario responsable del padrón tenga los permisos correspondientes (rol auditor) a modificar los datos completos de la persona (set de datos mínimos, datos de contacto, dirección y persona de contacto). En caso de eliminar una persona de contacto, se abrirá un modal con el siguiente mensaje ?o¿Desea eliminar persona de contacto? ? Si se confirma la acción se notificará con el mensaje ?oSe eliminó persona de contacto ? . La persona de contacto en cuestión será inactivada con una "Fecha hasta" para tener auditoría de cuando estuvo activa. 

 
 

 Link de pantallas: 

 pantalla 1 Modal de visualización de detalle de una persona. 

 pantalla 2 Pantalla de editar empadronamiento de una persona.

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 El usuario que realice la acción de editar deberá contar con los permisos para dicha acción. (rol auditor) 

 
Al seleccionar el botón ?oEditar ? el sistema nos redirigirá a la pantalla de ?oEditar empadronamiento de persona ? .

## Azure Tasks
- Sin tasks hijas en Azure.



