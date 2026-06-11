# HU 14990 - Selección de Cápita/Filial PAMI-UOM

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7708_ASIGNAR-TURNO
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14990/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de admisión/turnos Quiero: Indicar Cápita y Filial a paciente Para: Completar datos de cobertura 
 Descripción y comportamiento: Al momento de agregar un financiador a un paciente (ITEM 9851) en caso que alguno de los elegidos sean PAMI u OSUOMRA, se deberá indicar tanto la cápita como la filial a la cual pertenece el paciente. Esta información se obtiene mediante un proceso que se realiza de forma manual por el usuario, consultando de manera online a los padrones de PAMI y OSUOMRA según corresponda. 
 
 
 Tanto el campo Cápita como Filial serán de tipo Select. 
 Para la selección del campo cápita como filial, los datos deberán ser tomados del módulo de convenios, para esto se requiere una integración y utilizar estos datos como ya utiliza dicho modulo.

 
 
 
 Una vez completados los campos, se habilitará el botón "Guardar". 
 Los campos que contengan ?<* ?< serán de carácter obligatorios. 
 
 Nota relevante: los datos de cápita y filial no son datos vinculantes al financiador ni al paciente, sino al turno, ya que estos podrán cambiar de acuerdo a las prestaciones que se realice el mismo.
 
 
 https://xd.adobe.com/view/3bc4470b-e750-4c16-af37-e95f12520360-6e97/

## Azure Criterios de Aceptacion
- Si el financiador cargado no es OSUOMRA o PAMI los campos cápita y filial no se mostrarán por pantalla. 
- El botón "Guardar" permanecerá inactivo hasta que se completen todos los datos del financiador (Plan-N° de afiliado-Cápita-Filial)

## Azure Tasks
- Test Case 17167: QA - Verificar Campo Filial - OSUOMRA | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17186: BE - Modificar el crear turno | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 17007: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17169: QA - Verificar Boton Guardar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 17126: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16957: Modal Identificacion Paciente agregar selector | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 17042: BE - obtener filiales por financiador | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 17041: BE - obtener capitas por financiador | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Test Case 17168: QA - Verificar Boton Cancelar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16825: DT - Diseño interfaz | Estado: Done
 - Asignado a: German Facundo Skrobak
- Test Case 17163: QA - Verificar Campo Capita - PAMI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16959: FE - Integrar endpoint filial | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 17170: QA - Verificar Notificación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16960: FE- Modificar endpoint de CREAR turno | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 22097: QA - Financiador OSUOMRA - No se muestran los campos Capita / Filial | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17172: QA - CR - Si el financiador cargado no es OSUOMRA o PAMI los campos cápita y filial no se mostrarán por pantalla | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17162: QA - Verificar agregar un financiador a un paciente PAMI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 17544: QA - Selección de Cápita/Filial PAMI/UOM - Error Agregar Financiador/Plan | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16958: FE - Integrar endpoint cápita | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 17171: QA - Verificar Notificación de Error | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 15155: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 17043: BE - actualizar turno | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 15353: Análisis funcional y escritura | Estado: In Progress
 - Asignado a: Sebastian Hernandez Garandan
- Test Case 17164: QA - Verificar Campo Filial - PAMI | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16824: DB - Actualizar campos | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Task 17008: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 17173: QA - CR - El botón "Guardar" permanecerá inactivo hasta que se completen todos los datos del financiador (Plan-N° de afiliado-Cápita-Filial) | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17165: QA - Verificar agregar un financiador a un paciente OSUOMRA | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 17166: QA - Verificar Campo Capita - OSUOMRA | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



