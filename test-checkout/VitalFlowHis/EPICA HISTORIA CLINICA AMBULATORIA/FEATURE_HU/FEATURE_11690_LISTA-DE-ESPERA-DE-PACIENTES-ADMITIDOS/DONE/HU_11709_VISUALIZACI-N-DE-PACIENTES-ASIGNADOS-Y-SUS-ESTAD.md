# HU 11709 - Visualización de pacientes asignados y sus estados

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11709/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Profesional Asistencial 

Quiero: Visualizar el Listado de los pacientes
según agenda y admisión en sus distintos estados 

Para: Gestionar la lista de pacientes y
eventualmente abrir la HC y/o llamar a un Paciente para su
atención. 

 

 

Descripción y comportamiento:
 Una vez seleccionado el servicio de atención (ver HU ITEM 11707), el profesional podrá consultar el
listado de pacientes y sus estados, el mismo, debe visualizarse en forma ordenada según la grilla y detalle: El icono llamador (megáfono), se activará únicamente cuando el paciente se encuentra en estado "en espera" y/o "en observación". 

 

 

 La grilla a mostrar con el listado de pacientes, tendrá los siguientes campos: 

 - Turno: Identificación y descripción del horario del turno
solicitado por el paciente 
- Llegada: corresponde al Horacio en el cual el paciente es
recepcionado para su atención. 
- Paciente: Identificación del Paciente por (Nombre/s , Apellido/s y
edad del mismo). 
- Financiador: Identificación del financiador y el plan según
corresponda al paciente de atención. 
- Practica: Identificación del la practica a realizarse por el
Paciente según el servicio de atención 
- Estado: ver HU Product Backlog Item 12285 
 El profesional podrá consultar sus agendas, para visualizar a sus pacientes tanto en días pasados, presentes y futuros según lo crea necesario, ya que el sistema no le permitirá realizar ningún tipo de modificación sobre las mismas, con excepción del día de atención. 

 
 
 Si el profesional quiere
visualizar su agenda a días a futuro, y aún no tiene pacientes asignados, se mostrara en la siguiente pantalla (No se encontraron pacientes para la fecha) 
 

 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/2c5ac027-298a-4405-8e60-00753d30816a/

## Azure Criterios de Aceptacion
- Solo se podrá evolucionar a los pacientes que correspondan al día de la fecha del sistema, no podrá evolucionar a los pacientes con fechas futuras o pasadas. 
- El icono de llamador se activa únicamente cuando
el paciente se encuentra en estado en la sala espera y/o en observación.

## Azure Tasks
- Bug 17105: QA - Visualización de pacientes asignados y sus estados - No se visualiza el ícono llamar (megáfono) con paciente en estado "En sala de espera" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16563: QA - Validar el listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16565: QA - Validar la columna "Llegada" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16566: QA - Validar la columna "Paciente" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16212: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16569: QA - Validar la columna "Estado" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16567: QA - Validar la columna "Financiador" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 16911: QA - Lugar de Atención debe estar en Negritas y el Lapiz en color Azul | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 15823: DS - Interfaz | Estado: Done
 - Asignado a: German Facundo Skrobak
- Bug 17550: QA - No toma en cuenta diferencia de zona horaria para buscar el bloque adecuado | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16568: QA - Validar la columna "Práctica" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16574: QA - Validar que el profesional pueda consultar la agenda pasada | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16576: QA - Validar que el profesional pueda modificar una agenda actual | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14123: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 16575: QA - Validar que el profesional pueda consultar la agenda futura | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16577: QA - Validar que el profesional no pueda modificar una agenda pasada | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16357: BE - Endpoint obtenerDetalleAgenda/age-l-ageprof | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16901: BD - Insertar estados de encuentros | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 16846: FE - Fix grid fecha invalida | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 14510: Análisis y Diseños Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Test Case 16573: QA - Validar que el profesional pueda consultar la agenda actual | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17102: QA - No se visualizan los pacientes del día | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 16571: QA - Validar el icono llamador (megáfono) se active cuando el paciente se encuentra en estado "En observación" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16579: QA - Validar la consulta de una agenda futura cuando el profesional no tenga pacientes asignados | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16893: BD - Tablas de encuentros y permisos | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 16213: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16581: QA - Validar que el profesional no pueda evolucionar con una agenda pasada | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16582: QA - Validar que el profesional no pueda evolucionar con una agenda futura | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17109: QA - Visualización de pacientes asignados y sus estados - Difiere del mock up la alineación del texto en el campo fecha. Se ve centrado y debería estar justificado | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 14511: Escritura Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Test Case 16572: QA - Validar el icono llamador (megáfono) se inactive cuando el paciente se encuentra en estado distinto a "En espera" y/o "En observación" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16325: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16739: BE - Agregar idEncuentro en Endpoint obtenerTurnos/age-l-ageturn | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16607: FE - Integrar endpoint obtenerTurnos | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 16919: QA - Nombres de columnas diferentes al mockup | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 17188: FE - Agregar hora al servicio de turnos | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16583: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17359: QA - Se duplican las entradas de los turnos en Agenda Asistencial | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16741: BE - DEV Fix formato fecha y payload obtenerTurnos/age-l-agetur | Estado: Done
 - Asignado a: Tomas Goncalves
- Test Case 16570: QA - Validar el icono llamador (megáfono) se active cuando el paciente se encuentra en estado "En espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16578: QA - Validar que el profesional no pueda modificar una agenda futura | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 16564: QA - Validar la columna "Turno" del listado de pacientes | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16204: FE - Listar pacientes asignados | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16580: QA - Validar que el profesional pueda evolucionar con una agenda actual | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 16356: BE - Endpoint obtenerTurnos/age-l-ageturn | Estado: Done
 - Asignado a: Tomas Goncalves



