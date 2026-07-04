# HU 11762 - Buscador/Selector de prácticas individuales

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11699_SOLICITUD-DE-PRA-CTICAS
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11762/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como usuario efector medico 

Quiero poder buscar y agregar prácticas médicas utilizando texto predictivo 

Para poder seleccionar la o las prácticas que necesito indicar al paciente moviéndolas
a la ventana ubicada a la derecha y agregar si fuera necesario una observación 

 

Esta ventana tiene origen en la HU 11754 

 

 

- Desde la caja de la izquierda se busca y selecciona la practica. 
- Con los botones centrales se incluye desde o se quita de la caja izquierda 
- Al mover la primer practica, se abre un modal en el que se indica la fecha en la que se realiza la solicitud (actual o posterior)(defualt: hoy) 
- Luego debajo de cada fecha se listan las prácticas solicitadas 
 Para crear una solicitud de estudios con fecha posterior: HU 11761
 Al finalizar en la evolución, junto al boton "Solicitar estudios" se muestra la cantidad de estudios solicitados.
 

 

 

 

 

 

 

 
 
 

Importante: 

Las prácticas solicitadas
junto a sus observaciones solo se guardan en la historia clínica del paciente
luego de validar que el mismo tenga mínimo una evolución y un problema
cargado. 

De lo contrario se
eliminan las practicas previamente seleccionadas. 

 

En la esquina derecha se encuentra una una ventana que se minimiza y se abre (ventana flotante) para que pueda acceder a la evolucion 
 

Se puede agregar una observacion para cada practica y crear distintas ordenes con distinta fecha. Ver HU 11763 

 

 
 https://xd.adobe.com/view/2a24d113-641d-482c-a8ab-9827e745e82f-7f77/

## Azure Criterios de Aceptacion
- El texto predictivo debe listar las prácticas que coincidan con los 3 primeros caracteres ingresados. 
- La selección podrá ser individual o múltiple. 
- La flecha para mover una practica de una caja a otra se habilita solo cuando se haya seleccionado una practica en la caja izquierda previamente. 
- Las practicas pueden moverse de la ventana derecha a izquierda según la necesidad. En la ventana derecha quedan las practicas que serán solicitadas. 
- No puede repetirse una practica para la misma fecha.
 
- La fecha tiene que ser igual o mayor a la actual 
- El botón para guardar fecha se habilita solo cuando se cargue una fecha igual o posterior a la actual

## Azure Tasks
- Task 15611: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15688: AF - Analisis y escritura | Estado: Done
 - Asignado a: Natalia Inés Thomas



