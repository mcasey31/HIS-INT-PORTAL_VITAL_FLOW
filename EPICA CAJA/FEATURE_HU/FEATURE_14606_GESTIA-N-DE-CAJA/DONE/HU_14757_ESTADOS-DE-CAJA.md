# HU 14757 - Estados de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14757/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como ? : Gestor de caja 

 

Quiero ? : Visualizar y actualizar el ? estado de la gestión de cajas Para ? : Conocer con precisión en qué condición se encuentra la caja financiera 

Descripción y comportamiento:Al gestionar la caja administrativa, se necesita que el sistema muestre el estado actual de la caja y permita cambiarlo según sus proceso de apertura y cierre. Los estados posibles son: - Abierta ?"La caja queda abierta al gestionar la apertura por parte del cajero. 
- Cerrada ?" La caja queda cerrado al gestionar el cierre por parte del cajero.

## Azure Criterios de Aceptacion
Escenario 1: Al aperturar la caja esta debe quedar asociada al usuario (operador de caja) que realiza la apertura. Al aperturar la caja debe quedar con un estado ABIERTA. Se deben activar las operaciones de gestión de cobro a paciente. A realizar cobros a la lista de pacientes con pagos pendientes. Escenario 2: Al cerrar la caja esta debe quedar desligada al usuario (operador de caja) que realiza el cierre. Al cerrar la caja debe quedar con un estado CERRADA.
 Se deben inhabilitar las operaciones de gestión de cobro a paciente. No se puede realizar cobros a la lista de pacientes con pagos pendientes. Se podrá ver más no realizar acción alguna de cobro.

## Azure Tasks
- Task 14758: Análisis, Diseño y Escritura Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



