# HU 11775 - Validación de registro mínimo de información asociada al cierre del encuentro

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11703_FINALIZACIA-N-DEL-ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11775/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Sistema de control de información 

Quiero: validar información mínima asociada a una atención al momento de
salir de un encuentro o enviar a un paciente en Observación 

Para: asegurarme el registro adecuado de información clínica mínima 

 

Descripción: 

Al salir de un encuentro, el profesional de salud puede: 

1 - Cerrar
el encuentro 

2 - ?oenviar a Observación ? (para luego volver a llamarlo y
finalizar el encuentro.) 

Ref: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11774 

 

 Para ambos casos (1 y 2) , antes de salir del encuentro se deben
verificar lo siguiente: 

- La evolución del encuentro debe tener MINIMO UNA ETIQUETA
dentro de la caja ?oProblemas ? 
 - La evolución del encuentro debe tener TEXTO dentro de la caja
 ?oTexto de evolución ? 
 En caso de que no se cumplan los requisitos se muestra el siguiente mensaje 
 
 
 

Ref: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11750 

Ref: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11751 

 

 

 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/8c1318a2-035e-465f-beac-257ba8bbd1f2/

## Azure Criterios de Aceptacion
- La evolución del encuentro debe tener MINIMO UNA ETIQUETA dentro de la caja ?oProblemas ? 
- La evolución del encuentro debe tener TEXTO dentro de la caja ?oTexto de evolución ? 
- El boton guardar se habilita cuando se hayan agregando etiquetas y texto

## Azure Tasks
- Task 14541: AF - Analisis funcional y escritura | Estado: In Progress
 - Asignado a: Natalia Inés Thomas



