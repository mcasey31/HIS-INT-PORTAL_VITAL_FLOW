# HU 16093 - Impresion de Ticket de Pago desde modulo Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16093/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero 

Quiero: Imprimir Ticket de pagoPara: Entregar el Ticket al cliente 

 

Descripción y comportamiento: Una vez confirmado el pago en caja, se debe tener la opción de imprimir el Ticket de pago para entregar al paciente. 

 

En el comprobante se deben detallar los siguientes datos:
 

- Logo del centro 
- Fecha y hora de la compra. 
- Estado del pago 
- Nombre o razón social del centro. 
 
- Servicio de atención 
Datos de cliente (paciente) 
- Descripción de los productos o servicios adquiridos con su importe. (prácticas + valor $) 
- Total a pagar
 
- Medio de pago. 
- Número de ticket o referencia para identificación
 
 Al finalizar el cobro al paciente, se debe tener la opción de imprimir el ticket de pago, ver mockup.
 
 
 
 Al imprimir se debe generar un reporte del pago en formato pdf con las dimensiones de una impresora térmica. Ver mockup
 
 
 
 
 Datos de configuración de impresión: - El ticket debe imprimirse en papel térmico con un ancho de 58 mm (2.28 pulgadas) o 80 mm (3.15 pulgadas) (según modelo de impresora). 
- El contenido del ticket debe estar ajustado al ancho definido, sin desbordamientos ni cortes de texto.
 
- La longitud del ticket debe ser dinámica, dependiendo del contenido (cantidad de productos, totales, etc.).
 
- Se deben respetar márgenes mínimos para evitar cortes al borde del papel. 
 En caso de no imprimir en el momento del pago, se debe poder imprimir desde Visualizar estado pagado HU (ITEM 16091) como se muestra a continuación:
 
 
 
 
 Mockup impresión desde "éxito": https://xd.adobe.com/view/824318ca-1996-4f68-855d-750bb0711363-d710/

Mockup impresión desde consulta/detalle de operación previa "imprimir comprobante" (ITEM 16091):
https://xd.adobe.com/view/eec72ba8-819f-4a09-934c-ab65fb8d5599-bb94/

## Azure Criterios de Aceptacion
- Se debe permitir la impresión del reporte o comprobante de pago al finalizar el pago. 
- En caso de no imprimir en el momento, se debe poder imprimir desde Visualizar estado pagado ITEM 16091

## Azure Tasks
- Test Case 23459: QA - Validar la Fecha y hora de la compra en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23457: QA - Validar el botón "VOLVER" del modal "Se generó el pago. ¿Deseas imprimir el comprobante?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23455: QA - Validar el modal "Se generó el pago. ¿Deseas imprimir el comprobante?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23464: QA - Validar Descripción de los productos o servicios adquiridos con su importe en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24131: QA - Impresión de Ticket de Pago desde modulo Caja - Ticket - No se observa el número de ticket | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24034: QA - Impresión de Ticket de Pago desde modulo Caja - Botón "VOLVER" en minúscula, debería estar en mayúscula | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 23590: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16128: Análisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 23468: QA - Validar que al imprimir se genere un reporte del pago en formato pdf | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23299: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24061: QA - Impresión de Ticket de Pago desde modulo Caja ?" El formato del centro difiere del mock up y falta incluir el ícono de localización | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23469: QA - Validar que el reporte de pago se imprima en papel térmico | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23456: QA - Validar el botón "SI, IMPRIMIR" del modal "Se generó el pago. ¿Deseas imprimir el comprobante?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24350: QA - Impresión de Ticket de Pago desde modulo Caja - Ticket - El ícono del medio de pago se visualiza con un efecto de superíndice en la fuente, cuando debería mostrarse alineado al lado del campo ?oMedio de pago ? | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23471: QA - Validar que el contenido del ticket esté ajustado al ancho definido, sin desbordamientos ni cortes de texto | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23350: FE - Integracion de EP | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 23466: QA - Validar el Medio de pago en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24288: BD - Carga de pacientes con cargos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 23475: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24038: QA - Impresión de Ticket de Pago desde modulo Caja - El logo difiere del mock up, aparece en color, cuando debería mostrarse en blanco y negro | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23465: QA - Validar el Total a pagar en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23495: BE - Agregar numero de ticket al comprobante de cobro | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24039: QA - Impresión de Ticket de Pago desde modulo Caja - El estado "Pagado" no aparece en la posición correcta: actualmente se muestra debajo de la fecha y hora, cuando debería visualizarse a su lado | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23472: QA - Validar que la longitud del ticket sea dinámica, dependiendo del contenido | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23470: QA - Validar que el reporte de pago se imprima en papel térmico con un ancho de 58 mm (2.28 pulgadas) o 80 mm (3.15 pulgadas) (según modelo de impresora) | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16831: UX - Mockup Impresión de Ticket de Pago desde modulo Caja | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Bug 24347: QA - Impresión de Ticket de Pago desde modulo Caja - Ticket - La línea de la suma total se está mostrando en negro, pero según el mock up, debería aparecer en color gris | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24342: QA - Impresión de Ticket de Pago desde modulo Caja - Ticket - El nombre del paciente y el centro se muestran en mayúsculas, pero deberían visualizarse en minúsculas | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24081: QA - Impresión de Ticket de Pago desde modulo Caja - Ticket - Falta el ícono del medio de pago | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23462: QA - Validar el Servicio de atención en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24063: QA - Impresión de Ticket de Pago desde modulo Caja - En el Ticket se observa una línea visible debajo de cada práctica | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23467: QA - Validar el Número de ticket o referencia para identificación en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23300: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24156: QA - Impresión de Ticket de Pago desde modulo Caja - IMPRIMIR COMPROBANTE - Se observan inconsistencias entre el valor de la práctica y el total a pagar en el documento impreso | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23461: QA - Validar el Nombre o razón social del centro en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23474: QA - Validar que en caso de no imprimir en el momento del pago, se pueda imprimir desde Visualizar estado pagado | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23458: QA - Validar el Logo del centro en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23463: QA - Validar los Datos de cliente (paciente) en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23460: QA - Validar el Estado del pago en el ticket | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23473: QA - Validar que se respeten los márgenes mínimos para evitar cortes al borde del papel | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24036: QA - Impresión de Ticket de Pago desde modulo Caja - Modal - Difiere del mock up, le falta un interlineado antes de la pregunta ¿Deseas imprimir el comprobante? | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder



