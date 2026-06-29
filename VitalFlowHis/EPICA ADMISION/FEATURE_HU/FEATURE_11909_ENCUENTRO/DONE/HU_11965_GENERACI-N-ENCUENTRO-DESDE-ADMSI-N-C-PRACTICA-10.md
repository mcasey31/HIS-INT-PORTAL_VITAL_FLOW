# HU 11965 - Generación Encuentro Desde Admsión c/Practica 100% convenida

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11909_ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11965/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Sistema de Gestión de Admisiones
Quiero: Crear automáticamente un "Encuentro"
Para: Que el profesional pueda registrar la atención al paciente una vez finalizado el proceso de admisión 

 
 Descripción 

 Una vez que el paciente ha completado exitosamente el proceso de admisión, que incluye la validación de la documentación y, en este escenario los cargos son generados en su totalidad al financiador según la oportuna consulta a convenios, HU: ITEM 14041 el sistema deberá crear automáticamente un Encuentro. 

El paciente quedará en un estado de "En sala de espera" y quedará disponible para que el profesional de la salud, desde su agenda, pueda seleccionarlo, permitiendole comenzar la correspondiente atención clinica. 

Este Encuentro estará asociado al paciente y se informarán los siguientes datos: 

 

- Creación del Id (encuentro) 
- Datos del paciente 
- Datos de Profesional asignado (*) 
- Fecha y Hora 
- Centro 
- Lugar de Atención 
- Servicio - Unidad Organizativa 
 

 

El Encuentro debe ser creado solo cuando: 

- El paciente tenga un turno activo y válido ya sea programado o espontaneo 

 
- La admisión esté en estado Confirmada/Admitido OK, es decir que el paciente haya quedado en "Sala de Espera" 

 
- La documentación requerida haya sido completada y validada. 

 
- El pago de la consulta haya sido registrado (en aquellos casos que corresponda) 

 
- Se debe cambiar el Turno programado con el que se inicio la admision a estado CONSUMIDO 

 
 
 (*) Por proceso de admision, al momento de crear un encuentro se puede o no, tener los datos de profesional. Existen escenarios en donde el paciente se envia a un grupo de profesionales y hasta su asignacion (llamada del profesional) no se cuente con ese dato, proceso que se explicará en la HU (ITEM 14346) 
 El estado del encuentro una vez creado debera quedar "Abierto". Ver HU

 
 https://xd.adobe.com/view/9823f0d6-1183-4c05-9109-07e322cd6935-cd70/

## Azure Criterios de Aceptacion
- El Encuentro se crea automáticamente cuando la admisión del paciente se finaliza exitosamente. 
- El Encuentro queda vinculado al turno específico del paciente. 
- El profesional puede ver en su agenda el paciente con estado "En sala de espera" y con Encuentro disponible para iniciar. 
- Si la admisión no está completa (documentación o pago pendiente), el sistema no genera el Encuentro. 
- El sistema debe registrar la fecha y hora de creación del Encuentro. 
- Una vez generado el encuentro, el estado del Turno con el que se inicio y confirmo la admision debe quedar en Consumido

## Azure Tasks
- Bug 17411: QA - No mantiene paciente al en la grilla al CONFIRMAR ADMISI "N | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16724: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15590: QA-Ejecución de casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13494: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15625: Crear estructura en DB | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 14202: RE-ANALISIS | Estado: To Do
 - Asignado a: Martin Casey
- Task 13658: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 15589: QA-Diseño de casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13659: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Task 16879: BD - Creacion tabla encuentros QA | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 17436: QA - Al "Admitir paciente programado" agrega una práctica nueva al retroceder la pagina | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15570: FE - Integración EP Confirmar Admision | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16352: BE - Confirmar admisión | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 16708: Error en trigger | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina



