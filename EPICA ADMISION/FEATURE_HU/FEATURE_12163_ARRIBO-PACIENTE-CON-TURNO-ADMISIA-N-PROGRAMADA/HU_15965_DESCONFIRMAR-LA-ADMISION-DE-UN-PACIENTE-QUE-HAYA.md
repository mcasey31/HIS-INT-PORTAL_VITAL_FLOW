# HU 15965 - Desconfirmar la Admision de un Paciente que haya realizado algun pago por atención

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_12163_ARRIBO-PACIENTE-CON-TURNO-ADMISIA-N-PROGRAMADA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15965/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Usuario del sistema de admisión (administrativo o admisionista) Quiero: Poder deshacer la acción que cambia el estado del paciente "En sala de espera" y validando que no haya pago realizado por pacientePara: Volver al estado anterior "Programado" por si hubo alguna acción a corregir (UNDO) Contexto funcional Como ya fue explicado en la HU ITEM 12306, es posible desconfirmar una admision cerrada. En dicha HU el circuito se da cuando el paciente no tiene que abonar nada, en esta HU se debe verificar primero que para des-hacer una admsión no haya un pago previo de parte del paciente. 
 
 
 Al seleccionar un paciente en estado "Sala de Espera" y querer volver a un estado anterior, el sistema debe verificar primero, si el paciente tiene un pago pendiente ver HU (ITEM 12285). En realidad pueden darse 2 casos: 
 CASO 1: ESTADO PENDIENTE DE PAGO: 
 Si el paciente tiene un pago pendiente, estado "Pago Pendiente", la acción de volver a estado anterior se mantiene de la misma manera que la HU ya mencionada al incio de esta Historia (12306). De esa menera se debe anular el evento de CAJA generado al paciente como nueva condición. 
 
 CASO 2: ESTADO PAGADO 
 Si el paciente tiene un estado PAGADO (evento de caja), en este caso, no se podra generar la funcion de volver a estado anterior. En este caso el sistena debe generar un aviso de que existe un pago realizado del paciente y no podra volver al estado anterior. 
 
 
 Para poder realizar la acción de volver al estado anterior, por proceso, primero se debe hacer la devolución de pago al paciente ver HU ITEM 16080 
 Link mockup: https://xd.adobe.com/view/f83ba0b1-ee65-42f6-8594-66d7c8b972f3-ad68/

## Azure Criterios de Aceptacion
El botón/acción ?oDeshacer ? estará disponible solo si el estado actual del paciente es "En sala de espera" y aún no fue llamado por el profesional. 
Al deshacer, el sistema deberá registrar el evento con el usuario que realizó la acción y la hora. 
El estado del paciente debe volver a "Programado", y reactivarse la posibilidad de edición de los datos/documentación. 
El estado del Turno debe volver tambien a un estado anterior y pasar de Consumido a Programado 
El Encuentro generado, se debe anular de la base al deshacer la admision con esta funcionalidad 
No debe afectar la integridad del turno ni provocar duplicación de datos. 
El sistema deberá mostrar un mensaje de confirmación antes de deshacer la acción 
Esta funcionalidad estará disponible solo para perfiles autorizados. 
El sistema debe validar si el paciente tiene un evento de pago pendiente o cobrado. 
No se podra volver a un estado anterior en caso de que el evento de pago este en estado "Pagado"

## Azure Tasks
- Task 17323: AF | Estado: In Progress
 - Asignado a: Martin Casey
- Task 24265: BE - Listar cargos (release 1.3) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23959: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 24047: FE - Habilitar "opción volver a estado anterior" en estado "pend. pago" | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 24266: BE - Anular cargo pendiente de una admision | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23960: QA-Ejecución de Casos de Prueba | Estado: To Do
 - Asignado a: Hernan Alexis Gutierrez
- Task 17324: ESC HU | Estado: In Progress
 - Asignado a: Martin Casey
- Task 23652: DT- Interfaces | Estado: To Do
 - Asignado a: Marco Alex Brusa
- Task 24267: BE - Cancelar admision (release 1.1) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23688: BD - Auditoría y estado de cargo | Estado: In Progress
 - Asignado a: Gustavo Cesar Tejerina
- Task 16246: UX - Diseño de mockup | Estado: Done
 - Asignado a: Giselle Daniela Vazquez



