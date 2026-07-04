# HU 16081 - Eximir cobro a paciente privado desde admisión

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16081/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Eximir el cobro a pacientes privado Para: Poder admitirlo sin cargos particulares. 

 Descripción y comportamiento: Desde el proceso de admisión, se requiere un proceso donde se pueda eximir el cobro parcial o total a un paciente con pago particular al momento de ser admitido. 
 
 El proceso se registrara desde el icono exento de pago, ubicado al lado del monto total que se genera en la admisión, ver mockup. 
 

 
 
 Se mostrará un modal que permita identificar que tipo de exento de pago (exento parcial o exento total) tendrá el paciente, para ello se debe identificar de la siguiente manera: 
 
 
 
 Identificación de exento total: En la parte superior del modal se tendrá la opción de un check para seleccionar el exento total, si se selecciona esta opción, ésta determinará que es un impago total (exento total). En este caso se inhabilitaran las opciones para agregar exentos por práctica y el total de copago se identificará en cero (0.00). Ver mockup. 
 
 
 
 Identificación de exento parcial: En el caso de no seleccionar la opción de exento total, se podrá visualizar y editar el monto de las prácticas en dos formas: 
 
 Primera: a cada práctica se le puede aplicar un x por ciento de descuento, esta opción debe calcular el valor descontado y generar un nuevo valor a pagar (copago por práctica) 
 Segunda: a cada práctica se le puede aplicar mediante un check, el exento total a la práctica, esto generará el valor de cero (0.00) a esa práctica. 
 
 
 
 
 Al editar el cobro del paciente se debe identificar los siguientes datos: - Condición del paciente: opción múltiple con ckeck (exento total) 
- Motivo de exento: texto libre * 
- Las prácticas: con su valor de copago inicial, seguido de un input tipo select para agregar un x % de exento, luego un check para indicar si es exento total a la práctica y finalmente un total de copago calculado si hay un % de exento (*); de no aplicar, el copago es el mismo valor inicial y si es exento total, el total copago es cero (0.00) para esa práctica. 
- Total copago inicial: valor que vienen de convenio. 
- Total copago con exento: valor calculado en el proceso de exento. 
- Adjunto de documentación: en caso de requerirse. Solo se permite un archivo adjunto. 
 Nota explicativa (*): El calculo del valor del copago final es la diferencia entre el valor inicial - el x % de exento aplicado. Por ejemplo: si el valor inicial es 10.000 y se le aplica un exento del 10%, El 10% de 10.000 es 1.000, el nuevo copago sera 10.000 - 1.000 = 9.000. 
 
 Al finalizar el proceso de edición de cobro, se pueden presentar dos posibles escenarios: 
 Primer escenario: Exento Total, se evidencia un total de copago igual a cero (0.00) - En esta caso no se requiere generar un evento a caja. 
- Al guardar la edición, se debe cambiar la opción de "Generar un evento a caja" a "Confirmar Admisión" 
- Al guardar la edición del cobro, se debe generar un movimiento (evento a caja) de tipo "impago total", con los valores identificados desde convenio(copago o diferencia no convenida) o por pago de privado particular. 
 
 
 
 Segundo escenario: Exento parcial, se evidencia un total de copago mayor a cero (0.00) - En esta caso se requiere generar un evento a caja. 
- Al guardar la edición, se debe conservar la opción de "Generar un evento a caja"
 
- En la pantalla de admisión, en el marco de valor de la consulta, se debe visualizar los nuevos valores a pagar por práctica y el nuevo total a pagar. 
- Al guardar la edición del cobro, se debe generar un movimiento (evento a caja) de tipo "impago parcial", que refleje el valor exento por práctica y el valor total del exento aplicado. 
- Desde el botón" Generar un evento a caja", se generara otro evento a caja con estado "pendiente de pago" con el nuevo valor a pagar (Es la diferencia entre valor original de la consulta y el valor del exento aplicado, que será lo que realmente tocará para el paciente, discriminado por práctica y valor total) 
 
 
 
 Nota: Se requiere agregar los siguientes estados a la table de Estado de Pago(impago parcial o impago total), actualmente solo esta Pendiente y Pagado

## Azure Criterios de Aceptacion
- Al editar el cobro a un paciente, se podrá generar un exento parcial o total de la consulta. 
- Si el exento es parcial, se debe generar un evento a caja. 
- Si el exento es total, se debe permitir confirmar la admisión. 
- El pago debe generar un movimiento tipo: impago parcial o impago total. 
- Se debe agregar a la tabla de Estados de Pagos, los estados de impago parcial o impago total. HU ITEM 15419 
- Al regresar a la pantalla de admisión, se podrá editar nuevamente el exento antes de admitir o generar un evento de caja.

## Azure Tasks
- Task 16148: Análisis, diseño y escritura funcional. | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16530: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



