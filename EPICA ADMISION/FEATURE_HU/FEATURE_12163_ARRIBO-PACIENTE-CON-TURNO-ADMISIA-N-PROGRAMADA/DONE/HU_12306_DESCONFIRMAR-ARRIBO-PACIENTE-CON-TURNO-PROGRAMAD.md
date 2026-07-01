# HU 12306 - Desconfirmar Arribo Paciente con Turno Programado - Practica 100% convenida

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_12163_ARRIBO-PACIENTE-CON-TURNO-ADMISIA-N-PROGRAMADA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12306/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario del sistema de admisión (administrativo o admisionista)
Quiero: Poder deshacer la acción que cambia el estado del paciente "En sala de espera"
Para: Volver al estado anterior "Programado" por si hubo alguna acción a corregir (UNDO) 
 Contexto funcional Dentro del proceso de admisión ambulatoria, el paciente comienza en estado "Programado", asociado a un turno previamente otorgado. Una vez que se completa la documentación y el paciente no debe realizar pagos (por cobertura total del financiador), el sistema permite pasar el estado del paciente a "En sala de espera", habilitando así la atención por parte del profesional, ver HU ITEM 11965. El estado del turno cambio tambien a estado "Consumido" 

Sin embargo, puede darse la necesidad de revertir ese cambio de estado (por ejemplo, si se detecta algun error, si la documentación no era válida, o si se requiere algun otro cambio). En este caso, el usuario necesita poder deshacer (UNDO) esa acción, devolviendo el estado del paciente a "Programado", sin perder la información previamente cargada. 

 El paciente, que quedó en Sala de Espera ya que se confirmo su llegada al centro y su admisión, mediante la acción "Volver a estado anterior" queda de nuevo en estado "Programado" y el estado del Turno debe cambiarse tambien a "Programado" asi es posible volver a poder accionar la admision de manera correcta con ese paciente seleccionado 
 
 https://xd.adobe.com/view/22163b34-ad37-41e1-b086-e286b0330af6-7745/

## Azure Criterios de Aceptacion
- El botón/acción ?oDeshacer ? estará disponible solo si el estado actual del paciente es "En sala de espera" y aún no fue llamado por el profesional. 
- Al deshacer, el sistema deberá registrar el evento con el usuario que realizó la acción y la hora. 
- El estado del paciente debe volver a "Programado", y reactivarse la posibilidad de edición de los datos/documentación. 
- El estado del Turno debe volver tambien a un estado anterior y pasar de Consumido a Programado 
- El Encuentro generado, se debe anular de la base al deshacer la admision con esta funcionalidad 
- No debe afectar la integridad del turno ni provocar duplicación de datos. 
- El sistema deberá mostrar un mensaje de confirmación antes de deshacer la acción 
- Esta funcionalidad estará disponible solo para perfiles autorizados.

## Azure Tasks
- Task 16938: QA-Ejecución de Casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15152: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16928: FE - Agregar opcion "Volver a estado anterior" al listado turno | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16923: Corregir cambio de estado de paciente | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 16927: FE - Maquetado modal Volver al estado anterior | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 17183: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16688: Diseño tecnico | Estado: In Progress
 - Asignado a: German Facundo Skrobak
- Task 17328: FE- Pruebas End to End | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15960: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 16930: FE - Integracion EP "Cancelar admision" | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15959: ESC HU | Estado: Done
 - Asignado a: Martin Casey
- Task 16937: QA-Diseño de Casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez



