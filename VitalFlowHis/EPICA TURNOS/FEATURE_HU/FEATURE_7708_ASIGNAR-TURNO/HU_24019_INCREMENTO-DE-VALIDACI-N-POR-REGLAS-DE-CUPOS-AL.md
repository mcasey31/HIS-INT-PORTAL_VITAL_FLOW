# HU 24019 - Incremento de validación por reglas de cupos al buscar disponibilidad horaria para asignar turnos

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/24019/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: Incrementar la validación con reglas de cupos en una búsqueda de horarios disponibles Para: No mostrar en el calendario los horarios restrigidos de acuerdo a la reglas definida en el bloque. Descripción y comportamiento: Se requiere incrementar en la HU ITEM 9743, una funcionabilidad para validar en la busqueda y asignación de turno a un paciente, de acuerdo a la incorporación de reglas de cupos en el bloque de programación ITEM 11062. 
 Al agregar las reglas de cupos en el bloque de programación de una agenda, se pueden establecer dos criterios a la búsqueda de acuerdo a la condición que se le defina por cada regla. Estos criterios son: Financiadores y Planes que esten "SOLO HABILITADOS" o que esten "NO HABILITADO". 
 Una vez aplicada la búsqueda desarrollada en la HU ITEM 9743, y esta encuentre horarios disponibles, se debe buscar si esos bloques de programación que arrojaron resultados, tienen alguna regla definida. En caso de ser positivo se debe validar esas reglas contra los criterios del convenio del paciente; de existir se puede presentar los dos caso antes mencionados. Ver comportamiento de la validación: 
 Estos dos escenario no pueden convivir uno con el otro en el mismo bloque, hay reglas con "Solo habilitado" o reglas con "No habilitados" 
 En el caso que existentan Financiadores y Planes "Solo habilitado", se debe validar si el financiador y plan del paciente coincide con la(s) regla(s) definida en el bloque, si coinciden, SE DEBE mostrar las opciones horarias y se permite la asigación del turnos al paciente. En el caso que el financiador y plan del paciente NO coincida con los Financiadores y Planes de las reglas definidas, no se debe mostrar los turnos encontrados en la calendario, o sea, no se podrán asignar. 
 
 En el caso que existentan Financiadores y Planes "No habilitados", se debe validar si el financiador y plan del paciente coincide con la(s) regla(s) definida en el bloque, si coinciden, NO SE DEBE mostrar los turnos encontrados en el calendario, o sea, no se podrán asignar. En el caso que el financiador y plan del paciente NO coincida con los Financiadores y Planes de las reglas definidas, se debe mostrar las opciones horarias y se permite la asigación del turnos al paciente.

## Azure Criterios de Aceptacion
- Al consultar las diosponibilidaees horarias, se debe verificar si los bloques de programación con resultados tienen reglas definidas. 
- Si los bloques tienen reglas definidas, se debe validar según la condición de la regla y el financiador y plan del paciente. En caso de encontrar restriciones, las acciones a realizar es no mostrar los horarios encontrados en el calendario.

## Azure Tasks
- Task 24020: Analisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 24023: UX - Diseño de mockup | Estado: In Progress
 - Asignado a: Melanie Garcia



