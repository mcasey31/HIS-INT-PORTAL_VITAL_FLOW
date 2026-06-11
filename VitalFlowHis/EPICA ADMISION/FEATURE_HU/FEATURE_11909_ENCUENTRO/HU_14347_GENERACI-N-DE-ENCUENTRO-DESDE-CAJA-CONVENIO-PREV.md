# HU 14347 - Generación de Encuentro desde Caja-Convenio, previo pago correspondiente a cargo del Paciente - QA

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11909_ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14347/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Sistema de Gestión de Admisiones (Admisionista y/o Cajero)
Quiero: Crear automáticamente un "Encuentro" al generar el cobro prestacional al paciente
Para: Que el profesional pueda registrar la atención una vez finalizado el proceso de admisión 

Descripción El sistema debe generar automáticamente un Encuentro cuando el proceso de Admisión y todos sus subprocesos finalizan correctamente. 

Existen dos escenarios posibles: 

- Caso 1: El paciente no debe abonar nada 
 Si el financiador cubre el 100% de los costos, el sistema permite cerrar la admisión directamente y generar el Encuentro. Este caso ya fue detallado en la HU ITEM 11965 - Caso 2: El paciente debe abonar (total o parcialmente) 
 Este caso requiere una serie de pasos adicionales antes de cerrar la admisión: 

Una vez obtenida la respuesta del Módulo Convenio, el sistema informa los cargos privados a cargo del paciente. 

 
Si existen montos a pagar, no se puede completar la admisión hasta que el paciente realice el pago. 

 
- En este punto, se habilita el botón "Generar Evento Caja", que deriva el proceso al Módulo de Caja. (explicado en la ITEM 14040) 

 
En Caja, el usuario (ya sea el admisionista o un cajero) debe: 

- Buscar al paciente con cargos pendientes. Ver HU (ITEM 15419) 

 
- Emitir el cobro correspondiente (ver HU ITEM 11958 - Emitir Cobro Privado). 

 
 
Una vez que el sistema cambia el estado del pago a "Pagado" y se genera el movimiento correspondiente ver HU ITEM 15997 

- Se permite completar la admisión. 

 
- Se actualiza el estado del paciente a "En Espera". 

 
- Se genera automáticamente el Encuentro, habilitando así el registro de la atención por parte del profesional.

## Azure Criterios de Aceptacion
- Un encuentro solo puede generarse cuando la admision finalizo correctamente (se entrego la documentacion respaldatoria y se abono lo que correspondia por parte del paciente (privado) 
- No se puede generar un encuentro si existen cargos pendientes de cobro 
- Al momento de efectuarse el pago se cambian los siguientes estados: 
- El paciente pasa a "En Espera" 
- Los cargos quedan en estado "Pagado" 
 - Cuando el Paciente abono y sus cargados estan en estado "Pagado" se genera el Encuentro

## Azure Tasks
- Test Case 24467: QA - Validar botón "GENERAR EVENTO DE CAJA" cuando la práctica NO esté convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24461: QA - Validar el valor de la consulta cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24460: QA - Validar el valor de la consulta cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24464: QA - Validar el campo "Total a pagar" cuando la práctica NO está convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23950: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24471: QA - Validar que no se puede generar un encuentro si existen cargos pendientes de cobro | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24459: QA - Validar el valor de la consulta cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24468: QA - Validar botón "GENERAR EVENTO DE CAJA" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15398: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Test Case 24473: QA - Validar el formato y la longitud en cada campo cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24470: QA - Validar el toast de información "Se generó el evento de caja al paciente XXX. Diríjase a la sección de caja para emitir el cobro" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 23949: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24469: QA - Validar el toast de información "Se admitió al paciente XXX y queda en Sala de espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24466: QA - Validar botón "CONFIRMAR ADMISI "N" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24504: QA - Generación de Encuentro desde Caja-Convenio - Difiere del mock up el espacio de la sección "Archivos adjuntos" y "Valor de la consulta", esto muestra el mensaje 100% convenido con un interlineado | Estado: Approved
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 24462: QA - Validar cuando la Admisión esté Confirmada/Admitido OK el paciente convenido 100%, quede en estado "En sala de espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24522: QA - Generación de Encuentro desde Caja-Convenio ?"No se visualiza el toast de información "Se admitió al paciente XXX y queda en Sala de espera" | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 24472: QA - Validar que al generar el evento de caja, el estado del pago pase de "Pendiente" a Pagado" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 24496: QA - Generación de Encuentro desde Caja-Convenio - No se visualiza el n° de episodio cobrado | Estado: Approved
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 24474: QA - Validar el formato y la longitud en cada campo cuando la práctica NO esté convenida, o tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24465: QA - Validar el campo "Total a pagar" cuando la práctica tenga un 50% convenida y un 50% NO convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 24463: QA - Validar el campo "Valor total" cuando la práctica esté 100% convenida | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15397: AF | Estado: Done
 - Asignado a: Martin Casey



