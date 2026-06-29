# HU 16091 - Visualizar Pago Paciente - Estado Pagado

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16091/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrativo de caja Quiero: Visualizar pago de paciente Para: Obtener resumen de pago 
 Descripción y comportamiento: Una vez realizado el cobro a un paciente (ITEM 14040) desde la grilla donde se listan los cargos pendientes (ITEM 14493) se podrá visualizar un resumen del cobro realizado. 
 
 
 
 Una vez seleccionado el ícono de visualizar, la pantalla se verá de la siguiente manera: 
 
 
 
 Al pie de la página se encontrarán dos botones desde los cuales se podrá volver a la grilla listado, y también imprimir el comprobante de pago. 
 
 
 Mockup: https://xd.adobe.com/view/eec72ba8-819f-4a09-934c-ab65fb8d5599-bb94/

## Azure Criterios de Aceptacion
- El ícono para visualizar solo estará disponible para aquellos pacientes que se encuentren en estado "pagado". 
- Seleccionado el botón volver, el sistema nos llevará nuevamente a la grilla de pagos.

## Azure Tasks
- Task 23423: FE- Crear PAGE Visualizar Pago | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16519: Análisis funcional y escritura | Estado: In Progress
- Bug 24031: QA - El icono visualizar (ojo) se refleja en estado "PENDIENTE" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23428: FE - Integrar cambios EP Obtener cargos | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23493: BE - Obtener cargo (release 1.2) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24311: QA - Diferencias de tamaño y centrado en los botones "VOLVER e IMPRIMIR COMPROBANTE" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23424: FE - Agregar opción visualizar al listado de cargos y su lógica | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23425: FE - Integrar Cabecera Cajero | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23426: FE - Integrar cabecera paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16830: UX - Mockup Visualizar Pago Paciente - Estado Pagado | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Bug 24029: QA - No se visualiza el Cobro episodio N° | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23660: FE- Descarga comprobante | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23579: FE - Integrar Cabecera Cajero (listado cargos) | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23492: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23790: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 23427: FE - Maquetado detalle Cobro | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23494: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 23730: BE - Agregar id movimiento en ObtenerCargoByID | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



