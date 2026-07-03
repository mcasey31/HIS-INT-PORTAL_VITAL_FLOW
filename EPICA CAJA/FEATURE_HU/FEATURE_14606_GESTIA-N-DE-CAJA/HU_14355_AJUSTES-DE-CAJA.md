# HU 14355 - Ajustes de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14355/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Gestionar un ajuste en la caja Para: Cuadrar los registros contables de la caja. 

 Descripción y comportamiento: Desde la gestión de cajas se requiere un proceso que permita realizar los ajustes en los movimientos de una caja, para cuadrar el saldo cuando no coincidan los valores en los asientos contables y/o procesos de apertura de caja o cierre de la misma. 

 

Desde cualquier evento de gestión de caja como la apertura o cierre de caja, se debe tener acceso a realizar un ajuste de una caja en un ciclo determinado, esta puede estar cerrada o abierta. Ver ejemplo: 

 

 

 

 

 

Cuando generamos un ajuste, se debe levantar un modal con la información de la caja y del usuario que esta realizando la operación; indicando fecha y hora de la transacción. Ver mockup. 
 

 

 

 

 

 

Para realizar el ajuste se debe registrar los siguientes datos: 

- Tipo de ajuste: (campo tipo select - "Ajuste positivo, Ajuste negativo") * 
 
- Motivo: (campo tipo select - Ejemplo: "Ingreso o egreso no registrado (omisión), Diferencias entre el efectivo real y el saldo teórico del sistema, Error en el conteo o en la carga de datos") * 
 
- Observaciones: (campo tipo texto max 100c) * 
- Valor del ajuste: (campo tipo money) * 
- Responsable del ajuste: Por default (usuario de sistema) * 
 
- Fecha y hora: Por default la fecha y hora en que se registra el ajuste. 
 * Nota: campo obligatorio. Ver mockup 
 
 
 
 Al guardar el ajuste se debe dar un mensaje de confirmación y se debe aplicar el ajuste en el proceso indicado, de acuerdo a los criterios que tenga dicho proceso. 
 
 

 

 

 
 En caso de que se genere un error al realizar el ajuste, se debe alertar mediante mensaje tooltip, como se muestra en el mockup. 
 
 
 
 
 CONSIDERACIONES. La opción de ajuste(menú contextual) debe visualizarse en el cierre, solo si la caja esta abierta, o sea, si la caja esta en proceso de cierre y en la apertura si la caja esta cerrada. 
 

Mockup: https://xd.adobe.com/view/e2fac270-fcb2-4ae6-bec6-a8c3974c3535-b7a9/

## Azure Criterios de Aceptacion
- Se debe alertar si ocurrió algún error al aplicar el ajuste, ver error en el mockup. Usar Mensajes predeterminados como genéricos en los errores comunes si llegara a existir. 
- Al guardar el ajuste, este debe impactar en el proceso que lo invoco, y debe aplicarse de acuerdo al procedimiento que tenga dicho proceso. 
- Se debe crear la estructura de base para guardar los tipos de ajustes y motivos de ajuste, ya que son listas a mostrar en un elemento tipo select. 
- Al no tener un botón salir o cancelar, la funcionalidad entre pestañas es de blanquear la operación realizada si se cambia de pestaña, siempre y cuando esta no haya sido confirmada. 
 
- Al realizar un ajuste a la caja, esta debe generar un movimiento de ajuste identificando con el tipo de movimiento de acuerdo al ajuste aplicado según la HU Item 15997, igualmente se debe setear el campo "concepto" de acuerdo al tipo de ajuste especificado en la HU antes mencionada.

## Azure Tasks
- Task 23958: QA-Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez
- Task 24043: FE - maquetacion funcionalidad | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez
- Task 24166: BE - Crear ajuste de caja | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Task 15670: Análisis y Diseño Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23956: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 24044: FE Consumir EP - crearAjuste | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15671: Escritura Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16829: UX - Mockup ajustes de caja | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 23592: DB - Agregar tablas | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 24165: BE - Obtener selector tipo de ajustes | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala



