# HU 14040 - Evento cobro a privado

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Committed
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14040/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión Quiero: Generar evento de cobro al admitir un paciente Para: Emitir orden de cobro a caja 
 Descripción y comportamiento: Al confirmar la admisión de un paciente, y que este se realice prácticas que requieran ser financiadas de forma privada por el paciente, según la historia (ITEM 15377) escenarios 2 y 3, se debe generar la información correspondiente de cobro mediante un servicio de integración al módulo de caja como se explica a continuación: 
 

id_episodio este dato se toma del campo "id" de tabla Admision_ODI 
id_paciente se toma del campo "id_paciente" de tabla Admision_ODI 
nombre1_paciente se toma del campo "nombre1_paciente"de tabla Admision_ODI 
nombre2_paciente se toma del campo "nombre2_paciente"de tabla Admision_ODI 
apellido1_paciente se toma del campo "apellido1_paciente"de tabla Admision_ODI 
apellido2_paciente se toma del campo "apellido2_paciente" de tabla Admision_ODI 
id_tipo_documento se toma del campo "id_tipo_documento" de tabla Admision_ODI 
nro_documento se toma del campo "numero_documento" de tabla Admision_ODI 
numero_afiliado se toma del campo "numero_afiliado" de tabla Admision_ODI 
fecha_nacimiento se toma del campo "fecha_nacimeinto" de tabla Admision_ODI 
id_prestador se toma del campo "id_prestador" de tabla Admision_ODI 
id_ambito se toma del campo "id_ambito" de tabla Admision_ODI 
id_plan se toma del campo "id_plan" de tabla Admision_ODI 
id_filial se toma del campo "id_filial" de tabla Admision_ODI 
id_capita se toma del campo "id_capita" de tabla Admision_ODI 
id_financiador se toma del campo "id_financiador" de tabla Admision_ODI 
fecha_ingreso se toma del campo "fecha_ingreso" de tabla Admision_ODI 
hora_ingreso se toma del campo "hora_ingreso" de tabla Admision_ODI 
id_estado_episodio se toma del campo "id_estado_episodio" de tabla Admision_ODI 
id_tipo_iva se toma del campo "id_tipo_iva" de tabla Admision_ODI 
id_gerenciador se toma del campo "id_gerenciador" de tabla Admision_ODI 
motivo se toma del campo "motivo" de tabla Admision_ODI 
historia_clinica se toma del campo "historia_clinica" de tabla Admision_ODI 
id_metodo_registro se toma del campo "id_metodo_registro" de tabla Admision_ODI 
codigo_diagnostico se toma del campo "codigo_diagnostico" de tabla Admision_ODI 
nombre_diagnostico se toma del campo "nombre_diagnostico" de tabla Admision_ODI 
practicas_admisión se toman las practicas que se confirmen en la admisión con su respectivo copago. 
 
 
 Al momento de seleccionar "Generar evento de caja" se enviará la información para el cobro de la misma. 
 
 
 
 
 https://xd.adobe.com/view/fd77a7b3-765d-4189-a3d8-463b8f4d0f94-a824/

## Azure Criterios de Aceptacion
- Al seleccionar el botón "Generar evento de caja" se enviará la información al módulo de caja para realizar el cobro correspondiente.

## Azure Tasks
- Task 24289: BD - Carga de Prácticas con copago que no sean 100% convenidas | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 23496: FE- Adaptaciones a cambios de EP Normas OP | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 22510: FE - Integración modificaciones EP obtenerNormasOperativas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 17504: QA-Ejecución de Casos de Prueba | Estado: In Progress
 - Asignado a: Hernan Alexis Gutierrez
- Task 17438: FE - Maquetado Listado Valor Consulta Practica | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 24438: ADS - No muestra cobertura y copago correcto | Estado: New
 - Asignado a: Diego Alejandro Nuñez
- Task 22556: BE - Modificar EP obtener normas operativas | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15156: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 23420: BD - Se modifica función de BD obtener normas operativas | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 14195: Análisis funcional y escritura | Estado: To Do
- Task 23997: FE- Alertas para generación de cargo | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 16686: Diseño tecnico | Estado: To Do
 - Asignado a: Diego Alejandro Nuñez
- Task 17503: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17620: DT - interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez



