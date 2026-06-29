# HU 20271 - Incremento estados de pago y definición de colores de los estados

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14608_GESTION-DE-COBROS-PRIVADOS-FINANCIADOR
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/20271/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de caja 

Quiero: Requiero adicionar estados a los procesos de pagoPara: Gestionar distintos eventos en el proceso de pago. 

 Descripción y comportamiento: Se requiere adicionar a la base de datos de estados de pagos, a la HU ITEM 15419 Estados de Pagos, los siguientes estados de pago y su presepentación de colores para visualización en el frontend: 

 

 

 Estados para añadir: 

 

- Devolución : Estado que se aplicará a la devolución de pagos que ha pasado a estado Pagado 
- Rechazado : Estado que se aplicara a pagos relizados con medios de pagos electrónicos donde el emisor financiaron rechazo el pago. 
 
 

 Definición de color por estado Estado Color - Pendiente Gris 
- Pagado Verde 
- Devolución Naranja 
- Rechazado Rojo 
 
 Código de colores de fondo y texto.

## Azure Criterios de Aceptacion
- Sin criterios de aceptacion en Azure.

## Azure Tasks
- Task 20272: Analisis, diseño y escritura funcional | Estado: In Progress
 - Asignado a: Geroan Antonio Cadenas Alvarez



