# HU 12305 - Confirmar Arribo de Paciente con Turno Programado

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_12163_ARRIBO-PACIENTE-CON-TURNO-ADMISIA-N-PROGRAMADA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12305/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de Admisión Quiero: Confirmar la llegada del Paciente con un Turno Previo Para: Iniciar el proceso de admision desde un turno programado 
 Descripción
 

Una vez identificado el paciente, el sistema buscará su Turno correspondiente en base al listado generado en la HU ITEM 12164, desde donde se permitirá iniciar el proceso de admisión del Paciente. 

El botón "ADMITIR PACIENTE" actuará como filtro de jerarquía superior, mostrando únicamente los turnos del día actual asignados al paciente, sin importar otros filtros previamente aplicados. 

Con la seleccion correspondiente del turno, el usuario podrá hacer clic en el botón +ADMITIR PACIENTE, lo que iniciará el proceso de confirmación de arribo. 

 
 
 
 
 Casuísticas 1. Coincidencia entre los datos del paciente y los del turno (Financiador/Plan): 

El sistema permitirá continuar con el proceso de admisión normalmente. El siguiente paso será validar las prácticas médicas asociadas al turno (ver FEATURE 11903). 

2. Discrepancia entre los datos del paciente y los del turno (Financiador/Plan): Si los datos del Financiador y Plan del turno seleccionado no coinciden con el financiador y plan activo del paciente, el sistema debe mostrar un modal que informe la discrepancia y brinde la opción de actualizar el turno con los datos de pagador activos en el paciente. 
 Al "Aceptar" el sistema debe ACTUALIZAR los datos cargados en el ID del Turno del paciente los nuevos datos del Financiador/Plan activo del Paciente 3. Múltiples turnos para la misma fecha y paciente: 

Si existen múltiples turnos asociados al mismo tipo y número de documento para la fecha actual, se listarán todos en pantalla. El usuario deberá seleccionar manualmente el turno correcto, el cual quedará resaltado visualmente para facilitar su identificación. 

4. Sin turnos del Paciente para la fecha actual: 

En el caso de que al momento de identificar un paciente, segun el tipo y nro. de documento no hubier turnos programados para el dia de la fecha se mostrará el siguiente modal: 

 
 
 

 Link de pantallas 
https://xd.adobe.com/view/69c10981-9942-416b-9f36-fde239f6e051-3c92/
 8 a11 pág

## Azure Criterios de Aceptacion
- Dado un paciente identificado y un turno coincidente, el sistema debe permitir iniciar la admisión desde el botón "+ADMITIR PACIENTE". 

 
- El boton "+ADMITIR PACIENTE" solo debe activarse con un turno seleccionado en estado "Agendado" 

 
- El boton "+ADMITIR PACIENTE" solo debe mostrarse con listado de turnos del dia de la fecha actual 

 
- Si los datos del Financiador y Plan del turno seleccionado no coinciden con el financiador y plan activos del paciente, el sistema debe mostrar un modal que informe la discrepancia y brinde la opción de actualizar el turno con los datos de pagador activos en el paciente. 

 
- El botón "CONSULTAR" debe filtrar siempre los turnos de la fecha actual que coincidan con el tipo y número de documento del paciente, ignorando otros filtros activos. 

 
- En caso de existir más de un turno para el mismo paciente en la fecha actual, deben listarse todos, permitiendo al usuario seleccionar manualmente el turno correcto. 

 
- El turno seleccionado debe visualizarse destacado en pantalla (por ejemplo, sombreado) para evitar errores de selección.

## Azure Tasks
- Task 14444: FE - Revisar seleccion de fila componente grilla | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14653: FE - Habilitar boton de admitir paciente al seleccionar un turno en estado agendado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14477: BE - Actualizar admision | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14965: BE - Actualizar pacienteFinanciadorPlan de turno en PUT | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 13088: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14767: FE - Dummy page de proceso Admitir paciente programado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 13117: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Bug 15143: QA - No se eliminan los filtros al realizar búsqueda de turnos por paciente | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14654: FE - Agregar dialog de advertencia (causística 2) | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14232: DIseño interfaces | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 13116: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 14788: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14906: BE - Correcciones y pruebas Crear/Actualizar admision | Estado: Done
 - Asignado a: Tomas Goncalves
- Bug 14815: BUG - Libreria al hacer click sobre el context menu se debe hacer doble click | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14439: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14970: FE - Testear/Verificar paciente desde el listado | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14440: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14766: FE - Integracion Endpoint actualizar admision | Estado: Done
 - Asignado a: Romina Daiana Luzzi



