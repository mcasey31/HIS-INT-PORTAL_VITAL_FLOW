# HU 11913 - Alta Practicas en Admisión de Pacientes Ambulatorios

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11903_IDENTIFICACIA-N-PRA-CTICAS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11913/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Adicionar prácticas al realizar
la recepción del paciente. 
Para: Ampliar los estudios a realizarse al ser admitido el paciente.
 

 

 Descripción y comportamiento: Desde el proceso de admisión
de turnos programado a un paciente, se pueden visualizar todas las practicas que vienen asociadas al turno previamente programado. 

 

 

 

Desde el botón "agregar prácticas" , al seleccionarlo se abrirá un modal que nos permitirá según la indicación, agregar las practicas que no se hayan cargado al momento de asignar el turno. 

 

 

En este modal de agregar prácticas, deben visualizarse todas aquellas que están asociadas al bloque de programación (Agenda), del cual proviene
el turno que se va a admitir, al agregar practicas se informara un alerta de alta. 

 

 
 
 

 https://xd.adobe.com/view/04f22071-e989-4086-9977-f6143ff6e270-51a1/

## Azure Criterios de Aceptacion
- El modal de practicas, solo debe traer aquellas que están asociadas a la agenda y al bloque de programación de
donde proviene el turno programado. 
- El modal debe excluir las practicas, que
ya están agregadas previamente al turno.

## Azure Tasks
- Task 17024: FE - Modificaciones para agregar nombre de bloque a modal | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16849: BE - Agregar nuevos campos al listado de turnos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17182: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16115: FE - Integración EP obtenerPracticasMedicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16354: BE - Alta | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13511: Análisis y diseño Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Bug 17360: QA - Check de "Selecciona las prácticas que deseas agregar " | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 17349: QA-Falta la barra de scroll al momento de "Agregar prácticas médicas" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17026: FE - modificacion componente item transfer | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16643: FE - Integración componente Practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16112: FE - Crear componente practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16056: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16922: BE - Agregar Nombre del bloque de programacion en response | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 13512: Escritura Funcional | Estado: Done
 - Asignado a: Manuel Rolando Alvarez
- Task 16558: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16106: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 17348: QA - Verificar scroll en el modal de Agregar practicas | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 16961: BE - Agregar id practica admision (tabla pivot) en listado de practicas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 16107: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16714: DT - Modificacion interface | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 13498: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



