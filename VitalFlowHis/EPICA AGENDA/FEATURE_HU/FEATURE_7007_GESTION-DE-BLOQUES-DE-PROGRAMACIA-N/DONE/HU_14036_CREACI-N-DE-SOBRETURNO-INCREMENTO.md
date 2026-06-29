# HU 14036 - Creación de sobreturno (incremento)

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14036/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas Quiero: generar sobreturnos Para: contar con turnos disponibles ante situaciones extraordinarias 
 Descripción y comportamiento 
 Este desarrollo incrementa la funcionalidad ya implementada en la HU (Product Backlog Item 7027: Agregar Bloques de programación fija) Al generar la disponibilidad horaria a partir de una configuración de bloque, se deben incluir slots de tipo "ST" (según lo definido en la HU Product Backlog Item 15393: Tipos de slot) .

Estos slots de sobreturno: 

- No tienen horario de inicio ni fin asignado. 

 
- Mantienen la duración configurada en la definición del bloque. 

 
- Quedan disponibles únicamente para usuarios que cuenten con el permiso para otorgar sobreturnos, según su perfil. 

 
 
 
 Pantalla https://xd.adobe.com/view/d9f0a031-ef2c-4606-931b-9cbba4bcc320-8ca3/

## Azure Criterios de Aceptacion
- Generar slot de tipo "ST" 
- Generar slot sin horario de inicio y fin 
- Generar slot de duración correlativa a la definición del bloque de programación

## Azure Tasks
- Task 15154: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15382: Escritura de HU | Estado: Done
 - Asignado a: Natalia Gorriti
- Bug 22559: QA - No se visualiza turnos ni sobreturnos al crear bloques de programacion | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 23091: FE - Modificar consultas a la pantalla de Turnos. Agregar rangos | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15380: Analisis funcional | Estado: Done
 - Asignado a: Natalia Gorriti
- Task 17347: QA - No se permite guardar bloque - campo requerido idFrecuenciaSemanaMes | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16092: DS - Diseño | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 15422: UX - Corrección mockups | Estado: Done
 - Asignado a: Julieta Victoria Viscarra
- Task 17630: FE - Integracion de la modificacion | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16095: DB - Modificar sp que crea los slots | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16139: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23092: DG - Modificar interfaces. Agregar rangos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 16138: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 23093: BE - Modificar filtro fecha para evaluar desde/hasta como timestamptz | Estado: Done
 - Asignado a: Tomas Goncalves



