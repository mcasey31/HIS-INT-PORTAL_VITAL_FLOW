# HU 11916 - Carga de archivos de normas operativas.

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: New
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11916/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión. Quiero: Adjuntar documentación en admisión de paciente. Para: Realizar admisión de paciente con turno programado. 
 Descripción y comportamiento: Al momento de admitir un paciente con turno programado, luego de validar las prácticas asociadas al turno con el servicio de convenios (ITEM 13945) el sistema nos indicará las normas operativas según financiador y plan para esas practicas. En el apartado de "Archivos adjuntos" se podrá adjuntar dicha documentación a través de un modal de carga. 
 
 El modal contará con un selector que indicará el tipo de archivo a subir. Las opciones de selección serán: Documento, Credencial, Recibo, Otro. Una vez que se adjunte el archivo, el mismo se listará en el modal, y contará con un botón para eliminarlo en caso de ser necesario. 
 
 
 Desde el botón "Guardar" el modal se cerrará y el sistema nos llevará a la pantalla de admisión, la cual nos listará en el apartado de "Documentos adjuntos" los archivos que se vayan cargando, tal como lo muestra la imagen. 
 
 
 Para los casos en que se adjunte un archivo con formato no permitido, el sistema lo alertará con el siguiente mensaje:

## Azure Criterios de Aceptacion
- El botón "Guardar" del modal, permanecerá inactivo hasta que se realice la carga de un archivo. 
- El tamaño permitido para los archivos a subir será de hasta 10mb por archivo. 
- Se podrán subir hasta 5 archivos por vez. 
- Se permitirán subir archivos de formato PDF, JPG, JPEG. 
- Si el archivo cumple con los criterios (formato, tamaño, etc) y por cualquier error de back-end no se puede guardar, el sistema debe enviar al front-end que se produjo un error de carga y que se debe subir nuevamente. 
- Desde el botón "Cancelar" se cerrará el modal y el sistema nos retornará a la pantalla de admisión.

## Azure Tasks
- Task 13580: Análisis y escritura | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 15298: Ajustes DB | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 13964: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



