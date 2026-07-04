# HU 14922 - Llamar Paciente desde su Listado al Lugar de Atención (megáfono)

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11690_LISTA-DE-ESPERA-DE-PACIENTES-ADMITIDOS
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/14922/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como Profesional Asistencial 

Quiero Llamar a un Paciente 

Para: Iniciar el proceso de atención clinica 

 
 Descripción y comportamiento: La HU ITEM 11709 se listan todos los pacientes que tiene el profesional segun su agenda del día. El icono de llamar (megafono) solo se va a activar para los pacientes que estan en estado "En Espera" y/o "Observación" ver HU ITEM 12285 Una vez que el profesional llame a un paciente se abrirá un modal con la info del paciente (Nombre y apellido) 
 Al hacer clic al boton Si, Llamar, se activará la HU ITEM 11713 donde se gestiona la comunicación a los llamadores y se dará paso a acceder a la HC del paciente. 
 Desde la acción Si, llamar, mencionado en el popup, tambien se activará el cambio de estado del paciente pasando de "En Espera" a "En Atención" ver HU ITEM 12285, accediendo de esta forma a la landing de HC explicada en la HU15122 
 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/13a06978-fe1a-4011-a46b-a3b501c0bdf0/

## Azure Criterios de Aceptacion
- El icono del llamador (megafono) solo se puede activar si el estado del paciente es "En Espera" y/o "En Observación" 
- Solo se puede llamar un paciente a la vez 
- Al seleccionar el botón del pop up Si, LLAMAR, se cambiará automaticamente el estado del paciente a "En Atención"

## Azure Tasks
- Test Case 17373: QA - Validar que el modal "¿Deseas llamar al paciente XXX (n°)?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17372: QA - Validar el icono llamador (megáfono) se inactive cuando el paciente se encuentra en estado distinto a "En espera" y/o "En observación" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17065: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 17181: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 17030: BE - Endpoint llamarPaciente/ads-c-llamada | Estado: Done
 - Asignado a: Tomas Goncalves
- Task 16899: DT - interfaz | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 16999: FE - Integra Endpoint llamar paciente | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 16900: DB - Cambios | Estado: Done
 - Asignado a: Gustavo Cesar Tejerina
- Test Case 17370: QA - Validar el icono llamador (megáfono) se active cuando el paciente se encuentra en estado "En espera" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17403: QA - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) - En el modal "¿Deseas llamar al paciente XXX (n°)?", no se visualiza el n° (edad del paciente), sino el ID del paciente | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 20644: QA - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) ?" Paciente con Financiador PRIVADO-PARTICULAR se corta los botones ?oLLAMAR ? y ?oSALIR ? | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 15987: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14923: AF | Estado: Done
 - Asignado a: Martin Casey
- Test Case 17377: QA - Validar el formato y la longitud en cada campo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 14924: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Test Case 17374: QA - Validar el botón "CANCELAR" del modal "¿Deseas llamar al paciente XXX (n°)?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17405: QA - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) - Botón "SI, LLAMAR" - No abre la pantalla Panorámica de Historia Clínica ni cambia de estado de "En sala de espera" a "En Atención" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 17619: QA - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) - Al llamar al paciente desde el megáfono, el estado ?oEn Atención ? no se actualiza automáticamente | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Task 16948: FE - Llamar paciente desde listado | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Test Case 17371: QA - Validar el icono llamador (megáfono) se active cuando el paciente se encuentra en estado "En observación" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17701: FE - Mostrar nuevo parametro en vista -QA | Estado: Done
 - Asignado a: Rodrigo Nicolas Bertin
- Task 17064: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Bug 22796: QA - Llamar Paciente desde su Listado al Lugar de Atención (megáfono) - Error en el estado del paciente - dice "Agendado", debe decir "Programado" | Estado: Done
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17375: QA - Validar el botón "SI, LLAMAR" del modal "¿Deseas llamar al paciente XXX (n°)?" | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Test Case 17376: QA - Verificar que el profesional de una agenda no se pueda llamar a dos o más pacientes en simultáneo | Estado: Ready
 - Asignado a: Cristina Alejandra Schroeder
- Task 17700: BE - Agregar parametro en response - QA | Estado: Done
 - Asignado a: Tomas Goncalves



