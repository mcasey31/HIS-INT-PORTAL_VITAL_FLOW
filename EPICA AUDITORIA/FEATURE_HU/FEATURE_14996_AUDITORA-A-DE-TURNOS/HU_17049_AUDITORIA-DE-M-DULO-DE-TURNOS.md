# HU 17049 - Auditoria de módulo de turnos

## Trazabilidad
- Epic: EPICA AUDITORIA
- Feature: FEATURE_14996_AUDITORA-A-DE-TURNOS
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17049/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de sistema Quiero: Dejar registro de todas las creaciones y anulaciones de turnos Para: Poder registrar un tracking de auditoria al módulo de turnos 
 Descripción y comportamiento: Para llevar a cabo una auditoria del módulo de turnos, es necesario un registro de las acciones realizadas por los usuarios, específicamente en la creación y anulación de turnos. Para ello, se tendrán en cuenta los siguientes datos: 
 - Usuario que crea el turno (id, nombre completo) 
- Usuario que anula el turno (id, nombre completo) 
- Rol 
- Centro 
- Fecha y hora (tanto para creación como anulación del turno) 
- Paciente 
- Profesional 
- Especialidad 
- Practica/s 
- Fecha y hora del turno 
- IP 
- Estado (creado-anulado)

## Azure Criterios de Aceptacion
Los registros deben ser inmutables (no editables ni borrables)  
Se debe garantizar el almacenamiento seguro y periódico de estos registros. 
Se debe establecer un plazo mínimo de conservación (por ejemplo, 2 o 5 años, según normativas). 
Solo usuarios autorizados deben poder consultar los registros.

## Azure Tasks
- Task 17556: Análisis funcional y escritura | Estado: In Progress
  - Asignado a: Sebastian Hernandez Garandan


