# HU 14353 - Dar de alta distintos medios de pagos a operar (definición de dato maestro para BBDD)

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14353/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como Cajero 

Quiero Permitir el cobro con distintos medios de pago. 

Para Facilitar el cobro al momento de la atención. 

 El centro medico, debe permitir el cobro con distintos medios de pagos al momento de atención del paciente. 

Detalle de los medios más comunes:Efectivo: Pago con dinero en efectivo. 
Tarjetas Credito / debito: Aceptan pagos con tarjetas crédito / debito 
Transferencias bancarias: Pago mediante transferencias desde cuentas bancarias, en ventanilla. 
Pago QR: Distintas plataformas de pago digital, billeteras, virtuales 
Cheque: Algunas instituciones aceptan cheques como forma de pago. 
 Nota: Creadas con la task Task 17551: BD - Configuracion de maestros - Caja

## Azure Criterios de Aceptacion
- Siempre se debe seleccionar uno de los medios de pago descriptos.

## Azure Tasks
- Task 14572: Análisis y Diseño | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Test Case 22835: QA - Validar que exista el medio de pago "Tarjetas Crédito / débito" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22836: QA - Validar que exista el medio de pago "Tranferencias bancarias" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14573: Escritura Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Test Case 22837: QA - Validar que exista el medio de pago "Pago QR" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 22651: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 22652: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22840: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22839: QA - Validar los medios de pago en la base de datos - tabla: tm_cargos_tipos_pagos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22834: QA - Validar que exista el medio de pago "Efectivo" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 22838: QA - Validar que exista el medio de pago "Cheque" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



