# HU 14362 - Parametrizacion por BBDD Estructura de Cajas por Centros (Datos Maestros)

## Trazabilidad
- Epic: EPICA CAJA
- Feature: FEATURE_14349_CAJA-CONVENIOS-PARAMETRIZACION-INTEGRACIONES
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14362/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: contar con la cabecera de información del paciente Para: Obtener datos relevantes que me permitan conocer su información 
 Descripción y comportamiento En el sistema de Gestión de Cajas, se podrá organizar jerárquicamente la estructura de caja de la siguiente manera: 

1. Asociación por Centro Cada Centro representa una unidad de negocio o establecimiento (ej. hospital, clínica, sucursal). 

- Cada centro podrá tener uno o varios Grupos de Cajas asociados según sus necesidades operativas. 

 
 2. Grupos de Cajas Los Grupos de Cajas permiten clasificar y organizar diferentes tipos de cajas que comparten un fin común (ej. Cajas de Consultorios, Cajas de Farmacia, Cajas Administrativas). 

- Cada grupo estará vinculado exclusivamente a un Centro. 

 
- Cada grupo podrá contener una o más Cajas asociadas. 

 
 3. Cajas Asociadas Cada Caja es una unidad operativa de cobro/registro y estará asociada a 1(uno) o más cajeros. 

- Una caja debe pertenecer a un único Grupo de Cajas. 

 
- Una caja solo puede estar activa y asociada a un UNICO cajero 

 
- Desde la administración, se podrá: (en el mvp solo por bb.dd., a futuro con pantallas de abm) 

- Asignar o desasignar cajas a un grupo 

 
- Activar o desactivar su operatividad 

 
- Visualizar los movimientos y reportes por grupo, por centro o por caja individual

## Azure Criterios de Aceptacion
- Una caja no podrá pertenecer a mas de 1 grupo de caja 
- Una caja puede estar asociada a N Cajeros pero solo 1 (un) cajero podra gestionarla (abrirla y cerrarla) a la vez.
 
- No se podra duplicar Grupos y/o Cajas por Centro, el sistema debe validar la duplicidad 
- Las cajas pueden tener 2 estados (abierta o cerrada) ver HU ITEM 14757

## Azure Tasks
- Task 14938: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 14939: Escritura HU | Estado: In Progress
 - Asignado a: Martin Casey
- Task 17551: BD - Configuracion de maestros - Caja | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 17275: DB - Crear tablas schema y primeras entidades | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina



