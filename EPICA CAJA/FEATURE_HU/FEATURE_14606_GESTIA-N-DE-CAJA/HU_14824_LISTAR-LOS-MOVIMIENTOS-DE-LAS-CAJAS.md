# HU 14824 - Listar los movimientos de las cajas

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14824/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Listar todos los movimientos que se generen dentro de los ciclos de las cajas. Para: Visualizar los ingresos y egresos de las cajas y sus distintos tipos de movimientos realizados. 

 Descripción y comportamiento: Desde la gestión de cajas se requiere un proceso que permita listar los movimientos de ingreso y/o egresos de cada una de las cajas. 

 

Desde la grilla de consulta, se debe permitir aplicar los siguientes filtros de búsqueda: 

 

- Tipo de movimientos (Select) * Filtro por default visible (Ver HU:15997: Tipos de Movimientos de Caja) 
- Medio de pago (Select) * Filtro por default visible (Ver HU:14353: Dar de alta distintos medios de pagos ) 
- Fecha desde (Select) * Filtro por default visible 
- Fecha hasta (Select) * Filtro por default visible
 
- Caja (Select) Filtro avanzados (Ver HU:ITEM 14362) 
- Cajero (Select) Filtro avanzados 
- Hora desde (time) Filtro avanzados 
- Hora hasta (time) Filtro avanzados 
 
 

Ver mockup de filtros 

 

 

 

 

Filtros avanzados.
 

 
 
 
 
 
 

 

En el caso de que la consulta la este realizando un usuario con perfil de cajero, debe venir preseleccionado en los filtros de caja (la caja que tiene el cajero aperturada) y cajero (nombre del usuario), y ambos filtros inhabilitados. Ver mockup 

 

 

 

 

 

La consulta de registros de movimientos, puede generar dos posibles escenarios: 

 

1) Primer Escenario: Respuesta OK, se encontraron movimientos en las cajas de cobros. 

 

 Se debe listar los registros de los distintos tipos de movimientos que se realizaron en una caja. Cada registro debe estar identificado a una caja, ciclo y cajero. 
 

 

 Los movimientos de una caja se pueden generar desde distintos eventos y tipos de movimientos. Para el MVP se tendrá los siguientes tipos de movimientos de acuerdo a la HU: 15997: Tipos de Movimientos de Caja, y cada uno de ellos se generaran a partir de los siguientes eventos: 

 

 1) Cobro este tipo de movimiento se genera desde "Evento cobro a privado" HU: 4040 2) Fondo Inicial: este tipo de movimiento se genera desde "Apertura de Caja" HU: 4348 3) Retiro por rendición: este tipo de movimiento se genera desde "Cierre de Caja" HU:14350 

 4) Ajuste de Apertura este tipo de movimiento se genera desde "Apertura de Caja" HU:14355 

 5) Ajuste de Cierre este tipo de movimiento se genera desde "Cierre de Caja" HU:14355 

 6) Devolución a paciente este tipo de movimiento se genera desde "Evento cobro a privado" HU:16080 

 7) Retiro este tipo de movimiento se genera desde "Generar Movimientos" HU ITEM 17720 

 

La consulta debe considerar todos estos eventos para listar los movimientos de las cajas. 

 

El listado debe estar ordenado de forma decreciente(desde más actual al más antiguo en base a la fecha y hora) y por columna como se muestra a continuación: Ver muckup 

 

- Fecha y hora 
- Tipo de movimiento 
- Clase
 
- Concepto 
- Importe total 
- Medio de pago 
- Caja 
- Nombre de Paciente 
 Desde la grilla de movimientos se tendrá la opción de "GENERAR MOVIMIENTO", desde este botón de abrira un modal para registrar un movimiento en una caja activa. Esta acción se realizara en la HU: Item 17720: Generar movimientos 
 
 
 

 

 

 

 

 

2) Segundo Escenario: No se encontraron registros movimientos. 

 

 

 Se debe mostrar un mensaje informando que no hay movimientos realizados en las cajas, ver muckup. 

 

 

 

 

https://xd.adobe.com/view/71d9dccd-e681-467e-8246-153d7f178c1a-248a/

## Azure Criterios de Aceptacion
- La grilla debe contar con las funcionalidades de los componentes de grillas desarrollados en ODI. 
- El botón "Generar Movimientos" en esta HU no tendrá actividad, se desarrollará en otra HU, pero debe estar diseñado. 
- En caso de generar un error de comunicación o conexión se debe visualizar el error de acuerdo al comportamiento del Sistema ODI. 
- Los filtroa avanzados caja y cajero solo deben estar habilitados para los perfiles de administradores y/o coordinadores de cajas. 
- El cajero debe tener inhabilitado los filtro de caja y cajero.

## Azure Tasks
- Task 23304: QA-Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez
- Task 24162: BE - Listar totales de los movimientos por medio de pago | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23739: FE - Consumir EP obtenerSelectorMediosPago | Estado: In Progress
 - Asignado a: Andres Eloy Rincon Lopez
- Task 23628: BE - Listar movimientos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23737: FE - Maquetacion Listar filtros de Movimientos de caja | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 23436: Diseño de interfaz | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 23303: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 24262: FE - Maquetacion Listar listado de Movimientos de caja | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15596: Análisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23741: FE - Consumir EP obtenerCajerosSelector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 23740: FE - Consumir EP obtenerCajasSelector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15756: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 23738: FE - Consumir EP obtenerMovimientos | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez



