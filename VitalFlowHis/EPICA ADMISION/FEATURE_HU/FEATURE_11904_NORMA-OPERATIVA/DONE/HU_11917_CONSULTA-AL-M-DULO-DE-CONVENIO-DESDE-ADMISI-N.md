# HU 11917 - Consulta al módulo de convenio desde admisión

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11904_NORMA-OPERATIVA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11917/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista Quiero: Consultar al servicio de convenios. Para: Validar y corroborar las normas operativas de las prácticas a admitir por paciente. 

 

 

Descripción y comportamiento: 
 Al momento de admitir un paciente (ITEM 12305), luego de validar las prácticas ingresadas en el turno (ITEM 11913/11915) y seleccionar el botón "Continuar" como se muestra en la siguiente imagen; el sistema debe realizar una consulta a convenios, donde se validará según las "normas operativas" el requerimiento que tenga cada practica a realizarse. 
 
 Para consumir el servicio consulta de convenio, se debe enviar los siguientes datos: - Número de identificación del paciente (campo de texto) * 
- Número de beneficiario (numérico) * 
- Plan (campo de texto) * 
- Financiador (campo de texto) * 
- Centro (prestador) * 
 
- Las prácticas a consultar (array) * 
- Filial (cuando corresponda) 
- Capita (cuando corresponda) 
 En respuesta de la consulta se pueden generar dos posibles casos: 
 Caso 1) Consulta exitosa: 
 Este servicio debe retornar los requisitos y consideraciones correspondientes de acuerdo al convenio del paciente, a fin de garantizar una correcta admisión. 
 Según las normas operativas por cada práctica se debe obtener: Monto de la prestación 
Monto (%) de cobertura 
Monto de copago (de requiere copago) 
Tipo de autorización requerida (Si se requiere) 
Documentación requerida. 
Monto total de las prestaciones
 
Monto total del copago
 
 
 Caso 2) No tener una respuesta esperada:
 En caso no tener respuesta del servicio de consulta de convenios, se debe notificar el error. 
 Link: https://xd.adobe.com/view/b13b0918-cb84-4b4f-b784-2ad78198cb6f-e468/

## Azure Criterios de Aceptacion
- El servicio de convenio, debe validar si las prácticas están convenidas o no de acuerdo al financiador y plan del paciente. 
- De existir convenio y de requerir algún requisito, debe devolver las normas operativas por práctica. 
- Para realizar la consulta al servicio, se debe enviar los datos de identificación del pacientes, plan, financiador y prácticas a consultar.

## Azure Tasks
- Task 15047: FE - Maquetado del listado de practicas en la admision | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 15050: FE - Integracion con el boton Continuar | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 16590: BE - Agregar practicas a la admision | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 15808: FE - Integracion EP obtener practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Test Case 16845: QA - Diseños: tamaños, colores, distancias y tipografía | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 15061: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15807: FE- Maquetado listado practicas | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 13529: Escritura funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Bug 16850: QA - Faltan tooltips en detalle de turno | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16455: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15062: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15049: FE - Integracion del Listado | Estado: Done
 - Asignado a: Andres Eloy Rincon Lopez
- Task 13528: Análisis y diseño funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 16063: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14729: BD - Revisión de datos de comunicacion | Estado: To Do
 - Asignado a: Eduardo Ynoub
- Task 14919: Diseño interfaz | Estado: To Do
 - Asignado a: German Facundo Skrobak
- Task 13495: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia



