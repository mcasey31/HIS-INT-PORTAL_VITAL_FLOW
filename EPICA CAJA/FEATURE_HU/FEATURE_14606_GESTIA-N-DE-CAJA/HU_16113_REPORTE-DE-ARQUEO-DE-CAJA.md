# HU 16113 - Reporte de arqueo de caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16113/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero 
Quiero: Generar y visualizar un reporte de arqueo de caja
 Para: Conocer el detalle de saldo final por tipo de movimientos y medios de
pago de una caja en un ciclo específico. 
 

Descripción y comportamiento: Al finalizar el arqueo de caja, HU: Item 14354, Se debe disponer de la opción de descargar el reporte de
arqueo de caja, el cual debe incluir el detalle de movimientos de los totales
por cada medio de pago, el
reporte debe poder generarse en formato PDF para impresión, directamente desde el modal de finalización de arqueo, tal como se
muestra a continuación. 

 
 En el reporte, se debe visualizar la totalización de los movimientos correspondientes a las HU ITEM 14354 / ITEM 14350 en formato PDF, que incluya la siguiente información: 

- Número de caja, ciclo y grupo de caja.
 
- Nombre del cajero
 
- Totales por cada medio
de pago: efectivo, tarjetas (débito y crédito), cheques, transferencias, QR. Generados en el arqueo. 
- Fondo
inicial, total de movimientos, ajustes, total de caja y total a rendir, generados en el cierre de caja. 
- Tipo de conteo de efectivo realizado ( Manual o por Billetes). 
- En caso de conteo por billetes, incluir detalle
de denominaciones, cantidades y totales. 
- Observaciones y espacio para firmas (cajero y supervisor). Uso post impresión. 
 
 Se debe generar un resumen de cada atención o cobro realizado: Medio de pago utilizado (efectivo, tarjeta de crédito, tarjeta de débito, cheque, transferencia, QR). 
 Este detalle, debe permitir validar que la suma de todos los movimientos que coincida con el totalizador por medio de pago. 
 
 Tipos de conteo de efectivo realizado ( Manual o por Billetes). 
 
 Conteo de efectivo realizado (Manual).
 
 
 
 
 Conteo de efectivo realizado (Billetes). 
 
 En caso de no imprimir el reporte al
momento de finalizar el arqueo, se deberá contar con la opción de impresión
desde el menú contextual de la grilla de historial de arqueos. Desde
esta opción, únicamente será posible descargar el reporte del arqueo de caja
(ver mockup). 
 
 
 Link a prototipo: https://xd.adobe.com/view/b4e3a3ac-bb84-4245-9bfe-4c09f4dba62f-e1b0/

## Azure Criterios de Aceptacion
- Al seleccionar ?oImprimir ? , debe generarse un
archivo PDF con el formato definido. 
- Los valores monetarios deben mostrarse con
separador de miles y decimales. 
- Si el tipo de conteo de efectivo es ?opor
billetes ? , debe incluirse el desglose por denominaciones y cantidades. 
- El reporte debe generarse con los datos
correspondientes al ciclo y caja seleccionada en el arqueo.

## Azure Tasks
- Task 17735: Análisis, diseño y escritura | Estado: To Do
- Task 23070: UX - Mockup reporte de arqueo de caja | Estado: Done
 - Asignado a: Giselle Daniela Vazquez



