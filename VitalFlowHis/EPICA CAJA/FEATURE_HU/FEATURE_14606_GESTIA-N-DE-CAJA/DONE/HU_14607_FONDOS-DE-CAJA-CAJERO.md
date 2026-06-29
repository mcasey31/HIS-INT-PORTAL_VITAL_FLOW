# HU 14607 - Fondos de Caja/Cajero

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14607/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Gestionar el fondo de aperturaPara: Realizar el fondo de caja o cajero antes de la apertura de caja 

 Descripción y comportamiento: Desde la gestión de cajas se requiere un proceso que permita el fondeo de una caja o del cajero para generar los fondos necesarios (recurso económico efectivo) que debe tener una caja para su apertura. 

 

Al iniciar el proceso de fondeo, el sistema debe permitir al usuario a identificar a quien se le aplicara el fondo, si a la caja o al cajero. 

 

 

 

 

 

 

 

De acuerdo a la selección se plantean dos escenarios: 

 

Escenario 1: Fondo a caja 

En caso de fondear a la caja, se debe seleccionar una (1) caja, como se muestra en el mockup, y esta mostrará la identificación del grupo al cual pertenece de acuerdo a los criterios parametrizados en: HU ITEM 14362. y el estado en que se encuentra la caja seleccionada. Para fondear esta debe estar cerrada. 

 

 

 

 

 

 

 

Luego de seleccionar la caja, se debe identificar el tipo de fondo a rendir (Solo se habilitará la opción de FIJO), y la opción para registrar el monto de fondo que tendrá la caja en su apertura. Si la caja ha sido fondeada previamente, debe mostrar el valor del fondo en la caja de texto del monto, y solo se hará un edición de ese fondo. ver mockup. 

 

 

 

 

 

 Escenario 2: Fondo al cajero En caso de de fondear al cajero, se debe seleccionar un (1) usuario como se muestra en el mockup. Al crearle fondo al cajero este parámetro será el que tome la prioridad en el campo de "Fondo de Caja" cuando el cajero aperture una caja (n), el valor indicado como fondo, debe reflejarse en el campo antes indicado. El cajero no debe tener una caja abierta al memento del fondeo. 

 

Si el cajero ha sido fondeado previamente, debe mostrar el valor del fondo en la caja de texto del monto, y solo se hará un edición de ese fondo. 
 

 
 
 
 Al confirmar el monto del fondo en cualquier de los dos escenarios, se debe confirmar la acción de fondeo. 
 
 
 
 El modal de confirmación debe tener dos opciones, Cancelar que nos devuelve a la pantalla anterior o continuar para que nos ejecute el fondeo. En caso de ser exitoso el proceso se debe visualizar el mensaje de confirmación de la aplicación de fondo. En contrario el alerta de error. 
 

Fondo de caja

## Azure Criterios de Aceptacion
- Para fondear una caja esta debe estar en estado cerrada. Si el fondo es al cajero igual este no debe tener una caja aperturada al momento del fondeo. 
- Se debe tener una estructura para poder parametrizar el fondo de caja por caja o por cajero. 
- Una vez fondeada la caja/cajero, esta no se puede modificar al aperturar la caja, hasta cerrar el ciclo de la caja. 
- Tanto caja como cajero solo deben tener un solo fondo. 
- Al no tener un botón salir o cancelar, la funcionalidad entre pestañas es de blanquear la operación realizada si se cambia de pestaña, siempre y cuando esta no haya sido confirmada. 
- No si tiene un limite mínimo o máximo para el fondeo.

## Azure Tasks
- Task 17593: BE - Obtener detalle caja | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15149: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez
- Task 17592: BE - Obtener detalle cajero | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17448: FE - Integracion EP Obtener Caja | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17587: BE - Crear fondo de caja | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17590: BE - Seleccionar caja | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17497: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23512: QA - Diseño: tooltip "Tipo de fondo" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17451: FE - Integracion EP Obtener Cajeros Selector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17589: BE - Seleccionar cajero | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17588: BE - Seleccionar tipo de fondo | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17449: FE - Integracion EP Obtener Cajero | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15142: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 17453: FE - Integracion EP Crear Fondo | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 22819: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17450: FE - Integracion EP Obtener Cajas Selector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 23511: QA - El campo "Seleccionar usuario" no devuelve opciones | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17452: FE - Integracion EP Obtener Tipos Fondo Selector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 23508: QA - Error al Confirmar fondo, Cajas-Cajeros no existe | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17447: FE - Maquetado Formulario | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17498: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez



