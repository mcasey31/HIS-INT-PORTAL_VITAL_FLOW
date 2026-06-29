# HU 12996 - Verificación de Elegibilidad de Forma Manual Segun Financiador Plan Asociado a Paciente

## Trazabilidad
- Epic: EPICA ADMISION
- Feature: FEATURE_11891_IDENTIFICACIA-N-DE-PACIENTE-Y-COBERTURA
- Tipo Azure: Product Backlog Item
- Estado: Done
- URL: https://dev.azure.com/SofreDigital/ODI/_workitems/edit/12996/

## User Story
Como [rol]
quiero [capacidad]
para [beneficio].

## Azure Descripcion
Como: Personal de Admsion Quiero: Vincular un financiador o modificar uno asignado previamente a un paciente y verficar su elegibilidad Para: Iniciar el proceso de admisión de un paciente para una atención média ambulatoria 
 
 Descripcion: Esta HU esta ligada con el PRODUCT BACKLOG ITEM 9851 generada en el modulo de Turnos. Se deberá reutilizar la misma logica de usabilidad. Cambia unicamente el label del boton que en esta HU se llamará "Admitir Paciente" 
 En el proceso de Admision podrian darse los casos de agregar nuevo financiador/plan o dar de baja los existentes, con la tarea extra para este MVP de manera manual, donde se deberá chequear Elegibilidad con cada financiador activo en el paciente (salvo privado). 
 Este proceso de verificación de Elegibilidad manual, es ingresar a los portales de información de cada uno de los financiadores para verificar el estado de afiliación del paciente que estamos intentado admisionar. De esa consulta obtendremos 3 (tres) posibles casos: 
 Casuísticas: 1. Paciente Habilitado por el Financiador 

Si la consulta efectuada en el portal del financiador nos devuelve que esta habilitado y los datos de plan y Id de beneficiario coinciden, el check de "Elegibilidad Ok" deberá quedar activo en el sistema, en este caso siendo manual por parte del usuario final. 

2. Paciente No Habilitado 

Si la consulta efectuada devuelve que ese paciente no esta habilitado por el financiador, debería generarse el fin de vegencia en ODI como se explica en ITEM 9851 

3. Paciente Habilitado pero contiene cambios en datos de plan y/o id beneficiario 

Si la consulta efectuada devuelve que ese paciente esta habilitado por el financiador, pero hay cambios en los datos, debería generarse el fin de vigencia en ODI y cargar los cambios como un nuevo financiador como se explica en ITEM 9851 

 Comportamiento del Nuevo Check de Elegibilidad: 
 El nuevo check de Elegibilidad se activará unicamente para aquellos Financiadores que sean DISTINTO de PRIVADO y esten en modo Activo (radio button seleccionado) 

El check de "Elegibilidad" siempre vendrá DESACTIVADO. Una vez generada la verificacion manual correctamente se deberá tildar check Elegibilidad para continuar con el proceso de admision. En caso de quedar inactivo no podra continuar, inactivando el botón "Admitir Paciente"

## Azure Criterios de Aceptacion
Al seleccionar el botón se despliega la carga de los campos 
Al seleccionar el plan deberá venir filtrado los planes del financiador elegido antes 
El número de afiliado debe ser de 18 dígitos numéricos 
No se debe poder dejar agregar un financiador - plan con el que ya cuente en vigencia 
El check de "Elegibilidad ok" debera venir siempre desactivado.

## Azure Tasks
- Task 15777: BE - Insert en la tabla de prácticas de admision | Estado: Done
 - Asignado a: Lucas Ezequiel Ayala
- Task 14449: QA-Ejecución de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Bug 15348: QA - Palabras en minúscula: Plan y Privado/Particular | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 13198: Escritura HU | Estado: Done
 - Asignado a: Martin Casey
- Task 13197: AF | Estado: Done
 - Asignado a: Martin Casey
- Task 14478: BE - Crear admision | Estado: Done
 - Asignado a: Brian Ezequiel Agüero
- Task 15133: FE - actualizar financiador principal en admisión | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Bug 15130: QA - Diferencias, sombreado y tooltip | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez
- Task 14173: Diseño de interfaces | Estado: Done
 - Asignado a: German Facundo Skrobak
- Task 14465: FE - Integrar EP crear admision | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 13226: UX - Diseño de mockups | Estado: Done
 - Asignado a: Melanie Garcia
- Task 14453: FE - Agregar funcionalidad de paciente Eligibilidad | Estado: Done
 - Asignado a: Facundo Ezequiel Sergio
- Task 14552: Code Review | Estado: Done
 - Asignado a: Marco Alex Brusa
- Task 14448: QA-Diseño de Casos de Prueba | Estado: Done
 - Asignado a: Hernan Alexis Gutierrez



