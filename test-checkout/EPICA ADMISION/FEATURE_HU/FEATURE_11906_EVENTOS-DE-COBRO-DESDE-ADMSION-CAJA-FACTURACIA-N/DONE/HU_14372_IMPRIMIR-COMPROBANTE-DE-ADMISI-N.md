# HU 14372 - Imprimir comprobante de admisión

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11906_EVENTOS-DE-COBRO-DESDE-ADMSION-CAJA-FACTURACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14372/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Admisionista 

Quiero: Imprimir comprobante de admisiónPara: Entregar el comprobante al paciente 

 

Descripción y comportamiento: Una vez confirmada la admisión del paciente, se debe tener la opción de imprimir el comprobante de la admisión para entregar al paciente. 

 

En el comprobante se deben detallar los siguientes datos: 

 

Título del comprobante y fecha de admisión 
Nombre del centro 
 
Nombre y apellido del paciente. 
Fecha de nacimiento 
Documento del paciente 
Financiador 
Plan 
Número de afiliado
 
Profesional 
Sección de prestaciones a realizar (En la sección de prestaciones, se debe visualizar las prestaciones facturables que devuelve el convenio, código de la prestación y nombre de la prestación.) 
Servicio 
Diagnostico (Espacio subrayado en blanco para uso del profesional al pie del comprobante) 
Observaciones
 
Opciones de firma de beneficiario y profesional 
 
Episodio 
Usuario que emite el comprobante. 
 La emisión del comprobante se debe tener al momento de admitir al paciente.
 En el modal de impresión debe brindar la opción de Cancelar e Imprimir. Si cancela se debe direccionar a la grilla de admitidos, y si elige imprimir se genera el comprobante. Ver mockup. 
 
 
 
 
 Modelo del comprobante de admisión. 
 
 
 
 En caso de no imprimir en el momento de la admisión, se debe tener la opción de imprimir desde el menú contextual de la grilla de admitidos. Desde esta opción solo tendrá opción de descargar el comprobante los pacientes que fueron admitidos, o sea con estado (Atendido, En atención, En observación), ver mockup. 
 
 
 
 

https://xd.adobe.com/view/6cb917c4-87bc-484a-9dd1-05a8e969288c-39ea/

## Azure Criterios de Aceptacion
- La impresión de comprobante debe darse luego de confirmada la admisión. 
- El comprobante debe salir con duplicado en la impresión .

## Azure Tasks
- Task 17694: BE - Fix ubicacion de EP | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 17184: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16934: FE - Agregar opcion "Imprimir comprobante" al listado turno | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 23421: QA - No se muestra las lista de turnos en admision | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 24279: QA - Falta de alineación en la palabra Código y recuadro grisado | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 15139: Análisis, diseño y escritura | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Task 17027: Analisis de solucion | Estado: Done
 - Asignado a: Eduardo Ynoub
- Bug 24439: QA - Falta de tilde en la palabra Práctica | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16939: FE - Integracion EP descargar archivo | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 16935: QA-Ejecución de Casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23412: QA - No se visualizan los datos en las columnas en Admisión | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 23559: QA - Desde la grilla de admisión no se visualiza en el menú contextual"Imprimir comprobante" | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Test Case 23561: QA - Diseño de comprobante | Estado: Ready
 - Asignado a: Hernan Alexis Gutierrez
- Task 16932: FE - Modal imprimir comprobante | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 22818: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17430: DT - modificacion interfaces | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 16933: QA-Diseño de Casos de prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17057: BE - Descargar comprobante | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Bug 23563: QA - Diferencia en el diseño en el comprobante | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 16687: Diseño tecnico | Estado: Done
 - Asignado a: Diego Alejandro Nuñez
- Task 15148: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Bug 23216: QA - No se visualiza el Modal de comprobante | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 17055: BE - Modificar Admision | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala



