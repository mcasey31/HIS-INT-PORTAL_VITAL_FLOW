# HU 13945 - Listar las prácticas e información de convenios

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13945/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Listar las prácticas y sus normas operativas Para: Verificar, validar y/o completar información necesaria para admitir un paciente 

 
 Descripción y comportamiento: Una vez consultado el servicio de consulta de convenios, y este devuelva las normas operativas de cada práctica que se seleccionó para admitir un paciente, se deben visualizar en pantalla para validar qué práctica requiere documentación y/o autorización, así completar la información requerida para efectos de facturación. 
 En la consulta de convenios, se pueden evidenciar dos posibles escenarios: 
 Primer escenarios: Respuesta ok 
 Esta información debe mostrarse como se indica en el mockup. Mediante una grilla se listará las prácticas, la Autorización y los iconos de edición e iconos de alertas. Ejemplo de prácticas con requisitos completos. 
 La funcionalidad de edición se desarrollara en la HU Product Backlog Item 13944, permitirá adjuntar la documentación que se requiera por práctica. En caso de que se adjunten documentos estos debe visualizarse de la siguiente manera: 
 
 
 
 Con respecto a la funcionalidad del icono de alerta, este indicará el estado de la práctica de acuerdo las normas operativas que devolvió el servicio de convenio, el cual se evidenciará en dos casos: 
 Caso 1 En el caso de que la práctica NO requiera autorización ni documentación obligatoria, se mostrará un icono tipo chek en color verde:, el cual indicará a la admisionista que la práctica esta ok para ser admitida. 
 Caso 2 En caso contrario, si la práctica SI requiere autorización y/o alguna documentación, se mostrara un icono con el signo de admiración en naranja, el cual indicará que falta documentación en esa práctica. 
 
 El alerta naranja, no será impedimento para admitir un paciente, pero debe quedar registrado en el encuentro de la admisión, de que hay requisitos/documentos pendientes por suministrar por parte del paciente. 
 Ejemplo de prácticas con requisitos a completar. 
 
 
 
 
 
 Segundo escenarios: No hubo respuesta de convenios. 
 En este escenario se mostraran las prácticas en la grilla con un mensaje de "Error al conectarse con el servicio de convenio". La edición de los requisitos de las prácticas estará griseada, no tendrá señalización de estado de alerta por falta de documentos y se desestabilizará la opción para admitir al paciente. Ver mockup. 
 
 
 
 https://xd.adobe.com/view/31a15d4d-c7b1-47d9-aa66-5d82259bb438-64f2/

## Azure Criterios de Aceptacion
- Se debe mostrar todas las prácticas a realizar al paciente con sus normas operativas obtenidas en el servicio de convenio. 
- Se debe mostrar un alerta que indique que práctica requiere autorización o no. 
- Se debe permitir la admisión del paciente en caso de no tener los requisitos no obligatorios. 
- Si la consulta de convenios no devuelve información de las normas operativas de las practicas no se permite la admisión.

## Azure Tasks
- Task 16456: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15588: QA-Ejecución de casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16561: Pruebas End to End | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 16852: QA - No se visualizan las normas operativas según las prácticas | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15587: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 16944: QA-Normas operativas, misma practica y servicio difieren con respecto al efector | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 15569: FE - Maquetado Componente detalle turno | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15771: FE - Integrar info del store a detalle turno | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15804: FE - Integración EP Obtener practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 16921: QA - Falta tooltip de "Práctica" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15567: FE - Maquetado listado practicas con archivos | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15883: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14273: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14073: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 14074: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16612: BE - Modificar Guardado de practicas al crear Turno | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15738: FE - Guardado datos de turnos en store | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15568: FE - Integración EP Obtener normas operativas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio



