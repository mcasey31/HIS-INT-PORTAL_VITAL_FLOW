# HU 14071 - Consulta de normas operativas y cobertura a convenios. (Servicio)

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14071/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de turnos. Quiero: Obtener requerimientos según norma operativa y prestaciones. Para: Indicar al paciente las condiciones para asistir al turno. 
 Al momento de realizar una búsqueda y selección de un turno para un paciente (ITEM 9908) a partir de la selección del botón "Continuar", el sistema deberá realizar consultas a los distintos servicios, donde obtendrá los requerimientos, y las indicaciones que deberá cumplir el paciente para asistir al turno. 
 
 
 
 
 A partir de la combinación de financiador y plan que el paciente tenga cargados, se deberán consultar las "Normas operativas" del convenio para las prácticas del turno en cuestión, que son las que indicarán la documentación a presentar para la atención. Las mismas se detallarán en el comprobante de turno como "Documentación a presentar". (ITEM 11916) 
 Por otro lado, se deberá consultar a convenios si las prácticas cargadas en el turno requieren autorización, y el tipo de la misma. (Ome-OP-Autorización). 
 También se consultará si las prácticas ingresadas en el turno requieren de algún tipo de preparación para el paciente, esto se hará desde (ITEM 14047) y se incluirán en el comprobante del turno como "Indicaciones previas". 
 Con los resultados obtenidos por los distintos servicios, y confirmado el turno, el sistema enviará vía mail el comprobante del turno al paciente (ITEM 11787) donde se incluirán 
 
 Comprobante de asignación de turno con indicaciones: 
 
 
 
 Nota: para ejecutar la consulta, se debe reutilizar el servicio de consulta a convenio desarrollado en la HU Item 11917.

## Azure Criterios de Aceptacion
- Al momento de seleccionar "Continuar" se realizarán las consultas a los distintos servicios. 
- La información obtenida por los servicios se mostrará en el comprobante que se envíe al paciente.

## Azure Tasks
- Task 15067: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14732: BD - Revisión de datos de comunicación | Estado: To Do
 - Asignado a: Eduardo Ynoub
- Bug 16840: QA - Al momento de confirmar el turno no se recibe el email | Estado: New
 - Asignado a: Sebastian Mario Baudracco
- Task 14197: AF - Analisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 15068: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15054: DBA - sch_convenios.fn_obtener_normas_operativas | Estado: Done
 - Asignado a: Eduardo Ynoub



