# HU 11774 - Finalización del encuentro asistencial

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11703_FINALIZACIA-N-DEL-ENCUENTRO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11774/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Profesional asistencial Quiero: finalizar el encuentro actual Para: terminar mi encuentro con este paciente y poder atender otro paciente o terminar mis tareas asistenciales 
 Descripción y comportamiento: Una vez seleccionado el botón "Salir" desde la cabecera del encuentro (ITEM 11736) se habilitará un modal con las siguientes opciones: 
 
 
 
 Cerrar encuentro: Dará por finalizado el encuentro, para que esto se dé, el estado del paciente deberá ser "En atención" y deberá validar que tenga una evolución creada. El estado del paciente pasará a "Atendido". 
 Enviar a observación: Solo se podrá asignar este estado, si el paciente está en atención. El paciente en observación podrá ser llamado nuevamente. El sistema deberá validar que se haya registrado una evolución y la carga de al menos una etiqueta. (ITEM 11775)
 
 Enviar a lista de espera: deberá estar en atención, y cambiará el estado a sala de espera (se podrá llamar nuevamente). 
 No atendido: El estado del paciente podrá ser "En atención" o con estado "En sala de espera". Se podrá cerrar el encuentro y el estado del paciente pasará a "No atendido". 
 
 Nota: El estado del paciente será "En atención" luego de ser llamado por el llamador. 
 
 
 Product Backlog Item 12285: Estados de Pacientes
 
 Product Backlog Item 14961: Estados de Encuentro 
 Product Backlog Item 14346: Actualizacion Encuentro
 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/8c1318a2-035e-465f-beac-257ba8bbd1f2/

## Azure Criterios de Aceptacion
- El modal contendrá botones "radio button" de única selección. 
- El botón "Si, salir" permanecerá inhabilitado hasta que se seleccione alguna de las opciones. 
- El estado del encuentro permanecerá abierto, cuando se seleccionen "Enviar a lista de espera" o "Enviar a observación"

## Azure Tasks
- Test Case 16386: QA - Validar que el paciente pueda ser llamado nuevamente cuando se encuentre en estado "En observación" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16387: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16383: QA - Validar que el estado del paciente sea "En espera" al enviar a lista de espera | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16377: QA - Validar que al abrir el modal "¿Qué acción deseas realizar con el paciente XXX?" los radio buttons se muestran en estado no seleccionado por defecto | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16606: BD - Agregar tabla Foranea | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Bug 17574: QA - Finalización del encuentro asistencial ?" Al elegir una opción en el modal (a través de un radio button), las opciones restantes siguen activas, permitiendo su selección | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17591: QA - Finalización del encuentro asistencial ?" El modal tiene una palabra en inglés - Dice "action", debe decir "acción" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17358: QA - Finalización del encuentro asistencial - Al llamar nuevamente a un paciente previamente atendido, cuyo estado actual es "En sala de espera", se emite mensaje de error: "Error al llamar paciente" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16436: FE - Integrar endpoint finalizar encuentro | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 14516: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Bug 22545: QA - Finalización del encuentro asistencial ?" Al confirmar la opción "Cerrar encuentro", se emite mensaje de error: ?oERROR.HTTP.ADS_ENCUENTROS_EVOLUCION_NO_EXISTE ? | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16372: QA - Validar la opción "Enviar a observación" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17473: QA - Finalización del encuentro asistencial ?" No atendido - El toast de información que se muestra no coincide con el definido en el mockup. Dice "Encuentro finalizado con éxito.", debe decir "Se cambió el estado del encuentro a No atendido" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16370: QA - Validar la opción "Cerrar encuentro" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 15342: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Test Case 16380: QA - Validar que el estado del paciente sea "En atención" luego de ser llamado por el llamador | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16218: FE - Crear Modal finalizar encuentro | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Bug 17736: QA - Finalización del encuentro asistencial ?" Al elegir una opción en el modal (a través de un radio button), la línea y el color del fondo difiere del mock up; aparece en color blanco, debería ser de color celeste | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17391: QA - Finalización del encuentro asistencial- No se habilita la opción "Cerrar encuentro" del modal ?o¿Qué acción deseas realizar con el paciente XXX?", cuando el paciente está "En Atención" y con una evolución registrada | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 17656: FE - Integrar endpoint validar evolucion - QA | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Test Case 16385: QA - Validar que el paciente pueda ser llamado nuevamente cuando se encuentre en estado "En espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16382: QA - Validar que el estado del paciente sea "En observación" al enviar a observación | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16371: QA - Validar la opción "Enviar a la lista de espera" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 22810: QA - Finalización del encuentro asistencial - En el estado "En observación", la primera letra de la palabra "observación" aparece en mayúscula; debe mostrarse en minúscula | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16503: DT - Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16709: DT - Modificacion interface | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16495: BE - Endpoint finalizarEncuentro/ads-u-encuentros | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 16368: QA - Validar el botón "SALIR" desde la cabecera del encuentro | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16379: QA - Validar que al seleccionar una opción del modal "¿Qué acción deseas realizar con el paciente XXX?" el resto permanezcan activas | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16324: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16378: QA - Validar que los radio buttons del modal "¿Qué acción deseas realizar con el paciente XXX?" sean de única selección | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16373: QA - Validar la opción "No atendido" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16439: FE-Integrar con landing | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 16236: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16369: QA - Validar el modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17206: QA - Finalización del encuentro asistencial- botón "SALIR" - No se abre el modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16176: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 21525: QA - Finalización del encuentro asistencial ?" Al confirmar la opción "Cerrar encuentro", se emite mensaje de error: "Error en el servidor" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16374: QA - Validar el botón "CANCELAR" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17433: QA - Finalización del encuentro asistencial - La agenda se duplica para las fechas pasadas y futuras, lo que impide visualizar correctamente la agenda real del profesional | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17441: QA - Finalización del encuentro asistencial - Enviar a lista de espera - El toast de información que se muestra no coincide con el definido en el mockup. Dice "Encuentro finalizado con éxito.", debe decir "Se envió el paciente a lista de espera" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16235: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16375: QA - Validar el botón "CONFIRMAR" del modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16381: QA - Validar que el estado del paciente sea "Atendido" al cerrar el encuentro | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17355: QA - Finalización del encuentro asistencial - Enviar a lista de espera - El toast de información se muestra con código de base datos | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 17560: BE - EP para validar si un paciente tiene almenos 1 evolución | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 22523: BD - Crear tabla federada en QA | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 17740: QA - Finalización del encuentro asistencial ?" Al ingresar desde el ícono HC con un paciente en estado ?oEn Atención ? , y al presionar el botón ?oSALIR ? , se muestra el modal con scroll, lo cual difiere del mock up | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16376: QA - Validar que el botón 'CONFIRMAR' permanezca deshabilitado mientras no se seleccione ninguna opción en el modal "¿Qué acción deseas realizar con el paciente XXX?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 22614: QA - Finalización del encuentro asistencial - Al abrir la agenda del profesional se emite el siguiente mensaje de error: "ERROR.HTTP.AGE_DETALLE_AGENDA_PROFESIONAL_FECHAVIGENCIAINICIO_REQUERIDO" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16384: QA - Validar que el estado del paciente sea "No atendido" cuando no fue atendido por el profesional | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 22598: QA - Finalización del encuentro asistencial - Al confirmar la opción "Enviar a observación", se emite el toast de información correctamente, pero no actualiza el estado del paciente "En observación" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder



