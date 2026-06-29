# HU 16613 - Historial de Arqueos de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16613/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Tener un historial de arqueo de caja. 

Para: Visualizar los distintos arqueos realizados a una caja. 

 

Comportamiento y Descripción: 

 

Desde la funcionalidad de Arqueo de Caja (HU ITEM 14354), se requiere una opción que permita visualizar el historial
de los distintos arqueos realizados sobre una caja de cobro, tal como se visualiza en el mockup. 

 

 

 

Al hacer clic en el botón "Ver Historial de
Arqueos", el sistema deberá, por defecto, cargar automáticamente los datos
previamente seleccionados en el arqueo de Caja. 

 En la pantalla que se
abrirá al hacer clic en el botón mencionado, se mostrará una grilla con los resultados
disponibles, en caso de que
existan datos registrados.

Si no se encuentra información correspondiente a los criterios seleccionados,
la grilla no
mostrará resultados. 

Asimismo, se
habilitarán filtros
para realizar búsquedas por rangos de fechas y horas, con los siguientes campos: 

 
 Fecha Desde / Fecha Hasta 

 Hora Desde (correspondiente a la hora de
 apertura del ciclo) 

 Hora Hasta (correspondiente a la hora actual
 de consulta) 
 La búsqueda de
periodos históricos de arqueo estará limitada a un máximo de dos períodos (Meses) anteriores, respecto a la fecha
actual. Si se intenta realizar una consulta fuera de ese rango permitido, el
sistema no mostrara ningún resultado en la búsqueda por fecha seleccionada. 

 

 

 

En la consulta del historial de arqueos de caja,
pueden presentarse dos escenarios posibles: 

Primer Escenario: Caja con arqueos realizados 

 

Cuando existen arqueos registrados para la caja seleccionada, el sistema deberá
mostrarlos en la grilla correspondiente, como se visualiza en el
mockup. 

 

 

 

 

 

 

Segundo Escenario: Caja sin arqueos realizados

En caso de que no se hayan registrado arqueos para la caja seleccionada, el
sistema deberá mostrar el siguiente mensaje:
"No se encontraron resultados", como se visualiza en el
mockup. 

 

 

 

 

 

Prototipo: https://xd.adobe.com/view/aef6d7b8-b9fd-4c02-81ec-4ca6041632dc-fba5/

## Azure Criterios de Aceptacion
- El sistema debe permitir visualizar un listado de
arqueos realizados por caja y usuario. 
- Se debe poder filtrar por rango de fechas, estado
de caja, tipo de arqueo (parcial/final), caja y usuario. 
- Se debe ordenar tomando en cuenta el arqueo más
reciente. 
- Se debe ofrecer la opción de descargar el reporte
asociado a cada arqueo desde el listado. 
- Si no existen registros para los filtros
aplicados, se debe mostrar un mensaje informativo.

## Azure Tasks
- Test Case 23525: QA - Intentar realizar una búsqueda de arqueos superior a dos períodos (Meses) anteriores | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24257: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 23365: [FE] - Maquetacion de filtros | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 23529: QA - Verificar la búsqueda de arqueos por tipo de arqueo Final | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24651: QA - Verificar la búsqueda de arqueos por Ciclo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24638: QA - Validar el botón "LIMPIAR CONSULTA " | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24631: BD - Carga de arqueos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 23366: [FE] - Maquetacion de grilla | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 23339: BD - Crear tabla t_arqueo_total_pago_tipo | Estado: Done
 - Asignado a: Eduardo Ynoub
- Test Case 23523: QA - Validar el filtro "Hora hasta" del Historial de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23530: QA - Verificar que la grilla muestre los arqueos en orden descendente según la fecha, mostrando primero los más recientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23820: DT - Modificar interface | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23301: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23518: QA - Validar el botón "VER HISTORIAL DE ARQUEOS " cuando existan datos para mostrar | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23367: [FE] - Integracion EP filtros | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 23553: DT - Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Test Case 23526: QA - Verificar la búsqueda de arqueos por Caja | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 24160: BE - Historial de Arqueo de cajas (release 1.3) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24677: QA - Historial de Arqueos de Caja - Se visualiza el botón "CONSULTAR" en minúscula, cuando debería aparecer en mayúscula | Estado: Committed
 - Asignado a: Nahuel Salazar
- Task 23711: DT - Modificacion interface | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 23491: BE - Historial Arqueo de Caja | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24656: QA - Historial de Arqueos de Caja - Búsqueda superior a 2 meses - El mensaje muestra el campo técnico 'fechaHoraDesde', generando posible confusión para el usuario | Estado: Committed
 - Asignado a: Nahuel Salazar
- Bug 24634: QA - Historial de Arqueos de Caja - Se visualiza el botón "VER HISTORIAL DE ARQUEOS " en minúscula, cuando debería aparecer en mayúscula | Estado: Committed
 - Asignado a: Nahuel Salazar
- Bug 24666: QA - Historial de Arqueos de Caja - Se visualiza el botón "SALIR" en minúscula, cuando debería aparecer en mayúscula | Estado: Committed
 - Asignado a: Nahuel Salazar
- Test Case 24664: QA - Validar el botón "SALIR" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23528: QA - Verificar la búsqueda de arqueos por tipo de arqueo Parcial | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23531: QA - Verificar la opción "Imprimir" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24675: QA - Historial de Arqueos de Caja - Los filtros avanzados se muestran desplegados por defecto y el botón "FILTROS AVANZADOS" no está visible | Estado: Committed
 - Asignado a: Nahuel Salazar
- Bug 24665: QA - Historial de Arqueos de Caja ?" Al presionar el botón "SALIR" no se ejecuta ninguna acción, lo que impide al usuario salir de la pantalla ?oHistorial de arqueos ? | Estado: Committed
 - Asignado a: Nahuel Salazar
- Bug 24641: QA - Historial de Arqueos de Caja - Botón "CERRAR B sSQUEDA", se visualiza en minúscula y "búsqueda" sin acento en la letra (ú)) | Estado: Committed
 - Asignado a: Nahuel Salazar
- Test Case 24639: QA - Validar el botón "CERRAR B sSQUEDA" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23520: QA - Validar el filtro "Fecha desde" del Historial de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24655: QA - Historial de Arqueos de Caja - Difiere del mock up el color y tamaño de la "X" cuando no se encuentran resultados de búsqueda; y falta el punto (.) al final del mensaje | Estado: Committed
 - Asignado a: Nahuel Salazar
- Task 17269: Análisis, Diseño y Escritura funcional | Estado: In Progress
 - Asignado a: Manuel Rolando Alvarez
- Bug 24635: QA - Historial de Arqueos de Caja - Al presionar el botón "VER HISTORIAL DE ARQUEOS " se muestra un error de código: "El campo idCaja es requerido." | Estado: Committed
 - Asignado a: Nahuel Salazar
- Test Case 23519: QA - Validar el botón "VER HISTORIAL DE ARQUEOS " cuando NO existan datos para mostrar | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23364: [FE] - Maquetacion de pantalla | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 23242: DT- Interfaces | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 23368: [FE] - Integracion EP grilla | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 23326: DB - Crear tabla de arqueos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 17330: UX Mockup Historial de Arqueos | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Bug 24037: DEV - Validacion de formato de fecha Isostring | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 23521: QA - Validar el filtro "Fecha Hasta" del Historial de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23302: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23527: QA - Verificar la búsqueda de arqueos por Cajero | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23764: BE - Historial de Arque de cajas (release 1.1) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 23532: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23524: QA - Validar que la búsqueda de arqueos esté limitada a un máximo de dos períodos (Meses) anteriores | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24674: QA - Verificar el botón "FILTROS AVANZADOS" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23522: QA - Validar el filtro "Hora desde" del Historial de arqueos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24673: QA - Verificar el botón "CONSULTAR" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24640: QA - Historial de Arqueos de Caja - Difiere del mock up el texto del botón "LIMPIAR CONSULTA", dice incorrectamente "Limpiar busqueda" (en minúscula y "búsqueda" sin acento en la letra (ú)) | Estado: Committed
 - Asignado a: Nahuel Salazar



