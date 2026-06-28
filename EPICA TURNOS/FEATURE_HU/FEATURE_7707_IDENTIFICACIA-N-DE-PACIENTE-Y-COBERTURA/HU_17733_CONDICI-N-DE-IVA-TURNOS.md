# HU 17733 - Condición de IVA (turnos)

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7707_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17733/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: Indicar condición de IVA Para: Completar asignación de turno y posterior facturación 
 Descripción y comportamiento: Al momento de asignar un turno y cargarle al paciente una combinación de financiador+plan (ITEM 9851) el sistema deberá realizar una consulta al módulo de convenios, y devolver la condición de IVA (exento, gravado) (campo t_planes_tipos_iva) para poder realizar posteriormente la facturación. Si la respuesta es por una de las dos condiciones, esta deberá venir seleccionada (pantalla 1) y no le permitirá al usuario modificarla. Para los casos en que el plan aplique a ambas condiciones (exento/gravado) será el usuario quien lo determine por proceso y será un dato obligatorio a completar. (pantalla 2) 
 
 Pantalla 1 
 
 
 Pantalla 2 El usuario es quien debe seleccionar entre una de las dos condiciones 
 
 Una vez agregada la condición, los datos del financiador se mostrarán como se indica en la siguiente pantalla, y el usuario podrá continuar con la asignación del turno. 
 
 
 
 
 
 Link de pantallas https://xd.adobe.com/view/d694211b-4404-4344-846c-a97118f2e47e-83c7/

## Azure Criterios de Aceptacion
- La condición se determinará con un radiobutton de única selección. 
- Si la consulta nos devuelve una única condición, los botones permanecerán grisados. 
- Si el convenio nos devuelve más de una condición, el dato a completar por el usuario será obligatorio.
 
- La consulta a convenios se realizará al momento de agregarle un plan al financiador.

## Azure Tasks
- Task 17734: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



