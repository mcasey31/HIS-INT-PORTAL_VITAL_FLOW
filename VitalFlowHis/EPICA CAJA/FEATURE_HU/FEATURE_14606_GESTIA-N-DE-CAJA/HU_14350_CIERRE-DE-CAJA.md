# HU 14350 - Cierre de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14350/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Gestionar el cierre de caja Para: Realizar la gestión de finalización de operaciones del ciclo caja. 

 

Descripción y comportamiento: Desde la gestión de cajas se requiere un proceso que permita el cierre de caja para finalizar el ciclo operativo de dicha caja para poder rendir el resultado del saldo final. 
 

 

En la pantalla de gestión de caja, se tienen dos opciones (APERTURA-CIERRE), el sistema debe permitir al operador de caja a seleccionar una (1) caja, como se muestra en el mockup, y esta mostrará al grupo al cual pertenece de acuerdo a los criterios parametrizados en: HU ITEM 14362. 

 

 

Cada vez que se entre a gestionar la caja y se haya seleccionado una de ellas, se debe consultar en que estado se encuentra esa caja, ya que para realizar el cierre, la caja debería estar en un estado "Abierta". 

 

 

 

 

 

 

Una vez seleccionada la caja se debe evidenciar los siguientes datos: 

 

Saldo de inicio: (campo tipo money, inhabilitado) 
Total de movimientos: (campo tipo money, inhabilitado) 
Ajuste: (campo tipo money). Debe contar con menú contextual. Ver HU:Item 14355: Ajustes de Caja 
Total de Caja: (campo tipo money, inhabilitado)
 
Total Efectivo: (campo tipo money, inhabilitado) 
Fondos a rendir:(campo tipo money, inhabilitado). Debe contar con menú contextual para declarar el Retiro por Rendición. 
 
Fecha y hora: Se debe visualizar fecha y hora del cierre. 
Datos de la caja: Se debe evidencia el número o identificación de la caja seleccionada. Con la selección de la caja esta debe traer al grupo al cual pertenece, o identificar si es caja única. 
 

y se activara el botón de "Confirmar Cierre", como se muestra en la siguiente imagen. Todas las opciones de apertura deben estar inhabilitadas. 

 

 

 

 

 Para confirmar el cierre, se debe tener en cuenta las siguientes condiciones: - El saldo inicio: debe ser igual al saldo de apertura de la caja. 
- Total de movimientos: es la diferencia entre ingresos - egresos.( *)
 
- Ajuste: Si existe ajuste de cierre, se debe sumar o restar al fondo a rendir. Depende si en ajuste es positivo(ingreso) o negativo(egreso), para dar el saldo a rendir. Ver HU: Product Backlog Item 14355: Ajustes de Caja ( **) 
- Total de Caja: es la suma del total de movimientos + el saldo inicial +/- Ajuste de caja (puede ser positivo o negativo)
 
- Total Efectivo: Se debe totalizar los movimientos con ingresos en efectivo + el saldo de inicio (efectivo). En caso de no coincidir el valor de este campo con el efectivo físico de la caja, se debe generar un alerta en el proceso contable en el Arqueo, ya sea parcial o final: Proceso que se desarrollará en la HU ITEM 14363 
- Fondo a rendir: por default se reflejará el total en efectivo. Desde el menú contextual se podrá modificar el monto a retirar para la rendición. Este monto no podrá ser mayor al Total en Efectivo. 
 
 
 ( *) Para obtener el total de movimientos, se debe sumar los movimientos que estén clasificados como tipo "Ingreso" y sumar los movimientos de tipo "Egreso" que se hayan registrado en la caja en el ciclo actual. Se debe considerar todos los eventos especificados en la HU: 15997: Tipos de Movimientos de Caja. Posteriormente se debe restar el total de Ingresos - Total de Egresos; esto nos dará Total de Movimientos. 
 
 ( **) La opción de ajuste(menú contextual) debe visualizarse en el cierre, solo si la caja esta abierta, o sea, si la caja esta en proceso de cierre. 
 
 Formulas: Total de movimiento $ = Total de Ingresos $ - Total de Egresos $ Total de Caja $ = Total de movimiento $ + Saldo inicial $ +/- Ajuste de caja
 Total de Efectivo $ = Total de movimientos con ingresos en efectivo + el saldo de inicio (efectivo)
 Fondo a rendir $ = Por default es igual a Total Efectivo (editable)
 
 En el caso de editar el fondo a rendir, se debe levantar un modal donde se indicará el valor a retirar, si este valor es mayor al total en efectivo se debe indicar en el momento. Ver mockup. 
 
 
 
 
 Validaciones a considerar en el cierre: - El fondo a rendir no puede ser un valor negativo. - El saldo inicial al momento de cierre de caja debe ser igual al saldo de apertura de la caja. 
 De no coincidir algunos de estos datos, se debe emitir un alerta de "Valores de cierre no coinciden". Esta validación no es bloqueante para el cierre de la caja, simplemente se trata de warning, Ver Mockup. 
 
 
 
 
 Escenario esperado: 

Al concretarse el cierre de caja, mediante confirmación,esta debe quedar asociada al usuario (operador de caja) que realizo la gestión de cierre y debe cambiar de estado a CERRADA. También debe cerrarse el ciclo en el que se aperturo la caja (se debe registrar la hora de cierre para guía del próximo ciclo) 
 
 
 
 Una vez cerrada la caja se mostrara el mensaje de cierre, como se muestra a continuación, se podrá ver la opción para el botón de apertura habilitado y el botón de cierre se inhabilitará. 
 
 
 
 
 En caso de generar error al cerrar la caja, se mostrara un mensaje, Ver mockup. 
 
 
 
 
 https://xd.adobe.com/view/048692e3-a502-4edc-88ce-99165fd5b344-51d5/

## Azure Criterios de Aceptacion
- El total de movimientos debe ser la suma de todos los ingresos menos ( - ) la suma de egresos. 
- Los campos de saldo inicial, total de movimientos, ajuste de cierre, total de caja, total en efectivo y fondos a rendir, en el proceso de cierre deben estar inhabilitado para el usuario. 
- Al cerrarse la caja, esta debe generar un movimiento de cierre identificando con el tipo de movimiento "Retiro por Rendición" de acuerdo a la HU Item 15997, igualmente se debe setear el campo "concepto" de acuerdo a la HU antes mencionada.
 
- Al cerrar la caja, no se podrá abrir nuevamente el mismo ciclo, ni generar más movimientos en ese ciclo. 
- El monto a retirar para la rendición, no podrá ser mayor al Total en Efectivo. En caso de presentarse se debe alertar y corregir para continuar. 
 
- Antes de cerrar la caja se podrán realizar los procesos de arqueo que requiera el cajero, estos será tomados como arqueos parciales debido a que mientras la caja este abierta existe la posibilidad de generar nuevos movimientos. Luego de cerrada la caja se podrá generar un arqueo final del ciclo. 
- Al no tener un botón salir o cancelar, la funcionalidad entre pestañas es de blanquear la operación realizada si se cambia de pestaña, siempre y cuando esta no haya sido confirmada.

## Azure Tasks
- Task 24164: BE - Obtener los montos totales para el cierre de caja | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Task 15151: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 24163: BE - Confirmar cierre de caja | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Task 24040: FE - maquetacion funcionalidad | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez
- Task 24041: FE - consumir EP - obtenerMontosTotales | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez
- Task 23953: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23374: DT - Interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 15140: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23954: QA-Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez
- Task 24042: FE consumir EP - confirmarCierreCaja | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez



