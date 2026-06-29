# HU 11461 - Copiar bloque de programación

## Trazabilidad
- Epic: EPICA AGENDA
- Feature: FEATURE_7007_GESTION-DE-BLOQUES-DE-PROGRAMACIA-N
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/11461/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Gestor de agendas. Quiero: Copiar un bloque de programación de una agenda Para: Duplicar la configuración de un bloque de horario que haya estado operativa. 

 Descripción y comportamiento: Marco conceptual: Copiar un bloque de programación consiste en tomar los datos de un bloque inactivo de una agenda y usarlos como base para crear un nuevo bloque en la agenda del profesional con nuevas fechas de operatividad. 
 
 
 Desarrollo de la HU: Desde el menú contextual o la ventana de detalle del bloque de programación, se debe habilitar una opción para copiar la configuración de un bloque inactivo. Al iniciar el proceso se debe alertar si se desea copiar el bloque seleccionado. 
 
 
 Al realizar esta acción, se generará un nuevo bloque con atributos similares a los atributos copiados, a excepción de los campos que se nombran a continuación: 

 Datos a renombrar y/o alterar: Nombre de Programación: (*) (tipo texto de 70 caracteres), por defecto debe venir el nombre del bloque copiado + (copia1), editable. Ejemplo: Nombre_del_bloque_(copia1) 
Fecha desde: (*) (Fecha dd/mm/aaaa) - Campo en blanco editable 
Fecha hasta: (*) (Fecha dd/mm/aaaa) - Campo en blanco editable 
Seleccionar tipo de bloque de programación: (*) por default el tipo del bloque copiado 
Seleccionar días: (*) (L, M, M, J,V, S,D botones de selección) por default los días del bloque copiado 
Hora desde (*) (Horario en el que empezará el primer slot, HH:MM) 
Hora hasta (*) (Horario en el que terminará el último slot, HH:MM) 
Duración del turno (*) (Min que va a durar el slot, desplegable de 5,10,15,20,25,30,35,40,45,50,55,60 minutos)
 
Lugar de atención (*) (consultorios, box, area-sector información que va a venir, auto selector) por default el del bloque copiado
 
Frecuencia (*) 

 

semanal: Al seleccionar esta opción la configuración se repetirá todas las semanas que el bloque tenga vigencia 
quincenal: la configuración será de semanas alternas iniciando la semana que tenga la fecha desde del bloque 
Dia de la semana por orden en el mes (Orden mensual): seleccionar el día de la semana por orden en el mes (Ej.: primer y tercer jueves del mes) 
 
Nº Sobre turnos (integer con cantidad de sobre turnos que aceptara cada día la programación que se está configurando) 
 
 En el proceso de copiado se deben copiar las prácticas del bloque y sus reglas de cupos si es que posee. Ambas editables para agregar o eliminar alguna de las existentes. 
 
 
 
 Nota: (*) datos de carácter obligatorio 
 Link de pantallas: https://xd.adobe.com/view/a4b6825b-0469-4a3f-9a1f-f8ea0c6d4b48-f1e5/screen/16e650ec-8086-41c7-9a43-7520fdd618eb/

## Azure Criterios de Aceptacion
Para poder copiar un bloque de programación, este debe estar en estado inactivo. 
Para copiar un bloque, este debe haber estado configurada con los respectivos horarios y sus prácticas médicas. 
Al crear el nuevo bloque de programación, se deben generar los lots a partir de la fecha desde indicada al momento de copiar el bloque, hasta la fecha hasta definida en la HU. 
Si al completar el proceso de copiado se genera un error, se de alertar que hubo un error al copiar el bloque de programación. 
Se debe validar que la fecha desde no debe ser menor al día que se genera la copia.

## Azure Tasks
- Test Case 16409: QA - Verificar Nuevo Bloque - Atributos Copiados - Seleccionar Dias | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16699: QA - Diferencia en Menu Contextual entre ODI y Mockup | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16523: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 16143: QA - Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Task 16137: FE - Armar pantalla PATH copiar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 16418: QA - Verificar Notificación - Se Agrego Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16718: QA - Copiar bloque de programación - Error campo Fecha Desde | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16420: QA - CR - Para copiar un bloque, este debe haber estado configurada con los respectivos horarios y sus prácticas médicas. | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16405: QA - Verificar Nuevo Bloque - Atributos Copiados - Nombre de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16413: QA - Verificar Nuevo Bloque - Atributos Copiados - Lugar de Atención | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 11581: Análisis Funcional | Estado: Done
 - Asignado a: Geroan Antonio Cadenas Alvarez
- Test Case 16403: QA - Copiar Bloque de Programación - Boton Cancelar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16410: QA - Verificar Nuevo Bloque - Atributos Copiados - Hora Desde | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16131: FE - Armar logica de llamar endpoints en caso de copiar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 11582: Escritura de HU | Estado: Done
- Task 16133: FE - Validad fecha Desde como va a quedar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Task 16132: FE - Verificar Funcionamiento General | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 16412: QA - Verificar Nuevo Bloque - Atributos Copiados - Duración de Turno | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16401: QA - Verificar en Menu Contextual la opc Copiar Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16415: QA - Verificar Nuevo Bloque - Atributos Copiados - Nro de Sobre turnos | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16707: QA - Copiar bloque de programación - Error campo Fecha Hasta | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16407: QA - Verificar Nuevo Bloque - Atributos Copiados - Fecha Hasta | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16130: FE - Verificar Validacion de Boton Copiar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 16400: QA - Verificar Copiar Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Task 16221: FE - Modal Confirmar | Estado: Done
 - Asignado a: Romina Daiana Luzzi
- Test Case 16417: QA - Verificar Notificación - No se pudo Guardar Copia | Estado: Design
 - Asignado a: Alfonso Oscar Koike
- Test Case 16408: QA - Verificar Nuevo Bloque - Atributos Copiados - Tipo de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16764: QA - Copiar bloque de programación - Campos que tienen que ser Obligatorios | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16406: QA - Verificar Nuevo Bloque - Atributos Copiados - Fecha Desde | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16404: QA - Copiar Bloque de Programación - Boton Si, Copiar | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16416: QA - Verificar Copia de Practicas Medicas | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16419: QA - CR - Para poder copiar un bloque de programación, este debe estar en estado inactivo | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Bug 16889: QA - Copiar bloque de programación - No se Respeta Hora Desde - Hora Hasta | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16402: QA - Verificar en Detalle de Programacion en Menu contextual - Copiar Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16399: QA - Verificar Menu contextual - Copiar Bloque de Programación | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16421: QA - CR - Al crear el nuevo bloque de programación, se deben generar los lots a partir de la fecha desde indicada al momento de copiar el bloque, hasta la fecha hasta definida en la HU | Estado: Ready
 - Asignado a: Alfonso Oscar Koike
- Test Case 16414: QA - Verificar Nuevo Bloque - Atributos Copiados - Frecuencia | Estado: Design
 - Asignado a: Alfonso Oscar Koike
- Task 16142: QA - Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Alfonso Oscar Koike
- Test Case 16411: QA - Verificar Nuevo Bloque - Atributos Copiados - Hora Hasta | Estado: Ready
 - Asignado a: Alfonso Oscar Koike



