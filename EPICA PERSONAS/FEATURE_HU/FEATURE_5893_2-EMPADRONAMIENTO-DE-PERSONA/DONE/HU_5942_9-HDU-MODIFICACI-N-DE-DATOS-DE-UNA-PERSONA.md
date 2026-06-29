# HU 5942 - 9. HdU- Modificación de datos de una persona

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5893_2-EMPADRONAMIENTO-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: New
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5942/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: ? ? Usuario de sistema ODI. 

 

 Quiero: Editar datos de una persona. 

 ? 

 Para: ? Actualizar en sistema el padrón de una persona. 

 

 ? 

 Descripción y comportamiento: ? Desde el modal de visualización de detalle de una persona empadronada, al presionar botón ?oEditar ? (pantalla 1) se abrirá la pantalla de edición de empadronamiento (pantalla 2), donde se podrán editar todos los datos de: Tipo de contacto, dirección, persona de contacto. 
Si el usuario cuenta con rold e tipo Auditor, podrá editar TODOS los campos de la pantalla, en el caso que cuente con el rol "Identificación de personas" no podrá modificar los datos del set mínimo (Tipo y numero de documento, apellido y nombre, fecha de nacimiento, sexo biológico) que estarán inhabilitados (como muestra la pantalla 2).
El comportamiento funcional de la edición debe reflejar el de las funcioanlidades de Alta de las HdU 5935/6/7/8. 

 

 ? 

 Link de pantallas: 

 ? 

 (pantalla 1) Modal de visualización de detalle de una persona. 

 (pantalla 2) Pantalla de editar empadronamiento de una persona con rol "Identificación de personas".

## Azure Criterios de Aceptacion
Criterios de aceptación: 

 Al seleccionar el botón ?oEditar ? el sistema nos redirigirá a la pantalla de ?oEditar empadronamiento de persona ? . 

 
Los datos del set mínimo se encontrarán inhabilitados para la edición en el caso del rol "Identificación de personas"

## Azure Tasks
- Task 8699: BE - Obtener episodios desde vista episodios | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



