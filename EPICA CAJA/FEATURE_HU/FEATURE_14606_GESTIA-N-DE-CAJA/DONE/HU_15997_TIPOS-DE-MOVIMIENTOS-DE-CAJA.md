# HU 15997 - Tipos de Movimientos de Caja

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14606_GESTIA-N-DE-CAJA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15997/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Administrador de caja 

Quiero: Crear la tabla de tipos de movimientos de la caja. Para: Tener identificado los tipos de movimientos que debe realizarse en un caja. 

 

 

Descripción y comportamiento: Se requiere crear la tabla de tipos de movimientos de una caja, para poder clasificar e identificar de que evento se generó y su clasificación. 
 

 

Los tipos y clasificación de los movimientos a registrar en la tabla son: 

 

TIPOS DE MOVIMIENTOS CLASE DE MOVIMIENTO CONCEPTO
 

1) Cobro Ingreso Cobro por atención 

2) Fondo Inicial Ingreso Apertura de Caja
 

3) Retiro por rendición Egreso Cierre de Caja 4) Ajuste de Apertura Ajuste Ajuste de Apertura 
5) Ajuste de Cierre Ajuste Ajuste de Cierre 
 6) Retiro Egreso -- 
 
 Identificación de los evento que genera cada tipo de movimiento:

 1) Cobro: este tipo de movimiento se genera desde "Evento cobro a privado" HU: 4040, 2) Fondo Inicial: este tipo de movimiento se genera desde el fondo inicial de la "Apertura de Caja" HU: 4348 

3) Retiro por Rendición: este tipo de movimiento se genera desde el retiro por rendición "Cierre de Caja" HU:14350 

4) Ajuste de Apertura: este tipo de movimiento se genera desde "Apertura de Caja" HU:14355 

5) Ajuste de Cierre: este tipo de movimiento se genera desde "Cierre de Caja" HU:14355 

6) Retiro Parcial: este tipo de movimiento se genera desde HU: ITEM 17720

## Azure Criterios de Aceptacion
- La tabla de identificar el tipo de movimiento, clasificación y evento que lo genera. 
- Los tipos de movimientos que tengan conceptos definidos deben registrase ese concepto por defecto al generar un movimiento.

## Azure Tasks
- Task 16001: Análisis y Escritura Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



