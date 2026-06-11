# HU 11205 - Copiar Agenda

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7005_GESTION-DE-AGENDA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11205/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Tasks Front relevantes (Azure)
- Task 16177: FE modal Copiar Agenda.
- Bug 16867: Diferencia en menu contextual vs mockup al copiar.

## Pantalla objetivo para mock
- Pantalla: Modal Copiar Agenda.
- Componentes: codigo/nombre destino, rango de fechas, confirmacion, acceso desde menu contextual de la agenda.

## Azure Descripcion
Como: Gestor de agendas. Quiero: Copiar una agenda del profesional/grupo profesional/dispositivo Para: Duplicar la configuración de una agenda que haya estado operativa. 

 Descripción y comportamiento: 
 Marco conceptual: El proceso de copiar agenda consiste en tomar los datos de una agenda finalizada. Depende del módulo de gestión de agendas y su función principal es utilizar la información de la agenda seleccionada como unput, para crear una nueva agenda.
 Desarrollo de la HU: Desde el menú contextual o desde la ventana de detalles de la gestión de agendas, debe existir una opción para copiar la configuración de una agenda que haya estado operativa y que tenga los bloques de programación configurados, es importante que esta agenda esté en estado (Finalizada), como se muestra a continuación. 
 
 
 
 Esta acción creará una nueva agenda con características similares a los atributos copiados, excepto en los campos que se mencionan a continuación. 
 Datos a renombrar y/o alterar: - Nombre de agenda: (*) (tipo texto de 70 caracteres), por defecto debe venir el nombre de la agenda copiada + copia1, editable. Ejemplo: Nombre_de_agenda_copia1 
- Fecha desde: (*) (Fecha dd/mm/aaaa) - editable 
- Fecha hasta: (Fecha dd/mm/aaaa) - editable 
- Bloque(s) de programación: (*) Se debe permitir seleccionar que bloque se debe copiar, así dejar los horarios que realmente se requieran en la nueva agenda, se debe indicar a cada bloque la fecha desde y la fecha hasta. Al crear la nueva agenda, se deben crear los slot hasta la fecha asignada al bloque y se deben copiar las prácticas de cada bloque y sus reglas de cupos en caso de existir. 
 
 
 Antes de confirmar la copia de la agenda, es
importante revisar los atributos copiados para validar que la creación de la
nueva agenda para el profesional en el servicio y centro seleccionados sea
correcta, esto se puede verificar en la imagen que se muestra a continuación. 
 
 
 Al confirmar el copiado de la agenda, se debe generar un mensaje de proceso exitoso en un tooltip como se muestra a continuación. 
 
 
 
 Nota: (*) datos de carácter obligatorio Se considera una agenda operativa aquella que cuenta con su configuración completa, incluyendo definiciones de datos básicos, bloques, slots creados y sus respectivas prácticas; Además, debe haber gestionado turnos para pacientes en su estado vigente. 
 
 https://xd.adobe.com/view/ba84e288-aec7-4817-b511-07fcb5995bdb-efd7/screen/e8f53cf7-4c06-482b-b7d8-281d8a164859/

## Azure Criterios de Aceptacion
- Para poder copiar una agenda, esta debe estar en estado finalizada e inactivo. 
- Para copiar una agenda, esta debe haber estado configurada con los respectivos bloque(s) de programación configurados y sus prácticas médicas. 
 
- Se puede copiar una agenda al profesional, en el mismo servicio y centro médico donde a estado operativa dicha agenda.

## Azure Tasks
- Task 16720: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13086: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16140: QA - Diseño de Casos de Pruebaa | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16192: FE - Integrar Confirmar Copia | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11288: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16193: FE - Redirigir a la Copia ya para editar y mostrar lo creado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16158: BE - Copiar Agenda | Estado: Done
 - Asignado a: Leandro Andres Anadon
- Task 16177: FE - Modal Copiar Agenda | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16141: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 11287: Analisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 15423: Ajustes HU | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Bug 16867: QA - Copiar Agenda - Menu Contextual, diferencia con el Mockup | Estado: Done
 - Asignado a: Alfonso Oscar Koike



