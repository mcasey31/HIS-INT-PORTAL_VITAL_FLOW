# HU 12164 - Landing solapa admisión

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_13275_LANDING-SOLAPA-ADMISION
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12164/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de Admisión Ambulatoria Quiero: Ingresar a la funcionalidad de admisión Para: Iniciar el proceso de admisión de un paciente con turno programado
 
 Descripción y comportamiento: 
 
 
 Marco conceptual: 

 Componente 1: Identificar paciente Desde la solapa de admisión debe traer la funcionalidad para identificar a un paciente que se aplico en: (ver ITEM 9741) donde se debe respetar la misma lógica y usabilidad; solo existe el cambio del label del botón, en esta HU se llamara "Admitir Paciente". 
 
 
 Nota: el check de "Elegibilidad" será explicado en ITEM 12996 
 Componente 2: Aplicación de filtros 
 Para realizar la búsqueda de turnos programados se podrán aplicar los filtros que se mencionan a continuación:

 ° Servicio ° Práctica ° Tipo de efector ° Efector ° Fecha del turno. ° Estado
 
 Componente 3: Listar turnos programados
 Por default se debe listar los turnos del día correspondiente al centro médico, ordenados desde los más reciente hasta el último turno de ese día. Este listado mostrará los turnos de las distintas agendas con su respectivo "estado" para facilitar al personal de admisión el ingreso de pacientes. Este listado debe organizarse en el siguiente orden: 
 ° Turno ° Llegada (se calcula cuando el usuario de admisión haga click en el botón de admitir paciente) ° Paciente ° Documento ° Financiador ° Servicio ° Efector ° Estado 
 
 Link de pantallas https://xd.adobe.com/view/69c10981-9942-416b-9f36-fde239f6e051-3c92/

## Azure Criterios de Aceptacion
- Por default se debe listar los turnos del día correspondiente al centro médico en actividad en el sistema. 
- Al generar los resultados de la búsqueda, el listado debe organizar los turnos desde el mas reciente a la hora del día hasta el último turno del día. 
 
- Los select de los filtros, deben visualizar los datos registros asociados al centro médico en actividad en el sistema.

## Azure Tasks
- Task 12284: Escritura de HU | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14787: FE - Integrar grid admision con filtros | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Bug 15135: QA - No respeta el orden por defecto en lista de turnos | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14457: FE - Integrar componente Buscador | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15172: QA - BE - Modificacion endpoint obtenerTurnosAdmision/adm-l-admi | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14712: FE - Integración listado de turnos | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13784: Diseño interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 22530: QA - Desfasaje de horario en ADMISION con la hora de llegada | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14462: FE - Integración Efector | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14454: FE - Modificar boton modal paciente (GUARDAR A ADMITIR PACIENTE) y agregar traducciones modal paciente en Admision | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 14728: DBA - Privilegios odi_usr_administracion | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 15441: QA - Corregir icono de calendario en admisión | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14455: FE - Maquetado Componente 2: Aplicación de filtros | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14685: FE - Integracion EP obtenerPaciente en admisión | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14813: FE - integración EP Crear privado (admision) | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14551: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14776: FE - Integración EP Finalizar vigencia en admisión | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14812: FE - Integración EP agregar financiador (Admisión) | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14977: BE - DEV - Ajustes de formato de fecha, estados y sus atributos | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14446: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 13082: Análisis funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14460: FE - Integracion filtro Practica Medica | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14456: FE - Maquetado Listado de Turnos | Estado: Done
 - Asignado a: Federico Gastón Godoy
- Task 15144: Modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Bug 17655: QA - No figura el selector de centro | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14461: FE - Integración Tipo Efector | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14499: BE - EP obtenerEstadosAdmisionSelector/adm-s-estpacadmi | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14459: FE - Integracion filtro Servicios | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 22936: QA - No se generan slot | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14447: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14980: BE - DEV - Fix filtro idPersona listado de turnos | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14463: FE - Integración Estado | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14500: BE - EP obtenerTurnosAdmision/adm-l-admi | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 14458: FE - Integrar componente selector de día | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 13087: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 22797: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa



