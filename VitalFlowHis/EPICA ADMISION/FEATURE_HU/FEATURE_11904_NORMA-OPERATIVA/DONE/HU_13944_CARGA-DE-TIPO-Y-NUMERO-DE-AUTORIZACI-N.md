# HU 13944 - Carga de tipo y numero de autorización

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/13944/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión. Quiero: Agregar tipo y numero de autorización. Para: Completar requerimientos de financiador al momento de realizar admisión. 
 Al momento de admitir un paciente con turno programado, luego de realizar el control de prácticas ingresadas (ITEM 11913- ITEM 11915) y realizada la consulta al módulo de convenios, el sistema nos listará las prácticas del turno con un check (semáforo) que nos indicará según su estado y en caso de requerirlo, el tipo de autorización. En caso de que la prestación no requiera autorización, este check se encontrará en color verde, tal como se muestra en la pantalla, y podremos continuar con la admisión. 
 
 
 
 
 
 Para los casos en que así lo requieran, seleccionando el lápiz de edición, se abrirá un modal donde completaremos los siguientes datos: Tipo de autorización (Select: Ome/OP/Autorización) N° de autorización ?< (Numérico) 
 
 
 El modal nos permitirá también subir archivos, una vez adjuntada la documentación, o bien editando y completando el tipo y numero de autorización, desde el botón "Guardar" el modal se cerrará y el check de la prestación se actualizará a color verde. 
 
 Como nota importante, el requerimiento de autorización en cualquiera de las prestaciones no será condicionante para avanzar en la admisión del paciente. https://xd.adobe.com/view/31a15d4d-c7b1-47d9-aa66-5d82259bb438-64f2/screen/274dbefa-0492-4ed7-8e35-5a25782c5a90/

## Azure Criterios de Aceptacion
- El tamaño permitido para cada archivo adjunto será de hasta 10 mb. 
- Se podrán subir archivos en formato PDF, JPG, JPEG. 
- Si el financiador es Pami los "Tipo de autorización" posibles serán OME, y OP. 
- Para el resto de los financiadores vendrá por default el tipo "Autorización" y no se podrá modificar. 
- El botón "Guardar" del modal, se activará al momento de seleccionar "Tipo de autorización", o luego de adjuntar un archivo. 
- Para el campo número de autorización, se permitirán hasta 15 caracteres.

## Azure Tasks
- Task 15704: BE - Subir documentos para la prácticas de un turno asociado a una admisión | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15707: BE - Descargar documento asociados a una practica | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15754: FE - Maquetado Modal carga tipo y nro autorizacion | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Test Case 16962: QA- Verificar "Requiere autorización/ Requiere documentación" | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 15852: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13998: Análisis funcional y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 16557: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15395: Diseño | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 14189: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Bug 16973: QA - Tipos de autorización posible para financiador PAMI: OME-OP | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15853: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15975: FE - Integración EP Obtener normas operativas | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 16763: QA - Excede la cantidad máxima permitida el campo N° de Autorización | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16522: FE - Integración EP tipo de Efector | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 16749: QA - No se visualizan las opciones de "Tipos de autorización" | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15706: BE - Obterner documentos asociados a una práctica | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15983: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16792: QA - Verificar financiador PAMI TIpo de autorizacion posible | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 15705: BE - Eliminar documento asociados a una práctica | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15776: BE - Listado de practicas obtenerPracticasAdmision/ads-l-admpract | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 16046: BD - GRANT odi_usr_agenda - secuencia | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 16970: QA - En el modal no se reflejan las píldoras "Requiere autorización/ Requiere documentación" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15364: Cambios DB | Estado: To Do
 - Asignado a: Eduardo Ynoub



