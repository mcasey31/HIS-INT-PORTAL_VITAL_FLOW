# HU 14034 - Cabecera de paciente - Turno

## Trazabilidad
- Epic: EPICA TURNOS
- Feature: FEATURE_7707_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14034/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de turnos Quiero: contar con información del paciente Para: tomar 
 Descripción y comportamiento Contaremos con una cabecera que mostrará la información del paciente identificado.

En ella se incluirá un recuadro con los siguientes datos principales: 

- Apellidos y nombres del paciente 

 
- Edad y sexo biológico 

 
- Tipo y número de documento 

 
- Fecha de nacimiento 

 
- Financiador y plan seleccionado 

 
 Al final de la cabecera se ubicaran dos botones: 

- Lapiz, que realiza la edición de financiador 

 
- "Cambiar paciente" 

 
- Un ícono en forma de flecha para desplegar información adicional del paciente 

 
 
 Al hacer clic en el botón de despliegue, se mostrará información complementaria dividida en dos secciones: 

Lado izquierdo: 

- Género autopercibido 

 
- Teléfono personal 

 
- Correo electrónico personal 

 
- Ubicación 

 
- Dirección 

 
 Lado derecho: 

- Financiador y plan 

 
- Número de afiliado seleccionado

## Azure Criterios de Aceptacion
- Tener toda la información del paciente disponible 
- Poder desplegar la información adicional 
- Poder volver al buscador de paciente con el botón de cambiar paciente 
- Poder editar al presionar el boton de edicion de financiador

## Azure Tasks
- Task 15074: FE - componente cabecera | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Bug 15482: QA - No muestra numero de teléfono | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 15483: QA - No se esta mostrando el correo electrónico | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14120: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 15036: FE - Integrar componente en TURNOS | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15038: FE - Code Review Libreria | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 15245: FE - Modificar componente Card por cambio de interface | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 14307: Análisis funcional | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Task 15363: FE - Utilizar store para mostrar el financiador seleccioando | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15378: FE - Correccion Componente Card Paciente | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15035: FE - Revisar Componente | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 15058: QA-Ejecución de casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 14306: Escritura de HU | Estado: In Progress
 - Asignado a: Natalia Gorriti
- Task 15057: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 15037: FE - Integrar endpoint obtener paciente id | Estado: Done
 - Asignado a: Romina Daiana Luzzi



