# HU 15377 - Generador de eventos de cobro al admitir un paciente

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15377/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Generar evento de cobro al admitir un paciente Para: Emitir una orden de cobro a facturación y/o a caja. 

 

Descripción y comportamiento: 

En base a la respuesta del servicio de convenio HU Product Backlog Item 11917: Consulta al módulo de convenio desde admisión y HU: Product Backlog Item 14504: Especificación técnica integración al módulo convenio. Se generara tres posibles escenarios : 

 

1) En el primer escenario: Prácticas 100% convenidas. 

 En este caso debe generarse un evento de cobro al módulo de facturación, citando la HU Product Backlog Item 14041: Evento de cobro al módulo facturación para generar cargos al financiador 

 

 

2) En segundo escenario: Prácticas No convenidas. Evento a cobro Privado Particular. 

 Para este escenario, cuando las practicas no están convenidas, se debe realizar un cambio de financiador a privado particular, citando la HU Product Backlog Item 12996: Verificación de Elegibilidad de Forma Manual Según Financiador Plan Asociado a Paciente. 

 En este caso debe generarse un evento de cobro a caja, citando la HU Product Backlog Item 14040: Evento cobro a privado 

 En este evento se envían las prácticas con el respectivo valor a pagar para poder realizar la admisión. 

 

 

3) En el tercer escenario: Prácticas financiadas parte por financiador y parte por paciente de forma privada. 

 En este caso se deben generar dos eventos de cobros de manera simultanea. 

 1) El primero al evento de facturación citando a la HU Product Backlog Item 14041: Evento de cobro al módulo facturación para generar cargos al financiador. 

 2) El segundo evento se envía a caja citando a la HU Product Backlog Item 14040: Evento cobro a privado.

## Azure Criterios de Aceptacion
- Se debe generar algunos de los tres escenarios como evento de cobro.

## Azure Tasks
- Task 15424: Análisis, diseño y escritura funcional. | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



