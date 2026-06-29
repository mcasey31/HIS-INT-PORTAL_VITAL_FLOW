# HU 9908 - Selección y asignación de horario

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/9908/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos Quiero: Seleccionar un horario de la búsqueda Para: Asignar un turno al paciente Descripción y comportamiento: 
 Marco conceptual: Después de realizar la búsqueda de disponibilidad horaria (Product Backlog Item 9743: Búsqueda de disponibilidad de horarios para asignar turnos), se debe habilitar la opción de seleccionar y asignar un horario al paciente, permitiendo agendar su atención en una fecha y hora específica. 
 Desarrollo de la HU: Desde la lista de horarios disponibles, se debe seleccionar un horario, el cual estará asociado a un centro, un servicio, una práctica, un profesional, así como una fecha y hora específica para la atención del paciente. 
 Antes de confirmar la asignación, se debe mostrar el detalle del horario, incluyendo el copago asociado a la práctica (cuando esa información este disponible según servicio de consultas de convenios en definición), así como la opción de agregar o actualizar el correo electrónico y número de teléfono del paciente para enviar la notificación de confirmación. Si se modifican los datos de contacto, al menos uno de ellos, se debe incluir una opción para indicar si estos cambios se guardarán en el perfil del paciente o solo se utilizarán para la notificación. En el caso de realizar cambios en la base, se deben pisar los campos de email y teléfono personal de la persona. 
 
 Resultados esperados:
 
 En este proceso se pueden dar los siguientes casos: 
 1) Turno asignado OK 1.1- El paciente queda con un turno asignado (turno tomado). El slot seleccionado debe quedar con un estado de "asignado". Se muestra el mensaje de: se asigno un turno en la especialidad seleccionada. 1.2- El paciente ya tiene un turno asignado con los mismo datos de fecha y hora. Se emite un alerta para advertir que el paciente tiene un turno asignado. Ver pantalla 3 Esta validación se realizará en la HU Product Backlog Item 12287: Regla de validación del paciente con turno activo al asignar nuevo turno. 
 Hasta no tener las reglas, se permitirá la asignación del turno sin alterar o cancelar el turno ya asignado al paciente, permitiendo la asignación del nuevo turno. 
 
 2) Se cancela el proceso, no se asocia un turno al paciente. En caso de cancelar se devuelve a la búsqueda de horarios. 
 
 Pantallas Pantalla 1: Resultado de turnos disponibles para seleccionar Pantalla 2: Modal de confirmación del turno Pantalla 3: Validación de turnos del paciente. Pantalla 4: Asignación del turno al paciente. Pantalla 5: Validación de comprobación de turno ocupado.

## Azure Criterios de Aceptacion
- Solo se podrá seleccionar un turno al paciente. 
- El slot asignado al paciente no debe estar disponible para próximas asignaciones, debe quedar en estado ocupado. 
- En caso de editar los datos de contactabilidad del paciente, se debe indicar si impacta en la base de personas o solo para efectos la notificación. En el caso de realizar cambios en la base, se deben pisar los campos de email y teléfono personal de la persona. En saco de tener varios datos de contactabilidad de tipo persona, se debe tomar el último registro actualizado o registrado. 
- Los campos correo electrónico y número de teléfono, no son obligatorios. 
 
- En caso de editar los campos de email y teléfono personal de la persona, y se dejan en blanco, no impactara el cambio en base. 
- De agregar o modificar los campos de correo electrónico y número de teléfono, debe validarse los datos de acuerdo a las reglas estándar de ODI para estos datos. 
- Si el paciente ya tiene un turno asignado el mismo día y hora, se permitirá la asignación de un nuevo turno. 
- Se debe validar al guardar, si el turno que esta siendo asignado, no fue asignado de manera simultanea a otro paciente, para evitar la doble asignación de un slot(turno) a dos o más paciente.

## Azure Tasks
- Task 15511: BE - Fix obtenerDatosContactoPersona/spers | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 11885: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16314: FE - Actualizar crear turno | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 17103: QA - Error en listado de turnos disponibles para asignar | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14768: Diseño interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 14476: FE - Crear Toast de Confirmación de turno | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 13368: Diseño | Estado: To Do
 - Asignado a: German Facundo Skrobak
- Task 11887: Análisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 13911: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16586: DT - Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 15694: QA - No muestra alerta para turno simultáneo | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14479: BE - Crear turno | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Test Case 15677: QA - Ver | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Bug 16800: QA - Al confirmar turno, el mismo sigue disponible para seleccionar | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 14975: Mejora dialog | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Bug 17747: QA - No se muestra los horarios para asignar Turnos con Tipo Efector Grupo y Tipo Efector Dispositivo | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16315: DT - Diseño de interfaz | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 13598: Diseño - asignación de turno | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 15517: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 17054: QA - Los turnos disponibles para asignar no están ordenados por horario | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 15697: QA - Diferencias de diseño | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 22526: QA - Los turnos a mostrar No cumplen Con la Duración del Turno Asignada en el Bloque de Programación Fija | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Bug 16886: QA - Error al querer filtrar por Profesional en turnos | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 13913: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15341: BE - Modificacion datos contacto PUT | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 22593: QA - Asignación de turnos sin haber buscado paciente | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 12933: UX - Diseño de mockups selección y asignación de horario | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14884: BE - datos-contacto PUT | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 14883: BE - Endpoint obtenerDatosContactoPersona/spers | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Bug 15813: QA - Falta cargar fecha año en el modal | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16313: BE - Guardar practicas del turno | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 16807: QA - Aparece Mensaje de error poco claro al asignar turno | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14553: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14467: FE - Integrar componente modal con grilla de turnos | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Bug 22973: QA - Listado de Turnos, al consultar desde España Y? Y? no trae los turnos correspondientes | Estado: Done
 - Asignado a: Sebastian Mario Baudracco
- Bug 17191: QA - Error con filtros de turnos y realizar consulta | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 17476: QA - Demora al consultar el listado de turnos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15243: Diseño interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 23361: QA - Al asignar un turno y refresca la lista desaparece el resto | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16506: DT - Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 16531: QA - Se debe limpiar la lista de turnos al modificar filtros | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14828: FE - Integrar Get y Put Datos de contacto | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Bug 17728: QA - Desfasaje de horario en slots de turnos | Estado: Done
 - Asignado a: Cristian Fernando Alvarez



