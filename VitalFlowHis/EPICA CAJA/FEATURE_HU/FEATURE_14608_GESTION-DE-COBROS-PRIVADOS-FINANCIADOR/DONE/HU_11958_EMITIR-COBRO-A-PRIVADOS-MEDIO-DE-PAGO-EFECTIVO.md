# HU 11958 - Emitir Cobro a Privados-medio de pago efectivo

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11958/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de cajas. Quiero: Emitir un cobro a un privado/particular. Para: Completar proceso de admisión con cargo a paciente. 
 Descripción y comportamiento: Para realizar un cobro a un paciente que contenga cargos en la atención, desde el módulo de caja (solapa Facturación privado) se podrá realizar una búsqueda por tipo y numero de documento, o bien, seleccionar al paciente desde la grilla (ITEM 14493) que contendrá tanto los pendientes, como aquellos que ya hayan realizado el pago tal como se muestra en la siguiente pantalla. 
 
 
 Una vez seleccionado el paciente (con estado pendiente), se habilitará el botón "Emitir pago "que nos mostrará una pantalla resumen con los cargos a abonar por el paciente. 
 
 
 La pantalla contará con una cabecera (ITEM 15798), y una grilla que liste las practicas a realizar, con fecha, descripción, cantidad, y valor, tal como se muestra en el mockup. 
 Desde la sección "Completar datos de pago" se podrá indicar el medio de pago a utilizar (ITEM 14353). El campo tipo de comprobante será un select que listará entre los disponibles a emitir ver HU (ITEM 16090) (Ticket, Fc A, Fc B, Fc C), y de los cuales se utilizará en formato ticket en esta primera instancia. 
 Desde el botón "Cancelar" se podrá volver a la pantalla anterior (grilla listado), y si se selecciona "Continuar" se habilitará el botón "Generar pago" tal como se indica en la imagen, imprimirá los detalles del pago. 
 
 Comprobante (ticket) de pago 
 
 
 Como condición necesaria, el usuario deberá contar con una caja abierta para poder generar el pago (ITEM 14348) 
 En caso de no tenerla se verá el siguiente mensaje: 
 
 
 
 
 Desde el botón "Generar pago" se dispararán las siguientes acciones: 
 - El estado de pago se actualizará a "Pagado" (grilla de pendientes) 
- Genera movimiento "Cobro" (ITEM 15997) * 
- Genera encuentro (ITEM 14347) 
- Impresión de comprobante de atención (ITEM 14372) 
- Impresión de comprobante de pago (ITEM 14356) 
 *Al generar el movimiento se deberán considerar los siguientes datos: 
 Fecha Centro Servicio Profesional Practica Paciente Dni Valor por practica Valor total Medio de pago 
 Una vez "Generado" el pago, se confirmará la acción mediante el siguiente modal, que permitirá imprimir el ticket (ITEM 16093) 
 
 
 https://xd.adobe.com/view/84e1946c-c0e8-4b2d-8257-1f46cde61470-d1b2/

## Azure Criterios de Aceptacion
- Para emitir un cobro, el usuario deberá tener una caja abierta (aperturada) 
- Cuando se genere el cobro, el estado del paciente pasará a "En sala de espera"
 
- El botón volver llevará la pantalla a la grilla. 
- Una vez que se seleccione el botón "Continuar" el mismo quedará grisado, y se habilitará el "Generar pago".

## Azure Tasks
- Task 22656: FE - Crear cabecera cajero | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 24174: QA - Validar que el campo "Número" permita únicamente el ingreso de 11 dígitos numéricos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23039: BE - Obtener detalle cajero (release 1.1) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 22666: FE - Maquetacion Previsualizacion de pago | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 22662: FE - Esqueleto PAGE cobro paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 22647: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 22648: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24217: QA - Validar el botón "CANCELAR", luego de completar los datos de pago | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23034: BE - Descargar comprobante de cargo | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 22755: FE- Habilitar botón 'Emitir pago' solo para ítems pendientes y configurar redirección | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 24176: QA - Validar el tooltip en el medio de pago "Efectivo" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23209: FE- Validacion estado caja y maquetado alerta | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 23576: BD - Agregar campo monto a la tabla sch_cajas.t_movimientos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 23184: FE - Integrar EP crear movimiento | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 22677: FE - Integracion EP obtenerSelectorMediosPago | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 22663: FE - Maquetacion seccion detalle cargo | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 22898: FE- Integrar EP obtener cargo por ID | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 22676: FE - Integrar EP obtenerPracticasCargo | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 23134: QA - Verificar paciente informacion de pago | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 15158: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Test Case 23136: QA - Verificar campo CUIT -CUIL | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 22664: FE - Maquetacion Listado practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 24222: QA - Validar que al presionar el botón "GENERAR PAGO", se imprima el detalle del pago | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 23140: QA - Verificar modal de Alerta de generar pago | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 23035: BE - Crear movimiento | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 24220: QA - Emitir Cobro a Privados-medio de pago efectivo - Luego de presionar el botón "CONTINUAR", no aparece desactivado (grisado) | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24173: QA - Validar que el "Tipo de comprobante" sea un campo obligatorio | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 22799: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 23185: FE - Modal y integracion descargar comprobante | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 13581: Análisis y escritura | Estado: In Progress
- Test Case 23137: QA - Verificar campo Tipo de comprobante | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 23572: BE - Datos del movimiento | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 22675: FE - Integrar EP Obtener Cajero | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 24175: QA - Validar que el campo 'Número' no permita ingresar una cantidad distinta de 11 dígitos numéricos | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23377: FE - Componente bread-crums | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 24178: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 22665: FE - Maquetacion seccion datos de pago | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 23037: BE - Selector medios de pago | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23036: BE - Listar practicas de un cargo | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 23138: QA - Verificar Botón CONTINUAR en "Completar datos de pago" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 23038: BE - Obtener cargo by ID | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Test Case 23139: QA - Verificar Botón GENERAR PAGO | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez



