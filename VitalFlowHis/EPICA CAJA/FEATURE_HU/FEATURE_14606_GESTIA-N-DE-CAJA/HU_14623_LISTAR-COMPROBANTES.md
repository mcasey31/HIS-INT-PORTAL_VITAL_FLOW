# HU 14623 - Listar Comprobantes

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14623/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero 

Quiero: Visualizar una grilla con todos los comprobantes
de pago generados 

Para: Consultar y acceder a los comprobantes de las operaciones realizadas 

 

 

Comportamiento y Descripción: 

 

Una vez emitido el comprobante de pago
(HU ITEM 14356*), se debe tener la opción de acceder a "Comprobantes", desde
donde se podrá visualizar todos los comprobantes de pago generados como se muestra en el mockup. 
 

 

 

 La grilla de comprobantes deben detallar los siguientes columnas: 
 

Nº de comprobante 
Fecha y hora 
Paciente 
Servicio 
Monto total 
Financiador 
- Efector 
Medio de pago 
Estado del comprobante 
 Desde la visualización de la pantalla, debe ser posible, descargar el comprobante o reimprimir (si aplica).
 

 

La grilla
debe permitir aplicar filtros por: 

 

- Nº de comprobante 
- Paciente 
- Efector 
- Servicio 
- Fecha desde / Fecha hasta) 
- Medio de pago 
- Estado

## Azure Criterios de Aceptacion
- Al ingresar, se deberá mostrar una grilla con todos los comprobantes de pago generados. 
- Debe ordenarse desde el mas reciente al mas antiguo 
- El usuario solo podrá visualizar comprobantes de pago de las operaciones a las que tenga acceso, según su rol y permisos asignados.

## Azure Tasks
- Task 16500: Escritura Funcional | Estado: In Progress
 - Asignado a: Manuel Rolando Alvarez
- Task 16499: Análisis y Diseño Funcional | Estado: In Progress
 - Asignado a: Manuel Rolando Alvarez
- Task 15161: UX - Diseño de mockup | Estado: To Do
 - Asignado a: Melanie Garcia



