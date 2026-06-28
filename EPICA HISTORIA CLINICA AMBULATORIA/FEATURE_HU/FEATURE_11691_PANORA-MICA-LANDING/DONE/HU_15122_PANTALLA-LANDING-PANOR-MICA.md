# HU 15122 - Pantalla Landing panorámica

## Trazabilidad
- Epic: EPICA HISTORIA CLINICA AMBULATORIA
- Feature: FEATURE_11691_PANORA-MICA-LANDING
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/15122/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Profesional Asistencial Quiero: Ingresar a la funcionalidad de HC de los pacientes Para: Iniciar el proceso de atención y/o lectura de la HC Descripción y comportamiento: 
 El profesional, una vez que accede al modulo de HC, en el caso de que tenga pacientes para atender en el día, los vera registrados en el listado explicado en la hu (ITEM 11709). 
 Existen 2 alternativas para acceder a la HC del paciente (página de aterrizaje llamada Panorámica) 
 Caso 1: acceder a la HC - pantalla Panoramica - Sin llamador (hu: ITEM 11712) 
 En este caso, el profesional accede a la HC pero el paciente no es llamado desde la sala de espera a entrar al lugar de atención. El profesional mediante esta acción podra acceder a la HC del paciente para una revision preliminar sin la necesidad de llamar al paciente a ingresar a la atención. Si el paciente al que el profesional accedio a la HC, tenga el estado "En Espera" o "En Observacion" (ver HU ITEM 12285), se activará el boton llamar del borde derecho de la pantalla, para iniciar la atención correspondiente: 
 Caso 1.1: llamar al paciente desde la HC: En caso de que el paciente tenga un estado "En Espera" o "En Observación" como ya fue explicado en el punto 1, si el profesional llama al paciente, el mismo cambiará de estado a "En Atención". En caso de que el paciente no ingrese al consultorio el profesional podrá hacer clic en Salir (explicado en la Hu: ITEM 11774) devolviendo el estado a Sala de Espera. Se necesita crear un contador de llamados por cada vez que el profesional llama a un paciente para tener info en el tracking total del ciclo de vida de atención. De esa manera se podria informar por pantalla (como mejora) cuantas veces fue llamado un mismo paciente a ingresar al lugar de atención. 
 Caso 2: Acceder a HC desde el icono Megafóno (llamando al paciente a ingresar) HU ITEM 14922 Como se explico en la historia de este caso, el profesional llamó al paciente haciendo clic en el icono "megafóno" y directamente accede a la HC ´-pantalla panóramica- con el paciente en estado "En Espera". Idem el caso 1.1, en caso de no presentarse, el profesional podrá salir y volver al paciente a la sala de espera y poder llamar o otro paciente. 
 
 
 
 LANDING PANORAMICA: ESTRUCTURA: 
 La estructura de la pagina de aterrizaje "Panorámica" estará compuesta por 8 (ocho) componentes repartidos en el landscape de la página. Cada componente será una especie de almcenamiento de información del paciente en donde se guarde cierta documentación de la HC del paciente. Esos componenetes serán: 1) PROBLEMAS CRONICOS 2) HISTORIA CLINICA 3) ESTUDIOS PREVIOS DE INTERNACION 4) ESTUDIOS COMPLEMENTARIOS 5) INTERVENCIONES QUIRURGICAS 6) ULTIMA ATENCION AMBULATORIO 7) ALERTAS 8) RECORDATORIOS INDIVIDUALES GENERALES 
 
 
 Cada componente mencionado será un espacio en la pantalla donde agrupe la información referida a cada Item. De esta manera cada vez que un paciente tenga una evolución medica en el sistema ODI, esa info sera caratulada y agrupada en estos componentes que se mostrarán en orden segun fecha mas reciente NOTA: En todos los componentes para el MVP se podrá mostrar por cada componente hasta 10 registros como máximo: En caso de que no haya información de algun componente para un paciente se mostrará el mensaje "No Dispone Datos". 
 
 https://xd.adobe.com/view/14759262-1988-48fc-819c-72327448349a-4126/screen/f0a4e568-a82c-4c21-8053-20904dc1fa26/

## Azure Criterios de Aceptacion
- Se accede a la pagina de aterrizaje "PANORAMICA" de los iconos "Megafono" y "Plantilla" segun explicadas en la historia de usuario 
- Cada componente mencionado tendrá un espacion en la pantalla donde agrupe tipo de información, ej si el paciente se atendió en ambito ambulatorio, la próxima vez que se ingrese a la HC de dicho paciente, debería verse reflejado en el apartado "Ultima Atención Ambulatoria". 
- El Boton Llamar, desde la HC, solo sera habilitado en caso de que el estado del paciente sea "En Espera" o "En Observación" 
- Cada componente podra listar como maximo 10 registros en orden descendente por fecha más reciente

## Azure Tasks
- Task 15981: Code Review | Estado: To Do
 - Asignado a: Marco Alex Brusa
- Task 15321: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Task 22542: [FE] Separar fecha y hora | Estado: Done
 - Asignado a: Diego Gimbernat
- Bug 17061: QA - Error de activación del botón 'Llamar' en el historial clínico | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 16433: QA - Verificar el cambio de estado a "Enviar a observación" en un paciente, luego de hacer clic en el botón "Salir" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16366: QA - Verificar que en cada componente solo se visualice un máximo de 10 registros | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Task 15908: FE - Maquetación landing | Estado: Done
 - Asignado a: Diego Gimbernat
- Task 16259: QA - Ejecución casos de prueba | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 16282: [QA] Verificar que en cada componente solo se visualice un máximo de 10 registros | Estado: Design
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16432: QA - Verificar el cambio de estado a "Cerrar encuentro" en un paciente, luego de hacer clic en el botón "Salir" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16360: QA - Validar la correcta estructura en los componentes desde la pantalla "Panorámica" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16283: QA - Validar la visualización del mensaje " No disponible datos" en caso de que no haya información en algún componente | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Bug 17341: QA - Corregir botónes 'Llamar' y 'Salir' | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 16276: [QA] Verificar el cambio de estado "En Atención" Cuando una paciencia fue llamado | Estado: Design
 - Asignado a: Madeline Lissette Lopez Reyes
- Bug 17401: QA - No cambia de estado al llamar paciente | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Test Case 16277: [QA] Verificar que el botón "Llamar" desde la grilla se habilite cuando el cliente tenga el estado "En espera" o " En observación" | Estado: Design
 - Asignado a: Madeline Lissette Lopez Reyes
- Task 15320: AF | Estado: Done
 - Asignado a: Martin Casey
- Test Case 16279: [QA ]verificar el incremento del contador cuando se realizar varios llamados a un mismo paciente | Estado: Design
 - Asignado a: Madeline Lissette Lopez Reyes
- Task 16737: FE - Agregar idEncuentro | Estado: Done
 - Asignado a: Diego Gimbernat
- Test Case 16332: QA - Verificar que el Icono "Megáfono " desde la grilla se habilite cuando el cliente tenga el estado "En espera" o " En observación" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Task 15145: UX - Diseño de mockup | Estado: Done
 - Asignado a: Melanie Garcia
- Test Case 16281: QA - Verificar que al ingresar a la diferente vista panorámica se muestren las fechas más recientes | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16274: QA - Validar el proceso de atención sin llamador desde la pantalla "Panorámica" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16326: QA - Verificar el cambio de estado "En Atención" Cuando un paciente fue llamado haciendo clic desde el botón "Megáfono" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Task 16258: QA - Diseño casos de prueba | Estado: Done
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16335: QA - Verificar el cambio de estado a "Enviar a lista de espera" en un paciente, luego de hacer clic en el botón "Salir" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Bug 17104: QA - Corrección de tildes en títulos | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 17400: QA - Una vez llamado el paciente no te redirige a la pantalla de HC | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Bug 16917: QA - No figuran todos los datos del paciente en la cabecera | Estado: Done
 - Asignado a: Cristian Fernando Alvarez
- Task 16234: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Test Case 16278: [QA] Verificar el cambio de estado a "Enviar a lista de espera" del paciente, luego de hacer clic en el botón "Salir" | Estado: Design
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16334: [QA] Verificar el cambio de estado a "Enviar a lista de espera" del paciente, luego de hacer clic en el botón "Salir" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16435: QA - Verificar el cambio de estado a "No atendido" en un paciente, luego de hacer clic en el botón "Salir" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Test Case 16318: QA - Verificar la funcionalidad del botón "Llamar" desde la pantalla "Panorámica" | Estado: Ready
 - Asignado a: Madeline Lissette Lopez Reyes
- Bug 16940: QA - No se habilita botón 'Llamar' | Estado: Done
 - Asignado a: Cristian Fernando Alvarez



