# HU 14961 - Estados de Encuentro

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11909_ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14961/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Sistema de Gestión de Admisiones 

 

Quiero: Crear automáticamente un "Encuentro"Para: Que el profesional pueda registrar la atención al paciente una vez finalizado el proceso de admisión 

 Descripción El estado del Encuentro puede ser: 
 1) Abierto: 
 Al momento de la creación del encuentro (ver HU BACKLOG ITEM 11965) el estado del encuentro que es generado en la admisión debe quedar con estado "Abierto" 2) Cerrado: Caso 2A) Se genero la atención correspondiente del paciente: El encuentro debe ser cerrado por el profesional de la salud una vez que concluya la atención medica del paciente y este haya sido evolucionado. Caso 2B) Pueden darse casos en los cuales, el paciente haya sido admisionado, pero nunca se genero la atención médica, ej. el paciente se canso de esperar. En esos casos los estados de los pacientes siempren deben finalizar como: Atendido --> El profesional atendió al paciente y cerro el encuentro, Caso 2A. 
No Atendido --> El profesional nunca atendio el paciente, en ese estado el encuentro debe pasar a Cerrado (sin evolución), Caso 2B.

## Azure Criterios de Aceptacion
Una vez creado el encuentro siempre el estado debe quedar Abierto 
En ambito Ambulatorio un Encuentro no puede quedar abierto por más de 24 hs 
En caso de que un encuentro ambulatorio permanezca abierto por más de 24 hs se debera correr un Job del sistema que actualice el estado o debera accionarse el cambio de estado a cerrado de manera manual, por proceso operativo.

## Azure Tasks
- Task 14963: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Task 14962: AF | Estado: Done
 - Asignado a: Martin Casey



