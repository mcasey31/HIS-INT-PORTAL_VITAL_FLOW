# HU 22907 - Integración a Receta Electronica OnLine (RECETARIO)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11691_PANORA-MICA-LANDING
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/22907/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Medico 

Quiero: Acceder a un sistema Recetario con el paciente seleccionado desde ODIPara: Generar Recetas Electronicas de forma online 

 Descripción y comportamiento: 

 

Existe un sistema denominado Recetario que ya se utiliza integrado desde el sistema Sistemas Clinico. Se requiere generar un boton desde la Landing Panoramica para acceder a este sistema 

 

 

 

Se necesita desarrollar un Boton desde la Landing Panoramica como se muestra desde el mockeUp denominado "Receta Digital". 

Al hacer clic en ese boton, se debe acceder al sistema RECETARIO (ver doc de integracion a API: https://docs.recetario.com.ar/doc-514171) 

 

 

Prototipo: 

https://xd.adobe.com/view/b03ff76e-750b-4c2b-881e-aebc3598d6da-e56c/

## Azure Criterios de Aceptacion
- Se debe poder acceder al sistema Recetario desde el Boton Receta Digital, unicamente con un paciente seleccionado (landing Panoramica) 
- Al acceder al nuevo sistema, el paciente seleccionado en ODI deben llegar los datos de dicho paciente al sistema de receta online 
- Se debe setear la misma configuracion y la misma forma de integracion que YA se utiliza desde Sistemas Clinicos

## Azure Tasks
- Task 23513: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 23514: Esc HU | Estado: Done
 - Asignado a: Martin Casey



