# HU 16080 - Devolución de pago a paciente (efectivo)

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16080/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrativo de caja. Quiero: Realizar devolución de pago a paciente. Para: Completar proceso de anulación de admisión. 
 Descripción y comportamiento: Desde la grilla que lista los pagos realizados y pendientes (ITEM 14493) se podrá realizar una búsqueda por tipo y numero de documento, o bien, seleccionar al paciente desde el listado. 
 
 
 a través del menú contextual, se podrá realizar la devolución del pago, tal como se indica en la pantalla 
 
 Una vez seleccionada la opción, el sistema nos pedirá confirmar la acción a través de un modal, 
 
 desde el mismo se podrá confirmar, o bien cancelar, y la pantalla nos llevará nuevamente a la grilla. 
 Una vez realizada la devolución, el estado del pago pasará a "Devuelto" (ITEM 15419) y se actualizarán también los movimientos de caja. ITEM 14824 
 
 
 Para los casos de error se mostrará el siguiente mensaje 
 
 
 Para poder realizar la devolución, el estado del paciente sólo podrá ser "En espera". ITEM 12285

## Azure Criterios de Aceptacion
- Para realizar la devolución, el estado debe ser "Pagado". 
- Luego de realizado se actualizará a "Devuelto". 
- Sólo se podrá realizar la devolución a pacientes cuyo estado sea "En espera" 
- El estado de la admisión pasará a "no admitido".

## Azure Tasks
- Task 16518: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan



