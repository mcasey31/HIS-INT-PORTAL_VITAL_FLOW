# HU 22779 - Cambiar pagador

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/22779/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrativo de caja Quiero: Cambiar pagador Para: Indicar a un tercero como pagador de las prestaciones 
 Descripción y comportamiento: Esta historia complementa la funcionalidad de la emisión de cobro a privado (ITEM 11958), dando la posibilidad al usuario de modificar el pagador de las prestaciones que se realicen, y emitir el comprobante de pago a nombre de un tercero. Tal como se indica en la pantalla, el usuario tendrá la posibilidad de indicar mediante un switch que el pagador será otra persona que no sea el paciente, y a partir de allí completará los campos de Nombres y Apellidos y datos de facturación. 
 
 
 
 Una vez completados los datos del pagador, el usuario podrá continuar con el proceso de cobro, y emitirá el comprobante con los datos del pagador.

## Azure Criterios de Aceptacion
- Si se indica a un tercero para el pago, los campos de Nombres y Apellidos serán de carácter obligatorios. 
- Los campos serán de texto libre. 
- De acuerdo al tipo de comprobante de pago que se emita, se completarán los datos de facturación.

## Azure Tasks
- Task 22780: Análisis y escritura | Estado: In Progress
 - Asignado a: Sebastian Hernandez Garandan



