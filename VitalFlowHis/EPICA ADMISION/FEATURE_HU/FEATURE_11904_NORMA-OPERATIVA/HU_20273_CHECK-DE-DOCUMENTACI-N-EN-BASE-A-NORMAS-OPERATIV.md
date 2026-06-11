# HU 20273 - Check de documentación en base a normas operativas al admitir un paciente

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Approved
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/20273/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Que se adecue el formulario de admisión de paciente con turno programado Para: Mejorar la experiencia de usuario y garantizar la fliudez cambiando el adjunto de documentos por chequeos rápidos. 

 
 Descripción y comportamiento: Se requiere una adecuación en el formulario de admitir un paciente para mejorar la experiencia de usuario y garantizar la fliudez del mismo, especificamente en el marco donde se visualizan las prácticas a admitir, desarrollada en la HU ITEM 13945. 

 

El cambio requerido, es sacar la visualización de los documentos que se adjuntan desde el editar una práctica y sustituir por input tipo check para señalar si el paciente presento el requisito necesario por esa práctica. 

 

Situación Actual: 

Actualmente el diseño del formulario para admitir un paciente funciona adjuntando archivos de acuerdo a los requirimientos que se solicita por medio el convenio, esto en base a las normas operativas de las practicas a realizarse. Los procesos estan diseñedos para que se adjunten archivos por prácticas; al adjuntar estos archivos, actualmente se visualizan en la grilla como se muestra acontinuación: 

 

 

 

 

 

Situación propuesta: Para mejorar la funcionabilidad más eficiente y rápido del proceso al admitir un paciente, se requiere cambiar la visualización de los archivos adjuntados anteriormentre mencionados, por un check en cada requisito que se emita de acuerdo a las normas operativas de cada práctica, en base al convenio. Esto con la finalidad de que con un simple chequeo indicar que el paciente presentó la documentación requerida, sin necesidad de adjuntar la documentación en este proceso. 

 Cada práctica tendra un check "general", que de aplicarse esta acción sobre el, se marcaran todos los check individuales de los requisitos de esa práctica. En el caso de que falte alguno de los requisitos, el admisionista tendrá que desplegar y marcar que requisito entrego el paciente y quedar desmarcado el que falto. 
 La confirmación mediente el check debe cambiar el color del semaforo a verde, como indicardor de que presento los requisitos. Funcionalidad explicada en la HU ITEM 13945. La no presentación de un requisito, no será impedimento para la admisión del paciente. 
 Ver mockup
 
 
 Los proceso de adjuntar archivos al editar una práctica, seguirá funcionando como se desarrolló, no se quieren que se quite ese proceso, lo único es que al finalizar la edición y el adjunto de documentos, estos no se visualizarán en la grilla de prácticas como se vienen visualizando, en cambio se debe visualizar son los check para señalar el cumplimiento de requisito. Los adjuntos no son obligatorios, se puede obviar ese proceso para admitir al paciente. Pero si se edita una práctica debe tener su misma funcionabilidad, o agrega el número de autorización o adjunta un archivo. 
 En el caso de que el admisionista haga uso de adjuntar archivos, y en el proceso se requiera ver que archivos adjunto, como no tendrá la vista rápida desde la grilla, tendrá que abrir nuevamente el modal de editar, donde visualizará los archivos ya adjuntados, ahí podrá realizar las operaciones ya desarrolladas (agregar o eliminar adjuntos). 
 
 Link de pantallas https://xd.adobe.com/view/e71c16e1-3daf-45b7-a4a2-82037de2a28e-b24f/

## Azure Criterios de Aceptacion
- La no presentación de un requisito, no será impedimento para la admisión del paciente. 
 
- Se debe sacar la visualización de adjuntos y mostrar check para indicar el cumplimientos de requisitos. 
- El cambio de semaforo funcionará como se venia trabajando en la HU ITEM 13945, pero ahora con los check y no con los adjuntos. 
- Se debe registrar en base de datos lo indicado en cada ckeck por práctica: En caso de quedar un ckeck sin marcar se debe registrar igual e identificar como documento faltante. Para poder visualizar luego en admitidos los pacientes con documentación faltante. Igual se permite la admisión. 
- Los adjuntos no son obligatorios, se puede obviar ese proceso para admitir al paciente.

## Azure Tasks
- Task 22772: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 20275: Analisis, diseño y escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez



