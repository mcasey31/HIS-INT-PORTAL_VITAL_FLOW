# HU 5895 - 3. HdU- Fusión de personas

## Trazabilidad
- Epic: EPICA PERSONAS
- Feature: FEATURE_5894_3-AUDITORIA-Y-FUSIA-N-DE-PERSONA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/5895/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Auditor de empadronamiento Quiero: Fusionar candidatos duplicados Para: Depurar padrón de personas 
 Descripción y comportamiento: Desde la ventana de consulta de detalle de notificados (pantalla 1), se podrá seleccionar que registro (candidato) se tomará como principal (registro que quedará activo) para la fusión y cual quedará en estado inactivo. 
De cada candidato se tomará el bloque elegible como información definitiva. La elección del registro principal se toma con la selección del bloque de set de datos mínimos, y los bloques de tipos de contactos, dirección y persona de contacto pueden ser combinables o elegibles de cualquier candidato. 
 Los datos seleccionados para la fusión deben reflejarse en el registro principal que como se mencionó anteriormente, el cual quedará en estado "Activo" en la base de datos, manteniendo el registro histórico. 
 Para el caso de la persona que se inactiva, debe quedar en el historial la vigencia del estado ( "fecha desde" y "fecha hasta") que tuvo antes de la inactivación, para ser usado en una posible reversión de la fusión. 
 Para este proceso debe tomarse en cuenta la vigencia ( "fecha desde" y "fecha hasta") de los bloques involucrados, definiendo que en null "fecha hasta" se considera activo, e inactivo para los registros que posean definidos ambos campos "fecha desde" y "fecha hasta".
 
 Al realizar el proceso de fusión, se deben vincular ambos registros fusionados para mantener el histórico clínico para futuras consultas desde el registro principal (activo). Esta vinculación debe darse mediante el ID de la persona que queda en estado ""Activo", el cual debe asociarse a la persona que quedará inactiva mediante el campo de vinculación. 
 
 Al presionar el botón "Fusionar personas" abrirá un modal para cancelar, o confirmar la acción (pantalla 2). Si se confirma nos mostrara un mensaje indicando que se realizó la fusión (pantalla 3). 
 
 Link de pantallas: 
 pantalla 1: Detalle de notificados.
 pantalla 2: Modal de confirmación.
 pantalla 3: Mensaje de confirmación.

## Azure Criterios de Aceptacion
Dado que solo uno de los dos registros quedará activo, debo poder seleccionar mediante el set de datos mínimos que registro será el principal. 
Cuando se realice la fusión, debe mantenerse el histórico de ambos registros para revertir la fusión. 
Se podrá combinar los bloques de tipos de contacto, dirección y persona de contacto.

## Azure Tasks
- Sin tasks hijas en Azure.



