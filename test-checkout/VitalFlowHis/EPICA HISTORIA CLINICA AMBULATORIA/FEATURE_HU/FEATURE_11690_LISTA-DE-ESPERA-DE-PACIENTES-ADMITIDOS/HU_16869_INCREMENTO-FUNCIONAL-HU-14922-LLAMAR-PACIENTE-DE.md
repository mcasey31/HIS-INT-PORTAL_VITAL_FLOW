# HU 16869 - Incremento Funcional HU 14922 - Llamar Paciente desde su Listado al Lugar de Atención (megáfono)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/16869/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como usuario medico efector Quiero llamar a un paciente desde la opcion del megafono Para recibir una alerta si hay otro paciente en atención 
 DESCRIPCION 
 Llamada del paciente. HU https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14922
 Esta HU es el incremento funcional de la HU 14922 en el cual, por algun motivo el profesional de la salud puede salir de la pantalla, se le puede caer el sistema cuando ya tiene un paciente en consultorio. 
 En base a esta problematica, se necesita desarrollar una validacion, para que en el caso de que ya exista una persona en estado "en consultorio" no pueda volver a llamar a un paciente y en el pop up se muestre el mensaje del paciente que ya esta en consultorio como para volver a seleccionarlo e ir a su Historia Clinica.

## Azure Criterios de Aceptacion
No se puede llamar a un paciente nuevo si existe otro en estado "En atención"

## Azure Tasks
- Task 17271: AF - Análisis y escritura | Estado: Done
 - Asignado a: Natalia Inés Thomas
- Task 17032: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



