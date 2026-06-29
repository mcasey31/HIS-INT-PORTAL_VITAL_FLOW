# HU 14081 - Adjuntar archivos de documentación a la prácticas

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14081/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Adjuntar documentos al editar los requisitos de una práctica. Para: Completar la documentación requerida por prestación al admitir un paciente. 

 Descripción y comportamiento: Al editar algunas de las prácticas desde: Product Backlog Item 13944, se tendrá la opción de adjuntar uno más documentos, como se muestra a continuación: 
 
 
 Mediante el botón de ADJUNTAR ARCHIVO, se debe permitir adjuntar los documentos requeridos por la práctica (Puede ser mediante el drag and drop o seleccionando los archivos desde el ordenador). 
 Se permiten los formatos de XLXS, DOC, PDF E IMG. Con un máximo de 5 archivos. 
 
 
 
 En caso de ocurrir un error en la subida de los archivos, se debe alertar como se indica en el mockup. 

 
 Antes de cargar los archivos podrás validar si es correcta los documentos a cargar, permitiendo eliminar en caso de existir error o equivocación de carga.
 
 Una vez adjuntado los archivos, se deben listar en el modal de edición HU Product Backlog Item 13944 permitiendo desde la grilla de adjuntos del modal, la descarga por archivo y/o la eliminación en caso de no requerirse, como se muestra a continuación: 
 
 
 En caso de eliminar un adjunto, se debe alertar como se indica a continuación. 
 
 
 Terminado el proceso de adjuntar archivos, se debe completar el proceso con el Guardar de la edición de la práctica. 
 https://xd.adobe.com/view/31a15d4d-c7b1-47d9-aa66-5d82259bb438-64f2/

## Azure Criterios de Aceptacion
Se debe permitir adjuntar archivos en los siguientes formatos: XLXS, DOC, PDF E IMG, con un máximo de 5 archivos. No requiere paginación. 
Cada archivo debe tener un paso máximo de 10mg.

## Azure Tasks
- Task 15741: DB - Crear estructura | Estado: Done
 - Asignado a: Eduardo Ynoub
- Task 16110: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16125: FE - Integración EP descargar documento de practica | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15976: Fe - Integracion de componente importar archivos | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 20267: QA - Diferencias de diseño | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14117: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 16127: FE - Integración EP subir documento practica | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17344: FE - Refactor listados y guardado de practicas documentos | Estado: To Do
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17279: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Bug 24177: QA - El modal de Adjuntar archivo se visualiza grisado | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17342: DB - Cambios en campos nullables | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 14193: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Bug 22592: Optimizacion Query obtener turnos disponibles | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 22610: QA - No permite subir ciertos archivos según su formato | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16126: FE - Integración EP eliminar documento practica | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 17343: BE - Refactor listados y guardado de practicas documentos | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 14194: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 23498: FE - Adaptaciones a cambios de EP Normas OP (modal archivos) | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Bug 17395: QA - El boton GUARDAR se encuentra habilitado | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16061: FE - maquetado listado de archivos requisitos practica | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 16350: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16111: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15396: Diseño | Estado: Done
 - Asignado a: German Facundo Skrobak



