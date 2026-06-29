# HU 14348 - Apertura de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14348/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Gestionar la apertura de caja 
Para: Realizar la gestión
de cobros a pacientes particular. 

 
 Descripción y comportamiento: Desde la gestión de cajas se requiere un proceso que
permita la apertura de caja para gestionar cobros a pacientes que requieran realizar
pagos por medios particulares. 

 

 Las cajas pueden tener dos posibles estados (Abierta o Cerrada),
al momento de gestionar la apertura esta debe pasar a un estado abierta; ver ciclo de estados en la HU Product Backlog Item 14757: Estados de Gestión de Caja. 

 

En la pantalla de gestión de caja, se tienen dos opciones (APERTURA-CIERRE), el sistema debe permitir al operador de caja a seleccionar una (1) caja, como se muestra en el mockup, y esta mostrará el grupo al cual pertenece de acuerdo a los criterios parametrizados en: HU ITEM 14362. 

 

También debe visualizarse el tipo de fondo con que se aperturara la caja, esto en caso si el cajero logueado tenga un fondo de apertura definido, se tomará como fondo por default. Ver Mockup. 

 

 

Cada vez que se entre a gestionar la caja y se haya seleccionado una de ellas, el sistema debe consultar en que estado se encuentra esa caja, ya que para realizar la apertura la caja debería estar en estado "Cerrada", también debe verificar si tiene un fondo de apertura parametrizado. 
 
 Una vez seleccionada la caja se debe evidenciar las siguientes
datos: 

 

- Fondo de caja. (campo tipo money, inhabilitado) 
- Ajuste. (campo tipo money). Debe contar con menú contextual. Ver HU:Item 14355: Ajustes de Caja 
- Saldo de apertura. (campo tipo money, inhabilitado). Si existe ajuste, se debe sumar o restar al fondo de caja. Depende si en ajuste es positivo(ingreso) o negativo(egreso), para dar el saldo total. Ver HU: Product Backlog Item 14355: Ajustes de Caja 
- Fecha y hora: Se debe visualizar fecha y hora de apertura. 
 
- Datos de la caja: Se debe evidencia el número o identificación de la caja seleccionada. Con la selección de la caja esta debe traer al grupo al cual pertenece, o identificar si es caja única. 
 

y se activara el botón de "Confirmar Apertura", como se muestra en la siguiente imagen. Todas las opciones de cierre deben estar inhabilitadas. 

 

 

 

 En la apertura de caja, se debe evidenciar el saldo de fondo de caja. En el caso de que se le haya creado un fondo al cajero, se priorizara este monto en la apertura, en caso contrario se toma fondo fijo de caja si existe, sino si apertura con un fondo en cero (0.00$) Si el fondo de la caja es mayor a cero y el ajuste también es distinto a cero, se debe totalizar para dar el saldo de apertura. De no existir ajuste, el saldo de apertura será el mismo valor de fondo establecido. El saldo final nunca de ser negativo, siempre debe ser mayor o igual a cero. 
 Los procesos de apertura deben realizar la creación de ciclos durante el día, iniciando con la creación del primer ciclo al aperturar la caja. Cada ciclo termina al cierre de la caja. Se da inicio al segundo ciclo con la nueva apertura de la caja en ese mismo día, así sucesivamente hasta el final del día, donde debe reiniciar nuevamente el proceso contable de los ciclos, ejemplo: ciclo 1, ciclo 2, ciclo 3, etc. 
 Escenario esperado: 

Al concretarse la apertura de la caja, mediante confirmación, esta debe quedar asociada al usuario (operador de
caja) que realizo la gestión de apertura con un estado ABIERTA. y debe registrarse en que ciclo se aperturo. 
 
 
 
 
 Una vez aperturada la caja, se inhabilita el botón de apertura y se activara para el botón de cierre , proceso que se desarrollará en la HU Product Backlog Item 14350: Cierre de Caja., y se mostrará un mensaje en un tooltip que se confirmo la apertura,como se muestra a continuación. 
 
 
 
 En caso de generar error al aperturar, se mostrara un mensaje, Ver mockup. 
 
 https://xd.adobe.com/view/bb3fc62d-98b3-4787-9647-8717dbb75d83-ee6c/

## Azure Criterios de Aceptacion
- Se debe validar que el cajero no tenga otra caja activa (abierta) 
- Se debe validar que la caja a aperturar, haya tenido un cierre previo (Estado Cerrada) 
- Al aperturar la caja debe quedar en estado de Abierta. 
- El cajero no podrá editar los valores de fondo ni saldo de apertura. 
- Al abrir la caja, se activaran las actividades de cobros y gestión de pacientes con pagos pendientes. 
- Al crearse la apertura, esta debe generar un primer movimiento identificando con el tipo de movimiento "Fondo Inicial" de acuerdo a la HU Item 15997: Tipos de Movimientos de caja, igualmente se debe setear el concepto de acuerdo a la HU antes mencionada. 
- Se debe considerar en el modal de confirmar apertura, el tipos de mensaje a mostrar, de acuerdo a los escenarios planteados con los fondos de apertura. Ver cockup.

## Azure Tasks
- Task 17444: FE - Integracion EP Obtener Caja Selector | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 17617: BE - Obtener detalle cajero por id de usuario | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24317: Modificar la libreria cache back security | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 23723: QA - No se visualiza el nombre del operador de caja | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 22844: Prueba integración | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 17500: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23488: QA - Al confirmar apertura de caja, error"Atributo id cajero " | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17445: FE - Integracion EP Obtener Caja | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 14537: Escritura Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14678: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 17499: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17738: FE - Maquetado apertura/cierre | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 15356: UX - Corrección Mockups | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 17446: FE - Integracion EP Abrir Caja | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 23687: QA - No se visualiza el modal con apertura sin monto asignado | Estado: Approved
 - Asignado a: Diego Gimbernat
- Test Case 23269: QA - Verificar menu contextual en ajuste | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23429: QA - Falta idCentro | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 22967: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17690: Code Review | Estado: In Progress
 - Asignado a: Marco Alex Brusa
- Task 17616: BE - Abrir caja | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 23280: QA - No se visualiza fecha y hora de apertura | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17710: FE - Editar apertura de modal | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 23270: QA - No se visualiza el Menú contextual en Ajuste | Estado: New
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23369: QA - Modal de Apertura difiere el nombre de selección de caja | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23774: DS - Agregar parametro en EP (user logued) | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 24384: Revisión / Creacion de rol | Estado: To Do
 - Asignado a: Lucas Ezequiel Ayala
- Task 17507: Creacion y configuracion nuevo repo front_cajas | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 24280: BD - Creación de rol | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 23776: BE - Obtener detalles de cajero activo | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 19242: BE- Base template back_cajas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17439: FE - Maquetado Caja | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 17440: FE - Integracion EP Obtener Cajero Por Usuario | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 23721: QA - Falta Texto "Tipo de fondo" con que se aperturara la caja | Estado: Committed
 - Asignado a: Nahuel Salazar
- Task 14536: Análisis y Diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Bug 23685: QA - Texto descentrado en el campo Tipo de fondo | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 23265: QA - DIseños, tamaños y espacios | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez



