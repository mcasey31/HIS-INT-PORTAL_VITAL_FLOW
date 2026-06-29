# HU 17737 - Condición de IVA (admisión)

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11891_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17737/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión Quiero: Indicar condición de IVA Para: Realizar admisión y posterior facturación 
 Descripción y comportamiento: (ITEM 12996) Al seleccionar una combinación de financiador+plan desde el módulo de admisión, el sistema deberá realizar una consulta al módulo de convenios, y devolver la condición de IVA para el plan seleccionado (exento, gravado) (campo t_planes_tipos_iva) para poder realizar posteriormente la facturación. Si la respuesta es por una de las dos condiciones, esta deberá venir seleccionada (pantalla 1) y no le permitirá al usuario modificarla. Para los casos en que el plan aplique a ambas condiciones (exento/gravado) será el usuario quien lo determine por proceso y será un dato obligatorio a completar. (pantalla 2) 
 Pantalla 1 
 
 
 Pantalla 2, selección de IVA por proceso 
 
 
 Una vez agregada la condición, los datos del financiador se mostrarán como se indica en la siguiente pantalla, y el usuario podrá continuar con la admisión del paciente.
 
 
 
 
 
 
 Link de pantallas https://xd.adobe.com/view/70139135-9a33-436d-81ad-44bf851fc8b7-2540/screen/2351239f-b472-44da-a7f5-ac13e7b82475/

## Azure Criterios de Aceptacion
La condición se determinará con un radiobutton de única selección. 
Si la consulta nos devuelve una única condición, los botones permanecerán grisados. 
Si el convenio nos devuelve más de una condición, el dato a completar por el usuario será obligatorio. 
La consulta a convenios se realizará al momento de agregarle un plan al financiado

## Azure Tasks
- Task 23534: Análisis y escritura | Estado: In Progress
 - Asignado a: Sebastian Hernandez Garandan
- Task 17739: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



