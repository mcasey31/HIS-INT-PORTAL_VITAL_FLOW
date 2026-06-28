# HU 17526 - Admitir Paciente desde la Selección del Turno

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_12163_ARRIBO-PACIENTE-CON-TURNO-ADMISIA-N-PROGRAMADA
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/17526/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista
 

 

 

 

 

 

 

 

 

 

 

 

 

 

Quiero: Poder iniciar la admisión de un paciente directamente desde la lista de turnos programados
Para: Optimizar el proceso de admision del paciente. 

 

Descripción y comportamiento: 

 

Desde la admisión, el usuario podrá iniciar el proceso de admisión directamente desde la lista de turnos, generado en la HU ITEM 12305*. 

 Al seleccionar un turno en la grilla, este se resaltará en color celeste y se habilitará el botón "Admitir Paciente Programado" directamente desde la grilla de turnos, sin realizar búsquedas de datos adicionales. 

 

 

Una vez seleccionado el botón admitir programado se debe reutilizar la funcionalidad de identificación de pacientes, ITEM 9741 generado el mismo proceso que la HU ,mocionada al inicio. 

 

 

 

 

El usuario accede a la pantalla de Admisión y visualiza la grilla de turnos con el filtrado de los siguientes datos: 

Servicio 
Práctica 
Efector 
Estado 
Paciente - (Filtros avanzados) - Estos filtros son nuevos y deben desarrollarse en esta HU. 
Financiador (Filtros avanzados) - Estos filtros son nuevos y deben desarrollarse en esta HU. 
 Funcionalidades de los filtros Paciente y Financiador: Paciente: se debe buscare por nombre y/o apellido en la lista predefinida en la grilla. Financiador: se debe buscar por financiador en la lista predefinida en la grilla. 
 

Cada fila de la grilla representa un turno e incluye: 

 

Hora (Turno) 
Hora de llegada 
Paciente 
Documento 
Financiador 
Servicio 
Efector 
Estado 
 
 El usuario identifica el turno correspondiente y selecciona la acción ?oAdmitir paciente programado ? o el icono de opciones/detalle. 

 

El sistema despliega el modal ?oIdentificar como paciente ? , compuesto por dos pasos: Paso 1 ?" Validar persona: Se muestran nombre, edad, documento y fecha de nacimiento del paciente. El usuario confirma con el botón Continuar. 

 

 

 Paso 2 ?" Validar financiador: Se listan los financiadores vigentes con información de plan, N° de afiliado, IVA y elegibilidad. El usuario puede seleccionar uno, agregar un nuevo financiador y marcar vigencia. 

 

 

El usuario debe confirma la admisión presionando el botón "Confirmar paciente": 

 

 

El sistema registra la admisión y actualiza el estado del turno en la grilla según el flujo establecido. 

 

 
 https://xd.adobe.com/view/aaf8c1b6-c05c-4611-b07e-05c93836a9c1-ffab/

## Azure Criterios de Aceptacion
- Al seleccionar un turno, la fila debe cambiar a color celeste. 
- El botón "Admitir Programado"" debe estar deshabilitado hasta que
se seleccione un turno. 
- Los filtros avanzados deben incluir únicamente Financiador y Paciente. 
- Los filtros avanzados no deben mostrarse hasta que se active su
visualización desde el botón correspondiente. 
- La funcionalidad no requiere búsqueda adicional de pacientes fuera de
esta pantalla.

## Azure Tasks
- Task 24500: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 24351: FE - Maquetado e integración Nuevos filtros | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 24057: FE - Logica para abrir modal paciente desde boton "paciente programado" | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 22509: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 23651: DT - Interfaces | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 24624: Permisos para correr PIPE back_administracion QA | Estado: To Do
 - Asignado a: Sebastian Mario Baudracco
- Task 17711: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 23963: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 24268: BE - Obtener listado de turnos en admision (release 1.6) | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 23964: QA - Ejecución casos de prueba | Estado: To Do
 - Asignado a: Cristina Alejandra Schroeder
- Task 24476: FE - Pruebas End to End | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 24055: FE - Habilitar botón Paciente programado desde el listado | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio



