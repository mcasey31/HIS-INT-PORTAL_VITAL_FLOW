# HU 11089 - Edición de reglas de cupos de un bloque de programación

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_10957_GESTIA-N-DE-CUPOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11089/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Tener la opción de editar la gestión de cupos de un bloque de programación. Para: Modificar las reglas y/o condiciones de los cupos del bloque horario de una agenda. 

 Descripción y comportamiento: Como gestor de agenda, se requiere editar las reglas y/o condiciones de los cupos de un bloque de programación, para ello se necesita que en la lista de gestión de cupos se cuente con la opción para editar estas reglas. 
 
 Al ingresar a la regla que se desea modificar se debe tener la opción para editar los siguientes campos: Financiador (*) - Select 
Plan (*) - Select (Filtrar al seleccionar financiador ) 
Condición (No habilitado o Solo habilitado). (*) - Select 
Mensaje (Select) (*) - Select (en esta fase, mensaje fijado en "Cupo restringido") 
 
 Pantalla de edición de reglas de cupos:
 
 
 
 Nota: (*) datos de carácter obligatorio
 
 
 https://xd.adobe.com/view/b69c17ff-e9e6-4d65-8d88-07c6bdb1f2bd-e3cf/screen/0cfd0e48-2ff6-4885-98c5-b7efbdcf0a99/

## Azure Criterios de Aceptacion
- Al editar las reglas debe tomarse en cuenta la validación de los campos obligatorios. 
- Si se cambia algún dato que tenga otros datos dependeiente, se debe blanquear esos datos.

## Azure Tasks
- Task 15429: Ajuste HU | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 11572: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 11568: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 24529: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez



