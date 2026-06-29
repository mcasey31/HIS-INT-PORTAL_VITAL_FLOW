# HU 14981 - Validación de consultorio al crear un bloque de programacion

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14981/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas Quiero: Tener control de la asignación del lugar de atención Para: evitar solapamiento de profesionales asistencial 
 Descripción y comportamiento 
 Al agregar o editar un bloque de programación, se debe validar que el lugar de atención seleccionado no esté ocupado por otro bloque activo de otro profesional. Para ello, se debe verificar si en el mismo centro, día y horario existe una superposición y coincidencia en el lugar de atención. En caso de conflicto, se debe mostrar un mensaje informativo.
 
 
 
 
 
 https://xd.adobe.com/view/a4b6825b-0469-4a3f-9a1f-f8ea0c6d4b48-f1e5/screen/f42f6490-acc3-4a35-adf4-6f334e95423c/

## Azure Criterios de Aceptacion
- Al momento de guardar la configuración se debe validar 
- Si la validación no se cumple se debe mostrar el mensaje

## Azure Tasks
- Task 17035: BE - Validar consultorio bloque programacion - modificar | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 15360: Análisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 17056: QA - Al querer ingresar un lugar de atencion manualmente da error | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 17006: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 17005: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16430: DT - interfaces | Estado: In Progress
 - Asignado a: German Facundo Skrobak
- Task 17123: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17034: BE - Validar consultorio bloque programacion - crear | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16950: FE - Agregar validaciones claves. | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15359: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti



