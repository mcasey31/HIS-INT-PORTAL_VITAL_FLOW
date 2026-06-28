# HU 16090 - Tipos de Comprobantes al Emitir Cobros a Paciente (definición de dato maestro para BBDD)

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16090/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero Quiero: Seleccionar comprobantes de pago Para: La emisión al momento del cobro 
 Descripción y comportamiento: Se deberán crear distintos tipos de comprobantes para emitir al momento del cobro a un paciente: 
 - Ticket 
- Factura "A" 
- Factura "B" 
- Factura "C" 
 
 Los comprobantes se podrán seleccionar desde el módulo de caja (ITEM 11958). 
 Nota: Creadas con la task Task 17551: BD - Configuracion de maestros - Caja

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Test Case 22749: QA - Validar que exista la opción "Ticket" en el campo selector "Tipo de comprobante" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 22649: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22752: QA - Validar que exista la opción "Factura C" en el campo selector "Tipo de comprobante" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22754: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22753: QA - Validar los tipos de comprobantes en la base de datos - tabla: tm_cargos_tipos_comprobantes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 22650: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22751: QA - Validar que exista la opción "Factura B" en el campo selector "Tipo de comprobante" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22750: QA - Validar que exista la opción "Factura A" en el campo selector "Tipo de comprobante" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



