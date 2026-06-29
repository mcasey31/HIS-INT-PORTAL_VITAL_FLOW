# HU 11788 - Edición de datos de financiador/plan de un paciente

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11788/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Asignador de turnos 

Quiero: Editar datos de financiador/plan 

Para: Buscar alternativas de disponibilidad de turnos 

 

Descripción: Al
momento de asignar un turno, luego de realizada la búsqueda 
 

(ITEM 9743), podremos editar los
datos del financiador del paciente, con la finalidad de buscar disponibilidad con otro financiador. Desde el lápiz de edición se abrirá un
modal donde se podrá agregar un nuevo financiador, o bien, se podrá editar uno de ellos. 
 
 

 Los financiadores se podrán modificar de la siguiente manera: 

Agregar financiador: se utilizará para agregar aquellos que el paciente no tenga previamente cargado, o con vigencia activa. PRODUCT BACKLOG ITEM 9851 

Cambiar financiador, en los casos en que se tenga que modificar tanto plan como numero de afiliado de un paciente en un financiador con vigencia activa, se deberá "Finalizar vigencia" de la combinación elegida (financiador-plan-numero) y agregar uno nuevo. 

 

 
 
 
 Luego de confirmar la acción, el sistema nos mostrará un mensaje que lo indique. 
 
 
 Pantallas: https://xd.adobe.com/view/62263e5b-fd56-4450-beaa-dc025c82ab1f-3775/

## Azure Criterios de Aceptacion
- El modal mostrará todos los financiadores con vigencia activa. 
- El financiador Privado/Particular no podrá ser editado, y tampoco se le podrá finalizar la vigencia. 
- El afiliado podrá tener más de un financiador con vigencia activa. 
- El financiador que traerá por defecto, será el último seleccionado.

## Azure Tasks
- Task 15063: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15064: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15045: FE - Maquetado Modal Editar Financiador | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 15484: QA - Difiere el mensaje del alerta modal al "FINALIZAR VIGENCIA" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15490: FE - Cambio de título en el modal | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 15046: FE - Integracion EP actualizar financiador | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 11973: Análisis funcional | Estado: Done
 - Asignado a: Sebastian Hernandez Garandan
- Task 15175: FE - Integración modal editar financiador en cabecera paciente | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 13783: Diseño interfaces | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 15077: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15399: FE - Validación desactivar boton cancelar al finalizar vigencia | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 12937: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia



