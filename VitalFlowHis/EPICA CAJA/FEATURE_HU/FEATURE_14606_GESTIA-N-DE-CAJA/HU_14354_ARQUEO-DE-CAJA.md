# HU 14354 - Arqueo de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14354/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Cajero 

Quiero: Realizar el arqueo al cierre de caja.Para: Verificar que el efectivo y los demás medios de pago coincidan con las transacciones registradas durante el ciclo operativo 

Descripción y comportamiento: 

 Desde la gestión de cajas, se requiere un proceso que facilite el arqueo de caja y la generación de un listado de movimientos, de acuerdo a la caja y al ciclo seleccionado. 

 

Desde la pantalla de arqueo se debe seleccionar los campos Caja, Cajero, Ciclo (todos del tipo selector), así como la aplicación de filtros como se detallan a continuación: 

Tipo de movimientos (Select) * Filtro por default visible (Ver HU:15997: Tipos de Movimientos de Caja) 
Medio de pago (Select) * Filtro por default visible (Ver HU:14353: Dar de alta distintos medios de pagos ) 
Clase (Select) * Filtro por default visible (Ver HU:15997: Tipos de Movimientos de Caja) 
Estado (Select) * Filtro por default visible (Ver HU:14757: Estados de Caja) 
Hora desde (time) Filtro avanzados 
Hora hasta (time) Filtro avanzados 
 Ver mockup de filtros: 

 

 

 

Una vez aplicada la consulta, esta puede generar dos posibles resultados: 

 1° Resultado OK: Se mostrará el ciclo seleccionado con los movimientos de la caja ordenados de forma decreciente, (desde el más actual al más antiguo, en base a la fecha y hora), como se muestra a continuación: 

 

Fecha 
Hora 
Tipo De Movimiento 
Clase 
Concepto 
Importe Total Importe Cobrado 
Medio de Pago 
Número de Factura 
Nombre Paciente 
Estado 
 Una vez listado los movimientos, el sistema deberá mostrar un resumen completo de todas las transacciones realizadas durante el ciclo operativo de una caja, según el usuario. Tendrá que incluir todos los movimientos y medios de cobro utilizados, en caso de aplicar. 

 

 

Dentro del resumen en la pantalla de arqueo de caja, se debe mostrar los montos totales (sumarizado) correspondiente a cada medio de pago, como se especifica a continuación: 

Total Efectivo ($) = Se suman los movimientos con medios de pagos en efectivo + Saldo inicial de la apertura de la caja (efectivo). 
Total Tarjeta Crédito ($) = Se suma los movimientos con medios de pagos tarjeta de crédito. 
Total Tarjeta Debito ($) = Se suma los movimientos con tarjeta de débito. 
Total Cheques ($) = Se suma los movimientos con medio de pago ?ocheque ? . 
Total Transferencia ($) = Se suma los movimientos con medio de pago ?otransferencia ? . 
Total QR ($) = Se suma los movimientos cobrados con medios con código QR, Aplica a todos los servicios de QR habilitados. 
Total General ($) = Total Efectivo $ + Total Tarjeta $ + Total Cheques $ + Total Transferencia $ + Total QR $ Representa la suma de todos los medios de pago. 
 Ver mockup 

 

 

 

 DENTRO DEL PROCESO DE ARQUEO, SE CUENTA CON LA SIGUIENTE FUNCIONABILIDAD (no obligatoria para arquear) 

 CONTABILIZAR DINERO EN EFECTIVO: Para realizar un resumen del conteo de efectivo, el usuario podrá hacer clic en la funcionalidad de "Check$" El conteo de efectivo (físico) se puede realizar de dos maneras (Manual y/o Cantidad de billetes) que serán del tipo radio button en donde el usuario podrá seleccionar solo una modalidad de conteo: 

 

 1°: "Modalidad Manual", tal como se muestra en el mockup, habrá un campo de texto libre (en moneda) con un limite de de 8 cifras y separadores de miles, (10 Caracteres) donde el usuario podrá ingresar el total de dinero en efectivo que contabilizó de forma física en su caja. Seteando de esa forma el dato del total de su conteo. El sistema mostrará cuál es el saldo esperado que sale de sumar y restar todos los movimientos en efectivo durante el ciclo operativo. 

 

 

 

2°: "Modalidad Cantidad de billetes", tal como se muestra en el mockup. "Utilizando esta funcionalidad de contador de billetes, podrá ir ingresando la cantidad de billetes por denominación nominal" y el sistema lo asistirá a contabilizar el total del dinero efectivo físico de su caja. 

 

 

 

 ESCENARIOS POSIBLES AL GENERAR LA CONTABILIZACION DEL DINERO EN EFECTIVO 

En base al conteo en efectivo se pueden dar 3 casos: 

 

1) Que el saldo del sistema (contable) coincida con el ingresado por el usuario (dinero físico) --> escenario esperado. En este caso se activará un semáforo de color verde simbolizando el neteo entre el saldo físico y el contable 

 

 

 

2) Diferencia Negativa: En este caso el saldo del cajero en dinero físico es menor que el saldo contable del sistema. lo que generará una alerta y se activará un "semáforo" de color rojo advirtiendo esta diferencia 

 

 

3) Diferencia Positiva:" En este caso el saldo del cajero en dinero físico sea mayor al saldo contable" del sistema, "también generará un alerta de otro color al rojo y verde para informar de ese desfasaje." 

 

 PROCESOS DE ARQUEOS DE CAJAS: 

 

 "El arqueo de caja puede realizarse en distintos momentos del día, incluso mientras la caja se encuentra con estado "abierta", pudiendo efectuarse múltiples veces según se requiera, por ejemplo, a mitad de la jornada de trabajo. En cambio, cuando la caja esta en estado "cerrada", solo es posible realizar un único arqueo final. Para iniciar este proceso se debe hacer clic en el botón "REALIZAR ARQUEO". 

 

Arqueo Parcial: 

Sera posible realizar un arqueo parcial desde el momento de apertura de caja correspondiente al ciclo seleccionado. Este arqueo puede generarse tantas veces como sea necesario, siempre que la caja se encuentre en estado "abierta". 

Mientras la caja esté abierta, se pueden efectuar múltiples arqueos parciales. Cada uno de ellos tomará como punto de inicio la hora de apertura de la caja. Es decir, al generar un nuevo arqueo parcial, este siempre considerará el mismo horario de apertura, independientemente de los arqueos anteriores. 

Ejemplo: 

1° Arqueo:Desde la hora de apertura de caja: 08:00 hsHasta: 12:00 hs --> horario en el que se hizo clic en el botón realizar arqueo 
2° Arqueo:Desde la hora de apertura de caja: 08:00 hsHasta: 15:00 hs --> horario en el que se hizo clic en el botón realizar arque 
 Nota: no habrá sumarización entre los arqueos parciales Arqueo Final: Será posible realizar un arqueo final una vez que la caja haya sido cerrada, ya que, al estar en estado "cerrada", solo se permitirá generar un último arqueo final dentro del ciclo del horario seleccionado. 

En el caso de que una caja este en estado Cerrada y ya cuente con un arqueo final, NO se podrán realizar más arqueo, quedando el botón "grisado" 

 

 

 

 FINALIZAR ARQUEO DE CAJA: Antes de finalizar el arqueo de caja, el sistema mostrará un mensaje para confirmar o cancelar el arqueo de caja, tal como se muestra en el mockup. 

 Al obtener los resultados del arqueo, el usuario podrá imprimir el reporte en formato PDF desde el botón IMPRIMIR". como se muestra en el mockup, (Esta HU se desarrollara en la HU ( Product Backlog Item 16113: Reporte de arqueo de caja). 

Si no se imprime el reporte al momento del arqueo de caja, posteriormente se podrá descargar desde el historial de arqueos de caja desarrollada en la HU. (Product Backlog Item 16613: Historial de Arqueos de Caja), como se muestra en el menú contextual. 

 

 2° Resultado: No existen movimientos asociados al ciclo de caja seleccionado en la consulta. Se visualizará un mensaje con la notificación, (Este ciclo de caja no cuenta con movimientos), como se muestra en el mockup. 

 

 Link a prototipo: 

 https://xd.adobe.com/view/1b401fb7-2742-4f3a-b306-0f39e4719998-4e13/

 Links de apoyo para herramientas de conteo y footer: 
 Especificaciones UI para Footer: https://xd.adobe.com/view/9b4ef39b-2b51-41d3-8e17-9401c221f0f4-ce1d/ 
Comportamiento de la herramienta contadora de billetes: https://xd.adobe.com/view/3ab34d6c-4163-453f-abea-9c787a432c3e-6fe0/ 
Estados de conteo "semáforo": https://xd.adobe.com/view/32425bb6-f88b-44d4-b45d-0d21ed1fc7ae-6711/ 
Ejemplo de sumarizado (finalizar arqueo de caja con otros ejemplos): https://xd.adobe.com/view/f3abd8e6-cc6e-4b7f-ad19-511a9ddf6871-a6f8/

## Azure Criterios de Aceptacion
- Desde la gestión de caja, permita realizar el arqueo de caja y listar
los movimientos según el ciclo de arqueo ejecutado. 
- La realización del arqueo de caja, se puede realizar en distintos horarios. Cada arqueo será individual y tendrá siempre su origen con el horario de apertura de caja 
 
- Al finalizar el arqueo de caja, el sistema emitirá el mensaje de cancelación o confirmación. 
- El arqueo de caja podrá ser impreso o descargado por diferentes tipos de archivos como se explico en la HU. 

 
- Al no tener un botón salir o cancelar, la funcionalidad entre pestañas es de blanquear la operación realizada si se cambia de pestaña, siempre y cuando esta no haya sido confirmada. 
 

 
- 

Resumen por medio de pago: Se muestra un resumen de montos
agrupados por tipo de medio de pago, si es efectivo, se habilita un
botón que abre un modal de conteo.

## Azure Tasks
- Task 24171: BE - Crear arqueo | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24936: QA - Validar el modal "Arqueo de caja" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23957: QA - Ejecución casos de prueba | Estado: To Do
 - Asignado a: Cristina Alejandra Schroeder
- Task 24495: BE - crear EP obtenerCicloById | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24938: QA - Validar el conteo de efectivo "Cantidad de billetes" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24921: QA - Validar la columna "Hora" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24935: QA - Validar la funcionalidad del ícono "Check$" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24918: QA - Validar el botón "CANCELAR" del modal "¿Deseas finalizar el arqueo de caja?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24328: [FE] Integracion servicios filtros | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 24937: QA - Validar el conteo de efectivo "Manual" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24916: QA - Validar el botón "REALIZAR ARQUEO" al intentar realizar un nuevo arqueo final | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24941: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24172: BE - Seleccionar denominaciones (montos de billetes) | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24920: QA - Validar la columna "Fecha" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24927: QA - Validar la columna "Número de factura" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24923: QA - Validar la columna "Clase" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24914: QA - Validar el botón "REALIZAR ARQUEO" para realizar un arqueo parcial | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24167: BE - Seleccionar ciclo | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24933: QA - Validar el total de "QR" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24922: QA - Validar la columna "Tipo de movimiento" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24494: Diseño - obtenerCicloById | Estado: To Do
 - Asignado a: Sebastian Mario Baudracco
- Task 24327: [FE] Maquetacion grilla | Estado: In Progress
 - Asignado a: Diego Gimbernat
- Test Case 24940: QA - Validar el botón "CONTINUAR" del modal "Arqueo de caja" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15141: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Test Case 24932: QA - Validar el total de "Transferencia" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24906: QA - Validar el campo "Caja" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24928: QA - Validar la columna "Nombre paciente" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24939: QA - Validar el botón "CANCELAR" del modal "Arqueo de caja" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24909: QA - Validar el campo "Fecha" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24911: QA - Validar el campo "Medio de pago" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15150: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Test Case 24913: QA - Validar el campo "Nombre paciente" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24924: QA - Validar la columna "Concepto" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24169: BE - Seleccionar tipos de movimientos | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24925: QA - Validar la columna "Importe total" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24168: BE - Listar movimientos (release 1.1) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24919: QA - Validar el botón "CONFIRMAR" del modal "¿Deseas finalizar el arqueo de caja?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24931: QA - Validar el total de "Cheques" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24170: BE - Seleccionar tipos de cambios (monedas) | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 24934: QA - Validar el "Total" general | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24324: [FE] Maquetado filtros | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 24929: QA - Validar el total de "Efectivo" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23955: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24908: QA - Validar el campo "Ciclo" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23736: DB - Agregar tablas y campos | Estado: To Do
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 24915: QA - Validar el botón "REALIZAR ARQUEO" para realizar un arqueo final | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24329: [FE] Integración servicio grill | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 24926: QA - Validar la columna "Medio de pago" de la grilla de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24917: QA - Validar el modal de doble confirmación: "¿Deseas finalizar el arqueo de caja?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24930: QA - Validar el total de "Tarjeta" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24910: QA - Validar el campo "Tipo de movimiento" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24912: QA - Validar el campo "Clase" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24907: QA - Validar el campo "Cajero" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder



