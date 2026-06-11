# HU 15419 - Estados de Pagos - Privados

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15419/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como ? : Personal de Admisión (Admisionista y/o Cajero) Quiero ? : visualizar y actualizar el ? estado de pago de practicas por parte del paciente ? durante la admisiónPara ? : conocer con precisión en qué estado se encuentra el pago del Paciente y actuar en consecuencia
 
 Descripción breve: Al gestionar la admisión, si el Paciente tiene que abonar cargos de forma privado, el sistema generar los cargos propios por cada una de las practica a realizar en la atención. Los estados de esos pagos pueden ser: 

Pendiente ?" Desde la admisión, al generar el evento de cobro siempre quedará como "Pendiente" 

 
Pagado ?" Desde el modulo de Caja, al generar la emisión de cobro al paciente de cada uno de los cargos, una vez que estos se generan en el sistema el estado quedar "Pagado"

## Azure Criterios de Aceptacion
Escenario de Pago 1: PENDIENTE El sistema notifica que le paciente debe abonar cargos previo a su atención asistencial Se envian los correspondientes cargos al modulo Caja de ODI Entonces el sistema muestra el estado "Pendiente" Escenario de Pago 2: PAGADO El paciente genera el pago correspondiente El cajero o admisionista, registra el pago en el sistema y se emiten los comprobantes El estado del Pago queda cerrado como PAGADO

## Azure Tasks
- Task 15420: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 15421: Escritura HU | Estado: Done
 - Asignado a: Martin Casey



